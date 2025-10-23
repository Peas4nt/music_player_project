import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";

const pages = [
	{ title: "Home", path: "/" },
	{ title: "Player", path: "/player" }
];

const Navbar = () => {
	const location = useLocation();

	const activeIndex = useMemo(
		() => pages.findIndex((page) => page.path === location.pathname),
		[location.pathname],
	);

	return (
		<div className="relative flex w-full max-w-xl bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800">
			{pages.map((page, index) => (
				<Link
					key={page.title}
					to={page.path}
					className={`flex-1 py-2 text-sm font-medium transition-colors flex flex-col items-center ${
						activeIndex === index ? "text-white" : "text-gray-400 hover:text-gray-200"
					}`}>
					{page.title}
				</Link>
			))}

			{/* Animated border underline */}
			<span
				className="absolute h-full bg-transparent border border-white rounded-xl transition-all duration-300"
				style={{
					width: `${100 / pages.length}%`,
					left: `${(100 / pages.length) * activeIndex}%`,
				}}
			/>
		</div>
	);
};

export default Navbar;
