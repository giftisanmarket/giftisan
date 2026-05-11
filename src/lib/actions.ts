"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signIn, auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { AuthError } from "next-auth";
import { slugify } from "@/lib/utils";
import cloudinary from "@/lib/cloudinary";
import sharp from "sharp";
import { sendWelcomeEmail, sendOrderNotification, sendMessageNotification, sendVerificationEmail, sendOrderStatusUpdateEmail, sendPasswordResetEmail, sendInquiryNotification, sendArtisanApprovalEmail, sendArtisanOutreachEmail, sendProductStatusUpdateEmail } from "@/lib/mail";
import { generateVerificationToken, generatePasswordResetToken } from "@/lib/tokens";
import { cookies, headers } from "next/headers";
import { createPaymobIntention, PAYMOB_PUBLIC_KEY } from "@/lib/paymob";

export async function uploadImage(base64Data: string) {
  try {
    if (base64Data.startsWith('http')) {
      return { success: true, url: base64Data };
    }

    let uploadPayload: string | Buffer = base64Data;

    // Convert to WebP if it's an image and NOT already WebP
    if (base64Data.startsWith('data:image/') && !base64Data.startsWith('data:image/webp') && !base64Data.includes('svg+xml')) {
      try {
        const base64Image = base64Data.split(';base64,').pop();
        if (base64Image) {
          const buffer = Buffer.from(base64Image, 'base64');
          uploadPayload = await sharp(buffer)
            .resize({ width: 1920, height: 1920, fit: 'inside', withoutEnlargement: true })
            .webp({ quality: 80 })
            .toBuffer();

          console.log(`[Image Optimization] Converted image to WebP (Buffer size: ${uploadPayload.length})`);
        }
      } catch (sharpError) {
        console.error("Sharp conversion error, falling back to original:", sharpError);
      }
    }

    const uploadResponse = await cloudinary.uploader.upload(uploadPayload as any, {
      folder: "giftisan",
      resource_type: "auto", // Essential for videos
    });
    return { success: true, url: uploadResponse.secure_url };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return { success: false, error: "Failed to upload media" };
  }
}

async function processImage(imageSource: string | null | undefined): Promise<string | null> {
  if (!imageSource) return null;
  // Upload any data URL (image, video, etc.)
  if (imageSource.startsWith('data:')) {
    const res = await uploadImage(imageSource);
    if (res.success && res.url) return res.url;
    // CRITICAL: If upload fails, DO NOT return the original base64 string
    // This prevents 1MB+ strings from bloating the database and crashing the frontend
    console.error("Failed to upload base64 image to Cloudinary, discarding to prevent DB bloat");
    return null;
  }
  return imageSource;
}

export async function signUp(formData: any, role: "CLIENT" | "ARTISAN") {
  const { name, email, password } = formData;

  if (!name || !email || !password) {
    return { error: "Missing required fields" };
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "User already exists with this email" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    if (role === "ARTISAN") {
      await prisma.artisanProfile.create({
        data: {
          userId: user.id,
          bio: "",
          location: "",
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
        },
      });
    }

    // Generate verification token and send email
    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail(verificationToken.identifier, verificationToken.token);

    // Auto-login the user immediately
    try {
      await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      return { success: true, autoLogin: true };
    } catch (error) {
      // If auto-login fails, still return success for signup
      return { success: true, autoLogin: false };
    }
  } catch (error) {
    console.error("Signup error:", error);
    return { error: "Something went wrong during registration" };
  }
}

export async function login(formData: any) {
  const { email, password } = formData;

  try {
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      return { error: "Invalid credentials." };
    }

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.cause?.err?.message === "UNVERIFIED_EMAIL") {
        return { error: "Please verify your email address before logging in. Check your inbox for a link!" };
      }
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials." };
        default:
          return { error: "Something went wrong." };
      }
    }
    // For manual client-side handling, we don't want to throw the redirect here
    return { error: "An unexpected error occurred." };
  }
}

export async function resendVerificationEmailAction(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return { error: "User not found." };
    }

    if (user.emailVerified) {
      return { error: "Email is already verified." };
    }

    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail(verificationToken.identifier, verificationToken.token);

    return { success: true };
  } catch (error) {
    console.error("Resend verification error:", error);
    return { error: "Failed to resend verification email." };
  }
}

export async function getUserInfo(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        image: true,
      }
    });
    return user;
  } catch (error) {
    console.error("Get user info error:", error);
    return null;
  }
}

export async function sendPasswordResetEmailAction(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { accounts: true }
    });
    if (!user) return { error: "If an account exists with this email, we've sent a reset link." };

    // Check if it's a social account (no password)
    if (user.accounts.length > 0 && !user.password) {
      return { error: "This account was created with Google. Please use Google Sign-in." };
    }

    const token = await generatePasswordResetToken(email);
    const sent = await sendPasswordResetEmail(token.email, token.token);
    if (!sent.success) {
      return { error: "Mailing service is temporarily down. Please try again later." };
    }
    return { success: true };
  } catch (error) {
    console.error("Password reset error:", error);
    return { error: "Failed to send reset email." };
  }
}

export async function resetPasswordAction(token: string, password: any) {
  try {
    const existingToken = await prisma.passwordResetToken.findUnique({ where: { token } });
    if (!existingToken) return { error: "This link is invalid or has already been used." };

    const hasExpired = new Date(existingToken.expires) < new Date();
    if (hasExpired) {
      await prisma.passwordResetToken.delete({ where: { id: existingToken.id } });
      return { error: "This link has expired. Please request a new one." };
    }

    const user = await prisma.user.findUnique({ where: { email: existingToken.email } });
    if (!user) return { error: "Something went wrong. User not found." };

    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });

    await prisma.passwordResetToken.delete({ where: { id: existingToken.id } });

    return { success: true };
  } catch (error) {
    console.error("Reset password error:", error);
    return { error: "Failed to reset password." };
  }
}

