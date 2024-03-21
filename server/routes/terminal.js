const express = require('express');
const router = express.Router();
const Terminal = require('../model/terminalSchema');

// Ruta para crear datos en el modelo Terminal
router.post('/crear/terminal', async (req, res) => {
	try {
		const { terminal } = req.body;

		// Verificar que los datos sean requeridos
		if (!terminal) {
			return res.status(400).json({ error: "Se requiere proporcionar la terminal" });
		}

		// Verificar unicidad
		const existingTerminal = await Terminal.findOne({ terminal });
		if (existingTerminal) {
			return res.status(400).json({ error: "La terminal ya existe" });
		}

		const newTerminal = new Terminal({ terminal });
		await newTerminal.save();

		res.status(201).json(newTerminal);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

module.exports = router;
