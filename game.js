'use strict';

require('dotenv').config();
const port = process.env.PORT || 3333;

const io = require('socket.io')(port);

const game = io.of('/number-game');

// need some system to store guesses 
