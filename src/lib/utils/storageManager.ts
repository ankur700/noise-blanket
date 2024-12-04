import type { Preset, selectedAudioType } from "../types/types";

export class StorageManager {
	private static STORAGE_KEY = 'presets';

	// Retrieve current history
	private static async getPreset(): Promise<Preset[]> {
		return new Promise((resolve) => {
			chrome.storage.local.get(this.STORAGE_KEY, (result) => {
				// Return existing history or empty array
				const history = result[this.STORAGE_KEY] || [];
				resolve(history);
			});
		});
	}

	static async savePreset(key: string, selectedAudios: selectedAudioType[]): Promise<void> {
		try {
			// Get current history
			const history = await this.getPreset();

			const isEntryExists = history.some((entry) => Object.keys(entry)[0] === key);

      if (isEntryExists) {
        return;
      }

			// Create new entry
			const newEntry: Preset = {
				[key]: selectedAudios,
			};

			// Add new entry to the start of the array
			const updatedHistory = [newEntry, ...history];


			// Save to storage
			return new Promise((resolve, reject) => {
				chrome.storage.local.set({ [this.STORAGE_KEY]: updatedHistory }, () => {
					if (chrome.runtime.lastError) {
						reject(chrome.runtime.lastError);
						return;
					}
					resolve();
				});
			});
		} catch (error) {
			console.error('Error saving preset:', error);
			throw error;
		}
	}

	static async removePreset(key: string): Promise<void> {
		try {
			// Get current history
			const history = await this.getPreset();

			// Remove entry
			const updatedHistory = history.filter((entry) => Object.keys(entry)[0] !== key);

			// Save to storage
			return new Promise((resolve, reject) => {
				chrome.storage.local.set({ [this.STORAGE_KEY]: updatedHistory }, () => {
					if (chrome.runtime.lastError) {
						reject(chrome.runtime.lastError);
						return;
					}
					resolve();
				});
			});
		} catch (error) {
			console.error('Error saving preset:', error);
			throw error;
		}
	}

	static async getAllPresets(): Promise<Preset[]> {
		try {
			return new Promise((resolve, reject) => {
				chrome.storage.local.get(this.STORAGE_KEY, (result) => {
					if (chrome.runtime.lastError) {
						reject(chrome.runtime.lastError);
						return;
					}
					resolve(result[this.STORAGE_KEY] || []);
				});
			});
		} catch (error) {
			console.error('Error getting presets:', error);
			throw error;
		}
	}

	static async removeAllPresets(): Promise<void> {
		try {
			return new Promise((resolve, reject) => {
				chrome.storage.local.remove(this.STORAGE_KEY, () => {
					if (chrome.runtime.lastError) {
						reject(chrome.runtime.lastError);
						return;
					}
					resolve();
				});
			});
		} catch (error) {
			console.error('Error removing presets:', error);
			throw error;
		}
	}
}
