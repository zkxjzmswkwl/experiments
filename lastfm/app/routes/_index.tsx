import { Artist, PrismaClient } from "@prisma/client";
import type { MetaFunction } from "@remix-run/node";
import { json, useLoaderData } from "@remix-run/react";

export async function loader() {
  const prisma = new PrismaClient();
  const artists = await prisma.artist.findMany();
  console.log(artists);
  await prisma.$disconnect();
  return artists;
}

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const artists = useLoaderData<Artist[]>();
  return (
    <div>
      <h1>Hello World</h1>
      <ul>
        {artists.map((artist) => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ul>
    </div>
  );
}

