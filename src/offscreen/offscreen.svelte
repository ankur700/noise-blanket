<script lang="ts">
  import { audioStore } from "@stores/audioStore";
  import type { selectedAudioType } from "../lib/types/types";


  let audioContexts = $state<Map<string, HTMLAudioElement>>(
    new Map<string, HTMLAudioElement>()
  );

  $effect(() => {
    initializeAudioContexts();
  });

  function initializeAudioContexts() {
    if($audioStore.length === 0) return
    $audioStore.forEach((audio) => {
      if (!audioContexts.has(audio.src)) {
        const audioElement = new Audio(audio.src);
        audioContexts.set(audio.src, audioElement);
      }
    })
  }

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.type) {
      case "PLAY_AUDIO_OFFSCREEN":
        playAudio(message.audioUrl, message.volume);
        break;
      case "STOP_AUDIO_OFFSCREEN":
        stopAudio(message.audioUrl);
        break;
      case "STOP_ALL_AUDIO_OFFSCREEN":
        stopAllAudios();
        break;
      case "RESUME_ALL_AUDIO_OFFSCREEN":
        resumeAllAudios();
        break;
      case "SET_VOLUME_OFFSCREEN":
        setVolume(message.audioUrl, message.volume);
        break;
      case "CLEAR_OFFSCREEN":
        clear();
        break;
      case "LOAD_PRESET_OFFSCREEN":
        loadPreset(message.preset);
        break;
    }
  });

  // @ts-ignore
  function playAudio(audioUrl, volume) {
    if (!audioContexts.has(audioUrl)) {
      const audio = new Audio(audioUrl);
      audio.play();
      audio.loop = true;
      audio.volume = Math.max(0, Math.min(1, volume / 100));
      audioContexts.set(audioUrl, audio);
    }
  }

  // @ts-ignore
  function stopAudio(audioUrl) {
    const audio = audioContexts.get(audioUrl);
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      audioContexts.delete(audioUrl);
    }
  }

  function stopAllAudios() {
    audioContexts.forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
  }

  function resumeAllAudios() {
    audioContexts.forEach((audio) => {
      audio.play();
      audio.loop = true;
    });
  }

  // @ts-ignore
  function setVolume(audioUrl, volume) {
    const audio = audioContexts.get(audioUrl);
    if (audio) {
      audio.volume = Math.max(0, Math.min(1, volume / 100));
    }
  }

  function clear() {
    stopAllAudios();
    audioContexts.clear();
  }

  function loadPreset(preset: selectedAudioType[]) {
    clear();
    preset.forEach((audio) => {
      playAudio(audio.src, audio.volume);
    });
  }
</script>
