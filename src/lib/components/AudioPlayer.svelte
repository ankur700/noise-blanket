<script lang="ts">
  import { audioStore } from "@stores/audioStore";
  import type { Track } from "../types/types";

  let { src, title, icon, hideInactiveSounds, isSelected, isCustom } = $props();
  let volume = $state<number>(50);

  // $effect(() => {
  //   printVariables();
  // });

  function printVariables() {
    console.log("audios", $audioStore);
    console.log(`${title} selected: `, isSelected);
    console.log("hide inacvtive :", hideInactiveSounds);
    // console.log("has offline Document :", hasDocument);
  }

  chrome.contextMenus.onClicked.addListener((info) => {
    if (info.menuItemId === "removeAudio") {
      removeCustomTrack();
    }
  });

  function pause() {
    // isSelected = !isSelected;
    const selectedAudio = {
      src: src,
      title: title,
      volume: volume,
      isPlaying: false,
    };
    audioStore.stopAudio(selectedAudio);
    chrome.runtime.sendMessage({
      type: "STOP_AUDIO",
      audioUrl: selectedAudio.src,
      volume: volume,
    });
  }

  function play() {
    // isSelected = !isSelected;
    const selectedAudio = {
      src: src,
      title: title,
      volume: volume,
      isPlaying: true,
    };
    audioStore.playAudio(selectedAudio);
    chrome.runtime.sendMessage({
      type: "PLAY_AUDIO",
      audioUrl: selectedAudio.src,
      volume: volume,
    });
  }

  function handleAudioVolumeChange() {
    chrome.runtime.sendMessage({
      type: "SET_VOLUME",
      audioUrl: src,
      volume: volume,
    });
  }

  async function removeCustomTrack() {
    const { customTracks } = await chrome.storage.local.get("customTracks");
    const newTracks = customTracks.filter((track: Track) => track.src !== src);
    await chrome.storage.local.set({ customTracks: newTracks });
  }
</script>

<div
  class={!isSelected && hideInactiveSounds
    ? "hideInactiveSounds"
    : "card card-hover variant-glass-surface relative p-2 space-y-2"}
  role="group"
>
  {#if isCustom}
    <a
      class="absolute inset-0 z-40"
      role="button"
      type="button"
      tabindex="0"
      href={src}
      aria-label={!isSelected ? "Play" : "Pause"}
      onclick={(e) => {
        e.preventDefault();
        !isSelected ? play() : pause();
      }}
    >
    </a>
  {:else}
    <button
      class="absolute inset-0 z-40"
      type="button"
      tabindex="0"
      aria-label={!isSelected ? "Play" : "Pause"}
      onclick={!isSelected ? play : pause}
    >
    </button>
  {/if}

  <section class="card-body pt-2">
    <img
      src={icon}
      class={`h-16 w-16 rounded-full p-2 group-hover:bg-secondary-50 mx-auto ${isSelected ? "bg-secondary-50" : ""}`}
      alt={title}
    />
    <p class="text-sm capitalize pt-2">{title}</p>
    <input
      type="range"
      min="0"
      max="100"
      step="10"
      class={isSelected ? "z-50 px-2 mt-2 relative" : "px-2 mt-2"}
      bind:value={volume}
      disabled={!isSelected}
      oninput={handleAudioVolumeChange}
    />
  </section>
</div>

<style>
  .hideInactiveSounds {
    display: none;
  }
</style>
