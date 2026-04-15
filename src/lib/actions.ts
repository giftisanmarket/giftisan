"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signIn } from "@/auth";
import { revalidatePath } from "next/cache";
import { AuthError } from "next-auth";
import { slugify } from "@/lib/utils";
import cloudinary from "@/lib/cloudinary";
import { sendWelcomeEmail, sendOrderNotification, sendMessageNotification, sendVerificationEmail, sendOrderStatusUpdateEmail, sendPasswordResetEmail } from "@/lib/mail";
import { generateVerificationToken, generatePasswordResetToken } from "@/lib/tokens";

export async function uploadImage(base64Data: string) {
  try {
    if (base64Data.startsWith('http')) {
      return { success: true, url: base64Data };
    }

    const uploadResponse = await cloudinary.uploader.upload(base64Data, {
      folder: "giftisan",
    });
    return { success: true, url: uploadResponse.secure_url };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return { success: false, error: "Failed to upload image" };
  }
}

async function processImage(imageSource: string | null | undefined): Promise<string | null> {
  if (!imageSource) return null;
  if (imageSource.startsWith('data:image')) {
    const res = await uploadImage(imageSource);
    if (res.success && res.url) return res.url;
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
          bio: "A new artisan in the Giftisan community.",
          location: "Global Studio",
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
        },
      });
    }

    // Generate verification token and send email
    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail(verificationToken.identifier, verificationToken.token);

    return { success: true };
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
      where: query ? {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { category: { contains: query, mode: "insensitive" } },
          {
            artisan: {
              user: {
                name: { contains: query, mode: "insensitive" }
              }
            }
          }
        ]
      } : {},
      include: {
        artisan: {
          include: {
            user: true
          }
        }
      },
      take: 10
    });

    return products.map(p => ({
      ...p,
      images: Array.isArray(p.images) ? p.images.map((img: string) => (img?.length || 0) > 300000 ? "" : img) : [],
      artisan: {
        ...p.artisan,
        avatar: (p.artisan.avatar?.length || 0) > 300000 ? "" : p.artisan.avatar,
        user: { name: p.artisan.user?.name }
      }
    }));
  } catch (error) {
    console.error("Search error:", error);
    return [];
  }
}

export async function getProductsByCategory(category: string) {
  if (!category) return [];

  try {
    const products = await prisma.product.findMany({
      where: {
        category: {
          equals: category,
          mode: "insensitive"
        }
      },
      include: {
        artisan: {
          include: {
            user: true
          }
        }
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
    // 🛡️ Final Inventory Guard: Verify stock for all items before processing
    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.id },
        select: { stock: true, name: true }
      });

      if (!product || product.stock < item.quantity) {
        return { 
          error: `The treasure "${product?.name || 'One of your items'}" just sold out! Please remove it from your cart to proceed.` 
        };
      }
    }

    const order = await prisma.order.create({
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
        items: {
          create: items.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
            personalization: item.personalization
          }))
        }
      }
    });

    // Decrement stock for each item
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.id },
        data: {
          stock: {
            decrement: item.quantity
          }
        }
      });
    }

    // Send notification emails to artisans (asynchronously)
    try {
      const orderWithArtisans = await prisma.order.findUnique({
        where: { id: order.id },
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
        }
      });

      if (orderWithArtisans) {
        // Collect unique artisans
        const artisans = new Map();
        orderWithArtisans.items.forEach(item => {
          const artisan = item.product.artisan;
          if (artisan.user.email) {
            artisans.set(artisan.user.email, {
              name: artisan.user.name || artisan.studioName,
              email: artisan.user.email
            });
          }
        });

        // Send emails
        artisans.forEach(artisan => {
          sendOrderNotification(artisan.email, artisan.name, order.id, totalAmount)
            .catch(err => console.error(`Failed to send order notification to ${artisan.email}:`, err));
        });
      }
    } catch (err) {
      console.error("Failed to process order notification emails:", err);
    }

    return { success: true, orderId: order.id };
  } catch (error) {
    console.error("Order creation error:", error);
    return { error: "Failed to create order" };
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
            reviews: true,
            favoritedBy: true
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
      include: {
        user: true,
        products: true
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

export async function updateArtisanProfile(userId: string, data: any) {
  try {
    const slug = data.studioName 
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
        bannerImage: bannerUrl || null
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
        bannerImage: bannerUrl || null
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
        avatar: updated.avatar
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

export async function createProduct(artisanId: string, data: any) {
  try {
    const slug = `${slugify(data.name)}-${Math.random().toString(36).substring(2, 7)}`;
    const uploadedImages = await Promise.all(
      (data.images || []).map((img: string) => processImage(img))
    );
    const finalImages = uploadedImages.filter(img => img !== null) as string[];

    const product = await prisma.product.create({
      data: {
        artisanId,
        name: data.name,
        slug,
        description: data.description,
        price: parseFloat(data.price),
        category: data.category,
        images: finalImages,
        canPersonalize: data.canPersonalize || false,
        badge: data.badge || null,
        stock: parseInt(data.stock) || 1,
        tags: [],
      }
    });
    
    revalidatePath("/studio");
    revalidatePath("/");
    revalidatePath("/artisans");
    revalidatePath("/categories");

    return { success: true, product };
  } catch (error) {
    console.error("Create product error:", error);
    return { error: "Failed to list new treasure" };
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
        product: true
      },
      orderBy: {
        order: {
          createdAt: 'desc'
        }
      }
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
      }
    });

    return reviews;
  } catch (error) {
    console.error("Fetch artisan reviews error:", error);
    return [];
  }
}

