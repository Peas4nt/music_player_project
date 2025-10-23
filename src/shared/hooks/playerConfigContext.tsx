import { createContext } from "react";
import type { Track } from "../../entities/Tracks";

export type playerConfigContext = {
  playedTrack: Track | undefined;
  playerTrackId: number | undefined;
  trackQueue: Track[];
  trackSearch: string;
  trackSelectedOption: "all" | "liked" | "recently-played";
  
  setTrackSearch: (search: string) => void;
  setPlayedTrack: (track: Track | undefined) => void;
  setPlayerTrackId: (id: number | undefined) => void;
  setTrackQueue: (queue: Track[]) => void;
  setTrackSelectedOption: (option: "all" | "liked" | "recently-played") => void;
};

export const PlayerConfigContext = createContext<playerConfigContext | undefined>(undefined);


