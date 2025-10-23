import { useContext, useEffect, useState } from "react";
import type { Track } from "../../entities/Tracks";
import Loader from "../../shared/ui/Loader";
import MusicColumn from "../../shared/ui/MusicColumn";
import { PlayerConfigContext } from "../../shared/hooks/playerConfigContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";

type Props = {
	tracks: Track[] | undefined;
	isLoading: boolean;
	error: Error | null;
};

const SideTable = ({ tracks, isLoading, error }: Props) => {
	const [filteredTracks, setFilteredTracks] = useState<Track[] | undefined>(tracks);
	const [selected, setSelected] = useState<"all" | "liked" | "recently-played">("all");
	const [search, setSearch] = useState<string>("");
	const {
		playedTrack,
		// playerTrackId,
		trackSearch,
		trackSelectedOption,
		setPlayedTrack,
		setPlayerTrackId,
		setTrackQueue,
		setTrackSearch,
		setTrackSelectedOption,
	} = useContext(PlayerConfigContext)!;

	const searchChange = (e: React.ChangeEvent<HTMLFormElement>) => {
		const value = e.target.value as string;
		setSearch(value);
		console.log("Search:", value);
	};

	const menuChange = (e: React.ChangeEvent<HTMLFormElement>) => {
		const value = e.target.value as "all" | "liked" | "recently-played";
		setSelected(value);
		console.log("Selected:", value);
	};

	const trackClick = (track: Track) => {
		console.log("Track clicked:", track);
		if (!playedTrack) {
			console.log("1");
			setPlayedTrack(track);
			setPlayerTrackId(filteredTracks?.findIndex((t) => t.id === track.id) ?? undefined);
			setTrackQueue(filteredTracks || []);
			setTrackSearch(search);
			setTrackSelectedOption(selected);
			return;
		} else if (playedTrack?.id == track.id) {
			console.log("2");
			// If the clicked track is already playing, do nothing
			return;
		} else if (search == trackSearch && trackSelectedOption == selected) {
			console.log("3");
			setPlayedTrack(track);
			setPlayerTrackId(filteredTracks?.findIndex((t) => t.id === track.id) ?? undefined);
		} else {
			console.log("4");
			setPlayedTrack(track);
			setPlayerTrackId(filteredTracks?.findIndex((t) => t.id === track.id) ?? undefined);
			setTrackQueue(filteredTracks || []);
			setTrackSearch(search);
			setTrackSelectedOption(selected);
		}
	};

	const likeTrack = (key: number) => {
		const tracksInLikes = localStorage.getItem("trackLikes");
		let likes: number[] = tracksInLikes ? JSON.parse(tracksInLikes) : [];

		if (!likes.includes(key)) {
			likes.push(key);
		} else {
			likes = likes.filter((id) => id !== key);
		}

		localStorage.setItem("trackLikes", JSON.stringify(likes));

		setFilteredTracks((prev) => createLikeOption(prev || []));
	};

	const createLikeOption = (filteredTracks: Track[]): Track[] => {
		const tracksInLikes = localStorage.getItem("trackLikes");
		const likes: number[] = tracksInLikes ? JSON.parse(tracksInLikes) : [];

		return filteredTracks.map((track) => ({
			...track,
			liked: likes.includes(track.id),
		}));
	};

	useEffect(() => {
		if (!tracks) return;

		if (selected === "all") {
			setFilteredTracks(createLikeOption(tracks));
		} else if (selected === "liked") {
			const tracksInLikes = localStorage.getItem("trackLikes");
			const likes: number[] = tracksInLikes ? JSON.parse(tracksInLikes) : [];

			const likedTracks = likes
				.map((id) => tracks.find((track) => track.id === id))
				.filter((t): t is Track => !!t);
			
			setFilteredTracks(createLikeOption(likedTracks.reverse()));
		} else if (selected === "recently-played") {
			const tracksInHistory = localStorage.getItem("trackHistory");
			const history: number[] = tracksInHistory ? JSON.parse(tracksInHistory) : [];

			const recentlyPlayedTracks = history
				.map((id) => tracks.find((track) => track.id === id))
				.filter((t): t is Track => !!t);
			
			setFilteredTracks(createLikeOption(recentlyPlayedTracks.reverse()));
		}
	}, [selected, tracks]);

	useEffect(() => {
		if (!tracks) return;
		const filteredTracks = tracks.filter((track) => {
			return (
				track.title.toLowerCase().includes(search.toLowerCase()) ||
				track.artist.toLowerCase().includes(search.toLowerCase())
			);
		});

		setFilteredTracks(createLikeOption(filteredTracks));
	}, [search, tracks]);

	useEffect(() => {
		if (!tracks) return;

			const updatedTracks = tracks.map((track) => {
				const isActive = track.id === playedTrack?.id;
				return { ...track, isActive };
			});

			setFilteredTracks(createLikeOption(updatedTracks));

	}, [tracks, playedTrack]);

	return (
		<div className="w-1/3 bg-neutral-800 rounded-2xl p-4">
			<h3 className="text-lg font-semibold mb-4">Up Next</h3>
			<div className="space-y-2">
				{error ? (
					<div className="text-red-500 mt-10">Error loading tracks</div>
				) : isLoading ? (
					<Loader className={"h-10/12"} />
				) : (
					<>
						{/* Search */}
						<form onChange={searchChange}>
							<input
								type="text"
								placeholder="Search..."
								className={`w-full p-2 rounded-xl bg-neutral-900 text-white placeholder-gray-500 focus:outline-none`}
							/>
						</form>
						{/* menu */}

						<nav className="w-full flex">
							<form onChange={menuChange} className="flex gap-1">
								{[
									{ label: "All", value: "all" },
									{ label: "Liked", value: "liked" },
									{ label: "Recently Played", value: "recently-played" },
								].map((item) => (
									<div key={item.value}>
										<input
											type="radio"
											id={item.value}
											name="menu"
											value={item.value ?? ""}
											className="peer hidden"
											defaultChecked={selected === item.value}
										/>
										<label
											htmlFor={item.value}
											className="cursor-pointer select-none px-4 py-0.5 rounded-4xl text-sm font-medium text-gray-300 bg-neutral-700 hover:bg-neutral-200 hover:text-gray-900 transition peer-checked:bg-neutral-100 peer-checked:text-gray-800 peer-checked:border-neutral-600">
											{item.label}
										</label>
									</div>
								))}
							</form>
						</nav>

						{/* Table */}
						<div className="overflow-y-auto scrollbar-thin hide-scrollbar max-h-92 rounded-xl">
							<table className="w-full text-left ">
								<tbody>
									{filteredTracks?.map((track, id) => (
										<tr
											key={track.id + `-${id}`}
											className="border-b border-neutral-800 last:border-none hover:bg-neutral-700 transition">
											<MusicColumn
												image={track.img_url}
												title={track.title}
												artist={track.artist}
												className={"p-1"}
												onClick={() => trackClick(track)}
												isActive={trackSearch == search && trackSelectedOption == selected && track.id === playedTrack?.id}
											/>

											<td className="p-2 text-right">
												<button onClick={() => likeTrack(track.id)}>
													{track.liked ? (
														<FontAwesomeIcon icon={faHeartSolid} />
													) : (
														<FontAwesomeIcon icon={faHeartRegular} />
													)}
												</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default SideTable;
