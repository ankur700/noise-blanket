<script lang="ts">
  import { AppBar, LightSwitch } from "@skeletonlabs/skeleton";
  import { audioStore } from "@stores/audioStore";
  import "@styles/global.css";
  import { StorageManager } from "@utils/storageManager";
  import type { Preset } from "../types/types";

  let {
    children = null,
    hasDocument,
    isPlaying,
    hideInactiveSounds = $bindable<boolean>(false),
  } = $props();

  let selectedPreset = $state<string>("default");
  let savedPresets = $state<Preset[] | null>(null);
  let open = $state<boolean>(false);

  $effect(() => {
    loadPresetsFromStorage();
    if (hasDocument) {
      getSelectedPresetFromStorage();
    }
  });

  async function getSelectedPresetFromStorage() {
    try {
      const selectedPresetFromStorage =
        await chrome.storage.local.get("lastSelectedPreset");
      if (selectedPresetFromStorage["lastSelectedPreset"]) {
        selectedPreset = selectedPresetFromStorage["lastSelectedPreset"];
      }
    } catch (error) {
      console.error("Error geting last selected preset from storage", error);
    }
  }

  async function loadPresetsFromStorage() {
    try {
      savedPresets = await StorageManager.getAllPresets();
    } catch (error) {
      console.error("Error loading presets from storage", error);
    }
  }

  function stopAllAudios() {
    chrome.runtime.sendMessage({
      type: "STOP_ALL_AUDIO",
    });

    isPlaying = false;
  }

  function resumeAllAudios() {
    chrome.runtime.sendMessage({
      type: "RESUME_ALL_AUDIO",
    });
    isPlaying = true;
  }

  function clear() {
    audioStore.clear();
    chrome.runtime.sendMessage({
      type: "CLEAR",
    });
    isPlaying = false;
  }

  function loadPreset() {
    const preset = savedPresets?.find(
      (p) => Object.keys(p)[0] === selectedPreset
    );
    if (preset) {
      const audioList = preset[selectedPreset];
      chrome.storage.local.set({ lastSelectedPreset: selectedPreset }, () => {
        audioStore.loadPreset(audioList);
        chrome.runtime.sendMessage({
          type: "LOAD_PRESET",
          preset: audioList,
        });
      });
    }
  }

  async function removeSelectedPreset() {
    open = !open;
    await StorageManager.removePreset(selectedPreset);
  }

  async function savePreset() {
    open = !open;
    const name = prompt("Enter a name for the preset");
    if (name) {
      StorageManager.savePreset(name, $audioStore);
    }
  }
</script>

<section class="container mx-auto max-w-3xl">
  <AppBar
    gridColumns="grid-cols-3"
    slotDefault="place-self-center"
    slotTrail="place-content-end"
    class="relative"
  >
    <svelte:fragment slot="lead">
      <button
        type="button"
        class="btn btn-icon variant-glass-surface"
        aria-haspopup="menu"
        aria-expanded="false"
        aria-label="Dropdown"
        onclick={() => (open = !open)}
      >
        <svg
          class="flex-none size-4"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          ><circle cx="12" cy="12" r="1" /><circle
            cx="12"
            cy="5"
            r="1"
          /><circle cx="12" cy="19" r="1" /></svg
        >
      </button>

      <div
        class={`card ${open ? "top-full opacity-100 visible" : "top-[110%] invisible opacity-0"} absolute left-0 z-40 mt-2 max-w-md rounded-md bg-dark dark:bg-dark-2 py-[10px] transition-all`}
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="dropdown-custom-icon-trigger"
      >
        <ul class="list p-1 space-y-0.5">
          <li aria-label={"Save"}>
            <button
              aria-label="Save as new Preset"
              class="btn"
              onclick={savePreset}
            >
              Save as new Preset
            </button>
          </li>
          <li aria-label={"Remove selected preset"}>
            <button
              aria-label="Remove selected preset"
              class="btn"
              onclick={removeSelectedPreset}
            >
              Remove selected preset
            </button>
          </li>
          <li aria-label={"Hide Inactive Sounds"}>
            <button
              aria-label="Hide Inactive Sounds"
              class="btn"
              onclick={() => {
                open = !open;
                hideInactiveSounds = !hideInactiveSounds;
              }}
            >
              {hideInactiveSounds
                ? "Show Inactive Sounds"
                : "Hide Inactive Sounds"}
            </button>
          </li>
        </ul>
      </div>

      <button
        class="btn btn-icon variant-glass-surface rounded-full"
        aria-label={isPlaying ? "Stop All" : "Resume All"}
        title={isPlaying ? "Stop All" : "Resume All"}
        onclick={isPlaying ? stopAllAudios : resumeAllAudios}
        disabled={!hasDocument || $audioStore.length === 0}
      >
        {#if isPlaying}
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
            class="lucide lucide-circle-pause"
            ><circle cx="12" cy="12" r="10" /><line
              x1="10"
              x2="10"
              y1="15"
              y2="9"
            /><line x1="14" x2="14" y1="15" y2="9" /></svg
          >
        {:else}
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
            class="lucide lucide-circle-play"
            ><circle cx="12" cy="12" r="10" /><polygon
              points="10 8 16 12 10 16 10 8"
            /></svg
          >
        {/if}
      </button>
      <button
        class="btn btn-icon variant-glass-surface"
        aria-label="Clear"
        title="Clear All"
        onclick={clear}
        disabled={$audioStore.length === 0}
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
          class="lucide lucide-circle-stop"
          ><circle cx="12" cy="12" r="10" /><rect
            x="9"
            y="9"
            width="6"
            height="6"
            rx="1"
          /></svg
        >
      </button>
    </svelte:fragment>
    {#if savedPresets}
      <select
        class="select max-w-md"
        bind:value={selectedPreset}
        onchange={loadPreset}
        placeholder="Select Preset"
      >
        {#if savedPresets.length > 0}
          {#each savedPresets as preset}
            <option value={Object.keys(preset)[0]}
              >{Object.keys(preset)[0]}</option
            >
          {/each}
        {:else}
          <option value="default">Default</option>
        {/if}
      </select>
    {/if}

    <svelte:fragment slot="trail"><LightSwitch /></svelte:fragment>
  </AppBar>
  <div class="mt-4 text-center">
    {@render children()}
  </div>
</section>
