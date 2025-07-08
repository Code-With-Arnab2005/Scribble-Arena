import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Lobby from './components/Lobby';
import Room from './components/Room';
import Home from './components/Home';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/lobby-create" element={<Lobby type={"create"} />} />
      <Route path="/lobby-join" element={<Lobby type={"join"} />} />
      <Route path="/room/:roomId" element={<Room />} />
    </Routes>
  )
}

export default App