export async function searchProducts(query: string) {
  try {
    const products = await prisma.product.findMany({
      where: {
        status: "APPROVED",
        artisan: {
          status: "APPROVED"
        },
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { category: { contains: query, mode: "insensitive" } },
          {
            artisan: {
              studioName: { contains: query, mode: "insensitive" },
            }
          }
        ]
      },
      include: {
        artisan: {
          include: {
            user: true
          }
        },
        reviews: true,
        variants: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return products;
  } catch (error) {
    console.error("Search error:", error);
    return [];
  }
}

export async function getProductsByCategory(category: string) {
  if (!category) return [];

  // Map URL category slug back to official database name
  const categoryNames = [
    "Ceramics", "Jewelry", "Gift Boxes & Sets", "Stationery", "Vintage", "Textiles", 
    "Woodwork", "Leatherwork", "Culinary Arts", "Beauty & Apothecary", "Metalwork",
    "Glasswork", "Basketry", "Fashion",
    "Wedding", "Personalized", "Art & Collectibles"
  ];

  const matchedName = categoryNames.find(name => {
    const slug1 = name.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-");
    const slug2 = name.toLowerCase().replace(/\s+/g, "-");
    const slug3 = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
    return slug1 === category.toLowerCase() || slug2 === category.toLowerCase() || slug3 === category.toLowerCase();
  }) || category;

  // Generate all possible variations of the category string formats stored in the DB (e.g. "Gift Boxes & Sets", "gift-boxes-sets", "gift-boxes-&-sets", "gift boxes & sets")
  const variations = Array.from(new Set([
    category,
    category.toLowerCase(),
    matchedName,
    matchedName.toLowerCase(),
    matchedName.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-"), // gift-boxes-&-sets
    matchedName.toLowerCase().replace(/\s+/g, "-"), // gift-boxes-sets
    matchedName.toLowerCase().replace(/ & /g, " ").replace(/ /g, " "), // gift boxes sets
    matchedName.replace(/ & /g, " & ").replace(/  +/g, " ")
  ]));

  try {
    const products = await prisma.product.findMany({
      where: {
        category: {
          in: variations,
          mode: "insensitive"
        },
        status: "APPROVED",
        artisan: {
          status: "APPROVED"
        }
      },
      include: {
        artisan: {
          include: {
            user: true
          }
        },
        reviews: true,
        variants: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return products;
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
}

export async function getFeaturedProducts() {
  try {
    const products = await prisma.product.findMany({
      where: {
        status: "APPROVED",
        artisan: {
          status: "APPROVED"
        }
      },
      take: 8,
      include: {
        artisan: {
          include: {
            user: true
          }
        },
        reviews: true,
        variants: true
      },
      orderBy: [
        { isFeatured: "desc" },
        { createdAt: "desc" }
      ]
    });
    return products;
  } catch (error) {
    console.error("Get featured products error:", error);
    return [];
  }
}

export async function getAllProducts() {
  try {
    const products = await prisma.product.findMany({
      where: {
        status: "APPROVED",
        artisan: {
          status: "APPROVED"
        }
      },
      include: {
        artisan: {
          include: {
            user: true
          }
        },
        reviews: true,
        variants: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });
    return products;
  } catch (error) {
    console.error("Get all products error:", error);
    return [];
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const product = await prisma.product.findUnique({
      where: {
        slug
      },
      include: {
        artisan: {
          include: {
            user: true
          }
        },
        variants: true,
        reviews: {
          include: {
            user: true
          },
          orderBy: {
            createdAt: "desc"
          }
        }
      }
    });

    // Check if product exists
    if (!product) return null;

    const isPublic = product.status === "APPROVED" || product.status === "PENDING";
    const isArtisanPublic = product.artisan.status === "APPROVED" || product.artisan.status === "PENDING";

    if (!isPublic || !isArtisanPublic) {
      const session = await auth();
      const isAdmin = session?.user?.role === "ADMIN";
      const isOwner = session?.user?.id === product.artisan.userId;

      if (!isAdmin && !isOwner) {
        return null;
      }
    }

    return product;
  } catch (error) {
    console.error("Get product by slug error:", error);
    return null;
  }
}


export async function toggleFavoriteAction(productId: string, userId: string) {
  try {
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_productId: {
          userId,
          productId
        }
      }
    });

    if (existing) {
      await prisma.favorite.delete({
        where: {
          id: existing.id
        }
      });
      return { success: true, action: "removed" };
    } else {
      await prisma.favorite.create({
        data: {
          userId,
          productId
        }
      });
      return { success: true, action: "added" };
    }
  } catch (error) {
    console.error("Toggle favorite error:", error);
    return { error: "Failed to update favorite" };
  }
}

export async function getUserFavorites(userId: string) {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            artisan: {
              include: {
                user: true
              }
            }
          }
        }
      }
    });
    return favorites.map(f => ({
      ...f.product,
      images: Array.isArray(f.product.images) ? f.product.images.map((img: string) => (img?.length || 0) > 300000 ? "" : img) : [],
      artisan: {
        ...f.product.artisan,
        avatar: (f.product.artisan.avatar?.length || 0) > 300000 ? "" : f.product.artisan.avatar,
        user: { name: f.product.artisan.user?.name }
      }
    }));
  } catch (error) {
    console.error("Get favorites error:", error);
    return [];
  }
}

