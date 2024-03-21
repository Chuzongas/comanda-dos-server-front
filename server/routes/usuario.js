const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator')
const Usuario = require('../model/usuarioSchema')
const authCrearUsuarios = require('../middleware/authCrearUsuarios');
const Terminal = require('../model/terminalSchema')

// GET ALL
router.get('/', async (req, res) => {
	const usuario = await Usuario.find();
	res.json(usuario);
})

// GET ONE
router.get('/:id', async (req, res) => {
	const usuario = await Usuario.findById(req.params.id)
	res.json(usuario);
})

// Ruta para crear un nuevo usuario
router.post('/crear/usuario', async (req, res) => {
    try {
        const { usuario, clave, terminales } = req.body;

        // Verifica que todos los campos requeridos estén presentes
        if (!usuario || !clave || !terminales) {
            return res.status(400).json({ error: "Todos los campos son requeridos" });
        }

        // Verifica si el nombre de usuario ya existe
        const usuarioExistente = await Usuario.findOne({ usuario });
        if (usuarioExistente) {
            return res.status(400).json({ error: "El nombre de usuario ya está en uso" });
        }

        // Verifica si la clave ya existe
        const claveExistente = await Usuario.findOne({ clave });
        if (claveExistente) {
            return res.status(400).json({ error: "La clave ya está en uso" });
        }

        // Verifica que las terminales proporcionadas existan
        const terminalesExistentes = await Terminal.find({ terminal: { $in: terminales } });
        if (terminalesExistentes.length !== terminales.length) {
            return res.status(400).json({ error: "Una o más terminales no existen" });
        }

        // Crea un nuevo usuario
        const nuevoUsuario = new Usuario({
            usuario,
            clave,
            terminales
        });

        // Guarda el usuario en la base de datos
        await nuevoUsuario.save();

        res.status(201).json({ mensaje: "Usuario creado exitosamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Hubo un error al crear el usuario" });
    }
});

module.exports = router;