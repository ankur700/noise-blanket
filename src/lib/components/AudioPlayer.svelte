<script lang="ts">
  import { audioStore } from "@stores/audioStore";

  let { src, title, icon, hideInactiveSounds, isSelected } = $props();
  let volume = $state<number>(50);

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
</script>

<div
  class={!isSelected && hideInactiveSounds
    ? "hideInactiveSounds"
    : "card card-hover variant-glass-surface relative p-2"}
  role="group"
>
  <button
    class="absolute inset-0 z-40"
    type="button"
    tabindex="0"
    aria-label={!isSelected ? "Play" : "Pause"}
    onclick={!isSelected ? play : pause}
  >
  </button>

  <section class="card-body pt-1">
    <img
      src={icon}
      class={`h-12 w-12 rounded-full p-2 group-hover:bg-secondary-50 mx-auto ${isSelected ? "bg-secondary-50" : "bg-[rgba(0,0,0,0.1)]"}`}
      alt={title}
    />
    <p class="text-sm capitalize pt-2">{title}</p>
    <input
      type="range"
      min="0"
      max="100"
      step="10"
      class={isSelected
        ? "z-50 px-2 mt-2 relative bg-secondary-50"
        : "px-2 mt-2"}
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
