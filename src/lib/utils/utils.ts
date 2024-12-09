import { audioStore } from "@stores/audioStore";
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

export function addTrack(tracks: Track[]) {

  let audioSrc: string | null = null;
  let title: string | null = null;

  audioSrc = prompt("Provide audio source url");
  title = prompt("Enter a name for the track");

  if (!audioSrc || !title) {
    return alert("Please provide a valid audio source url and a name for the track.");
  };
  const newAudioTrack: Track = {
    id: (tracks?.length + 1).toString(),
    src: audioSrc ?? "https://apps.roanapur.de/blanket/603ddcfeb4a790b1579c.ogg",
    title: title ?? "Custom Audio",
    icon: "/images/white-noise.svg",
  };

  addCustomTrackToStorage(newAudioTrack, tracks);
  audioStore.playAudio({
    title: newAudioTrack.title,
    src: newAudioTrack.src,
    volume: 50,
    isPlaying: true,
  });
  chrome.runtime.sendMessage({
    type: "PLAY_AUDIO",
    audioUrl: newAudioTrack.src,
    volume: 50,
  });
}

