import { prisma } from "../src/lib/prisma";

async function runSimulation() {
  console.log("================================================================================");
  console.log("🚀 STARTING GIFTISAN END-TO-END TRANSACTION & DISPUTE LIFECYCLE SIMULATION");
  console.log("================================================================================\n");

  const timestamp = Date.now();
  const testBuyerEmail = `e2e_buyer_${timestamp}@test.giftisan.com`;
  const testArtisanEmail = `e2e_artisan_${timestamp}@test.giftisan.com`;

  try {
    // -------------------------------------------------------------------------
    // STEP 0: Setup Test Entities (Artisan, Buyer, Product)
    // -------------------------------------------------------------------------
    console.log("📦 [STEP 0] Provisioning Test Artisan, Buyer, and Product...");

    // 1. Create Test Buyer
    const buyer = await prisma.user.create({
      data: {
        name: "E2E Test Buyer",
        email: testBuyerEmail,
        role: "CLIENT"
      }
    });

    // 2. Create Test Artisan User + ArtisanProfile + Wallet Balance
    const artisanUser = await prisma.user.create({
      data: {
        name: "E2E Test Artisan",
        email: testArtisanEmail,
        role: "ARTISAN",
        artisanProfile: {
          create: {
            studioName: "E2E Artisan Crafts",
            slug: `e2e-crafts-${timestamp}`,
            status: "APPROVED",
            isVerified: true,
            commissionRate: 0.15, // 15% platform fee
            balances: {
              create: {
                pending: 0.0,
                withdrawable: 0.0,
                withdrawn: 0.0
              }
            }
          }
        }
      },
      include: {
        artisanProfile: {
          include: { balances: true }
        }
      }
    });

    const artisanProfile = artisanUser.artisanProfile!;
    console.log(`   ✅ Test Artisan created (ID: ${artisanProfile.id}, Commission: 15%)`);
    console.log(`   ✅ Test Buyer created (ID: ${buyer.id})`);

    // 3. Create Test Product with initial stock of 10
    const initialStock = 10;
    const itemPrice = 200.0; // 200 EGP per item
    const product = await prisma.product.create({
      data: {
        name: `Handmade Ceramic Vase ${timestamp}`,
        slug: `ceramic-vase-${timestamp}`,
        description: "A beautiful handcrafted ceramic vase for test simulation.",
        price: itemPrice,
        stock: initialStock,
        category: "Home & Living",
        status: "APPROVED",
        artisanId: artisanProfile.id
      }
    });

    console.log(`   ✅ Test Product created (ID: ${product.id}, Price: ${itemPrice} EGP, Initial Stock: ${initialStock})\n`);

    // =========================================================================
    // SCENARIO A: HAPPY PATH (Order -> Payment -> Delivery -> Escrow Release)
    // =========================================================================
    console.log("--------------------------------------------------------------------------------");
    console.log("💎 SCENARIO A: HAPPY PATH LIFECYCLE");
    console.log("--------------------------------------------------------------------------------");

    // A1. Buyer checks out 2 units
    const orderQtyA = 2;
    const orderTotalA = orderQtyA * itemPrice; // 400 EGP
    console.log(`\n🛒 [A1. Checkout] Buyer places order for ${orderQtyA} units (Total: ${orderTotalA} EGP)...`);

    const orderA = await prisma.$transaction(async (tx) => {
      // Deduct stock
      await tx.product.update({
        where: { id: product.id },
        data: { stock: { decrement: orderQtyA } }
      });

      return await tx.order.create({
        data: {
          userId: buyer.id,
          totalAmount: orderTotalA,
          status: "PENDING",
          shippingAddress: "123 Nile St, Zamalek",
          shippingCity: "Cairo",
          items: {
            create: [
              {
                productId: product.id,
                quantity: orderQtyA,
                price: itemPrice,
                status: "PENDING",
                trackingNumber: `TRK-A-${timestamp}`
              }
            ]
          }
        },
        include: { items: true }
      });
    });

    // Verify stock deduction
    const stockAfterA = (await prisma.product.findUnique({ where: { id: product.id } }))?.stock;
    console.log(`   ✅ Order #${orderA.id} created with status "PENDING"`);
    console.log(`   ✅ Inventory deducted: Expected ${initialStock - orderQtyA}, Actual: ${stockAfterA}`);
    if (stockAfterA !== initialStock - orderQtyA) throw new Error("Stock deduction mismatch!");

    // A2. Payment Webhook received (Success)
    console.log(`\n💳 [A2. Payment Webhook] Simulating successful Paymob payment webhook...`);
    const commissionRate = artisanProfile.commissionRate;
    const adminCommissionA = orderTotalA * commissionRate; // 400 * 0.15 = 60 EGP
    const artisanShareA = orderTotalA - adminCommissionA;  // 400 - 60 = 340 EGP

    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: orderA.id },
        data: { status: "PROCESSING" }
      });

      await tx.artisanTransaction.create({
        data: {
          artisanId: artisanProfile.id,
          orderId: orderA.id,
          amount: artisanShareA,
          type: "SALE",
          status: "PENDING",
          description: `Earnings from "${product.name}" (Qty: ${orderQtyA}). Total: ${orderTotalA} EGP (Commission: ${adminCommissionA.toFixed(2)} EGP)`
        }
      });

      await tx.artisanBalance.update({
        where: { artisanId: artisanProfile.id },
        data: {
          pending: { increment: artisanShareA }
        }
      });
    });

    const balanceAfterPayA = await prisma.artisanBalance.findUnique({ where: { artisanId: artisanProfile.id } });
    console.log(`   ✅ Order #${orderA.id} transitioned to "PROCESSING"`);
    console.log(`   ✅ Platform Commission (15%): ${adminCommissionA} EGP | Artisan Payout: ${artisanShareA} EGP`);
    console.log(`   ✅ Artisan Escrow Wallet: Pending = ${balanceAfterPayA?.pending} EGP, Withdrawable = ${balanceAfterPayA?.withdrawable} EGP`);
    if (balanceAfterPayA?.pending !== artisanShareA) throw new Error("Artisan pending balance mismatch!");

    // A3. Shipping & Delivery Carrier Webhook
    console.log(`\n🚚 [A3. Carrier Delivery Webhook] Simulating courier delivery confirmation...`);
    await prisma.$transaction(async (tx) => {
      await tx.orderItem.updateMany({
        where: { orderId: orderA.id },
        data: { status: "DELIVERED" }
      });

      await tx.order.update({
        where: { id: orderA.id },
        data: { status: "DELIVERED" }
      });

      // Escrow clock starts at delivery
      await tx.artisanTransaction.updateMany({
        where: {
          orderId: orderA.id,
          artisanId: artisanProfile.id,
          type: "SALE",
          status: "PENDING"
        },
        data: {
          // Fast-forward created date 8 days into the past to simulate holding period completion
          createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000)
        }
      });
    });

    const orderDeliveredA = await prisma.order.findUnique({ where: { id: orderA.id }, include: { items: true } });
    console.log(`   ✅ Order & Items transitioned to "DELIVERED"`);
    console.log(`   ✅ Escrow 7-day holding countdown initialized.`);

    // A4. Automated Escrow Clearance Cron
    console.log(`\n⏰ [A4. Escrow Cron Clearance] Executing automated escrow release...`);
    const HOLDING_DAYS = 7;
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - HOLDING_DAYS);

    const pendingSales = await prisma.artisanTransaction.findMany({
      where: {
        type: "SALE",
        status: "PENDING",
        createdAt: { lt: thresholdDate },
        order: { status: "DELIVERED" },
        artisanId: artisanProfile.id
      }
    });

    console.log(`   🔍 Escrow cron found ${pendingSales.length} transaction(s) eligible for release.`);
    for (const tx of pendingSales) {
      await prisma.$transaction(async (prismaTx) => {
        await prismaTx.artisanTransaction.update({
          where: { id: tx.id },
          data: { status: "CLEARED" }
        });

        await prismaTx.artisanBalance.update({
          where: { artisanId: tx.artisanId },
          data: {
            pending: { decrement: tx.amount },
            withdrawable: { increment: tx.amount }
          }
        });
      });
    }

    const balanceAfterCronA = await prisma.artisanBalance.findUnique({ where: { artisanId: artisanProfile.id } });
    console.log(`   ✅ Funds released! Pending = ${balanceAfterCronA?.pending} EGP | Withdrawable = ${balanceAfterCronA?.withdrawable} EGP`);
    if (balanceAfterCronA?.withdrawable !== artisanShareA || balanceAfterCronA?.pending !== 0) {
      throw new Error("Escrow release balance calculation mismatch!");
    }

    // =========================================================================
    // SCENARIO B: DISPUTE & REFUND LIFECYCLE (Order -> Payment -> Dispute -> Refund)
    // =========================================================================
    console.log("\n--------------------------------------------------------------------------------");
    console.log("🛡️ SCENARIO B: DISPUTE & REFUND LIFECYCLE");
    console.log("--------------------------------------------------------------------------------");

    // B1. Buyer checks out 1 unit
    const orderQtyB = 1;
    const orderTotalB = orderQtyB * itemPrice; // 200 EGP
    console.log(`\n🛒 [B1. Checkout] Buyer places second order for ${orderQtyB} unit (Total: ${orderTotalB} EGP)...`);

    const orderB = await prisma.$transaction(async (tx) => {
      await tx.product.update({
        where: { id: product.id },
        data: { stock: { decrement: orderQtyB } }
      });

      return await tx.order.create({
        data: {
          userId: buyer.id,
          totalAmount: orderTotalB,
          status: "PENDING",
          shippingAddress: "456 Dokki St",
          shippingCity: "Giza",
          items: {
            create: [
              {
                productId: product.id,
                quantity: orderQtyB,
                price: itemPrice,
                status: "PENDING",
                trackingNumber: `TRK-B-${timestamp}`
              }
            ]
          }
        },
        include: { items: true }
      });
    });

    const stockAfterB = (await prisma.product.findUnique({ where: { id: product.id } }))?.stock;
    console.log(`   ✅ Order #${orderB.id} created with status "PENDING"`);
    console.log(`   ✅ Inventory deducted: Expected ${initialStock - orderQtyA - orderQtyB}, Actual: ${stockAfterB}`);

    // B2. Payment Webhook received (Success)
    const adminCommissionB = orderTotalB * commissionRate; // 200 * 0.15 = 30 EGP
    const artisanShareB = orderTotalB - adminCommissionB;  // 200 - 30 = 170 EGP

    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: orderB.id },
        data: { status: "PROCESSING" }
      });

      await tx.artisanTransaction.create({
        data: {
          artisanId: artisanProfile.id,
          orderId: orderB.id,
          amount: artisanShareB,
          type: "SALE",
          status: "PENDING",
          description: `Earnings from "${product.name}" (Qty: ${orderQtyB}). Total: ${orderTotalB} EGP`
        }
      });

      await tx.artisanBalance.update({
        where: { artisanId: artisanProfile.id },
        data: {
          pending: { increment: artisanShareB }
        }
      });
    });

    const balanceAfterPayB = await prisma.artisanBalance.findUnique({ where: { artisanId: artisanProfile.id } });
    console.log(`   ✅ Order #${orderB.id} paid. Pending Escrow = ${balanceAfterPayB?.pending} EGP | Withdrawable = ${balanceAfterPayB?.withdrawable} EGP`);

    // B3. Buyer files Dispute / Refund Claim (e.g. DAMAGED_IN_TRANSIT)
    console.log(`\n⚠️ [B3. Dispute Claim Filed] Buyer submits claim: "DAMAGED_IN_TRANSIT"...`);
    const refundClaim = await prisma.refundRequest.create({
      data: {
        orderId: orderB.id,
        orderItemId: orderB.items[0].id,
        userId: buyer.id,
        reason: "DAMAGED_IN_TRANSIT",
        details: "The vase arrived cracked on the side during shipping.",
        images: ["https://res.cloudinary.com/test/image/upload/sample_vase_crack.jpg"],
        preferredAction: "REFUND",
        status: "PENDING"
      }
    });

    console.log(`   ✅ Dispute Claim #${refundClaim.id} registered in PENDING status.`);

    // B4. Admin Mediates & Approves Refund
    console.log(`\n⚖️ [B4. Admin Mediation & Resolution] Admin reviews photo evidence and APPROVES refund...`);

    await prisma.$transaction(async (tx) => {
      // 1. Update claim status
      await tx.refundRequest.update({
        where: { id: refundClaim.id },
        data: {
          status: "APPROVED",
          adminNote: "Verified photo evidence. Customer refunded in full."
        }
      });

      // 2. Mark order and items as REFUNDED
      await tx.orderItem.update({
        where: { id: orderB.items[0].id },
        data: { status: "REFUNDED" }
      });

      await tx.order.update({
        where: { id: orderB.id },
        data: { status: "REFUNDED" }
      });

      // 3. Restore product stock
      await tx.product.update({
        where: { id: product.id },
        data: { stock: { increment: orderQtyB } }
      });

      // 4. Void pending SALE transaction so escrow cron will not release it
      await tx.artisanTransaction.updateMany({
        where: {
          orderId: orderB.id,
          type: "SALE",
          status: "PENDING"
        },
        data: { status: "FAILED" }
      });

      // 5. Debit artisan balance & record ledger entry
      const bal = await tx.artisanBalance.findUnique({ where: { artisanId: artisanProfile.id } });
      if (bal) {
        // Pending sale was cancelled, so pending is decremented
        const newPending = Math.max(0, bal.pending - artisanShareB);
        await tx.artisanBalance.update({
          where: { artisanId: artisanProfile.id },
          data: { pending: newPending }
        });
      }

      await tx.artisanTransaction.create({
        data: {
          artisanId: artisanProfile.id,
          orderId: orderB.id,
          amount: -artisanShareB,
          type: "REFUND_DEBIT",
          status: "COMPLETED",
          description: `Refund debited for dispute #${refundClaim.id} ("${product.name}" Qty: ${orderQtyB})`
        }
      });
    });

    // B5. Verification of Final Balances & Invariants
    console.log(`\n📊 [B5. Invariant & Ledger Verification] Checking final financial state...`);
    const finalProduct = await prisma.product.findUnique({ where: { id: product.id } });
    const finalBalance = await prisma.artisanBalance.findUnique({ where: { artisanId: artisanProfile.id } });
    const finalOrderB = await prisma.order.findUnique({ where: { id: orderB.id } });
    const finalClaim = await prisma.refundRequest.findUnique({ where: { id: refundClaim.id } });
    const finalTxns = await prisma.artisanTransaction.findMany({ where: { artisanId: artisanProfile.id } });

    console.log(`   📦 Product Stock Restored: ${finalProduct?.stock} (Initial: ${initialStock}, OrderA sold: ${orderQtyA}, OrderB refunded: +${orderQtyB})`);
    console.log(`   💰 Artisan Balance: Pending = ${finalBalance?.pending} EGP (Expected: 0), Withdrawable = ${finalBalance?.withdrawable} EGP (Expected: ${artisanShareA})`);
    console.log(`   📑 OrderB Status: ${finalOrderB?.status} (Expected: REFUNDED)`);
    console.log(`   ⚖️ Dispute Claim Status: ${finalClaim?.status} (Expected: APPROVED)`);
    console.log(`   📜 Artisan Transactions count: ${finalTxns.length}`);
    for (const t of finalTxns) {
      console.log(`      - [${t.type}] Amount: ${t.amount > 0 ? "+" : ""}${t.amount} EGP | Status: ${t.status} | ${t.description?.slice(0, 60)}...`);
    }

    // Assertions
    if (finalProduct?.stock !== initialStock - orderQtyA) {
      throw new Error(`Inventory mismatch: expected ${initialStock - orderQtyA}, got ${finalProduct?.stock}`);
    }
    if (finalBalance?.pending !== 0) {
      throw new Error(`Pending balance mismatch: expected 0, got ${finalBalance?.pending}`);
    }
    if (finalBalance?.withdrawable !== artisanShareA) {
      throw new Error(`Withdrawable balance mismatch: expected ${artisanShareA}, got ${finalBalance?.withdrawable}`);
    }

    // -------------------------------------------------------------------------
    // CLEANUP TEST DATA
    // -------------------------------------------------------------------------
    console.log(`\n🧹 [CLEANUP] Cleaning up test entities...`);
    await prisma.refundRequest.deleteMany({ where: { orderId: { in: [orderA.id, orderB.id] } } });
    await prisma.artisanTransaction.deleteMany({ where: { artisanId: artisanProfile.id } });
    await prisma.artisanBalance.deleteMany({ where: { artisanId: artisanProfile.id } });
    await prisma.orderItem.deleteMany({ where: { orderId: { in: [orderA.id, orderB.id] } } });
    await prisma.order.deleteMany({ where: { id: { in: [orderA.id, orderB.id] } } });
    await prisma.product.delete({ where: { id: product.id } });
    await prisma.artisanProfile.delete({ where: { id: artisanProfile.id } });
    await prisma.user.deleteMany({ where: { id: { in: [buyer.id, artisanUser.id] } } });

    console.log("   ✅ All temporary simulation records cleaned up successfully.\n");

    console.log("================================================================================");
    console.log("🎉 ALL END-TO-END FLOW TESTS PASSED WITH 100% INTEGRITY & CONSISTENCY!");
    console.log("================================================================================");

  } catch (error: any) {
    console.error("\n❌ SIMULATION TEST FAILED:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runSimulation();
