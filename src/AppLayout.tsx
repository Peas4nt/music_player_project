import { Outlet } from "react-router-dom"
import Navbar from "./shared/ui/Navbar"

const AppLayout = () => {
  return (
    <div className="w-full min-h-screen bg-black text-white flex flex-col items-center justify-start p-6">
      <header className="w-full flex flex-col items-center"><Navbar /></header>
      <main className="w-full"><Outlet /></main>
      <footer className="w-full"></footer>
    </div> 
  )
}

export default AppLayout