import { useState, type ReactNode } from "react";
import { PlayerConfigContext } from "./playerConfigContext";
import type { Track } from "../../entities/Tracks";
import type { playerConfigContext } from "./playerConfigContext";

export const PlayerConfigProvider = ({ children }: { children: ReactNode }) => {
	const [trackSearch, setTrackSearch] = useState<string>("");
	const [trackSelectedOption, setTrackSelectedOption] = useState<"all" | "liked" | "recently-played">("all");
	const [playedTrack, setPlayedTrack] = useState<Track | null>(null);
	const [playerTrackId, setPlayerTrackId] = useState<number | null>(null);
	const [trackQueue, setTrackQueue] = useState<Track[]>([]);

	return (
		<PlayerConfigContext.Provider
      value={{
        trackSearch,
				playedTrack,
				playerTrackId,
				trackQueue,
				trackSelectedOption,
        setTrackSearch,
				setPlayedTrack,
				setPlayerTrackId,
				setTrackQueue,
				setTrackSelectedOption,
			} as playerConfigContext}>
			{children}
		</PlayerConfigContext.Provider>
	);
};