export async function createOrder(userId: string, totalAmount: number, items: any[], shippingData?: any) {
  try {
    const order = await prisma.$transaction(async (tx) => {
      // 🛡️ Final Inventory Guard: Verify stock for all items before processing
      for (const item of items) {
        if (item.variantId) {
          const variant = await tx.productVariant.findUnique({
            where: { id: item.variantId },
            select: { stock: true, name: true }
          });
          if (!variant || variant.stock < item.quantity) {
            throw new Error(`The variation "${variant?.name || 'One of your items'}" just sold out! Please remove it from your cart to proceed.`);
          }
        } else {
          const product = await tx.product.findUnique({
            where: { id: item.id },
            select: { stock: true, name: true }
          });

          if (!product || product.stock < item.quantity) {
            throw new Error(`The treasure "${product?.name || 'One of your items'}" just sold out! Please remove it from your cart to proceed.`);
          }
        }
      }

      // Create the order
      const newOrder = await tx.order.create({
        data: {
          userId,
          totalAmount,
          status: "PENDING",
          shippingAddress: shippingData?.address,
          shippingCity: shippingData?.city,
          shippingZip: shippingData?.zip,
          shippingCountry: shippingData?.country,
          clientPhone: shippingData?.phone,
          clientEmail: shippingData?.email,
          orderNotes: shippingData?.orderNotes,
          isGift: shippingData?.isGift || false,
          giftMessage: shippingData?.giftMessage || null,
          couponId: shippingData?.couponId || null,
          discountApplied: shippingData?.discountApplied || 0,
          items: {
            create: items.map(item => ({
              productId: item.id,
              variantId: item.variantId || null,
              quantity: item.quantity,
              price: item.price,
              personalization: item.personalization
            }))
          }
        }
      });

      // Update coupon usage count if used
      if (shippingData?.couponId) {
        await tx.coupon.update({
          where: { id: shippingData.couponId },
          data: {
            usedCount: {
              increment: 1
            }
          }
        });
      }

      // Decrement stock for each item
      for (const item of items) {
        if (item.variantId) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: {
              stock: {
                decrement: item.quantity
              }
            }
          });
        } else {
          await tx.product.update({
            where: { id: item.id },
            data: {
              stock: {
                decrement: item.quantity
              }
            }
          });
        }
      }

      return newOrder;
    });

    // Generate Paymob Payment Link
    let paymentUrl = null;
    try {
      const amountCents = Math.round(totalAmount * 100);
      
      const headersList = await headers();
      const host = headersList.get("host") || "localhost:3000";
      const proto = headersList.get("x-forwarded-proto") || "http";
      const origin = `${proto}://${host}`;

      const itemsForPaymob = items.map(item => {
        let imageUrl = item.image || (item.images && item.images.length > 0 ? item.images[0] : "");
        if (imageUrl && !imageUrl.startsWith("http")) {
          imageUrl = `${origin}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
        }
        return {
          name: item.name || "Item",
          price: item.price,
          description: item.description || "Giftisan Product",
          quantity: item.quantity,
          image: imageUrl
        };
      });

      if (shippingData?.discountApplied && shippingData.discountApplied > 0) {
        itemsForPaymob.push({
          name: "Promo Discount",
          price: -shippingData.discountApplied,
          description: "Applied coupon discount",
          quantity: 1,
          image: ""
        });
      }

      const clientSecret = await createPaymobIntention(
        amountCents,
        `${order.id}-${Date.now()}`, // using unique suffixed order ID as special_reference to avoid duplicate reference collisions
        shippingData || {},
        itemsForPaymob
      );

      if (clientSecret) {
        paymentUrl = `https://accept.paymob.com/unifiedcheckout/?publicKey=${PAYMOB_PUBLIC_KEY}&clientSecret=${clientSecret}`;
      }
    } catch (paymobError) {
      console.error("Paymob initialization error:", paymobError);
      // We don't fail the order creation if Paymob fails to init, we just return the orderId
    }

    return { success: true, orderId: order.id, paymentUrl };
  } catch (error: any) {
    console.error("Create order error:", error);
    return { error: error.message || "Failed to complete your pre-launch order." };
  }
}

export async function retryPaymentAction(orderId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "You must be signed in to perform this action" };
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true
          }
        },
        user: true
      }
    });

    if (!order) {
      return { error: "Order not found" };
    }

    if (order.userId !== session.user.id) {
      return { error: "You are not authorized to retry payment for this order" };
    }

    if (order.status !== "PENDING") {
      return { error: `This order is already ${order.status.toLowerCase()}` };
    }

    // Generate fresh Paymob Intention link
    const amountCents = Math.round(order.totalAmount * 100);
    
    const headersList = await headers();
    const host = headersList.get("host") || "localhost:3000";
    const proto = headersList.get("x-forwarded-proto") || "http";
    const origin = `${proto}://${host}`;

    const itemsForPaymob = order.items.map(item => {
      let imageUrl = item.product.images && item.product.images.length > 0 ? item.product.images[0] : "";
      if (imageUrl && !imageUrl.startsWith("http")) {
        imageUrl = `${origin}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
      }
      return {
        name: item.product.name || "Item",
        price: item.price,
        description: item.product.description || "Giftisan Product",
        quantity: item.quantity,
        image: imageUrl
      };
    });

    if (order.discountApplied && order.discountApplied > 0) {
      itemsForPaymob.push({
        name: "Promo Discount",
        price: -order.discountApplied,
        description: "Applied coupon discount",
        quantity: 1,
        image: ""
      });
    }

    const shippingData = {
      firstName: order.user.name?.split(" ")[0] || "NA",
      lastName: order.user.name?.split(" ").slice(1).join(" ") || "NA",
      email: order.clientEmail || order.user.email || "test@test.com",
      phone: order.clientPhone || "+201234567890",
      address: order.shippingAddress || "NA",
      city: order.shippingCity || "NA",
      country: order.shippingCountry || "EG",
      zip: order.shippingZip || ""
    };

    const clientSecret = await createPaymobIntention(
      amountCents,
      `${order.id}-${Date.now()}`, // using unique suffixed order ID as special_reference to avoid duplicate reference collisions
      shippingData,
      itemsForPaymob
    );

    if (clientSecret) {
      const paymentUrl = `https://accept.paymob.com/unifiedcheckout/?publicKey=${PAYMOB_PUBLIC_KEY}&clientSecret=${clientSecret}`;
      return { success: true, paymentUrl };
    } else {
      return { error: "Failed to initialize payment gateway" };
    }
  } catch (error: any) {
    console.error("Retry payment error:", error);
    return { error: error.message || "Failed to regenerate payment session" };
  }
}


