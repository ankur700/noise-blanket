// src/stores/audioStore.js
import { writable } from 'svelte/store';
import type { selectedAudioType } from '../types/types';

// Function to create a persistent store with Chrome storage
function createPersistentStore(key: string, startValue: selectedAudioType[]) {
  const { subscribe, set, update } = writable(startValue);

  return {
    subscribe,
    set: async (value: selectedAudioType[]) => {
      try {
        await chrome.storage.local.set({ [key]: value });
        set(value);
      } catch (error) {
        console.error('Error saving to storage:', error);
      }
    },
    update: async (updater: (arg0: selectedAudioType[]) => any) => {
      update(currentValue => {
        const newValue = updater(currentValue);
        chrome.storage.local.set({ [key]: newValue }).catch(console.error);
        return newValue;
      });
    },
    init: async () => {
      try {
        const stored = await chrome.storage.local.get(key);
        if (stored[key] !== undefined) {
          set(stored[key]);
        }
      } catch (error) {
        console.error('Error loading from storage:', error);
      }
    },
    // Method to add or remove an audio
    playAudio: async (audio: selectedAudioType) => {
      update(currentAudios => {
        const exists = currentAudios.some(a => a.title === audio.title);
        let newAudios;

        if (!exists) {
          // Add if not exists
          newAudios = [...currentAudios, audio];
        } else {
          // dont do anything if already exists
          newAudios = currentAudios;
        }

        // Save to Chrome storage
        chrome.storage.local.set({ [key]: newAudios }).catch(console.error);
        console.log('Updated audios',newAudios);
        return newAudios;
      });
    },

    stopAudio: async (audio: selectedAudioType) => {
      update(currentAudios => {
        const newAudios = currentAudios.filter(a => a.title !== audio.title);
        chrome.storage.local.set({ [key]: newAudios }).catch(console.error);
        return newAudios;
      });
    },


    // Clear all selected audios
    clear: async () => {
      try {
        await chrome.storage.local.remove(key);
        set([]);
      } catch (error) {
        console.error('Error clearing storage:', error);
      }
    }
  };
}

// Create the store for selected audios
export const audioStore = createPersistentStore('tracks', []);