import { useState } from "react";
import api from "../../shared/api/http";
import { useMutation } from "@tanstack/react-query";
import Loader from "../../shared/ui/Loader";

type Props = {
	id: number;
	url: string | undefined;
};

const DownloadButtons = ({ id, url }: Props) => {
	const [trackUrl, setTrackUrl] = useState<string | undefined>(url);

	const {
		mutate: uploadTrack,
		isPending,
		isError
	} = useMutation({
		mutationFn: async (id: number): Promise<{ downloadLink: string }> => {
			const response = await api.post<{ downloadLink: string }>("/track/download", {
				trackId: id,
			});
			return response.data;
		},
		onSuccess: (data: { downloadLink: string }) => {
			setTrackUrl(data.downloadLink);
		},
	});

	const onClick = () => {
		uploadTrack(id);
	};

	if (isError) return <p style={{ width: "110px", display: "block", textAlign: "center" }} className="font-medium text-red-500">Request failed</p>;

	if (isPending) return <Loader />;

	if (trackUrl)
		return (
      <a
        href={api.defaults.baseURL + '../' + trackUrl}
				download
				style={{ width: "110px", display: "block", textAlign: "center" }}
				className="py-2 bg-emerald-800 hover:bg-emerald-700 rounded-xl shadow-md font-medium transition cursor-pointer">
				Download
			</a>
		);
	else
		return (
			<button
				onClick={onClick}
				style={{ width: "110px", display: "block", textAlign: "center" }}
				className="py-2 bg-cyan-800 hover:bg-cyan-700 rounded-xl shadow-md font-medium transition cursor-pointer">
				Upload
			</button>
		);
};

export default DownloadButtons;
