"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { slugify } from "@/lib/utils";

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
            reviews: true
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
    const slug = data.studioName ? `${slugify(data.studioName)}-${userId.slice(-4)}` : null;
    const updated = await prisma.artisanProfile.update({
      where: { userId },
      data: {
        studioName: data.studioName,
        slug,
        bio: data.bio,
        location: data.location,
        avatar: data.avatar
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
  } catch (error) {
    console.error("Update artisan error:", error);
    return { error: "Failed to update studio profile" };
  }
}

export async function createProduct(artisanId: string, data: any) {
  try {
    const slug = `${slugify(data.name)}-${Math.random().toString(36).substring(2, 7)}`;
    const product = await prisma.product.create({
      data: {
        artisanId,
        name: data.name,
        slug,
        description: data.description,
        price: parseFloat(data.price),
        category: data.category,
        images: data.images,
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

export async function updateOrderItemStatus(itemId: string, status: string) {
  try {
    await prisma.orderItem.update({
      where: { id: itemId },
      data: {
        status: status
      }
    });
    return { success: true };
  } catch (error) {
    console.error("Update status error:", error);
    return { error: "Failed to update item status" };
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

    const slug = `${slugify(data.name)}-${productId.slice(-4)}`;
    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        name: data.name,
        slug,
        description: data.description,
        price: rawPrice,
        category: data.category,
        images: Array.isArray(data.images) ? data.images : [],
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

export async function addReview(data: { productId: string, userId: string, rating: number, comment: string }) {
  try {
    const review = await prisma.review.create({
      data: {
        productId: data.productId,
        userId: data.userId,
        rating: data.rating,
        comment: data.comment,
      },
      include: {
        user: true
      }
    });
    return { success: true, review };
  } catch (error) {
    console.error("Add review error:", error);
    return { error: "Failed to post your review" };
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

export async function sendMessage(senderId: string, receiverId: string, content: string, productId?: string) {
  try {
    const message = await prisma.message.create({
      data: {
        senderId,
        receiverId,
        content,
        productId
      },
      include: {
        sender: true,
        receiver: true,
        product: true
      }
    });
    return { success: true, message };
  } catch (error: any) {
    console.error("Send message error:", error);
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
      orderBy: { createdAt: 'desc' }
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
import { revalidatePath } from "next/cache";

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
