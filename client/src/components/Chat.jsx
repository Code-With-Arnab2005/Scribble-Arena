import React, { useEffect, useState } from 'react';
import { socket } from '../utils/socket';
import { useSelector } from 'react-redux';
import { play_sound, preload_sound } from '../utils/utils';

const Chat = ({ messages, setMessages, isCorrect, setIsCorrect, players, roundStartTime, isDrawer, chosenWord, roomId, username }) => {
  const userId = socket.id;
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (!roomId || !username) return;

    preload_sound('/correct_guess.mp3')

    socket.on('chat_update', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off('chat_update');
    };
  }, []);

  const sendMessage = () => {
    if (msg.trim().length > 0) {
      socket.emit('chat_message', { roomId, username, playerId: socket.id, message: msg });

      if (isCorrect || isDrawer) {
        setMsg('');
        return;
      }

      if (msg === chosenWord) {
        play_sound('/correct_guess.mp3')
        setIsCorrect(true);

        const maxScore = 500, roundDuration = 80000;
        const elapsedTime = Date.now() - roundStartTime;
        const timeLeft = Math.max(0, roundDuration - elapsedTime);
        const guesserScore = Math.floor((timeLeft / roundDuration) * maxScore);

        socket.emit('update_player_score', { roomId, playerId: userId, score: guesserScore });
        socket.emit('update_correct_guesses', { roomId });
      }

      setMsg('');
    }
  };

  return (
    <div className="flex flex-col justify-between min-h-[30vh] lg:min-h-[60vh] w-[40vw] lg:w-[25vw] border-2 border-[#00f5d4] bg-[#0f3460] text-white rounded-lg p-2 font-orbitron">
      <div className="flex-1 overflow-y-auto mb-2 px-1">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`mb-1 text-sm px-2 py-1 rounded-md overflow-y-scroll ${
              m.message === chosenWord ? 'bg-green-500 text-black font-bold animate-pulse' : ''
            }`}
          >
            <strong className="text-[#00f5d4]">{m.username}:</strong> {m.message}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          disabled={isDrawer}
          type="text"
          placeholder="Type..."
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          className="flex-1 border border-[#00f5d4] bg-[#1e1e2f] text-white rounded px-2 py-1 text-sm w-[80%] placeholder-gray-400 focus:outline-none"
        />
        <button
          onClick={sendMessage}
          className="hidden lg:block bg-[#00f5d4] text-black px-4 py-1 rounded hover:bg-[#00cfc8] text-sm transition duration-200"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
