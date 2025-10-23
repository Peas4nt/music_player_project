import { Router } from "express";
import SpotifyModel from "../models/spotifyModel.js";
import TrackModel from "../models/trackModel.js";

const router = Router();

router.get("/tracks", async (req, res) => {
	try {
		const trackModel = new TrackModel();

		const data = await trackModel.getAllTracks();

		return res.json(data);
		
	} catch (error) {
		console.error("Error get all tracks:", error);
		return res.status(500).json({ error });
	}
});

router.get("/playlist/:url", async (req, res) => {
	const { url } = req.params;

	try {
		const spotifyModel = await SpotifyModel.authenticate();

		let tracks = await spotifyModel.getInfo(url);

		const trackModel = new TrackModel();

		const updatedTracks = await Promise.all(
			tracks.map(async (track) => {
				const existingTrack = await trackModel.find(track.id);

				if (existingTrack.length > 0) {
					track.track_url = "/uploads/" + existingTrack[0].filename;
				}
				return track;
			}),
		);

		return res.json(updatedTracks);
	} catch (error) {
		console.error("Error authenticating Spotify:", error);
		return res.status(500).json({ error });
	}
});

// post track downloading
router.post("/track/download", async (req, res) => {
	const { trackId } = req.body;

	try {
		const spotifyModel = await SpotifyModel.authenticate();
		const trackUrl = `spotify.com/track/${trackId}`;

		const [track] = await spotifyModel.getInfo(trackUrl);

		const trackModel = new TrackModel();
		const trackFile = await trackModel.downloadTrack(track);

		await trackModel.create(track, trackFile);

		const downloadLink = "/uploads/" + trackFile;

		return res.json({ downloadLink });
	} catch (error) {
		console.error("Error downloading track:", error);
		return res.status(500).json({ error });
	}
});

export default router;
