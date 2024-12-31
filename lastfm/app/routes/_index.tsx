import { PrismaClient, Scrobble } from "@prisma/client";
import type { MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export async function loader() {
  const prisma = new PrismaClient();
  const scrobbles = await prisma.scrobble.findMany({
    include: {
      song: {
        select: {
          name: true,
          artist: {
            select: {
              name: true
            }
          }
        }
      },
      user: {
        select: {
          username: true
        }
      }
    }
  })
  console.log(scrobbles);
  await prisma.$disconnect();
  return scrobbles;
}

export const meta: MetaFunction = () => {
  return [
    { title: "Last.fm Clone" },
    { name: "description", content: "Last.fm but with considerably less functionality!" },
  ];
};

export default function Index() {
  const scrobbles = useLoaderData<Scrobble[]>();
  return (
    <div>
      <h1>Hello World</h1>
      <ul>
        {scrobbles.map((scrobble: any) => (
          <li key={scrobble.id}>
            {scrobble.user.username} - {scrobble.song.name} - {scrobble.song.artist.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

