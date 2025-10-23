import util from "node:util";
import child_process from "node:child_process";
import ytSearch from "yt-search";
import path from "path";
import { sql } from "../config/db.js";

const exec = util.promisify(child_process.exec);

const destPath = path.join(path.resolve(), "./public/uploads");

export default class TrackModel {
	async create(track, filename) {
		await sql`INSERT INTO tracks (title, artist, filename, spotify_track_id, img_url) VALUES (${
			track.title
		}, ${track.artist}, ${filename}, ${track.id}, ${
			track.img_url
		})`;
		console.log("track created: ", track.title);
	}

	async find(id) {
		return await sql`SELECT * FROM tracks WHERE spotify_track_id = ${id}`;
	}

	async downloadTrack(track) {
		const searchQuery = `${track.title} ${track.artist}`;
		const result = await ytSearch(searchQuery);

		if (!result.videos.length) throw new Error("Video not found");

		const videoUrl = result.videos[0].url;

		const file = `${track.title} - ${track.artist}.mp3`;

		const outputFilePath = `${destPath}/${file}`;

		const command = `yt-dlp -f bestaudio --extract-audio --audio-format mp3 --output "${outputFilePath}" "${videoUrl}"`;

		const { error, stderr } = await exec(command);
		if (error) throw new Error("Error downloading video");

		if (stderr) console.warn(stderr);

		return file;
	}

	async getAllTracks() {
		const tracks = await sql`select * from tracks order by id desc`;

		return tracks
	}
}
