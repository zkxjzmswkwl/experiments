import { Album, Artist as ArtistType, PrismaClient, Song } from "@prisma/client";
import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

type ArtistWithRelations = ArtistType & {
  albums: (Album & {
    songs: Song[]
  })[]
};

export async function loader({ params }: LoaderFunctionArgs) {
  const prisma = new PrismaClient();
  const artist = await prisma.artist.findFirst({
    where: { name: params.artistName },
    include: {
      albums: {
        include: {
          songs: true
        }
      }
    },
  });
  await prisma.$disconnect();
  return artist;
}

export default function Artist() {
  const artist = useLoaderData<typeof loader>();
  return (
    <div>
      <h1>{artist?.name}</h1>
      <ul>
        {artist?.albums.map((album) => (
          <li key={album.id}>
            {album.name}
            <ul>
              {album.songs.map((song) => (
                <li key={song.id}>{song.name}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
