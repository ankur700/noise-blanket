<script lang="ts">
  import { AppBar, LightSwitch } from "@skeletonlabs/skeleton";
  import "@styles/global.css";
  import { StorageManager } from "@utils/storageManager";
  import type { Preset } from "../types/types";

  let savedPresets = $state<Preset[]>([]);
  let { children = null, title = null } = $props();

  $effect(() => {
    loadPresets();
  })

  async function loadPresets() {
    savedPresets = await StorageManager.getAllPresets();
  }
</script>

<section class="container mx-auto max-w-3xl p-4">
  <AppBar>
    <svelte:fragment slot="lead">
      <select class="select select-bordered w-full max-w-xs">
        <option disabled selected>Select an option</option>
        {#each savedPresets as preset}
          <option>{Object.keys(preset)[0]}</option>
        {/each}
      </select>
    </svelte:fragment>
    { title ? title : 'App Bar'}
    <svelte:fragment slot="trail"><LightSwitch /></svelte:fragment>
  </AppBar>
  <div class="mt-4 text-center">
    {@render children()}
  </div>
</section>
