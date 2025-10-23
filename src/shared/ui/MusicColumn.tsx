type Props = {
	image: string;
	title: string;
	artist: string;
	musicUrl?: string;
	artistUrl?: string;
	className?: string;
	onClick?: () => void;
	isActive?: boolean;
};

const MusicColumn = ({ image, title, artist, musicUrl, artistUrl, className, onClick, isActive }: Props) => {
	return (
		<td className={`flex items-center justify gap-4 ${className}`} onClick={onClick}>
			<img src={image} alt={title} className="w-12 h-12 rounded-lg shadow-md" loading="lazy" />
      <div>
        
				{musicUrl ? (
					<a href={musicUrl} className="text-sm text-gray-400 hover:underline">
						{title}
					</a>
				) : (
						<p className={`font-semibold ${isActive && "text-emerald-600"}`}>{title}</p>
        )}
        
				{artistUrl ? (
					<a href={artistUrl} className="text-sm text-gray-400 hover:underline">
						{artist}
					</a>
				) : (
					<p className="text-sm text-gray-400">{artist}</p>
				)}
			</div>
		</td>
	);
};

export default MusicColumn;