export async function getUserOrders(userId: string) {
  try {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                artisan: {
                  include: {
                    user: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });
    return orders;
  } catch (error) {
    console.error("Get orders error:", error);
    return [];
  }
}

export async function getArtisanData(userId: string) {
  try {
    const artisan = await prisma.artisanProfile.findUnique({
      where: { userId },
      include: {
        products: {
          include: {
            variants: true,
            _count: {
              select: {
                reviews: true,
                favoritedBy: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        user: true
      }
    });
    return artisan;
  } catch (error) {
    console.error("Get artisan data error:", error);
    return null;
  }
}

export async function getAllArtisans() {
  try {
    const artisans = await prisma.artisanProfile.findMany({
      where: {
        status: "APPROVED"
      },
      include: {
        user: true,
        products: {
          where: {
            status: "APPROVED"
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return artisans;
  } catch (error) {
    console.error("Get all artisans error:", error);
    return [];
  }
}

export async function checkSlugAvailability(slug: string, currentUserId: string) {
  try {
    const existing = await prisma.artisanProfile.findUnique({
      where: { slug },
      select: { userId: true }
    });

    // Available if no one has it OR the current user already has it
    return {
      available: !existing || existing.userId === currentUserId
    };
  } catch (error) {
    console.error("Slug check error:", error);
    return { error: "Failed to verify slug" };
  }
}

export async function updateArtisanProfile(userId: string, data: any) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: "You must be signed in to perform this action" };
    }

    const isAdmin = session.user.role === "ADMIN";
    if (!isAdmin && session.user.id !== userId) {
      return { error: "You are not authorized to update this profile" };
    }

    // Only generate slug if it's not manually provided OR it's a new profile
    const slug = data.slug
      ? slugify(data.slug)
      : data.studioName
        ? `${slugify(data.studioName)}-${userId.slice(-4)}`
        : null;

    const avatarUrl = await processImage(data.avatar);
    const bannerUrl = await processImage(data.bannerImage);

    const updated = await prisma.artisanProfile.upsert({
      where: { userId },
      create: {
        userId,
        studioName: data.studioName || null,
        slug,
        bio: data.bio || null,
        location: data.location || null,
        avatar: avatarUrl || null,
        instagram: data.instagram || null,
        website: data.website || null,
        pinterest: data.pinterest || null,
        tiktok: data.tiktok || null,
        facebook: data.facebook || null,
        brandColor: data.brandColor || "#da7b5a",
        bannerImage: bannerUrl || null,
        phoneNumber: data.phoneNumber || null
      },
      update: {
        studioName: data.studioName || null,
        slug,
        bio: data.bio || null,
        location: data.location || null,
        avatar: avatarUrl || null,
        instagram: data.instagram || null,
        website: data.website || null,
        pinterest: data.pinterest || null,
        tiktok: data.tiktok || null,
        facebook: data.facebook || null,
        brandColor: data.brandColor || "#da7b5a",
        bannerImage: bannerUrl || null,
        phoneNumber: data.phoneNumber || null
      }
    });

    revalidatePath("/studio");
    revalidatePath("/studio/settings");
    revalidatePath("/");
    revalidatePath("/artisans");
    return {
      success: true,
      artisan: {
        id: updated.id,
        studioName: updated.studioName,
        bio: updated.bio,
        location: updated.location,
        avatar: updated.avatar,
        slug: updated.slug
      }
    };
  } catch (error: any) {
    console.error("Update artisan error:", error);
    // Return specific message for unique constraint (slug/studioName)
    if (error.code === 'P2002') {
      return { error: "This Studio Name is already taken. Please try another one." };
    }
    return { error: error.message || "Failed to update studio profile" };
  }
}

export async function createProduct(artisanId: string, formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: "You must be signed in to perform this action" };
    }

    const artisan = await prisma.artisanProfile.findUnique({
      where: { id: artisanId }
    });

    if (!artisan || artisan.userId !== session.user.id) {
      return { error: "You are not authorized to list creations in this studio" };
    }

    const data = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: formData.get("price") as string,
      category: formData.get("category") as string,
      canPersonalize: formData.get("canPersonalize") === "true",
      personalizationPrompt: formData.get("personalizationPrompt") as string,
      badge: formData.get("badge") as string,
      stock: formData.get("stock") as string,
    };

    const images: string[] = [];
    for (let i = 0; i < 10; i++) {
      const img = formData.get(`image-${i}`);
      if (img) images.push(img as string);
    }

    const slug = `${slugify(data.name)}-${Math.random().toString(36).substring(2, 7)}`;
    const uploadedImages = await Promise.all(
      images.map((img: string) => processImage(img))
    );
    const finalImages = uploadedImages.filter(img => img !== null) as string[];

    const product = await prisma.product.create({
      data: {
        artisanId,
        name: data.name,
        slug,
        description: data.description,
        price: parseFloat(data.price.replace(/,/g, '.')) || 0,
        category: data.category,
        images: finalImages,
        canPersonalize: data.canPersonalize,
        personalizationPrompt: data.personalizationPrompt || null,
        badge: data.badge,
        stock: parseInt(data.stock) || 0,
        status: "PENDING",
        variants: {
          create: JSON.parse(formData.get("variants") as string || "[]").map((v: any) => ({
            name: v.name,
            price: parseFloat(v.price) || 0,
            stock: parseInt(v.stock) || 0,
            sku: v.sku || null,
            options: v.options || null,
            image: v.image || null,
            badge: v.badge || null
          }))
        }
      }
    });

    revalidatePath("/studio");
    revalidatePath("/");
    revalidatePath("/artisans");
    revalidatePath("/categories");

    return { success: true, product };
  } catch (error: any) {
    console.error("Create product error detail:", error);
    return { error: error.message || "Failed to list new treasure" };
  }
}

export async function getArtisanSales(artisanId: string) {
  try {
    const sales = await prisma.orderItem.findMany({
      where: {
        product: {
          artisanId: artisanId
        }
      },
      include: {
        order: {
          include: {
            user: true
          }
        },
        product: true,
        variant: true
      },
      orderBy: {
        order: {
          createdAt: 'desc'
        }
      },
      take: 50
    });

    return sales;
  } catch (error) {
    console.error("Fetch sales error:", error);
    return [];
  }
}

export async function getArtisanReviews(artisanId: string) {
  try {
    const reviews = await prisma.review.findMany({
      where: {
        product: {
          artisanId: artisanId
        }
      },
      include: {
        user: true,
        product: true
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 50
    });

    return reviews;
  } catch (error) {
    console.error("Fetch artisan reviews error:", error);
    return [];
  }
}

export async function updateOrderItemStatus(itemId: string, status: string, trackingNumber?: string, carrier?: string) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: "You must be signed in to perform this action" };
    }

    const orderItem = await prisma.orderItem.findUnique({
      where: { id: itemId },
      include: {
        product: {
          select: { artisanId: true }
        }
      }
    });

    if (!orderItem) {
      return { error: "Order item not found" };
    }

    const isAdmin = session.user.role === "ADMIN";
    const artisan = await prisma.artisanProfile.findUnique({
      where: { userId: session.user.id }
    });

    if (!isAdmin && (!artisan || orderItem.product.artisanId !== artisan.id)) {
      return { error: "You are not authorized to update this order item" };
    }

    const updatedItem = await prisma.orderItem.update({
      where: { id: itemId },
      data: {
        status: status,
        trackingNumber: trackingNumber || undefined,
        carrier: carrier || undefined,
      },
      include: {
        order: {
          include: {
            user: true
          }
        },
        product: true
      }
    });

    // Send email notification to the buyer
    if (updatedItem.order.user.email) {
      sendOrderStatusUpdateEmail(
        updatedItem.order.user.email,
        updatedItem.order.user.name || "Customer",
        updatedItem.order.id,
        status,
        updatedItem.product.name,
        updatedItem.product.slug || undefined,
        trackingNumber,
        carrier
      ).catch(err => console.error("Failed to send order status email:", err));
    }

    revalidatePath("/studio");
    revalidatePath("/profile");
    return { success: true };
  } catch (error: any) {
    console.error("CRITICAL Update status error:", error.message || error);
    return { error: `Failed to update item status: ${error.message || "Unknown error"}` };
  }
}

