const mongoose = require('mongoose');

const CentroConsumoSchema = new mongoose.Schema({
	centroConsumo: {
		type: String,
		required: true,
		unique: true
	},
	imagen: {
		type: String,
	}
});

const CentroConsumo = mongoose.model('CentroConsumo', CentroConsumoSchema);

module.exports = CentroConsumo;
