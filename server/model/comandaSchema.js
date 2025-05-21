const mongoose = require('mongoose');

// Función para obtener la hora actual en formato GMT
const getCurrentGMTTime = () => {
	const now = new Date();
	return now.toISOString(); // Devuelve la hora actual en formato ISO (GMT)
};

// Definir el esquema de los productos
const productoSchema = new mongoose.Schema({
	movcmd: Number,
	movcmdpkt: Number,
	nompaquete: String,
	comensal: String,
	tiempo: String,
	cantidad: String,
	producto: String,
	preparacion: [String],
	modificador: [String],
	observaciones: String,
	imagen: String,
	complementos: [{
		movcmd: Number,
		comensal: Number,
		tiempo: Number,
		cantidad: Number,
		producto: String,
		imagen: String,
	}],
	ordenado: {
		responsable: String,
		hora: { type: String, default: getCurrentGMTTime }, // Establece la hora por defecto como la hora actual en GMT
		notificar: { type: Boolean, default: true } // Nuevo campo "notificar" dentro de "ordenado" con valor por defecto true
	},
	cocinando: {
		responsable: String,
		hora: String,
		notificar: { type: Boolean, default: false } // Nuevo campo "notificar" dentro de "cocinando" con valor por defecto false
	},
	preparado: {
		responsable: String,
		hora: String,
		notificar: { type: Boolean, default: false } // Nuevo campo "notificar" dentro de "preparado" con valor por defecto false
	},
	entregado: {
		responsable: String,
		hora: String,
		notificar: { type: Boolean, default: false } // Nuevo campo "notificar" dentro de "entregado" con valor por defecto false
	},
	servido: {
		responsable: String,
		hora: String,
		notificar: { type: Boolean, default: false } // Nuevo campo "notificar" dentro de "entregado" con valor por defecto false
	},
	cancelado: {
		type: Boolean,
		default: false
	}
});

// Definir el esquema de la comanda
const comandaSchema = new mongoose.Schema({
	comanda: Number,
	caja: String,
	cuenta: String,
	ccmo: {
		type: String,
		ref: 'CentroConsumo'
	},
	cvecc: String,
	fecha: String,
	hora: String,
	imagen: String,
	mesa: String,
	cantidadComensales: Number,
	meseros: [{
		nombre: String,
		imagen: String
	}],
	data: [{
		terminal: String,
		imagen: String,
		productos: [productoSchema],
		oculto: {
			type: Boolean,
			default: false
		}
	}]
});

// Crear y exportar el modelo de la comanda
const Comanda = mongoose.model('Comanda', comandaSchema);
module.exports = Comanda;