export async function subscribeToNewsletter(email: string) {
  try {
    const subscriber = await prisma.newsletterSubscriber.create({
      data: { email }
    });

    // Send the welcome email to the new subscriber
    await sendWelcomeEmail(email, "Friend");
    return { success: true };
  } catch (err: any) {
    if (err.code === "P2002") {
      return { error: "This email is already waiting for the next drop!" };
    }
    return { error: "Something went wrong." };
  }
}

export async function trackProductView(productId: string) {
  try {
    const cookieStore = await cookies();
    const viewCookieName = `vtd_${productId}`;
    const hasViewed = cookieStore.get(viewCookieName);

    if (!hasViewed) {
      console.log(`[SEO] Counting unique view for product: ${productId}`);
      await prisma.product.update({
        where: { id: productId },
        data: { views: { increment: 1 } }
      });

      cookieStore.set(viewCookieName, "1", {
        maxAge: 60 * 60 * 24, // 24 hours
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
      });
      return { success: true };
    }
    return { success: true, alreadyViewed: true };
  } catch (err) {
    console.error("Action view track error:", err);
    return { error: "Failed to track view" };
  }
}

export async function getSubscribers() {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return [];
    }

    return await prisma.newsletterSubscriber.findMany({
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error("Fetch subscribers error:", error);
    return [];
  }
}

export async function deleteSubscriber(id: string) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return { error: "Unauthorized" };
    }

    await prisma.newsletterSubscriber.delete({
      where: { id }
    });
    revalidatePath("/admin/subscribers");
    return { success: true };
  } catch (error) {
    console.error("Delete subscriber error:", error);
    return { error: "Failed to remove subscriber" };
  }
}

