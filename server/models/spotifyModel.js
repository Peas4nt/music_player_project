import SpotifyWebApi from "spotify-web-api-node";
import dotenv from 'dotenv';
dotenv.config();

const spotifyApi = new SpotifyWebApi({
	clientId: process.env.SPOTIFY_CLIENT_ID,
	clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

export default class SpotifyModel {
	constructor(spotifyApi) {
		this.spotifyApi = spotifyApi;
	}

	static async authenticate() {
		try {
			const data = await spotifyApi.clientCredentialsGrant();
			spotifyApi.setAccessToken(data.body["access_token"]);
			return new SpotifyModel(spotifyApi);
		} catch (error) {
			console.error("Authentication failed:", error);
			throw new Error("Spotify authentication failed");
		}
	}

	async getInfo(url) {
		let tracks = [];

		if (url.includes("spotify.com")) {
			if (url.includes("spotify.com/track/")) {
				const trackId = url.split("/track/")[1].split("?")[0];
				tracks = await this.getTrack(trackId);
			} else if (url.includes("spotify.com/playlist/")) {
				const playlistId = url.split("/playlist/")[1].split("?")[0];
				tracks = await this.getAllPlaylistTracks(playlistId);
			}
			
			return tracks.reverse().map((row) => {
				const track = row;

				return {
					id: track.id,
					href: track.external_urls?.spotify,
					title: track.name,
					artist: track.artists.map((a) => a.name).join(", "),
					img_url: track.album.images[0].url,
				};
			});
		} else return new Error("Url not supported");
	}

	async getAllPlaylistTracks(playlistId) {
		try {
			// 1. Узнаём общее количество треков
			const playlist = await this.spotifyApi.getPlaylist(playlistId);
			const total = playlist.body.tracks.total;

			let allTracks = [];
			let offset = 0;
			const limit = 100;

			// 2. Делаем циклом, пока не соберём все
			while (offset < total) {
				const response = await this.spotifyApi.getPlaylistTracks(playlistId, {
					offset,
					limit,
				});

				// allTracks = [...allTracks, response.body.items]
				response.body.items.forEach((item) => {
					allTracks.push(item.track);
				});

				offset += limit;
			}

			return allTracks;
		} catch (err) {
			console.error("Error fetching playlist tracks:", err);
			return [];
		}
	}

	async getTrack(key) {
		const trackData = await spotifyApi.getTrack(key);
		const track = trackData.body;
		// console.log(track);

		return [track];
	}
}
