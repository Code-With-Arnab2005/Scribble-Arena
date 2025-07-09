import express from 'express';
import http from "http";
import { Server } from 'socket.io';


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
    }
})

let isRoomReseted = {};//key-roomId, value-boolean if the room reseted
let choosenWordArray = {};//key-roomId, value-boolean for each character

let rooms = {} //tracks all the details of a room
//rooms[roomId] = { players: [{id, name, score, pos}, {id, name, score, pos}], drawer: player[i], host: player[0], round: 0, maxRounds: n, correGuesses: 0 }

let roundTimers = {}//trancs if all the users guessed correctly then starts the new round immediately

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

//when game over
// const handleGameOver = (roomId) => {
//     const room = rooms[roomId];
//     const players = room.players;
//     const winners = {}
//     for (const [player, index] of room.players) {
//         if (index >= 3) break;
//         winners.push(player)
//     }
//     io.to(roomId).emit('top_three_winners', { winners })
// }

//function to handle each rounds of the game
const handleNextRound = (roomId) => {
    const room = rooms[roomId];

    //emit the round number
    io.to(roomId).emit('new_round', room.round)

    let drawer = room.players[Math.floor(Math.random() * room.players.length)];
    for (let i = 0; i < 5; i++) {
        if (drawer && room.drawer && drawer.id === room.drawer.id) drawer = room.players[Math.floor(Math.random() * room.players.length)];
        else break;
    }
    room.drawer = drawer;
    // console.log("new round drawer: ", drawer)
    io.to(roomId).emit('drawer_selected', drawer)//drawer = {id, name, score}
}

