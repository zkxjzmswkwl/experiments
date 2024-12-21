import { PrismaClient } from "@prisma/client";

export const selectUsersScrobbles = async (userId: string) => {
  // Is a Singleton out of the question? After enough reads it should become a predictable codepath.
  // Which would quickly become more performant than allocating a new client for each request.
  const prisma = new PrismaClient();
  const scrobbles = prisma.scrobble.findMany({
    where: {
      userId: userId
    }
  });
  // We're waiting for the connection to drop here, according to [$disconnect] docs.
  // But what if we'd rather keep the connection open for <int:conn_max_age> seconds?
  // This is a fairly common practice for database operations that typically result in subsequent operations.
  await prisma.$disconnect();
  return scrobbles;
};
