
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const productId = 'cmnwa747p0002tkf2dwtz5i14';
  const product = await prisma.product.findUnique({
    where: { id: productId }
  });
  console.log('Product exists:', !!product);
  
  const senderId = 'cmnxj74k10001mkf2h3m7aqw7';
  const sender = await prisma.user.findUnique({
    where: { id: senderId }
  });
  console.log('Sender exists:', !!sender);

  const receiverId = 'cmnvb1nj30000r4f21sr3e0u8';
  const receiver = await prisma.user.findUnique({
    where: { id: receiverId }
  });
  console.log('Receiver exists:', !!receiver);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
