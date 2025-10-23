import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppLayout from "./AppLayout";
import MusicDownloader from "./pages/MusicDownloader";
import Player from "./pages/Player";

function App() {
	const queryClient = new QueryClient();

	return (
		<>
			<QueryClientProvider client={queryClient}>
				<BrowserRouter>
					<Routes>

						<Route path="/" element={<AppLayout />}>
							<Route index element={<MusicDownloader />} />
							<Route path="/player" element={<Player />} />
						</Route>

					</Routes>
				</BrowserRouter>
			</QueryClientProvider>
		</>
	);
}

export default App;
