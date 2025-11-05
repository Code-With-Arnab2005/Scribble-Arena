Live Link: https://scribble-arena-frontend.onrender.com
<!-- Banner Image -->
<p align="center">
  <img src="https://via.placeholder.com/1000x300?text=Scribble+Dimension+🎨" alt="Scribble Dimension Banner"/>
</p>

<h1 align="center">🎨 Scribble Dimension</h1>
<p align="center">
  <b>A real-time multiplayer drawing & guessing game built with React, Node.js, and Socket.io.</b><br/>
  <sub>Play. Draw. Guess. Compete. Have fun! 🚀</sub>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.0-blue?logo=react" />
  <img src="https://img.shields.io/badge/Node.js-Express-green?logo=node.js" />
  <img src="https://img.shields.io/badge/Socket.io-Realtime-black?logo=socket.io" />
  <img src="https://img.shields.io/github/license/<your-username>/scribble-dimension?color=brightgreen" />
  <img src="https://img.shields.io/github/stars/<your-username>/scribble-dimension?style=social" />
</p>

---

## ✨ Overview

**Scribble Dimension** lets multiple players join a shared game room where one draws while others guess the word — similar to *Skribbl.io*, but with your own creative twist, smoother real-time updates, and a modern interface built using **React + Socket.io**.

---

## 🚀 Features

- 🧑‍🤝‍🧑 **Multiplayer Rooms** – Create or join private rooms  
- 🖌️ **Real-time Drawing Board** – Shared canvas synced via WebSockets  
- 💬 **Instant Chat System** – Guess the word or chat live  
- 🏆 **Smart Scoring System** – Rewards accuracy and speed  
- ⏱️ **Round-based Gameplay** – Countdown timers for each turn  
- 📱 **Responsive UI** – Works seamlessly on all devices  
- ⚡ **Optimized for Performance** – Efficient socket event handling  

---

## 🛠️ Tech Stack

| Category | Technology |
|-----------|-------------|
| **Frontend** | React (Vite), Tailwind CSS, Framer Motion, Socket.io-client |
| **Backend** | Node.js, Express.js, Socket.io |
| **Database (optional)** | MongoDB |
| **Tools** | Git, npm, VSCode |

---

## ⚙️ Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/scribble-dimension.git
cd scribble-dimension
```
### 2. Install dependencies
Client
```bash
cd client
npm install
```
Server
```bash
cd ../server
npm install
```
### 3. Run the project
Backend
```bash
cd server
npm run dev
```
Frontend
```bash
cd ../client
npm run dev
```
Now visit 👉 http://localhost:5173

### 🧩 How It Works
Create or join a room with your name.
One player becomes the drawer each round.
The drawer receives a secret word and sketches it.
Others guess via chat — correct guesses earn points.
After time runs out, the next round begins.
Highest scorer wins 🏅!

### 📸 Screenshots
<p align="center"> <img src="https://via.placeholder.com/400x220?text=Lobby" alt="Lobby Screenshot" /> <img src="https://via.placeholder.com/400x220?text=Drawing+Board" alt="Drawing Board Screenshot" /> <img src="https://via.placeholder.com/400x220?text=Leaderboard" alt="Leaderboard Screenshot" /> </p>

### 🧠 Key Learnings
Built real-time systems using Socket.io rooms
Implemented a collaborative Canvas with synchronized events
Managed state efficiently in React for multi-user interactivity
Designed scalable server-side events for gameplay
Practiced clean component structure & optimized rendering

### 💡 Future Enhancements
🔐 User authentication (Clerk / Google OAuth)
🏅 Persistent leaderboard via MongoDB
🎨 Custom brush colors and stroke widths
🤖 AI-powered word suggestions
📊 Game statistics dashboard

### License
This project is licensed under the MIT License – see LICENSE for details.

### 👨‍💻 Author
Arnab Bhattacharya
3rd Year B.Tech CSE | MERN & AI Developer
🌐 [LinkedIn Profile]([https://www.linkedin.com/in/arnab-bhattacharya](https://www.linkedin.com/in/arnab-bhattacharya-42216a320/)) • 💻 [LinkedIn Profile]([https://www.linkedin.com/in/arnab-bhattacharya](https://github.com/Code-With-Arnab2005))

<p align="center"> ⭐ If you like this project, consider giving it a star! ⭐ </p>
