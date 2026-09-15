import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { ReactionItem, RoomSyncPayload, Song } from "../types";

interface RoomContextType {
  roomCode: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  memberCount: number;
  reactions: ReactionItem[];
  clientId: string;
  createRoom: (currentSong?: Song | null, isPlaying?: boolean, position?: number, queue?: Song[]) => Promise<string | null>;
  joinRoom: (code: string) => Promise<{ success: boolean; error?: string }>;
  leaveRoom: () => void;
  sendSyncAction: (payload: RoomSyncPayload) => void;
  sendReaction: (emoji: string) => void;
  registerSyncListener: (listener: (payload: RoomSyncPayload, serverTime: number) => void) => () => void;
}

const RoomContext = createContext<RoomContextType | null>(null);

const ROOM_STORAGE_KEY = "wavelength_active_couple_room";

function getStoredRoomCode(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return sessionStorage.getItem(ROOM_STORAGE_KEY) || null;
  } catch {
    return null;
  }
}

function setStoredRoomCode(code: string | null) {
  if (typeof window === "undefined") return;
  try {
    if (code) sessionStorage.setItem(ROOM_STORAGE_KEY, code);
    else sessionStorage.removeItem(ROOM_STORAGE_KEY);
  } catch {}
}

export function RoomProvider({ children }: { children: ReactNode }) {
  const [clientId] = useState(() => `client-${Math.random().toString(36).substring(2, 9)}`);
  const [roomCode, setRoomCode] = useState<string | null>(() => getStoredRoomCode());
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [memberCount, setMemberCount] = useState(1);
  const [reactions, setReactions] = useState<ReactionItem[]>([]);

  const socketRef = useRef<WebSocket | null>(null);
  const listenersRef = useRef<Set<(payload: RoomSyncPayload, serverTime: number) => void>>(new Set());

  // Connect WebSocket to /ws/rooms/{code}
  const connectSocket = (code: string) => {
    if (socketRef.current) {
      try {
        socketRef.current.close();
      } catch {}
      socketRef.current = null;
    }

    setIsConnecting(true);

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const host = window.location.host;
    const wsUrl = `${protocol}//${host}/ws/rooms/${code}`;

    const ws = new WebSocket(wsUrl);
    socketRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      setIsConnecting(false);
      setRoomCode(code);
      setStoredRoomCode(code);
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === "ROOM_INIT") {
          setMemberCount(msg.memberCount || 1);
          // Trigger listeners with initial state if available
          if (msg.state && (msg.state.currentSong || msg.state.isPlaying)) {
            const initialPayload: RoomSyncPayload = {
              action: "CHANGE_SONG",
              song: msg.state.currentSong,
              isPlaying: msg.state.isPlaying,
              position: msg.state.position || 0,
              playbackSpeed: msg.state.playbackSpeed || 1.0,
              queue: msg.state.queue || [],
              senderId: "server_init",
              timestamp: msg.serverTime || Date.now(),
            };
            listenersRef.current.forEach((fn) => fn(initialPayload, msg.serverTime || Date.now()));
          }
        } else if (msg.type === "MEMBER_JOINED") {
          setMemberCount(msg.memberCount || 1);
        } else if (msg.type === "MEMBER_LEFT") {
          setMemberCount(msg.memberCount || 1);
        } else if (msg.type === "SYNC_ACTION") {
          const payload: RoomSyncPayload = {
            action: msg.action,
            ...msg.data,
            timestamp: msg.serverTime || Date.now(),
          };
          listenersRef.current.forEach((fn) => fn(payload, msg.serverTime || Date.now()));
        } else if (msg.type === "REACTION") {
          triggerReaction(msg.emoji, msg.senderId);
        }
      } catch {}
    };

    ws.onerror = () => {
      setIsConnected(false);
      setIsConnecting(false);
    };

    ws.onclose = () => {
      setIsConnected(false);
      setIsConnecting(false);
    };
  };

  const triggerReaction = (emoji: string, senderId?: string) => {
    const reaction: ReactionItem = {
      id: `rx-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      emoji,
      senderId,
      x: Math.floor(Math.random() * 60) + 20, // 20% to 80% screen width
    };
    setReactions((prev) => [...prev, reaction]);

    // Auto-remove reaction after animation completes (2.5s)
    setTimeout(() => {
      setReactions((prev) => prev.filter((r) => r.id !== reaction.id));
    }, 2500);
  };

  // Reconnect if stored room code exists on initial load
  useEffect(() => {
    const saved = getStoredRoomCode();
    if (saved && /^\d{6}$/.test(saved)) {
      connectSocket(saved);
    }
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  const createRoom = async (
    currentSong?: Song | null,
    isPlaying?: boolean,
    position?: number,
    queue?: Song[]
  ): Promise<string | null> => {
    try {
      const res = await fetch("/api/rooms/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentSong: currentSong || null,
          isPlaying: !!isPlaying,
          position: position || 0,
          queue: queue || [],
        }),
      });
      if (!res.ok) return null;
      const data = await res.json();
      const code = data.roomCode;
      connectSocket(code);
      return code;
    } catch {
      return null;
    }
  };

  const joinRoom = async (code: string): Promise<{ success: boolean; error?: string }> => {
    const cleanCode = code.trim();
    if (!/^\d{6}$/.test(cleanCode)) {
      return { success: false, error: "Please enter a valid 6-digit room code" };
    }

    try {
      const res = await fetch(`/api/rooms/${cleanCode}`);
      if (!res.ok) {
        return { success: false, error: "Room not found or expired. Check the code." };
      }
      connectSocket(cleanCode);
      return { success: true };
    } catch {
      return { success: false, error: "Could not connect to server." };
    }
  };

  const leaveRoom = () => {
    if (socketRef.current) {
      try {
        socketRef.current.close();
      } catch {}
      socketRef.current = null;
    }
    setRoomCode(null);
    setStoredRoomCode(null);
    setIsConnected(false);
    setMemberCount(1);
  };

  const sendSyncAction = (payload: RoomSyncPayload) => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN || !roomCode) {
      return;
    }
    try {
      socketRef.current.send(
        JSON.stringify({
          type: "SYNC_ACTION",
          action: payload.action,
          data: {
            ...payload,
            senderId: clientId,
            timestamp: Date.now(),
          },
        })
      );
    } catch {}
  };

  const sendReaction = (emoji: string) => {
    triggerReaction(emoji, clientId);
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN || !roomCode) {
      return;
    }
    try {
      socketRef.current.send(
        JSON.stringify({
          type: "REACTION",
          emoji,
          senderId: clientId,
        })
      );
    } catch {}
  };

  const registerSyncListener = (listener: (payload: RoomSyncPayload, serverTime: number) => void) => {
    listenersRef.current.add(listener);
    return () => {
      listenersRef.current.delete(listener);
    };
  };

  return (
    <RoomContext.Provider
      value={{
        roomCode,
        isConnected,
        isConnecting,
        memberCount,
        reactions,
        clientId,
        createRoom,
        joinRoom,
        leaveRoom,
        sendSyncAction,
        sendReaction,
        registerSyncListener,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
}

export function useRoom() {
  const ctx = useContext(RoomContext);
  if (!ctx) {
    throw new Error("useRoom must be used within a RoomProvider");
  }
  return ctx;
}
