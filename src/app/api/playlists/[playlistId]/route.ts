import { NextResponse } from "next/server";
// import { db } from "@/lib/mongodb";
// import { to } from "await-to-js";
// import type { Log, LogPayload } from "@/types";
import SpotifyWebApi from "spotify-web-api-node";

// bot
export async function GET(
  request: Request,
  { params }: { params: Promise<{ playlistId: string }> }
) {
  const playlistId = (await params).playlistId;

  try {
    const spotifyApi = new SpotifyWebApi({
      clientId: "6f4fbf5d368c4540b3a79c5abf1b25f0",
      clientSecret: "9cb4df8f6ac343d9a76db4f528bc7489",
      redirectUri: "https:127.0.0.1:3000",
    });

    async function authenticate() {
      const { body } = await spotifyApi.clientCredentialsGrant();
      spotifyApi.setAccessToken(body.access_token);
    }

    await authenticate();

    const res = await spotifyApi.getPlaylistTracks(playlistId);

    // return NextResponse.json({ data: playlistId });
    const last10Tracks = res.body.items
      .map((item) => {
        if (!item.track) return false;

        return item.track.name;
      })
      .filter(Boolean);

    return NextResponse.json({ data: last10Tracks.slice(0, 10) });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch logs", error },
      { status: 500 }
    );
  }
}
