import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Валидация
const schema = z.object({
	url: z
		.string()
		.min(1, "Link is required")
		.refine(
			(val) => val.includes("spotify.com/track/") || val.includes("spotify.com/playlist/"),
			{
				message: "Must be a valid Spotify track or playlist link",
			},
		),
});

type Props = {
	onSubmit: (data: { url: string }) => void ;
};

const MusicForm = ({ onSubmit }: Props) => {
	const {
		register,
    handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(schema),
	});

  const onSubmitForm = (data: { url: string }) => {
    onSubmit(data);
  };

	return (
		<form onSubmit={handleSubmit(onSubmitForm)} className="w-full max-w-xl flex flex-col gap-2">
			<div className="flex">
				<input
					type="text"
					placeholder="Paste Spotify playlist or track link..."
					{...register("url")}
					className={`flex-1 p-3 rounded-l-xl bg-neutral-900 border ${
						errors.url ? "border-red-600" : "border-neutral-800"
					} text-white placeholder-gray-500 focus:outline-none focus:ring-2 ${
						errors.url ? "focus:ring-red-600" : "focus:ring-emerald-700"
					}`}
				/>
				<button
					type="submit"
					className="px-5 bg-emerald-800 hover:bg-emerald-700 border border-neutral-800 border-l-0 rounded-r-xl text-white font-medium transition">
					Submit
				</button>
			</div>
			{errors.url && <p className="text-red-500 text-sm">{errors.url.message}</p>}
		</form>
	);
};

export default MusicForm;
