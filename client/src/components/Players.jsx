import React, { useEffect, useState, useRef } from 'react';
import { socket } from '../utils/socket';
import { useSelector } from 'react-redux';
import { play_sound, preload_sound } from '../utils/utils';
import randomPictionary from 'word-pictionary-list';

const Players = ({ started, setStarted, isHost, setShowTimer, setIsCorrect, setRoundStartTime, players, setIsDrawer, chosenWord = '', setChosenWord }) => {
  const username = useSelector((state) => state.user.username);
  const roomId = useSelector((state) => state.room.roomId);

  const timeoutRef = useRef(null);
  const seletedWordRef = useRef('');
  const choosenWordRef = useRef('');

  
  
  const [showWords, setShowWords] = useState(false);
  const [selectedWord, setSelectedWord] = useState('');
  const [isWordChosing, setIsWordChosing] = useState(false);
  const [wordOptions, setWordOptions] = useState([]);

  useEffect(() => {
    preload_sound('/start_game.wav');

    
    socket.on('game_started', () => {
      setStarted(true);
    });
    socket.on('drawer_selected', (data) => {
      setIsWordChosing(true);
      const words = randomPictionary(4).map(word =>word.toLowerCase())
      setWordOptions(words)
      // console.log(generate(4))
      if (socket.id === data.id) {
        setIsDrawer(true);
        setShowWords(true);
        timeoutRef.current = setTimeout(() => {
          setShowWords(false);
          setSelectedWord(wordOptions[0]);
          seletedWordRef.current = wordOptions[0];
          socket.emit('word_selected', { roomId, word: seletedWordRef.current });
        }, 10000);
      } else {
        setIsDrawer(false);
      }
    });
    socket.on('word_chosen', (word) => {
      setIsCorrect(false);
      setRoundStartTime(Date.now());
      setIsWordChosing(false);
      setChosenWord(word);
      setShowTimer(true);
    });

    return () => {
      socket.off('game_started');
      socket.off('drawer_selected');
      socket.off('word_chosen');
    };
  }, []);

  const handleWordSelection = (word) => {
    setSelectedWord(word);
    seletedWordRef.current = word;
    setShowWords(false);
    clearTimeout(timeoutRef.current);
    socket.emit('word_selected', { roomId, word });
  };

  const handleStartGame = () => {
    if (isHost) {
      play_sound('/start_game.wav')
      socket.emit('init_game', { roomId });
    }
  };

  return (
    <div className="p-3 min-h-[30vh] lg:min-h-[60vh] w-[40vw] lg:w-[25vw] border-2 border-[#00f5d4] bg-[#0f3460] text-white rounded-lg font-orbitron">
      {showWords && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 flex justify-center items-center z-50 animate-fadeIn">
          <div className="bg-[#1e1e2f] p-5 rounded-lg shadow-lg text-center border-2 border-[#00f5d4] max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-3 text-[#00f5d4]">Choose a word to draw</h2>
            <ul className="space-y-3 text-white">
              {wordOptions.map((word, idx) => (
                <li
                  key={idx}
                  onClick={() => handleWordSelection(word)}
                  className="cursor-pointer hover:text-[#00f5d4] text-lg transition duration-200"
                >
                  {word}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {(!showWords && isWordChosing) && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 flex justify-center items-center z-50 animate-fadeIn">
          <div className="bg-[#1e1e2f] p-5 rounded-lg shadow-lg text-center border-2 border-[#00f5d4] max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-3 text-[#00f5d4]">Word is being chosen...</h2>
          </div>
        </div>
      )}

      <ul className="w-full">
        <li className="grid grid-cols-3 gap-4 font-bold text-[10px] md:text-lg border-b pb-1 mb-1 text-[#00f5d4]">
          <p className="text-left underline">Players</p>
          <p className="text-center underline">Score</p>
          <p className="text-center underline">Position</p>
        </li>

        {players.length > 0 && players.map((player) => (
          <li key={player.id} className="grid grid-cols-3 gap-4 items-center text-[10px] md:text-lg py-1">
            <div className="flex items-center gap-2">
              <p>{player.name}</p>
              {socket.id === player.id && (
                <span className="px-2 pb-[1px] bg-[#ffb703] text-black rounded-lg text-[8px] md:text-[12px]">
                  <strong>You</strong>
                </span>
              )}
            </div>
            <p className="text-center">{player.score}</p>
            <p className="text-center">{player.pos}</p>
          </li>
        ))}
      </ul>

      <div className="text-center mt-3">
        <button
          disabled={!isHost}
          onClick={handleStartGame}
          className={`font-bold text-[12px] lg:text-lg bg-[#00f5d4] text-black px-2 md:px-10 py-1 md:py-3 rounded-lg transition duration-200 ${
            !isHost ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#00cfc8]'
          } ${started && 'hidden'}`}
        >
          {isHost ? 'Start Game' : 'Game not started'}
        </button>
      </div>
    </div>
  );
};

export default Players;
