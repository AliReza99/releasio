type PlaylistResponseItem = {
  added_at: SpotifyApi.PlaylistTrackObject["added_at"];
  track: PlaylistItemTrack | null;
};

type PlaylistItemTrack = Pick<
  SpotifyApi.TrackObjectFull,
  "name" | "id" | "external_urls"
>;

export type PlaylistTracksResponse = Pick<
  SpotifyApi.PlaylistTrackResponse,
  "limit" | "offset" | "total" | "previous"
> & {
  items: PlaylistResponseItem[];
};
