import { Link } from 'react-router-dom';
import Navbar from "../components/Navbar";

function HomePage() {
  return (
    <div>
        <Navbar />
        <div className="flex mx-10 justify-between items-center gap-20">
            <img src="/images/homepage-image.jpg" alt="Mawar" className="h-150 w-100"/>
            <div className="flex flex-col gap-10">
                <div className="flex gap-2 bg-pink-100 rounded-xl px-4 py-2 w-fit items-center text-pink-400">
                    <span>🌸</span>
                    <p className="font-bold text-sm">Your Favorite Flower Studio</p>
                </div>
                <h1 className="text-5xl font-extrabold text-pink-500">The Ultimate Flower Shopping Destination</h1>
                <Link to="/login" className="w-fit bg-pink-500 p-2 text-lg font-semibold hover:font-bold text-white rounded-lg px-4">Shop Now</Link>
            </div>
        </div>
    </div>
  );
}

export default HomePage;