const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define el esquema del usuario
const usuarioSchema = new Schema({
	usuario: {
		type: String,
		required: true,
		unique: true
	},
	clave: {
		type: String,
		required: true,
		unique: true
	},
	admin: {
		type: Boolean
	},
	terminales: {
		type: [String]
	},
	fechaCreacion: {
		type: Date,
		default: Date.now
	}
});

// Crea el modelo de usuario
const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;
