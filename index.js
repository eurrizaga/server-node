// Inicio de aplicación
//se arranca haciendo: node index.js
const express = require('express'); //express parse response + routing
const http = require('http'); // handle http requests
const bodyParser = require('body-parser'); //help parse incoming http requests
const morgan = require('morgan'); // logging

const app = express();
const router = require('./router');


const mongoose = require('mongoose');

//DB setup
mongoose.connect('mongodb://localhost:27017/auth');
//App setup
//app.use los registra como middleware
app.use(morgan('combined')); //para logging
app.use(bodyParser.json({ type: '*/*' })); //parsea el request a json
router(app);


// Server setup
const port = process.env.PORT || 3090; //numero seleccionado por mí
const server = http.createServer(app);
server.listen(port);
console.log('Server escuchando en:', port);