export async function updateOrderItemStatus(itemId: string, status: string, trackingNumber?: string, carrier?: string) {
  try {
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
        updatedItem.product.name
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
    return { success: true, data: subscriber };
  } catch (error: any) {
    console.error("Newsletter subscription error:", error);
    if (error.code === 'P2002') {
      return { success: false, error: 'You are already subscribed!' };
    }
    return { success: false, error: error.message || 'Something went wrong.' };
  }
}

export async function getSubscribers() {
  try {
    return await prisma.newsletterSubscriber.findMany({
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error("Fetch subscribers error:", error);
    return [];
  }
}

export async function updateProduct(productId: string, data: any) {
  try {
    const rawPrice = typeof data.price === 'string' ? parseFloat(data.price) : data.price;
    const rawStock = typeof data.stock === 'string' ? parseInt(data.stock) : data.stock;

    if (isNaN(rawPrice)) return { error: "Invalid price format" };
    if (isNaN(rawStock)) return { error: "Invalid stock number" };

    const uploadedImages = await Promise.all(
      (data.images || []).map((img: string) => processImage(img))
    );
    const finalImages = uploadedImages.filter(img => img !== null) as string[];

    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        name: data.name,
        description: data.description,
        price: rawPrice,
        category: data.category,
        images: finalImages,
        canPersonalize: !!data.canPersonalize,
        badge: data.badge || null,
        stock: rawStock,
      }
    });
    
    revalidatePath(`/products/${productId}`);
    revalidatePath("/studio");
    revalidatePath("/");
    revalidatePath("/artisans");
    revalidatePath("/categories");

    return { success: true, product };
  } catch (error: any) {
    console.error("Update product error:", error);
    return { error: error.message || "Failed to update treasure" };
  }
}

export async function deleteProduct(productId: string) {
  try {
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
    await prisma.user.update({
      where: { id: userId },
      data: { role: "ARTISAN" }
    });

    await prisma.artisanProfile.create({
      data: {
        userId,
        studioName: studioData.studioName,
        bio: studioData.bio,
        location: studioData.location || "Global Studio",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${studioData.studioName || userId}`
      }
    });

    return { success: true };
  } catch (error) {
    console.error("Promote to artisan error:", error);
    return { error: "Failed to become an artisan" };
  }
}

export async function addReview(data: { productId: string, userId: string, rating: number, comment: string, images?: string[] }) {
  try {
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
    await prisma.user.delete({
      where: { id: userId }
    });
    return { success: true };
  } catch (error) {
    console.error("Delete user error:", error);
    return { error: "Failed to delete user" };
  }
}

export async function toggleArtisanVerification(artisanId: string, status: boolean) {
  try {
    await prisma.artisanProfile.update({
      where: { id: artisanId },
      data: { isVerified: status }
    });
    return { success: true };
  } catch (error) {
    console.error("Toggle verification error:", error);
    return { error: "Failed to update verification status" };
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

    // Send notification email to receiver (asynchronously)
    if (message.receiver.email) {
      sendMessageNotification(
        message.receiver.email, 
        message.receiver.name || "Artisan", 
        message.sender.name || "A customer"
      ).catch(err => console.error("Failed to send message notification:", err));
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
        sender: true,
        receiver: true,
        product: true
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
    const image = formData.get("image") as string;

    const user = await prisma.user.update({
      where: { id: userId },
      data: { name, image }
    });
    return { 
      success: true, 
      user: {
        id: user.id,
        name: user.name,
        image: user.image
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

export async function trackProductView(productId: string) {
  try {
    await prisma.product.update({
      where: { id: productId },
      data: { views: { increment: 1 } }
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to track view:", error);
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



