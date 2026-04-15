const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function checkUser() {
  const email = "giftisanmarket@gmail.com";
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      accounts: true,
      sessions: true,
      artisanProfile: true
    }
  });

  if (user) {
    console.log("User found:", JSON.stringify(user, null, 2));
  } else {
    console.log("User not found.");
  }

  await prisma.$disconnect();
}

checkUser();
