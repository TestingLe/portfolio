import { create } from "zustand";

export type ZoneName = "about" | "skills" | "projects" | "education" | "awards" | "contact" | null;

interface GameState {
  activeZone: ZoneName;
  showHUD: boolean;
  isExploring: boolean;
  playerX: number;
  playerZ: number;
  setActiveZone: (zone: ZoneName) => void;
  setShowHUD: (show: boolean) => void;
  setIsExploring: (exploring: boolean) => void;
  setPlayerPosition: (x: number, z: number) => void;
  enterZone: (zone: ZoneName) => void;
  exitZone: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  activeZone: null,
  showHUD: false,
  isExploring: true,
  playerX: 0,
  playerZ: 0,
  setActiveZone: (zone) => set({ activeZone: zone }),
  setShowHUD: (show) => set({ showHUD: show }),
  setIsExploring: (exploring) => set({ isExploring: exploring }),
  setPlayerPosition: (x, z) => set({ playerX: x, playerZ: z }),
  enterZone: (zone) => set({ activeZone: zone, showHUD: true }),
  exitZone: () => set({ activeZone: null, showHUD: false }),
}));
