'use strict'

const io = require('socket.io-client');
const inquirer = require('inquirer');

const host = `http://localhost:3000/number-game`;
const socket = io.connect(host);

let currRoom = null;

// STEP 3: LISTEN FOR NEW GAME EVENT
socket.on('new-game', startGame);

// STEP 7 LISTEN FOR THE WINNER EVENT!
socket.on('winner', handleWinner);

// STEP 3 HANDLER
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
    // STEP 4 SEND BACK TO THE GAME
    socket.emit('guess', { answers: answers, room: currRoom });
  });
}

// STEP 7 HANDLER
function handleWinner(payload) {
  console.log(payload.message);
}

// function getNumber() {
//   readline.question('Guess a number!', number => {
//   socket.emit('guess', { name: playerName, number: number, room: currRoom })
//   })
//   readline.close();
// }
