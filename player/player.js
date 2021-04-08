'use strict'

const io = require('socket.io-client');
const inquirer = require('inquirer');

const host = `http://localhost:3000/number-game`;
const socket = io.connect(host);

let currRoom = null;

socket.on('new-game', startGame);
socket.on('number', getNumber);

function startGame(payload) {
  currRoom = payload.room;
  console.log(payload.message);
  const questions = [
    { type: 'input',
      name: 'name',
      message: 'What is your name? '},
    { type: 'number',
      name: 'number',
      message: 'Guess a number: '}]
  inquirer.prompt(questions).then(answers => {
    socket.emit('guess', { answers: answers, room: currRoom });
  });
}

function getNumber() {
  readline.question('Guess a number!', number => {
  socket.emit('guess', { name: playerName, number: number, room: currRoom })
  })
  readline.close();
}
