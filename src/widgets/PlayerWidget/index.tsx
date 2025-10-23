import { useQuery } from "@tanstack/react-query";
import api from "../../shared/api/http";
import Player from "./Player";
import SideTable from "./SideTable";
import type { Track } from "../../entities/Tracks";
import { PlayerConfigProvider } from "../../shared/hooks/playerConfigProvider";

const PlayerWidget = () => {
	const { data, isLoading, error } = useQuery({
		queryKey: ["allTracks"],
		queryFn: async (): Promise<Track[]> => {
			const url = `/tracks`;
			const response = await api.get(url);
			return response.data;
		},
		retry: false,
	});

	console.log(data);

	return (
		<>
			<h1 className="text-3xl font-bold p-6 text-center">Music Player</h1>

			<div className="flex gap-6 p-6 bg-neutral-900 text-white rounded-2xl shadow-lg max-w-6xl mx-auto">
				<PlayerConfigProvider>
					{/* Left player */}
					<Player />

					{/* Right queue */}
					<SideTable tracks={data} isLoading={isLoading} error={error} />
				</PlayerConfigProvider>
			</div>
		</>
	);
};

export default PlayerWidget;
