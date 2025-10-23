import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faBackward,
	faForward,
	faPause,
	faPlay,
	faRepeat,
	faShuffle,
	faVolumeHigh,
	faVolumeLow,
	faVolumeXmark,
} from "@fortawesome/free-solid-svg-icons";
import { PlayerConfigContext } from "../../shared/hooks/playerConfigContext";
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import api from "../../shared/api/http";

const Player = () => {
	const { playedTrack, playerTrackId, trackQueue, setPlayedTrack, setPlayerTrackId } =
		useContext(PlayerConfigContext)!;

	const [IsPlaying, setIsPlaying] = useState<boolean>(false);
	const [currentTime, setCurrentTime] = useState<number>(0);
	const [duration, setDuration] = useState<number>(0);
	const [volume, setVolume] = useState<number>(10);
	const [isShuffle, setIsShuffle] = useState<boolean>(false);
	const [isRepeat, setIsRepeat] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const audiPlayer = useRef<HTMLAudioElement>(null);

	const trackHistory: number[] = useMemo(() => [], []);

	const togglePlay = () => {
		if (!audiPlayer.current) return;
		if (IsPlaying) {
			audiPlayer.current.pause();
			setIsPlaying(false);
		} else {
			audiPlayer.current.play();
			setIsPlaying(true);
		}
	};

	const handleNextTrack = useCallback(
		(autoNext = false) => {
			console.log("next");
			console.log(audiPlayer.current);
			console.log(playerTrackId);

			if (!audiPlayer.current) return;
			if (!playerTrackId && playerTrackId != 0) return;
			console.log("next passed checks");

			if (trackQueue.length === playerTrackId + 1) {
				console.log("next passed checks");
				if (!autoNext || (autoNext && isRepeat)) {
					console.log("next passed checks");
					setPlayedTrack({ ...trackQueue[0] });
					setPlayerTrackId(0);
					return;
				}
			}

			if (autoNext && isShuffle) {
				console.log("Shuffling tracks...");

				let randomIndex = Math.floor(Math.random() * trackQueue.length);
				while (randomIndex === playerTrackId || trackHistory.includes(randomIndex)) {
					randomIndex = Math.floor(Math.random() * trackQueue.length);
				}
				console.log("Shuffling to index:", randomIndex);
				trackHistory.push(randomIndex);
				if (trackHistory.length > Math.floor(trackQueue.length / 2)) {
					trackHistory.shift();
				}
				setPlayedTrack(trackQueue[randomIndex]);
				setPlayerTrackId(randomIndex);
				return;
			}

			setPlayedTrack(trackQueue[playerTrackId + 1]);
			setPlayerTrackId(playerTrackId + 1);
		},
		[
			trackQueue,
			playerTrackId,
			setPlayedTrack,
			setPlayerTrackId,
			isRepeat,
			isShuffle,
			trackHistory,
		],
	);

	const nextTrack = useCallback(() => handleNextTrack(false), [handleNextTrack]);

	const autoNextTrack = useCallback(() => handleNextTrack(true), [handleNextTrack]);

	const previousTrack = useCallback(() => {
		if (!audiPlayer.current) return;
		if (!playerTrackId && playerTrackId != 0) return;

		if (playerTrackId === 0) {
			setPlayedTrack(trackQueue[trackQueue.length - 1]);
			setPlayerTrackId(trackQueue.length - 1);
			return;
		}

		if (isShuffle && trackHistory.length > 0) {
			const previousIndex = trackHistory.pop()!;
			setPlayedTrack(trackQueue[previousIndex]);
			setPlayerTrackId(previousIndex);
			return;
		}

		setPlayedTrack(trackQueue[playerTrackId - 1]);
		setPlayerTrackId(playerTrackId - 1);
	}, [trackQueue, playerTrackId, setPlayedTrack, setPlayerTrackId, isShuffle, trackHistory]);

	const calculateTime = (secs: number) => {
		const minutes = Math.floor(secs / 60);
		const returnedMinutes = minutes;
		const seconds = Math.floor(secs % 60);
		const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
		return `${returnedMinutes}:${returnedSeconds}`;
	};

	const progressBarHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!audiPlayer.current) return;

		if (audiPlayer.current.readyState < 2) return;

		const value = Number(e.target.value);

		audiPlayer.current.currentTime = (duration / 100) * value;
		setCurrentTime(audiPlayer.current.currentTime);
	};

	const addTrackToHistory = (key: number) => { 
		const tracksInHistory = localStorage.getItem("trackHistory");
		let history: number[] = tracksInHistory ? JSON.parse(tracksInHistory) : [];
		
		history.push(key);

		if (history.length > 50) {
			history = history.slice(history.length - 50);
		}

		localStorage.setItem("trackHistory", JSON.stringify(history));
	};

	useEffect(() => {
		if (!audiPlayer.current) return;
		audiPlayer.current.volume = volume / 100;
	}, [volume]);

	useEffect(() => {
		if (!audiPlayer.current) return;
		if (!playedTrack) return;
		if (IsPlaying) {
			audiPlayer.current.play();
		} else {
			audiPlayer.current.pause();
		}

		addTrackToHistory(playedTrack?.id);
	}, [playedTrack, IsPlaying]);

	useEffect(() => {
		if (!audiPlayer.current) return;
		const audio = audiPlayer.current;

		const handleTimeUpdate = () => {
			setCurrentTime(audio.currentTime);
			if (audio.currentTime === audio.duration) autoNextTrack();
		};
		const handleLoadedMetadata = () => setDuration(audio.duration);

		audio.addEventListener("timeupdate", handleTimeUpdate);
		audio.addEventListener("loadedmetadata", handleLoadedMetadata);

		return () => {
			audio.removeEventListener("timeupdate", handleTimeUpdate);
			audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
		};
	}, [autoNextTrack]);

	return (
		<div className="flex-1 flex flex-col items-center bg-neutral-800 rounded-2xl p-6">
			{/* Cover */}
			<div className="w-64 h-64 bg-neutral-700 rounded-xl mb-6 flex items-center justify-center">
				<img
					src={
						playedTrack?.img_url ||
						"https://cdn-icons-png.flaticon.com/512/282/282151.png"
					}
					alt="Track cover"
					className="w-full h-full object-cover rounded-xl shadow-md"
				/>
			</div>

			<audio
				ref={audiPlayer}
				src={
					playedTrack?.filename &&
					api.defaults.baseURL + "../uploads/" + playedTrack?.filename
				}
				onLoadStart={() => setIsLoading(true)}
				onCanPlay={() => setIsLoading(false)}
				onWaiting={() => setIsLoading(true)}
				onPlaying={() => setIsLoading(false)}
			/>

			{/* Track info */}
			<div className="text-center mb-4">
				<h2 className="text-xl font-semibold">{playedTrack?.title ?? "Track Title"}</h2>
				<p className="text-neutral-400 text-sm">{playedTrack?.artist ?? "Track Title"}</p>
			</div>

			{/* Progress bar */}
			<div className="w-full mb-4">
				<div className="flex justify-between text-xs text-neutral-400">
					<span>{calculateTime(currentTime)}</span>
					<span>{calculateTime(duration)}</span>
				</div>
				<input
					disabled={isLoading}
					type="range"
					min="0"
					max="100"
					step="0.1"
					value={currentTime && duration ? (currentTime / duration) * 100 : 0}
					onChange={progressBarHandler}
					onMouseDown={() => setIsPlaying(false)}
					onMouseUp={() => setIsPlaying(true)}
					className="w-full h-2 appearance-none rounded-full bg-neutral-700 cursor-pointer
         [&::-webkit-slider-runnable-track]:h-2 [&::-webkit-slider-runnable-track]:rounded-full
         [&::-webkit-slider-runnable-track]:bg-neutral-700
         [&::-webkit-slider-thumb]:-webkit-appearance-none [&::-webkit-slider-thumb]:appearance-none
         [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full
         [&::-webkit-slider-thumb]:-mt-1 [&::-webkit-slider-thumb]:bg-white
         [&::-webkit-slider-thumb]:shadow [&::-webkit-slider-thumb]:shadow-emerald-800/40
         [&::-moz-range-track]:h-2 [&::-moz-range-track]:bg-neutral-700 [&::-moz-range-track]:rounded-full
         [&::-moz-range-progress]:h-2 [&::-moz-range-progress]:bg-emerald-600 [&::-moz-range-progress]:rounded-full
         [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:rounded-full
         [&::-moz-range-thumb]:shadow [&::-moz-range-thumb]:shadow-emerald-800/40 disabled:opacity-50 disabled:cursor-not-allowed"
				/>
			</div>

			{/* Controls */}
			<div className="flex items-center justify-center gap-6 mb-4">
				<button
					disabled={isLoading}
					onClick={previousTrack}
					className="p-2 hover:text-neutral-400 transition disabled:opacity-50 disabled:cursor-not-allowed">
					<FontAwesomeIcon icon={faBackward} />
				</button>
				<button
					onClick={togglePlay}
					disabled={isLoading}
					className="bg-emerald-600 hover:bg-emerald-700 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed">
					{IsPlaying ? (
						<FontAwesomeIcon icon={faPause} />
					) : (
						<FontAwesomeIcon icon={faPlay} />
					)}
				</button>
				<button
					onClick={nextTrack}
					disabled={isLoading}
					className="p-2 hover:text-neutral-400 transition disabled:opacity-50 disabled:cursor-not-allowed">
					<FontAwesomeIcon icon={faForward} />
				</button>
			</div>

			{/* Extra controls */}
			<div className="flex items-center justify-center gap-6 text-neutral-400">
				<button
					className={`hover:text-emerald-700 ${
						isShuffle && "text-emerald-600"
					} transition`}
					onClick={() => setIsShuffle(!isShuffle)}>
					<FontAwesomeIcon icon={faShuffle} />
				</button>
				<button
					className={`hover:text-emerald-700 ${
						isRepeat && "text-emerald-600"
					} transition`}
					onClick={() => setIsRepeat(!isRepeat)}>
					<FontAwesomeIcon icon={faRepeat} />
				</button>
				<div className="flex items-center gap-2">
					<span>
						{volume === 0 && <FontAwesomeIcon icon={faVolumeXmark} />}
						{volume > 0 && volume < 50 && <FontAwesomeIcon icon={faVolumeLow} />}
						{volume >= 50 && <FontAwesomeIcon icon={faVolumeHigh} />}
					</span>
					<input
						type="range"
						min="0"
						max="100"
						step="0.1"
						value={volume}
						onChange={(e) => setVolume(Number(e.target.value))}
						className="w-2/3 h-2 appearance-none rounded-full bg-neutral-700 cursor-pointer
							[&::-webkit-slider-runnable-track]:h-2 [&::-webkit-slider-runnable-track]:rounded-full
							[&::-webkit-slider-runnable-track]:bg-neutral-700
							[&::-webkit-slider-thumb]:-webkit-appearance-none [&::-webkit-slider-thumb]:appearance-none
							[&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full
							[&::-webkit-slider-thumb]:-mt-1 [&::-webkit-slider-thumb]:bg-white
							[&::-webkit-slider-thumb]:shadow [&::-webkit-slider-thumb]:shadow-emerald-800/40
							[&::-moz-range-track]:h-2 [&::-moz-range-track]:bg-neutral-700 [&::-moz-range-track]:rounded-full
							[&::-moz-range-progress]:h-2 [&::-moz-range-progress]:bg-emerald-600 [&::-moz-range-progress]:rounded-full
							[&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:rounded-full
							[&::-moz-range-thumb]:shadow [&::-moz-range-thumb]:shadow-emerald-800/40"
					/>
				</div>
			</div>
		</div>
	);
};

export default Player;
