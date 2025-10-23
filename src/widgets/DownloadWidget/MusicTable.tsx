import { useQuery } from "@tanstack/react-query";
import type { Track } from "../../entities/Tracks";
import MusicColumn from "../../shared/ui/MusicColumn";
import api from "../../shared/api/http";
import Loader from "../../shared/ui/Loader";
import DownloadButtons from "./DownloadButtons";

type Props = {
	link: string;
};

const MusicTable = ({ link }: Props) => {
	const { data, isLoading, error } = useQuery({
		queryKey: ["tracks", link],
		queryFn: async (): Promise<Track[]> => {
			const url = `/playlist/${encodeURIComponent(link)}`;
			const response = await api.get(url);
			return response.data;
		},
		retry: false,
		enabled: !!link, // Only run the query if link is provided
	});

	if (!link) return null;

	if (error) return <div className="text-red-500 mt-10">Error: {(error as Error).message}</div>;

	if (isLoading) return <Loader className={"mt-10"} />;

	return (
		<>
			<div className="w-full max-w-3xl mt-10 bg-neutral-900 rounded-xl shadow-lg overflow-hidden">
				<table className="w-full text-left">
					<tbody>
						{data?.map((track, id) => (
							<tr
								key={track.id + `-${id}`}
								className="border-b border-neutral-800 last:border-none hover:bg-neutral-800 transition">
								<MusicColumn
									image={track.img_url}
									title={track.title}
									artist={track.artist}
									className={"p-2"}
								/>

								<td className="p-2 text-right">
									<DownloadButtons id={track.id} url={track.track_url} />
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</>
	);
};

export default MusicTable;
