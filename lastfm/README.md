## [Remix](https://remix.run/)

I lent a hand to a project using Remix a little while ago. Since then I've not touched it. I'd like to be more familiar with what people are using, so I figured I'd catch myself up a bit.

### Disclaimer
- Auth isn't actually auth. It's a cookie with your user id. I have no plans on this ever being hosted.
- I was planning to experiment with shadcdn a bit, but decided not to for now.
- I've included the `dev.db` file in the unlikely event that you'd like to run this project. This is easier than providing scaffolding.

### Thoughts, as I have them
- File system based routing solves small problems at the expense of additional behind-the-scenes complexity. I don't personally think it's good, but once you're aware of it, it's not a big deal. 
  - I'd prefer it to not be used by default, since many open source projects attract contributors from all over. It doesn't save the core developers enough time to warrant potentially annoying would-be contributors from across the street.
  - That being said, for teams consisting entirely of people who work in this part of the world day-in day-out, sure. Why not.
- The goal very much seems to be "success via many microscopic improvements". This occurred to me when I realized `loader`, a function which is automatically called, can optionally take `params` as an argument.
- Prisma is considerably more verbose than Django's ORM but is intuitive enough for that to not bother me much. I've used it before and thought the same thing then.
- Below is an example of a pattern I've seen repeated in many examples. It leaves me with questions. I've left those as comments.
```ts
export const selectUsersScrobbles = async (userId: string) => {
  // Is a Singleton out of the question?
  // After enough reads it should become a predictable codepath.
  // Which is more performant than allocating a new client for each request.
  // With that being said, the fact that this pattern is seemingly common
  // suggests that there are more things to consider than what I've listed.
  const prisma = new PrismaClient();
  const scrobbles = prisma.scrobble.findMany({
    where: {
      userId: userId
    }
  });
  // We're waiting for the connection to drop here.
  // But what if we'd rather keep the connection open,
  // for <int:conn_max_age> seconds?
  // This is a fairly common practice for database operations that typically result in subsequent operations.
  await prisma.$disconnect();
  return scrobbles;
};
```