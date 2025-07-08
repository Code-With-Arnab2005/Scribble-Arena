import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUsername } from '../slice/userSlice';
import { setRoomId } from '../slice/roomSlice';
import { setRounds } from '../slice/roomSlice';
import { useState, useEffect } from 'react';
import { roomId_generator } from '../utils/utils';
import CopyButton from './CopyButton';

const Lobby = ({ type = "join" }) => {
  const [username, setusername] = useState('');
  const [selectedNumber, setSelectedNumber] = useState(1);
  const [roomId, setroomId] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const joinRoom = () => {
    if (username.length === 0 || roomId.length === 0) {
      setError("Please provide username");
      return;
    }

    dispatch(setUsername(username));
    dispatch(setRoomId(roomId));
    dispatch(setRounds(selectedNumber));

    // console.log("lobby: ", username, " ", roomId)

    setTimeout(() => {
      navigate(`/room/${roomId}`);
    }, 50);
  };

  useEffect(() => {
    let roomid = '';
    if (type === 'create') roomid = roomId_generator();
    if (roomid && roomid.length > 0) setroomId(roomid);
  }, [navigate]);

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#0f3460] text-white font-orbitron px-4">
      <div className="my-5 flex flex-col md:flex-row gap-4">
        <button
          disabled={type === 'create'}
          onClick={() => {
            setroomId('');
            navigate('/lobby-create');
          }}
          className={`px-4 py-2 rounded-lg border-2 ${
            type === 'create' ? 'bg-gray-700 border-gray-500 text-gray-300 cursor-not-allowed' : 'bg-[#00f5d4] text-black hover:bg-[#00e5c0] border-[#00f5d4]'
          } transition duration-200`}
        >
          Create a Room
        </button>
        <button
          disabled={type === 'join'}
          onClick={() => {
            setroomId('');
            navigate('/lobby-join');
          }}
          className={`px-4 py-2 rounded-lg border-2 ${
            type === 'join' ? 'bg-gray-700 border-gray-500 text-gray-300 cursor-not-allowed' : 'bg-[#00f5d4] text-black hover:bg-[#00e5c0] border-[#00f5d4]'
          } transition duration-200`}
        >
          Join a Room
        </button>
      </div>

      <div className="px-10 py-10 border-4 border-[#00f5d4] rounded-lg bg-[#1e1e2f] flex flex-col justify-center items-start gap-4 shadow-2xl w-[90vw] max-w-md">
        <div className="w-full">
          <label htmlFor="username" className="block text-sm md:text-lg font-semibold mb-1">
            Username:
          </label>
          <input
            className="w-full border-2 border-[#00f5d4] bg-[#0f3460] text-white rounded-lg pl-2 py-2 placeholder-gray-400 focus:outline-none"
            id="username"
            placeholder="Enter your name"
            required
            value={username}
            onChange={(e) => setusername(e.target.value)}
          />
        </div>

        {type === 'create' && (
          <div className="w-full">
            <label htmlFor="rounds" className="block text-sm md:text-lg font-semibold mb-1">
              No. of Rounds:
            </label>
            <select
              id="rounds"
              value={selectedNumber}
              onChange={(e) => setSelectedNumber(e.target.value)}
              className="w-full border-2 border-[#00f5d4] bg-[#0f3460] text-white rounded-lg px-2 py-2 text-lg focus:outline-none"
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="w-full">
          <label htmlFor="roomid" className="block text-sm md:text-lg font-semibold mb-1">
            Room ID:
          </label>
          <div className='flex gap-4'>
            <input
              disabled={type === 'create'}
              className={`w-full ${type === 'create' ? 'bg-gray-500 cursor-not-allowed' : 'bg-[#0f3460]'} border-2 border-[#00f5d4] text-white rounded-lg pl-2 py-2 placeholder-gray-400 focus:outline-none`}
              id="roomid"
              placeholder="Enter room ID"
              required
              value={roomId}
              onChange={(e) => setroomId(e.target.value)}
            />
            {type==='create' && <CopyButton roomId={roomId} />}
          </div>
        </div>

        <div className="w-full flex items-center justify-center">
          <button
            onClick={joinRoom}
            className="w-full px-8 py-2 mt-2 rounded-lg bg-[#00f5d4] text-black border-2 border-[#00f5d4] hover:bg-[#00e5c0] font-bold transition duration-200 text-lg"
          >
            {type === 'create' ? 'Create' : 'Join'}
          </button>
        </div>

        {error.length > 0 && (
          <p className="text-red-500 text-sm font-semibold">{error}</p>
        )}
      </div>
    </div>
  );
};

export default Lobby;
