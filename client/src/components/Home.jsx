import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#0f3460] text-white font-orbitron px-4">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-6xl font-extrabold text-[#00f5d4] drop-shadow-lg mb-4 animate-fadeIn">
          🎨 Scribble Arena
        </h1>
        <p className="text-md md:text-lg text-gray-300 animate-fadeIn">
          Guess the word, draw your best, and dominate the leaderboard!
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 w-full max-w-md justify-center animate-fadeIn">
        <button
          onClick={() => navigate('/lobby-create')}
          className="w-full md:w-1/2 bg-[#00f5d4] text-black font-bold px-6 py-3 rounded-lg border-2 border-[#00f5d4] hover:bg-[#00e5c0] transition duration-200"
        >
          Create Room
        </button>

        <button
          onClick={() => navigate('/lobby-join')}
          className="w-full md:w-1/2 bg-[#00f5d4] text-black font-bold px-6 py-3 rounded-lg border-2 border-[#00f5d4] hover:bg-[#00e5c0] transition duration-200"
        >
          Join Room
        </button>
      </div>
    </div>
  );
};

export default Home;
