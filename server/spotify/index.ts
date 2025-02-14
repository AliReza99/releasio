import SpotifyWebApi from "spotify-web-api-node";
import { config } from "dotenv";
config();

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { PlaylistTracksResponse } from "./types";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TOKEN_PATH = path.resolve(__dirname, "spotify_token.json");

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: "https:127.0.0.1:3000",
});

// const { body } = await spotifyApi.getPlaylistTracks("0u8ab7oAwtFPWgNWMIFlTu");

// const last10Tracks = body.items
//   .map((item) => {
//     if (!item.track) return false;

//     return item.track.name;
//   })
//   .filter(Boolean);

// console.log(`[last10Tracks] `, last10Tracks);

export class Spotify {
  static async authenticate() {
    try {
      const tokenData = await fs.readFile(TOKEN_PATH, "utf-8");
      const { access_token, expires_at } = JSON.parse(tokenData);

      if (Date.now() < expires_at) {
        spotifyApi.setAccessToken(access_token);
        return;
      }
    } catch (err) {
      // Token file might not exist or be invalid, so we proceed to fetch a new token
      console.log(`[token expired/not-found. getting new token] `);
    }

    const { body } = await spotifyApi.clientCredentialsGrant();
    const expires_at = Date.now() + body.expires_in * 1000; // Convert to ms

    await fs.writeFile(
      TOKEN_PATH,
      JSON.stringify({
        access_token: body.access_token,
        expires_at,
      })
    );

    spotifyApi.setAccessToken(body.access_token);
  }

  static async getPlaylistTracks(
    playlistId: string,
    { page = 1, pageSize = 100 }: { page?: number; pageSize?: number } = {}
  ) {
    const offset = (page - 1) * pageSize;
    const body: PlaylistTracksResponse = await spotifyApi
      .getPlaylistTracks(playlistId, {
        limit: pageSize,
        offset,
        market: "GB",
      })
      .then((d) => d.body);

    return body;
  }
}