export async function updateProduct(productId: string, formData: FormData) {
  try {
    const data = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: formData.get("price") as string,
      category: formData.get("category") as string,
      canPersonalize: formData.get("canPersonalize") === "true",
      personalizationPrompt: formData.get("personalizationPrompt") as string,
      badge: formData.get("badge") as string,
      stock: formData.get("stock") as string,
    };

    const images: string[] = [];
    for (let i = 0; i < 10; i++) {
      const img = formData.get(`image-${i}`);
      if (img) images.push(img as string);
    }

    const uploadedImages = await Promise.all(
      images.map((img: string) => processImage(img))
    );
    const finalImages = uploadedImages.filter(img => img !== null) as string[];

    const updated = await prisma.product.update({
      where: { id: productId },
      data: {
        name: data.name,
        description: data.description,
        price: parseFloat(data.price.replace(/,/g, '.')) || 0,
        category: data.category,
        images: finalImages,
        canPersonalize: data.canPersonalize,
        personalizationPrompt: data.personalizationPrompt || null,
        badge: data.badge || null,
        stock: parseInt(data.stock) || 0,
        status: "PENDING", // Reset to pending on update for re-approval
        rejectionReason: null // Clear feedback once resubmitted
      }
    });

    // Update variants (Sync approach: delete existing and recreate)
    const variantsData = JSON.parse(formData.get("variants") as string || "[]");
    
    await prisma.productVariant.deleteMany({ 
      where: { productId } 
    });

    if (variantsData.length > 0) {
      await prisma.productVariant.createMany({
        data: variantsData.map((v: any) => ({
          productId,
          name: v.name,
          price: parseFloat(v.price) || 0,
          stock: parseInt(v.stock) || 0,
          sku: v.sku || null,
          options: v.options || null,
          image: v.image || null,
          badge: v.badge || null
        }))
      });
    }

    revalidatePath(`/products/${productId}`);
    revalidatePath("/studio");
    revalidatePath("/");
    revalidatePath("/artisans");
    revalidatePath("/categories");

    return { success: true, product: updated };
  } catch (error: any) {
    console.error("Update product error:", error);
    return { error: error.message || "Failed to update treasure" };
  }
}

export async function deleteProduct(productId: string) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: "You must be signed in to perform this action" };
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { artisanId: true }
    });

    if (!product) {
      return { error: "Treasure not found" };
    }

    const isAdmin = session.user.role === "ADMIN";
    const artisan = await prisma.artisanProfile.findUnique({
      where: { userId: session.user.id }
    });

    if (!isAdmin && (!artisan || product.artisanId !== artisan.id)) {
      return { error: "You are not authorized to remove this treasure" };
    }

    await prisma.product.delete({
      where: { id: productId }
    });

    revalidatePath("/studio");
    revalidatePath("/");
    revalidatePath("/artisans");
    revalidatePath("/categories");

    return { success: true };
  } catch (error) {
    console.error("Delete product error:", error);
    return { error: "Failed to remove treasure" };
  }
}

export async function promoteToArtisan(userId: string, studioData: any) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: "You must be signed in to perform this action" };
    }

    if (session.user.id !== userId) {
      return { error: "You are not authorized to onboard this account" };
    }

    await prisma.user.update({
      where: { id: userId },
      data: { role: "ARTISAN" }
    });

    await prisma.artisanProfile.create({
      data: {
        userId,
        studioName: studioData.studioName,
        bio: studioData.bio || "",
        location: studioData.location || "",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${studioData.studioName || userId}`
      }
    });

    revalidatePath("/studio");
    revalidatePath("/become-artisan");
    revalidatePath("/artisans");

    return { success: true };
  } catch (error) {
    console.error("Promote to artisan error:", error);
    return { error: "Failed to become an artisan" };
  }
}

export async function addReview(data: { productId: string, userId: string, rating: number, comment: string, images?: string[] }) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: "You must be signed in to perform this action" };
    }

    if (session.user.id !== data.userId) {
      return { error: "You are not authorized to submit this review" };
    }

    const processedImages = await Promise.all(
      (data.images || []).map(img => processImage(img))
    );

    const review = await prisma.review.create({
      data: {
        productId: data.productId,
        userId: data.userId,
        rating: data.rating,
        comment: data.comment,
        images: processedImages.filter(Boolean) as string[]
      },
      include: {
        user: true
      }
    });

    revalidatePath(`/products/${data.productId}`);
    return { success: true, review };
  } catch (error: any) {
    console.error("DEBUG Add review error detail:", error);
    return { error: `Review failed: ${error.message || "Please check your internet and try again."}` };
  }
}

export async function getAdminStats() {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return { userCount: 0, productCount: 0, orderCount: 0, revenue: 0 };
    }

    const [userCount, productCount, orderCount, totalRevenue] = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: {
          totalAmount: true
        }
      })
    ]);

    return {
      userCount,
      productCount,
      orderCount,
      revenue: totalRevenue._sum.totalAmount || 0
    };
  } catch (error) {
    console.error("Admin stats error:", error);
    return { userCount: 0, productCount: 0, orderCount: 0, revenue: 0 };
  }
}

export async function getAllUsers() {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return [];
    }

    return await prisma.user.findMany({
      include: {
        artisanProfile: true,
        orders: true,
      },
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error("Get all users error:", error);
    return [];
  }
}

export async function getAllOrders() {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return [];
    }

    return await prisma.order.findMany({
      include: {
        user: true,
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error("Get all orders error:", error);
    return [];
  }
}

export async function deleteUser(userId: string) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return { error: "Unauthorized" };
    }

    await prisma.user.delete({
      where: { id: userId }
    });
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Delete user error:", error);
    return { error: "Failed to delete user" };
  }
}

export async function updateArtisanStatus(artisanId: string, status: "PENDING" | "APPROVED" | "REJECTED") {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return { error: "Unauthorized" };
    }

    const profile = await prisma.artisanProfile.update({
      where: { id: artisanId },
      data: { status },
      include: { user: true }
    });

    if (status === "APPROVED" && profile.user.email) {
      sendArtisanApprovalEmail(profile.user.email, profile.user.name || "Artisan")
        .catch(err => console.error("Failed to send artisan approval email:", err));
    }

    revalidatePath("/admin/users");
    revalidatePath("/");
    revalidatePath("/artisans");
    return { success: true };
  } catch (error) {
    console.error("Update status error:", error);
    return { error: "Failed to update studio status" };
  }
}

export async function updateProductStatus(productId: string, status: "PENDING" | "APPROVED" | "REJECTED" | "DRAFT", reason?: string) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return { error: "Unauthorized: Admin privileges required" };
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        artisan: {
          include: {
            user: true
          }
        }
      }
    });

    if (!product) {
      return { error: "Treasure not found" };
    }

    await prisma.product.update({
      where: { id: productId },
      data: {
        status,
        rejectionReason: status === "REJECTED" ? reason : null
      }
    });

    // Send notification email
    if (status !== "DRAFT" && product.artisan.user.email) {
      sendProductStatusUpdateEmail(
        product.artisan.user.email,
        product.artisan.user.name || "Artisan",
        product.name,
        status as "APPROVED" | "REJECTED" | "PENDING",
        reason
      ).catch(err => console.error("Failed to send product status email:", err));
    }

    revalidatePath("/");
    revalidatePath("/categories");
    revalidatePath("/artisans");
    revalidatePath("/admin/products");
    return { success: true };
  } catch (error) {
    console.error("Update product status error:", error);
    return { error: "Failed to update treasure status" };
  }
}

export async function toggleProductFeatured(productId: string, isFeatured: boolean) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return { error: "Unauthorized: Admin privileges required" };
    }

    await prisma.product.update({
      where: { id: productId },
      data: { isFeatured }
    });
    revalidatePath("/");
    revalidatePath("/admin/products");
    return { success: true };
  } catch (error) {
    console.error("Toggle featured error:", error);
    return { error: "Failed to update featured status" };
  }
}

export async function toggleArtisanVerification(artisanId: string, isVerified: boolean) {
  try {
    await prisma.artisanProfile.update({
      where: { id: artisanId },
      data: { isVerified }
    });
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Toggle verification error:", error);
    return { error: "Failed to update verification status" };
  }
}

export async function updateUserRole(userId: string, role: "CLIENT" | "ARTISAN" | "ADMIN") {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { role }
    });

    // If role is ARTISAN, ensure an ArtisanProfile exists
    if (role === "ARTISAN") {
      await prisma.artisanProfile.upsert({
        where: { userId },
        create: {
          userId,
          bio: "",
          location: "",
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name || userId}`
        },
        update: {} // Do nothing if it already exists
      });
    }

    revalidatePath("/admin/users");
    revalidatePath("/studio");
    return { success: true };
  } catch (error) {
    console.error("Update user role error:", error);
    return { error: "Failed to update user role" };
  }
}

