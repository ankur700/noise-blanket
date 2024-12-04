<script lang="ts">
  import { audioStore } from "@stores/audioStore";

  let { src, title, icon } = $props();
  let volume = $state<number>(50);
  let isSelected = $state<boolean>(false);

  $effect(() => {
			isSelected = $audioStore.some((audio) => audio.src === src);
  });

  function toggleTrack() {
    isSelected = !isSelected;
    const selectedAudio = { src: src, title: title, volume: volume };
    isSelected ? audioStore.playAudio(selectedAudio) : audioStore.stopAudio(selectedAudio);
    chrome.runtime.sendMessage({
      type: isSelected ? "PLAY_AUDIO" : "STOP_AUDIO",
      audioUrl: src,
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

<div class="card card-hover variant-glass-surface space-y-2" role="group">
  <section class="card-body pt-4 relative">
    <button
      class="absolute inset-0"
      aria-label={isSelected ? "Play" : "Pause"}
      onclick={toggleTrack}
    ></button>
    <img
      src={icon}
      class={`h-16 w-16 rounded-full p-2 group-hover:bg-surface-200 mx-auto ${isSelected ? "bg-surface-200" : ""}`}
      alt={title}
    />
    <p class="text-sm capitalize pt-2">{title}</p>
  </section>
  <footer class="card-footer pb-1">
    <input
      type="range"
      min="0"
      max="100"
      step="10"
      bind:value={volume}
      oninput={handleAudioVolumeChange}
    />
  </footer>
</div>
