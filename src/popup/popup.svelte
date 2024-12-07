<script lang="ts">
  import AudioPlayer from "@components/AudioPlayer.svelte";
  import Layout from "@components/layout.svelte";
  import { audioStore } from "@stores/audioStore";
  import { tracks } from "@utils/tracks.js";
  import { onMount } from "svelte";
  import type { Track } from "../lib/types/types";
  let hasDocument = $state<boolean>(false);
  let hideInactiveSounds = $state<boolean>(false);
  let isPlaying = $state<boolean>(false);
  let Tracks = $state<Track[] | null>(null);

  onMount(() => {
    Tracks = [...tracks];
  });

  $effect(() => {
    audioStore.init();
    // chrome.runtime.sendMessage({ type: "LOAD_TRACKS" });
    const documentCheckInterval = setInterval(checkDocument, 1000); // Check every 1 second
    if (hasDocument) {
      isPlaying = $audioStore.some((audio) => audio.isPlaying);
    }

    return () => {
      clearInterval(documentCheckInterval);
    };
  });

  async function checkDocument() {
    try {
      hasDocument = await chrome.offscreen.hasDocument();
    } catch (checkError) {
      console.error("Error checking offscreen document:", checkError);
    }
  }

  function addTrack() {
    const title = prompt("Enter a name for the track");
    const audioSrc = prompt("Provide audio source url");

    const newAudioTrack: Track = {
      id: (tracks?.length + 1).toString(),
      src:
        audioSrc ?? "https://apps.roanapur.de/blanket/603ddcfeb4a790b1579c.ogg",
      title: title ?? "Custom Audio",
      icon: "/images/white-noise.svg",
    };
    Tracks?.push(newAudioTrack);

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
</script>

<Layout {hasDocument} {isPlaying} bind:hideInactiveSounds>
  <div class="grid grid-cols-3 gap-2 p-2">
    {#if Tracks}
      {#each Tracks as track}
        <AudioPlayer {...track} {hideInactiveSounds} />
      {/each}
    {/if}
    <div
      class="card card-hover flex justify-center items-center variant-glass-surface min-h-36"
      role="group"
    >
      <section class="card-body">
        <button
          class="btn btn-icon variant-glass-surface"
          aria-label="Add Track"
          onclick={addTrack}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-plus"
            ><path d="M5 12h14" /><path d="M12 5v14" /></svg
          >
        </button>
      </section>
    </div>
  </div>
</Layout>
