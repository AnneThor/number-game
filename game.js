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

  // when player join they are assigned to a room
  // we also need to assign the room number and random number for the game to storage
  if (io.nsps['/number-game'].adapter.rooms[roomNo] &&
      io.nsps['/number-game'].adapter.rooms[roomNo].length > 1) {
        roomNo++
      }
  socket.join(`${roomNo}`, handleJoinRoom(roomNo));

  // checking room number is incrementing and stating how many players in the room
  console.log(`There are ${io.nsps['/number-game'].adapter.rooms[roomNo].length} players in room ${roomNo}`)

  // if a room reaches two players, a game begins
  // when a game starts, we store the random number into the roomsDB variable
  // then we emit a game start event to the player with the roomNo and welcome message
  if (io.nsps['/number-game'].adapter.rooms[roomNo].length === 2 ) {
    roomsDB[roomNo].random = Math.floor(Math.random()*limit);
    console.log(`The random no is ${roomsDB[roomNo].random}`);
    let payload = {
      room: roomNo,
      message: `Welcome to room ${roomNo} \n NEW GAME! \n Guess the Number`
    }
    game.to(roomNo).emit('new-game', payload);
  }

  socket.on('guess', handleGuess);


})

function handleJoinRoom(roomNo) {
  if (Object.keys(roomsDB).includes(roomNo) === false) {
    roomsDB[roomNo] = {};
  }
}

function handleGuess(payload) {
    // guess: number, room: currRoom, name: name
    // save this into the room database area
    if (!roomsDB[payload.room].guess) {
      roomsDB[payload.room].guess = payload;
    }
}
