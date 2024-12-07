
export interface Preset {
  [key: string]: selectedAudioType[];
}

export interface selectedAudioType {
  src: string;
  title?: string;
  volume?: number;
  isPlaying: boolean;
}

export interface Track {
  id: string;
  src: string;
  title: string;
  icon: string;
}