export interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration?: string; // e.g. "3:45"
  coverUrl: string;
  audioUrl: string;
  genre?: string;
  year?: number;
  color?: string;
  lyrics?: string;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  coverUrl: string;
  songIds: string[];
  color?: string;
  isPrivate?: boolean;
  isCollaborative?: boolean;
  isPinned?: boolean;
}

export interface Artist {
  id: string;
  name: string;
  coverUrl: string;
  songIds: string[];
  color?: string;
}

export interface Album {
  id: string;
  name: string;
  artist: string;
  coverUrl: string;
  songIds: string[];
  year?: number;
  color?: string;
}

export type AudioQuality = "normal" | "high" | "lossless";
export type SoundPreset = "spatial_3d" | "studio_master" | "bass_boost" | "vocal_pure";

export interface Toast {
  id: string;
  message: string;
  type?: "info" | "success" | "warning" | "error";
}

export interface RoomState {
  code: string;
  memberCount: number;
  currentSong: Song | null;
  isPlaying: boolean;
  position: number;
  lastSyncTime: number;
  playbackSpeed: number;
  queue: Song[];
}

export type RoomSyncActionType = "PLAY" | "PAUSE" | "SEEK" | "CHANGE_SONG" | "SPEED" | "QUEUE";

export interface RoomSyncPayload {
  action: RoomSyncActionType;
  song?: Song | null;
  position?: number;
  isPlaying?: boolean;
  playbackSpeed?: number;
  queue?: Song[];
  senderId?: string;
  timestamp?: number;
}

export interface ReactionItem {
  id: string;
  emoji: string;
  senderId?: string;
  x: number;
}
