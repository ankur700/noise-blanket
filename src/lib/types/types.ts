
export interface Preset {
  [key: string]: selectedAudioType[];
}

export interface selectedAudioType {
  src: string;
  title: string;
  volume: number;
}