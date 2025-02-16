<script lang="ts">
  import AudioPlayer from "@components/AudioPlayer.svelte";
  import Layout from "@components/layout.svelte";
  import { audioStore } from "@stores/audioStore";
  import { tracks } from "@utils/tracks.js";
  import { onMount } from "svelte";
  import type { Track } from "../lib/types/types";
  let hasDocument = $state<boolean>(false);
  let hideInactiveSounds = $state<boolean>(false);
  let isPlaying = $derived<boolean>(
    hasDocument && $audioStore.some((audio) => audio.isPlaying)
  );
  let Tracks = $state<Track[]>(tracks);
  let isSelected = $derived((track: Track) =>
    $audioStore.some((audio) => audio.src === track.src)
  );

  onMount(() => {
    audioStore.init();
    checkDocument();
  });

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
          isSelected={isSelected(track)}
        />
      {/each}
    {/if}
  </div>
</Layout>
