import { Artist, PrismaClient } from "@prisma/client";
import { ActionFunctionArgs } from "@remix-run/node";
import { getArtistWithName, getSongByArtistWithName } from "~/selectors/music.selectors";
import { selectUserByUsername } from "~/selectors/users.selectors";

export const action = async ({ request }: ActionFunctionArgs) => {
    // I'd like a more abstract way to validate the request body.
    // Chucking validation in the controller doesn't make for the best new-dev onboarding experience.
    // Then again, if it's overly abstract, that wouldn't do much good either.
    const data = await request.formData();
    if (!data.has("artist") || !data.has("song") || !data.has("user")) {
        return new Response("Artist and song are required", { status: 400 });
    }
    // We don't really do that "auth" thing here, remember?
    const requestingUser = data.get("user");
    const artist = data.get("artist");
    const song = data.get("song");

    if (typeof requestingUser !== "string" || typeof artist !== "string" || typeof song !== "string") {
        return new Response("Invalid request", { status: 400 });
    }

    const prisma = new PrismaClient();
    const qRequestingUser = await selectUserByUsername(requestingUser, prisma);
    if (!qRequestingUser) {
        return new Response(`User ${requestingUser} does not exist`, { status: 401 });
    }

    let qArtist = await getArtistWithName(artist, prisma);
    if (!qArtist) {
        qArtist = await prisma.artist.create({
            data: { name: artist }
        });
    }

    let qSong = await getSongByArtistWithName(song, artist, prisma);
    if (!qSong) {
        qSong = await prisma.song.create({
            data: {
                name: song,
                artist: {
                    connect: { id: qArtist.id }
                }
            }
        });
    }

    await prisma.scrobble.create({
        data: {
            user: {
                connect: { id: qRequestingUser.id }
            },
            song: {
                connect: { id: qSong.id }
            }
        }
    });
}