export async function sendMessage(senderId: string, receiverId: string, content: string, productId?: string, attachment?: string) {
  if (!senderId || !receiverId) {
    return { error: "Missing sender or receiver ID" };
  }

  try {
    const attachmentUrl = await processImage(attachment);

    const message = await prisma.message.create({
      data: {
        senderId,
        receiverId,
        content: content || "",
        productId: productId || null,
        attachment: attachmentUrl
      },
      include: {
        sender: true,
        receiver: true,
        product: true
      }
    });

    // Send notification email to receiver ONLY if they don't already have unread messages from this sender
    // This prevents spamming if the user sends multiple quick messages
    if (message.receiver.email) {
      const hasUnreadFromSender = await prisma.message.count({
        where: {
          receiverId: message.receiverId,
          senderId: message.senderId,
          read: false,
          id: { not: message.id } // Don't count the message we just created
        }
      });

      if (hasUnreadFromSender === 0) {
        sendMessageNotification(
          message.receiver.email,
          message.receiver.name || "Artisan",
          message.sender.name || "A customer"
        ).catch(err => console.error("Failed to send message notification:", err));
      }
    }

    return { success: true, message };
  } catch (error: any) {
    console.error("CRITICAL Send message error:", error.code, error.message || error);
    if (error.code === 'P2003') {
      return { error: "Could not send message: one of the users or the product no longer exists." };
    }
    return { error: error.message || "Failed to send message" };
  }
}

export async function getInbox(userId: string) {
  try {
    return await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId }
        ]
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        product: {
          select: {
            id: true,
            name: true,
            images: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 100
    });
  } catch (error) {
    console.error("Get inbox error:", error);
    return [];
  }
}

export async function updateUser(userId: string, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const image = formData.get("image") as string;
    const imageUrl = await processImage(image);

    const currentUser = await prisma.user.findUnique({ where: { id: userId } });
    const emailChanged = email && currentUser && currentUser.email !== email;

    const data: any = { name, image: imageUrl };
    if (emailChanged) {
      // Check if email is already taken
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) return { error: "Email is already in use by another account." };

      data.email = email;
      data.emailVerified = null;
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data
    });

    if (emailChanged) {
      const verificationToken = await generateVerificationToken(email);
      await sendVerificationEmail(verificationToken.identifier, verificationToken.token);
    }

    return {
      success: true,
      emailChanged,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        emailVerified: user.emailVerified
      }
    };
  } catch (error) {
    console.error("Update user error:", error);
    return { error: "Failed to update profile" };
  }
}

export async function toggleFollowAction(artisanId: string, userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { following: true }
    });

    if (!user) return { error: "User not found" };

    const isFollowing = user.following.some(a => a.id === artisanId);

    if (isFollowing) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          following: {
            disconnect: { id: artisanId }
          }
        }
      });
      revalidatePath(`/artisans`);
      return { success: true, action: "unfollowed" };
    } else {
      await prisma.user.update({
        where: { id: userId },
        data: {
          following: {
            connect: { id: artisanId }
          }
        }
      });
      revalidatePath(`/artisans`);
      return { success: true, action: "followed" };
    }
  } catch (error: any) {
    console.error("Toggle follow error:", error);
    return { error: `Follow failed: ${error.message || "Unknown Error"}` };
  }
}

