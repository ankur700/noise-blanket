<script lang="ts">
  import { audioStore } from "@stores/audioStore";

  let {
    src,
    title,
    icon,
    hideInactiveSounds = false,
  } = $props();
  let volume = $state<number>(50);
  let isSelected = $state<boolean>(false);


  $effect(() => {
   isSelected = $audioStore.some((audio) => audio.src === src);
  //  printVariables();
  });

  function printVariables(){
    // console.log("audios", $audioStore);
    // console.log(`${title} selected: `, isSelected);
    console.log("hide inacvtive :", hideInactiveSounds);
  }

  function pause() {
    isSelected = !isSelected;
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
    isSelected = !isSelected;
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
    : "card card-hover variant-glass-surface space-y-2"}
  role="group"
>
  <section class="card-body pt-4 relative">
    <button
      class="absolute inset-0"
      aria-label={!isSelected ? "Play" : "Pause"}
      onclick={!isSelected ? play : pause}
    ></button>
    <img
      src={icon}
      class={`h-16 w-16 rounded-full p-2 group-hover:bg-secondary-50 mx-auto ${isSelected ? "bg-secondary-50" : ""}`}
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

<style>
  .hideInactiveSounds {
    display: none;
  }
</style>
