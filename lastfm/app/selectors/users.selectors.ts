import { PrismaClient } from "@prisma/client";

export const isUsernameAvailable = async (username: string) => {
  const prisma = new PrismaClient();
  const user = await prisma.user.findFirst({
    where: { username: username }
  });
  await prisma.$disconnect();
  return user === null;
};

export const selectUserByUsername = async (username: string) => {
  const prisma = new PrismaClient();
  const user = await prisma.user.findFirst({ where: { username } });
  await prisma.$disconnect();
  return user;
};
