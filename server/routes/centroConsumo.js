const express = require('express');
const router = express.Router();
const CentroConsumo = require('../model/centroConsumoSchema');

router.post('/crear/centroConsumo', async (req, res) => {
	try {
		const { centroConsumo, imagen } = req.body;

		// Verificar si el campo centroConsumo está presente y no está vacío
		if (!centroConsumo || centroConsumo.trim() === '') {
			return res.status(400).json({ error: 'El campo centroConsumo es requerido' });
		}

		// Verificar si el centro de consumo ya existe
		const existeCentro = await CentroConsumo.findOne({
			centroConsumo
		});
		if (existeCentro) {
			return res.status(400).json({ error: 'El centro de consumo ya existe' });
		}

		// Crear un nuevo centro de consumo
		const nuevoCentro = await CentroConsumo.create({
			centroConsumo,
			imagen
		});
		res.status(201).json({ mensaje: 'Centro de consumo creado exitosamente', data: nuevoCentro });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

module.exports = router;
