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

export interface Toast {
  id: string;
  message: string;
  type?: "info" | "success" | "warning" | "error";
}
