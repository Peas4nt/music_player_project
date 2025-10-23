import { useState } from "react";
import MusicForm from "./MusicForm";
import MusicTable from "./MusicTable";


const DownloadWidget = () => {
	const [link, setLink] = useState<string>("");

	const onSubmit = (data: { url: string }) => { 
		setLink(data.url);
	};
	return (
		<>
			<h1 className="text-3xl font-bold mb-6">Spotify Downloader</h1>

			{/* Input for playlist link */}
			<MusicForm onSubmit={onSubmit} />

			{/* Tracks table */}
			<MusicTable link={link} />
			
		</>
	);
};

export default DownloadWidget;
