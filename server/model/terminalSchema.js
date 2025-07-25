const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const terminalSchema = new Schema({
	terminal: {
		type: String,
		required: true,
		unique: true
	},
	imagen: {
		type: String,
	}
});

const Terminal = mongoose.model('Terminal', terminalSchema);

module.exports = Terminal;
