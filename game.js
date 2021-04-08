'use strict';

require('dotenv').config();
const port = process.env.PORT || 3333;
const limit = process.env.MAX || 25;

const io = require('socket.io')(port);

const game = io.of('/number-game');
let roomNo = 1;

// need some system to store guesses
let roomsDB = {};

game.on('connection', socket => {

  // STEP 1: When players join they're assigned a room
  // when player join they are assigned to a room
  // we also need to assign the room number and random number for the game to storage
  if (io.nsps['/number-game'].adapter.rooms[roomNo] &&
      io.nsps['/number-game'].adapter.rooms[roomNo].length > 1) {
        roomNo++
      }

  socket.join(`${roomNo}`, handleJoinRoom(roomNo));

  // checking room number is incrementing and stating how many players in the room
  console.log(`There are ${io.nsps['/number-game'].adapter.rooms[roomNo].length} players in room ${roomNo}`)

  // STEP 2: When 2 players are in a room, the game starts
  // if a room reaches two players, a game begins
  // when a game starts, we store the random number into the roomsDB variable
  // then we emit a game start event to the player with the roomNo and welcome message
  if (io.nsps['/number-game'].adapter.rooms[roomNo].length === 2 ) {
    roomsDB[roomNo].random = Math.floor(Math.random()*limit);
    console.log(`The random no is ${roomsDB[roomNo].random}`);
    let payload = {
      room: roomNo,
      message: `Welcome to room ${roomNo} \n Let the Game Begin!`
    }
    game.to(roomNo).emit('new-game', payload);
  }

  // STEP 5: Handle guess received from player
  socket.on('guess', handleGuess);

})

function handleJoinRoom(roomNo) {
  if (Object.keys(roomsDB).includes(roomNo) === false) {
    roomsDB[roomNo] = {};
  }
}

// STEP 5 HANDLER
function handleGuess(payload) {
  // name, number
  // save this into the room database area
  console.log(payload);
  let room = payload.room;
  if (!roomsDB[room].guess) {
    roomsDB[room].guess = [];
    roomsDB[room].guess.push(payload.answers);
  } else {
    roomsDB[room].guess.push(payload.answers);
    handleWinner(room, roomsDB[room].guess);
  }
}

function handleWinner(room, answers) {
  let number = roomsDB[room].random;
  let player1 = answers[0];
  let player2 = answers[1];
  let winner = Math.abs(player1.number - number) > Math.abs(player2.number - number) ? player2.name : player1.name;
  console.log(`The winner is ${winner}`);
  let payload = { message: `The number was ${number} \n The winner is ${winner}` };
  // STEP 6: Emit winner event back to the players in the room
  game.to(room).emit('winner', payload);
}
