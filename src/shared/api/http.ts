import axios from "axios";

const api = axios.create({
	baseURL: "http://localhost:3000/api/",
	// headers: {
	// 	Authorization: `Bearer ${process.env.SPOTIFY_API_TOKEN}`,
	// },
});

export default api;
