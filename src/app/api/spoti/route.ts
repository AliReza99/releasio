import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/lib/mongodb";
import SpotifyWebApi from "spotify-web-api-node";
import { getLogs } from "@/lib/telegraf";
// import { getBotLogs } from "@/lib/telegram";

// var SpotifyWebApi = require("spotify-web-api-node");

// credentials are optional

let previousTrackIds = new Set<string>();

export async function GET() {
  try {
    // console.log(`[ran again] `);

    // const spotifyApi = new SpotifyWebApi({
    //   clientId: "6f4fbf5d368c4540b3a79c5abf1b25f0",
    //   clientSecret: "9cb4df8f6ac343d9a76db4f528bc7489",
    //   redirectUri: "https:127.0.0.1:3000",
    // });

    // async function authenticate() {
    //   const { body } = await spotifyApi.clientCredentialsGrant();
    //   spotifyApi.setAccessToken(body.access_token);
    // }

    // await authenticate();

    // const { body } = await spotifyApi.getPlaylistTracks(
    //   "0u8ab7oAwtFPWgNWMIFlTu"
    // );

    // const last10Tracks = body.items
    //   .map((item) => {
    //     if (!item.track) return false;

    //     return item.track.name;
    //   })
    //   .filter(Boolean);

    return NextResponse.json({ logs: getLogs() });
  } catch (error) {
    // console.error("Error generating token:", error);
    return NextResponse.json({ message: "Failed", error }, { status: 500 });
  }
}
