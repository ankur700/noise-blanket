<script lang="ts">
  import AudioPlayer from "@components/AudioPlayer.svelte";
  import Layout from "@components/layout.svelte";
  import { audioStore } from "@stores/audioStore";
  import { tracks } from "@utils/tracks.js";
  import { addTrack, initalizeTracks } from "@utils/utils";
  import { onMount } from "svelte";
  import type { Track } from "../lib/types/types";
  let hasDocument = $state<boolean>(false);
  let hideInactiveSounds = $state<boolean>(false);
  let isPlaying = $derived<boolean>(hasDocument && $audioStore.some((audio) => audio.isPlaying));
  let Tracks = $derived(setTracks());
  let isSelected = $derived((track: Track) =>
    $audioStore.some((audio) => audio.src === track.src)
  );
  let tracksFromStorage = $state<Track[] | null>(null);
  let isCustom = $derived((track: Track) =>
    tracksFromStorage?.some((t) => t.src === track.src)
  );

  onMount(() => {
    audioStore.init();
    checkDocument();
  })


  $effect(() => {
    getTracksFromStorage();
    const documentCheckInterval = setInterval(checkDocument, 1000); // Check every 1 second

    return () => {
      clearInterval(documentCheckInterval);
    };
  });

  function setTracks() {
    if (!tracksFromStorage) {
      return tracks;
    } else {
      return [...tracks, ...tracksFromStorage];
    }
  }

  async function getTracksFromStorage() {
    tracksFromStorage = await initalizeTracks();

  }
  async function checkDocument() {
    try {
      hasDocument = await chrome.offscreen.hasDocument();
    } catch (checkError) {
      console.error("Error checking offscreen document:", checkError);
    }
  }
</script>

<Layout {hasDocument} {isPlaying} bind:hideInactiveSounds>
  <div class="grid grid-cols-3 gap-2 p-2">
    {#if Tracks}
      {#each Tracks as track}
        <AudioPlayer
          {...track}
          {hideInactiveSounds}
          isCustom={isCustom(track)}
          isSelected={isSelected(track)}
        />
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
          onclick={() => addTrack(Tracks ?? [])}
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
