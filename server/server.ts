import express from "express";
import "./bot";
import "./spotify";
import { Spotify } from "./spotify";

const app = express();

app.listen(4000, () => {
  console.log(`[server started on port 4000] `);
});

app.get("/", async (req, res) => {
  await Spotify.authenticate();
  const start = Date.now();
  const r = await Spotify.getPlaylistTracks("0u8ab7oAwtFPWgNWMIFlTu");
  const elapsedTime = Date.now() - start;

  res.json({
    message: "success",
    timeTakenMs: elapsedTime,
    res: r,
  });
});

// Create or update a subscription
app.post("/subscriptions", (req, res) => {
  const { chatId, playlists } = req.body; // Extract payload
  if (!chatId || !Array.isArray(playlists)) {
    res.status(400).json({ message: "Invalid payload" });
    return;
  }
  res.status(501).json({ message: "Not implemented", chatId, playlists });
});

// Delete a subscription by ID
app.delete("/subscriptions/:id", (req, res) => {
  const { id } = req.params; // Extract ID from URL
  res.status(501).json({ message: "Not implemented", id });
});

// Get all subscriptions
app.get("/subscriptions", (req, res) => {
  res.status(501).json({ message: "Not implemented" });
});

// Get a specific subscription by ID
app.get("/subscriptions/:id", (req, res) => {
  const { id } = req.params; // Extract ID from URL
  res.status(501).json({ message: "Not implemented", id });
});