export async function checkFollowStatus(artisanId: string, userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        following: {
          where: { id: artisanId }
        }
      }
    });

    return !!user?.following.length;
  } catch (error) {
    return false;
  }
}

export async function getUnreadMessageCount(userId: string) {
  try {
    const unreadCount = await prisma.message.count({
      where: {
        receiverId: userId,
        read: false
      }
    });
    return unreadCount;
  } catch (error) {
    return 0;
  }
}

export async function markMessagesAsRead(userId: string, senderId: string) {
  try {
    await prisma.message.updateMany({
      where: {
        receiverId: userId,
        senderId: senderId,
        read: false
      },
      data: {
        read: true
      }
    });
    revalidatePath("/profile/messages");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

export async function deleteAccountAction(userId: string) {
  try {
    await prisma.user.delete({
      where: { id: userId }
    });
    return { success: true };
  } catch (error) {
    console.error("Delete account error:", error);
    return { error: "Failed to delete account. Please try again." };
  }
}

export async function submitInquiry(data: { name: string; email: string; message: string }) {
  try {
    const inquiry = await prisma.contactInquiry.create({
      data: {
        name: data.name,
        email: data.email,
        message: data.message,
      }
    });

    // Send notification email to support team
    sendInquiryNotification(data.name, data.email, data.message)
      .catch(err => console.error("Failed to send inquiry email:", err));

    return { success: true, data: inquiry };
  } catch (error: any) {
    console.error("Inquiry submission error:", error);
    return { success: false, error: "Failed to send message. Please try again later." };
  }
}

export async function sendOutreachAction(data: { name: string; email: string; product: string; subject: string; lang: 'ar' | 'en' }) {
  try {
    const result = await sendArtisanOutreachEmail(data.email, data.name, data.product, data.subject, data.lang);
    if (!result.success) {
      return { success: false, error: "Failed to send email via Resend" };
    }
    return { success: true };
  } catch (error) {
    console.error("Outreach Action Error:", error);
    return { success: false, error: "Internal Server Error" };
  }
}

export async function bulkDeleteProducts(ids: string[]) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: "You must be signed in to perform this action" };
    }

    const isAdmin = session.user.role === "ADMIN";
    
    if (!isAdmin) {
      const artisan = await prisma.artisanProfile.findUnique({
        where: { userId: session.user.id }
      });

      if (!artisan) {
        return { error: "You must be an artisan to perform this action" };
      }

      // Verify that all products belong to this artisan
      const productsCount = await prisma.product.count({
        where: {
          id: { in: ids },
          artisanId: artisan.id
        }
      });

      if (productsCount !== ids.length) {
        return { error: "You are not authorized to remove some of these treasures" };
      }
    }

    await prisma.product.deleteMany({
      where: {
        id: { in: ids }
      }
    });

    revalidatePath("/studio");
    revalidatePath("/");
    revalidatePath("/artisans");
    revalidatePath("/categories");

    return { success: true };
  } catch (error) {
    console.error("Bulk delete error:", error);
    return { error: "Failed to remove treasures" };
  }
}

export async function bulkUpdateProductStatus(ids: string[], status: "PENDING" | "APPROVED" | "REJECTED" | "DRAFT") {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: "You must be signed in to perform this action" };
    }

    const isAdmin = session.user.role === "ADMIN";
    let targetStatus = status;

    if (!isAdmin) {
      const artisan = await prisma.artisanProfile.findUnique({
        where: { userId: session.user.id }
      });

      if (!artisan) {
        return { error: "You must be an artisan to perform this action" };
      }

      // Verify that all products belong to this artisan
      const productsCount = await prisma.product.count({
        where: {
          id: { in: ids },
          artisanId: artisan.id
        }
      });

      if (productsCount !== ids.length) {
        return { error: "You are not authorized to update some of these treasures" };
      }

      // Artisans can only transition products to DRAFT or PENDING
      if (status === "APPROVED" || status === "REJECTED") {
        targetStatus = "PENDING";
      }
    }

    await prisma.product.updateMany({
      where: {
        id: { in: ids }
      },
      data: {
        status: targetStatus,
        rejectionReason: null
      }
    });

    revalidatePath("/");
    revalidatePath("/categories");
    revalidatePath("/artisans");
    revalidatePath("/admin/products");
    revalidatePath("/studio");
    return { success: true };
  } catch (error) {
    console.error("Bulk update status error:", error);
    return { error: "Failed to update treasures status" };
  }
}

export async function validateCouponAction(code: string, subtotal: number) {
  try {
    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase().trim() }
    });

    if (!coupon) {
      return { error: "This coupon code does not exist." };
    }

    if (!coupon.isActive) {
      return { error: "This coupon is no longer active." };
    }

    if (coupon.expiresAt && new Date() > coupon.expiresAt) {
      return { error: "This coupon has expired." };
    }

    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return { error: "This coupon has reached its maximum usage limit." };
    }

    if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
      return { error: `This coupon is only valid for orders of EGP ${coupon.minOrderAmount} or more.` };
    }

    let appliedDiscount = 0;
    if (coupon.discountType === "PERCENTAGE") {
      appliedDiscount = subtotal * (coupon.discountValue / 100);
      if (coupon.maxDiscount && appliedDiscount > coupon.maxDiscount) {
        appliedDiscount = coupon.maxDiscount;
      }
    } else if (coupon.discountType === "FIXED") {
      appliedDiscount = coupon.discountValue;
    }

    // Round to 2 decimal places and clamp to subtotal
    appliedDiscount = Math.min(Math.round(appliedDiscount * 100) / 100, subtotal);

    return {
      success: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        appliedDiscount
      }
    };
  } catch (error) {
    console.error("Validate coupon error:", error);
    return { error: "An error occurred during coupon validation." };
  }
}
