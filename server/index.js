const express = require('express');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');
const app = express();

// GLOBAL VARS
const axiosConfig = require('./axiosConfig/axiosconfig')

//database connection
const { mongoose } = require('./database');

//variables
app.set('port', process.env.PORT || 5000);

//middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

//routes
app.use('/api/comanda', require('./routes/comanda.js'));
app.use('/api/terminal', require('./routes/terminal.js'));
app.use('/api/centroconsumo', require('./routes/centroConsumo.js'));
app.use('/api/usuario', require('./routes/usuario.js'));
app.use('/api/auth', require('./routes/auth.js'));

//static files
app.use(express.static(path.join(__dirname, 'public')));

//server
app.listen(app.get('port'), () => {
	console.log(`Server listening on port ${app.get('port')}`);
});