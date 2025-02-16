import type { Track } from "../types/types";

export async function addCustomTrackToStorage(track: Track, Tracks?: Track[]) {
  const oldTracks = await initalizeTracks();
  const newTracks = [...oldTracks, track];
  chrome.storage.local.set({ "customTracks": newTracks });
  Tracks?.push(track);
}

export async function initalizeTracks(): Promise<Track[]> {
  return new Promise((resolve) => {
    chrome.storage.local.get("customTracks", (result) => {
      const storageTracks = result["customTracks"] || [];
      resolve(storageTracks);
    });
  });
}
