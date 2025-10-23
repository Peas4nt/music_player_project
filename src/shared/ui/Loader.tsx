const Loader = ({ className }: { className?: string }) => {
	return (
		<div className={`flex items-center justify-center ${className}`}>
			<div className="w-6 h-6 bg-white rounded-full animate-ping"></div>
		</div>
	);
};

export default Loader;
