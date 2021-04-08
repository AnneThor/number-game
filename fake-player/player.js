'use strict'

const io = require('socket.io-client');

const host = `http://localhost:3000/number-game`;
const socket = io.connect(host);

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

let currRoom = null;

socket.emit('hello', () => {
  console.log("Hello I am connected");
})

socket.on('new-game', startGame);

function startGame(payload) {
  currRoom = payload.room;
  console.log(payload.message);
  let number, name;
  readline.question('What is your name? ', name => {
    name = name;
  })
  readline.question(payload.message + ': ', number => {
    // we should just add the validation checking here
    socket.emit('guess', { guess: number, room: currRoom, name: name });
    readline.close();
  })



}
