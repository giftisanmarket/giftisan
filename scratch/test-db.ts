import { prisma } from "../src/lib/prisma";

async function test() {
  try {
    const subscribers = await prisma.newsletterSubscriber.findMany();
    console.log("Subscribers:", subscribers);
  } catch (error) {
    console.error("Connection error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

test();
