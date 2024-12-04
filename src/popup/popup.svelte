<script lang="ts">
  import AudioPlayer from "@components/AudioPlayer.svelte";
  import Layout from "@components/layout.svelte";
  import { audioStore } from "@stores/audioStore";
  import { StorageManager } from "@utils/storageManager";
  import { tracks } from "@utils/tracks.js";
  import { onMount } from "svelte";
  import type { selectedAudioType } from "../lib/types/types";


  onMount(() => {
    audioStore.init();
  });

  function stopAllAudios() {
    chrome.runtime.sendMessage({
      type: 'STOP_ALL_AUDIO'
    });
  }

  function resumeAllAudios() {
    chrome.runtime.sendMessage({
      type: 'RESUME_ALL_AUDIO'
    });
  }

async function savePreset(currentTracks: selectedAudioType[]) {
  const name = prompt('Enter a name for the preset');
  if (name) {
    StorageManager.savePreset(name, currentTracks);
  }
  const all = await StorageManager.getAllPresets();
  console.log(all);
}


</script>

<Layout title="Noise Blanket">
  <div class="grid grid-cols-3 gap-2 p-2">
    {#each tracks as track}
      <AudioPlayer {...track} />
    {/each}
    <div class="card card-hover variant-glass-surface space-y-2" role="group">
      <section class="card-body flex flex-col items-center gap-2 pt-4 ">
        <div class="space-x-2">
          <button
            class="btn btn-icon variant-glass-surface rounded-full"
            aria-label={'Stop All'}
            onclick={stopAllAudios}
          >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-stop"><circle cx="12" cy="12" r="10"/><rect x="9" y="9" width="6" height="6" rx="1"/></svg>
        </button>
        <button
          class="btn btn-icon variant-glass-surface rounded-full"
          aria-label={'Resume All'}
          onclick={resumeAllAudios}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-play"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
        </button>
        </div>
        <button class="btn btn-sm variant-filled-primary" onclick={() => savePreset($audioStore)}>
          Save Preset
        </button>
    </div>
  </div>
</Layout>
