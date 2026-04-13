"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

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

    return products;
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
    return favorites.map(f => f.product);
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
    const updated = await prisma.artisanProfile.update({
      where: { userId },
      data: {
        studioName: data.studioName,
        bio: data.bio,
        location: data.location,
        avatar: data.avatar
      }
    });
    return { success: true, artisan: updated };
  } catch (error) {
    console.error("Update artisan error:", error);
    return { error: "Failed to update studio profile" };
  }
}

export async function createProduct(artisanId: string, data: any) {
  try {
    const product = await prisma.product.create({
      data: {
        artisanId,
        name: data.name,
        description: data.description,
        price: parseFloat(data.price),
        category: data.category,
        images: data.images,
        canPersonalize: data.canPersonalize || false,
        badge: data.badge || null,
        tags: [],
      }
    });
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
