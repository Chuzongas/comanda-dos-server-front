const express = require('express');
const router = express.Router();
const USUARIO = require('../model/usuarioSchema');
const axios = require('axios')
const { check, validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const config = require('config')
const auth = require('../middleware/auth')
const preAuth = require('../middleware/preAuth');
const Terminal = require('../model/terminalSchema')

// AUTH USER
router.get('/', auth, async (req, res) => {
	try {
		res.json("good");
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server error')
	}
});

// LOGIN
router.post('/login', [
	// check('correo', 'Campo correo requerido').notEmpty().isString(),
	check('clave', 'Campo clave requerido').notEmpty().isString()
], async (req, res) => {

	try {
		const errors = validationResult(req)
		if (!errors.isEmpty()) return res.status(400).json({ message: errors.array() })

		const { clave } = req.body

		const usuario = await USUARIO.findOne({ clave }).select('-clave') //menos password

		if (!usuario) {
			return res.status(401).json({ message: "Credenciales incorrectas" })
		}

		const tokenOptions = {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production', // solo HTTPS en prod
			maxAge: 24 * 60 * 60 * 1000, // 24 horas en ms
			sameSite: 'lax', // evita CSRF sencillo
		};

		// CHECK IF ADMIN
		if (usuario.admin === true) {
			//SI ES ADMIN
			// JWT
			const payload = {
				usuario: usuario,
				data: {
					todasTerminales: true
				},
				preData: {
					terminalSeleccionada: true
				}
			}



			jwt.sign(
				payload,
				process.env.JWT_SECRET,
				{ expiresIn: 86400 },
				(err, token) => {
					if (err) throw err;
					// Setea cookie con el token
					res.cookie('token', token, tokenOptions);
					return res.status(200).json({
						admin: usuario.admin === true ? true : undefined,
						usuario: usuario
					});
				}
			)

		} else {

			// NO ES ADMIN
			// JWT
			const payload = {
				usuario: usuario,
				data: {},
				preData: {
					terminalSeleccionada: true
				}
			}

			jwt.sign(
				payload,
				process.env.JWT_SECRET,
				{ expiresIn: 86400 },
				(err, token) => {
					if (err) throw err;
					res.cookie('token', token, tokenOptions);
					return res.status(200).json({
						admin: usuario.admin === true ? true : undefined,
						usuario: usuario
					});
				}
			)
		}
	} catch (error) {
		res.status(500).json({ message: 'Server error' })
		console.error(error.message)
	}

})

// SELECT PRE DATA
router.post('/select/predata', preAuth, [
	check('terminal', 'Campo terminal requerido').isString().notEmpty()
], async (req, res) => {

	try {
		const errors = validationResult(req)
		if (!errors.isEmpty()) return res.status(400).json({ message: errors.array() })

		const { terminal } = req.body

		console.log(terminal)

		let terminalDatabase = await Terminal.findOne({ terminal: terminal })

		let user = req.userdecode

		// CHECK IF USUARIO TIENE ESTA TERMINAL
		if (!user.usuario.terminales.includes(terminalDatabase.terminal)) {
			return res.status(401).json({ message: 'no tienes acceso a esta terminal' })
		}

		// JWT
		const payload = {
			usuario: user.usuario,
			data: {
				terminalDatabase
			},
			preData: {
				terminalSeleccionada: true
			}
		}

		jwt.sign(
			payload,
			process.env.JWT_SECRET, { expiresIn: 86400 }, //24 horas
			(err, token) => {
				if (err) throw err;
				return res.status(200).json({
					token,
					usuario: user.usuario.usuario,
					terminalSeleccionda: terminalDatabase
				})
			}
		)


	} catch (error) {
		res.status(500).json({ message: 'Server error' })
		console.error(error)
	}

})

// GET PRE DATA
router.get('/get/predata', preAuth, async (req, res) => {

	let reqUser = req.userdecode

	console.log(reqUser);

	try {
		// FIND SI USER EXIST
		const user = await USUARIO.findOne({ _id: reqUser.usuario._id }).select('-clave -_id -fechaCreacion') //menos password;
		if (!user) {
			return res.status(404).json({ message: 'Usuario no encontrado' });
		}

		res.status(200).json({ user });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: 'Ha ocurrido un error en el servidor' });
	}
});

module.exports = router;