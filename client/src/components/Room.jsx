import React, { useEffect, useState, useRef } from 'react';
import Canvas from '../components/Canvas';
import Chat from '../components/Chat';
import { useNavigate } from 'react-router-dom';
import { socket } from '../utils/socket';
import { useSelector } from 'react-redux';
import Players from './Players';
import CopyButton from '../components/CopyButton';
import { play_sound, preload_sound } from '../utils/utils';

const Room = () => {
  const username = useSelector((state) => state.user.username);
  const roomId = useSelector((state) => state.room.roomId);
  const rounds = useSelector((state) => state.room.rounds);

  const isGameOverRef = useRef(false)

  const [players, setPlayers] = useState([]);
  const [isHost, setIsHost] = useState(false);
  const [chosenWord, setChosenWord] = useState('');
  const [currRound, setCurrRound] = useState(1);
  const [isDrawer, setIsDrawer] = useState(false);
  const [isShowingNewScore, setIsShowingNewScore] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [roundStartTime, setRoundStartTime] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);
  const [maxRounds, setMaxRounds] = useState(3);
  const [showTimer, setShowTimer] = useState(false);
  const [currTime, setCurrTime] = useState(30);
  const [started, setStarted] = useState(false);
  const [messages, setMessages] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    preload_sound('/join_room.mp3');
    preload_sound('/game_over.mp3');
    if (!roomId || !username || !rounds) navigate('/lobby-join');

    socket.emit('join_room', { roomId, username, rounds });

    socket.on('players_update', (data) => {
      // console.log("isGameOver: ", isGameOverRef.current)
      if (!isGameOverRef.current) {
        play_sound('/join_room.mp3')
        setPlayers(data);
      }
      // console.log("room.jsx players update: ", data)
    });
    socket.on('max_rounds', (maxRound) => {
      setMaxRounds(maxRound);
    });
    socket.on('room_host', (data) => {
      setIsHost(data.id === socket.id);
      // console.log(data.id, " ", socket.id)
    });
    socket.on('new_round', (round) => {
      setIsShowingNewScore(false);
      setCurrRound(round);
      setCurrTime(30);
      setShowTimer(false);
    });
    socket.on('update_score', (data) => {
      // setPlayers(prevPlayers =>
      //   prevPlayers.map(player => {
      //     const updated = data.find(e => e.id === player.id);
      //     return updated ? { ...player, score: updated.score } : player;
      //   })
      // );
      setPlayers(data)
      setIsShowingNewScore(true);
    });
    socket.on('room_reset', () => {
      // console.log("room reseted")
      setMessages([])
      setIsDrawer(false)
      setChosenWord('')
      setCurrRound(1)
      setRoundStartTime(0)
      setShowTimer(false)
      setCurrTime(0)
      setStarted(false)
    })
    socket.on('game_over', () => {
      setTimeout(() => {
        play_sound('/game_over.mp3')
      }, 500);
      setIsGameOver(true);
      setIsShowingNewScore(false);
      setShowTimer(false);
      // console.log("isHost: ", isHost)
    });

    return () => {
      socket.off('players_update');
      socket.off('new_round');
      socket.off('max_rounds')
      socket.off('room_host');
      socket.off('update_score');
      socket.off('room_reset');
      socket.off('game_over');
    };
  }, []);

  useEffect(() => {
    isGameOverRef.current = isGameOver
  }, [isGameOver])

  // Timer
  useEffect(() => {
    let interval = null;

    if (showTimer && currTime > 0) {
      interval = setInterval(() => {
        setCurrTime(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 30;
          } else {
            return prev - 1;
          }
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [showTimer]);

  const handlePlayAgain = () => {
    // socket.emit("init_game", { roomId })
    setIsGameOver(false)
    socket.emit('reset_room', { roomId, playerId: socket.id })
    socket.emit('join_room', { roomId, username, rounds })
  }

  return (
    <div className="min-h-screen w-full p-2 font-orbitron bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white">
      {/* Game Over Overlay */}
      {isGameOver && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 flex flex-col justify-center items-center z-50 animate-fadeIn">
          <div className="bg-[#1e1e2f] p-5 rounded-lg shadow-lg text-center max-w-md w-full mx-2 border-2 border-[#00f5d4]">
            <h2 className="text-xl font-bold mb-3 text-[#00f5d4]">Game is over</h2>
            <ul className="w-full">
              <li className="grid grid-cols-3 gap-4 font-bold text-sm md:text-lg border-b pb-1 mb-1 text-white">
                <p className="text-left underline">Players</p>
                <p className="text-center underline">Score</p>
                <p className="text-center underline">Position</p>
              </li>
              {players.map(player => (
                <li key={player.id} className="grid grid-cols-3 gap-4 items-center text-sm md:text-lg py-1">
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
          </div>
          <div className='mt-2 flex gap-2 justify-around items-center'>
            <button
              onClick={handlePlayAgain}
              className="px-4 py-2 rounded-lg border-2 bg-[#00f5d4] text-black hover:bg-[#00e5c0] border-[#00f5d4] transition duration-200">
              Play Again
            </button>
            <button
              onClick={() => {
                socket.disconnect()
                navigate('/lobby-join')
              }}
              className="px-4 py-2 rounded-lg border-2 bg-[#00f5d4] text-black hover:bg-[#00e5c0] border-[#00f5d4] transition duration-200">
              Lobby
            </button>
          </div>
        </div>
      )}

      {/* Scoreboard Overlay */}
      {isShowingNewScore && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 flex justify-center items-center z-50 animate-fadeIn">
          <div className="bg-[#1e1e2f] p-5 rounded-lg shadow-lg text-center max-w-md w-full mx-2 border-2 border-[#00f5d4]">
            <h2 className="text-xl font-bold mb-3 text-[#00f5d4]">Current Scoreboard</h2>
            <ul className="w-full">
              <li className="grid grid-cols-3 gap-4 font-bold text-sm md:text-lg border-b pb-1 mb-1 text-white">
                <p className="text-left underline">Players</p>
                <p className="text-center underline">Score</p>
                <p className="text-center underline">Position</p>
              </li>
              {players.map(player => (
                <li key={player.id} className="grid grid-cols-3 gap-4 items-center text-sm md:text-lg py-1">
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
          </div>
        </div>
      )}

      {/* Room Info */}
      <div className="flex items-center justify-center gap-2 text-2xl mb-2 text-center">
        <h1><strong>Room Id:</strong> {roomId}</h1>
        <CopyButton roomId={roomId} />
      </div>

      {/* Round Info */}
      <div className="text-xl px-2 font-bold min-h-[8vh] w-full my-5 border-2 border-[#00f5d4] rounded-lg flex justify-around items-center bg-[#0f3460] text-white">
        <h1>Round {currRound} out of {maxRounds}</h1>
        {showTimer && (
          <h1>Time Left: {currTime}s</h1>
        )}
      </div>

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row justify-center items-start gap-4 w-full">
        <div className="w-full lg:w-[50%]">
          <Canvas roomId={roomId} isDrawer={isDrawer} />
        </div>
        <div className="w-full lg:w-[50%] flex justify-around lg:justify-between items-center gap-4">
          <Players
            started={started}
            setStarted={setStarted}
            isHost={isHost}
            setIsHost={setIsHost}
            setShowTimer={setShowTimer}
            setIsCorrect={setIsCorrect}
            setRoundStartTime={setRoundStartTime}
            players={players}
            setIsDrawer={setIsDrawer}
            chosenWord={chosenWord}
            setChosenWord={setChosenWord}
          />
          <Chat
            messages={messages}
            setMessages={setMessages}
            isCorrect={isCorrect}
            setIsCorrect={setIsCorrect}
            players={players}
            roundStartTime={roundStartTime}
            isDrawer={isDrawer}
            chosenWord={chosenWord}
            roomId={roomId}
            username={username}
          />
        </div>
      </div>
    </div>
  );
};

export default Room;