io.on('connection', (socket) => {
    // console.log(`New Player connected: ${socket.id}`)

    //when a user joins the room
    socket.on('join_room', ({ roomId, username, rounds }) => {
        socket.join(roomId);
        // console.log("join_room maxRound: ", rounds)
        if (!rooms[roomId]) rooms[roomId] = { players: [], drawer: null, host: null, round: 1, maxRound: rounds, correctGuesses: 0 }
        if (rooms[roomId].players.find(p => p.id === socket.id)) return;
        rooms[roomId].players.push({ id: socket.id, name: username, score: 0, pos: rooms[roomId].players.length + 1 })
        io.to(roomId).emit('players_update', rooms[roomId].players)
        io.to(roomId).emit('max_rounds', rooms[roomId].maxRound)
        if (!rooms[roomId].host && rooms[roomId].players.length === 1) {
            rooms[roomId].host = rooms[roomId].players[0];
        }
        if (rooms[roomId].host) io.to(roomId).emit('room_host', rooms[roomId].host)
        // console.log('join room server: ', rooms[roomId].players)
        // console.log("players: ", rooms[roomId].players)
    })

    //when a game starts
    socket.on('init_game', ({ roomId }) => {
        const room = rooms[roomId];
        isRoomReseted[roomId] = false;

        if (room.players.length <= 1) {
            return
        }

        // console.log("init_game: ", roomId)
        io.to(roomId).emit('game_started')

        room.round = 1
        if (!room.maxRound) room.maxRound = 3;

        handleNextRound(roomId)

    })

    //when the drawer selected a word
    socket.on('word_selected', ({ roomId, word }) => {
        io.to(roomId).emit('word_chosen', word);

        choosenWordArray[roomId] = Array(word.length).fill(false)

        //after 15sec reveal first word and emit this to all players
        const timer1 = setTimeout(() => {
            if(choosenWordArray[roomId].length > 1) choosenWordArray[roomId][1] = true;
            else choosenWordArray[roomId][0] = true;
            io.to(roomId).emit('hashArray_update', choosenWordArray[roomId]);
        }, 20000);

        //after 30sec reveal second character and emit this to all players
        const timer2 = setTimeout(() => {
            if(choosenWordArray[roomId].length > 2) {
                if(word[2]!=' ') choosenWordArray[roomId][2] = true;
                else choosenWordArray[roomId][0] = true;
                io.to(roomId).emit('hashArray_update', choosenWordArray[roomId]);
            }
        }, 40000);

        //if word length is greater than 8 then after 45sec reveal third character and emit
        const timer3 = setTimeout(() => {
            if(choosenWordArray[roomId].length > 8){
                if(word[word.length-2]!=' ') choosenWordArray[roomId][word.length-2] = true;
                else choosenWordArray[roomId][word.length-1]=true;
                io.to(roomId).emit('hashArray_update', choosenWordArray[roomId]);
            }
        }, 57000);

        //each round will go for 80sec, then next round will be started
        const timer4 = setTimeout(async () => {
            const room = rooms[roomId]
            if (!room) return;

            //reset the HashArray and emit
            choosenWordArray[roomId]=[]
            io.to(roomId).emit('hashArray_update', choosenWordArray[roomId]);

            rooms[roomId].round++;

            if (room.round > room.maxRound) {
                // handleGameOver(roomId)
                io.to(roomId).emit('game_over');
                return;
            }

            if (room.players.length <= 1) {
                io.to(roomId).emit('game_over');
                return;
            }

            room.correctGuesses = 0;
            //emit the score after each round
            io.to(roomId).emit('update_score', room.players)
            await sleep(7000)
            handleNextRound(roomId)
        }, 80000);

        if(!roundTimers[roomId]) roundTimers[roomId]=[]
        roundTimers[roomId].push(timer1, timer2, timer3, timer4);
    })

    //when score of a player is updated
    socket.on('update_player_score', ({ roomId, playerId, score }) => {
        const room = rooms[roomId];
        for (const player of room.players) {
            if (room.drawer.id === player.id) {
                player.score += 100;
            } else if (player.id === playerId) {
                player.score += score;
            }
        }
        room.players.sort((a, b) => b.score - a.score)
        room.players.forEach((player, index) => {
            player.pos = index + 1;
        });
        // console.log("updated_player_score: ", room.players)
        //emit the updated players
        io.to(roomId).emit('players_update', room.players)
    })

    //update the number of correct guesses. and if all the players guessed correctly then immediately start new round
    socket.on('update_correct_guesses', async ({ roomId }) => {
        const room = rooms[roomId]
        if (!roomId) return;
        room.correctGuesses += 1;
        if (room.correctGuesses >= room.players.length - 1) {
            if (roundTimers[roomId]) {
                roundTimers[roomId].forEach(clearTimeout);
                delete roundTimers[roomId];
            }

            //reset the HashArray and emit
            choosenWordArray[roomId]=[]
            io.to(roomId).emit('hashArray_update', choosenWordArray[roomId]);

            rooms[roomId].round++;

            if (room.round > room.maxRound) {
                // handleGameOver(roomId)
                io.to(roomId).emit('game_over');
                return;
            }

            if (room.players.length <= 1) {
                io.to(roomId).emit('game_over');
                return;
            }

            room.correctGuesses = 0;
            //emit the score after each round
            io.to(roomId).emit('update_score', room.players)
            await sleep(7000)
            handleNextRound(roomId)
        }
    })

    //when a new round starts in a game
    socket.on('start_game', (roomId) => {



    })

    //emit the changes in drawing canvas
    socket.on('draw', ({ roomId, data }) => {
        io.to(roomId).emit('draw_data', data);
    });

    //for chat-messages in a room
    socket.on('chat_message', ({ roomId, username, playerId, message }) => {
        // console.log("rooms: ", rooms)
        // console.log("message: ", roomId, message)
        io.to(roomId).emit('chat_update', { message, username, playerId })
    })

    //for play again
    socket.on('reset_room', ({ roomId, playerId }) => {
        const room = rooms[roomId];
        if (!room) return;

        // room.players.forEach((player, index) => {
        //     player.score = 0;
        //     player.pos = index + 1;
        // });
        if (!isRoomReseted[roomId]) {
            room.players = [];
            isRoomReseted[roomId] = true;
            room.drawer = null
            room.round = 1
            room.correctGuesses = 0
            // console.log("play_again players: ", room.players)
            io.to(roomId).emit('room_reset')
            io.to(roomId).emit('players_update', room.players)
        }
    })

    //when a user disconnected from a room
    socket.on('disconnect', () => {
        // console.log(`A player disconnected: ${socket.id}`)
        for (const roomId in rooms) {
            let before = rooms[roomId].players.length;
            rooms[roomId].players = rooms[roomId].players.filter((player) => player.id !== socket.id);
            if (rooms[roomId].players.length < before) io.to(roomId).emit('players_update', rooms[roomId].players);

            //reassiging host if the prev host leaves
            if (rooms[roomId].host?.id === socket.id && rooms[roomId].players.length > 0) {
                rooms[roomId].host = rooms[roomId].players[0];
                io.to(roomId).emit('room_host', rooms[roomId].host)
                // console.log("disconnect server: ", rooms[roomId].players)
            }

            if (rooms[roomId].players.length === 0) {
                delete rooms[roomId];
                delete choosenWordArray[roomId];
                delete isRoomReseted[roomId];
                // console.log("room deleted")
                if (roundTimers[roomId]) {
                    roundTimers[roomId].forEach(clearTimeout)
                    delete roundTimers[roomId];
                }
            }

        }
    })

})

app.get("/", (req, res) => {
    res.send("Welcome to the Scribble dimension")
})

const PORT = process.env.PORT || 3000

server.listen(PORT, () => {
    console.log("Server is listening on PORT: ", PORT)
})