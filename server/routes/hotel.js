const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator')
const RegistroHotel = require('../model/registroHotel')
const Hotel = require('../model/hotel')
const Usuario = require('../model/usuario')
const auth = require('../middleware/auth')

// GET BY DATE REGISTRO HOTEL
router.post('/getbydate', [
	check('fecha', 'campo fecha es requerido y tiene que ser de tipo string').isString().notEmpty(),
	check('selectedHotel', 'campo selectedHotel es requerido y tiene que ser de tipo string').isString().notEmpty(),
	// check('selectedSeccion', 'campo selectedSeccion es requerido y tiene que ser de tipo string').isString().notEmpty(),
], auth, async (req, res) => {

	const errors = validationResult(req)
	if (!errors.isEmpty()) return res.status(400).json({ message: errors.array() })

	const { fecha, selectedSeccion, selectedHotel } = req.body;

	let user = req.userdecode

	let userDB = await Usuario.findById(user.usuario.usuario._id)


	if (!userDB) {
		return res.status(400).send({ message: 'El usuario no existe.' });
	}

	// Verifica si el usuario tiene el hotel especificado en su arreglo de hoteles
	const hasHotel = userDB.hoteles.some(hotel => hotel._id.toString().includes(selectedHotel));

	if (!hasHotel) {
		return res.status(400).send({ message: 'El usuario no tiene el hotel especificado en su arreglo de hoteles.' });
	}

	// Busca QUE EL HOTEL SI EXISTA
	const hotel = await Hotel.findById(selectedHotel);

	if (!hotel) {
		return res.status(400).send({ message: 'No se ha encontrado el hotel con ese id.' });
	}


	console.log(`buscando hotel con el nombre ${hotel.nombre}, la fecha ${fecha} y la seccion ${selectedSeccion}`);

	// CHECK SI SE MANDA LA SECCION
	if (selectedSeccion !== undefined && selectedSeccion !== '') {
		// SI SE MANDA LA SECCION

		// BUSCAR POR ID LA SECCION QUE BUSCAS PARA SACAR EL NOMBRE DE ESTA
		let hotelDeSeccionEncontrada = await Hotel.findOne({ 'secciones._id': selectedSeccion })

		if (!hotelDeSeccionEncontrada) {
			return res.status(400).json({ message: `No se encontro registro con la seccion ${selectedSeccion}` })
		}

		// SACAR LA SECCION SELECCIONADA DEL ARRAY DE SECCIONES DEL HOTEL
		let objetoSeccionSeleccionada = hotelDeSeccionEncontrada.secciones.find(item => item._id.toString().includes(selectedSeccion))

		// BUSCAR UN REGISTRO POR ID, FECHA Y SECCION
		const registroHotel = await RegistroHotel.findOne({ nombre: hotel.nombre, 'days.fecha': fecha, seccion: objetoSeccionSeleccionada.nombreSeccion });

		// SI ENCONTRAMOS UN DATO
		if (registroHotel) {
			// LO FILTRAMOS PARA SACAR LO QUE NECESITAMOS
			const result = registroHotel.days.filter(day => day.fecha === fecha);
			// ENVIAMOS LOS DATOS
			res.json(result[0]);
			return
		}

		return res.json(false)

	}

	// NO SE MANDA LA SECCION
	// BUSCAR UN REGISTRO POR ID , FECHA Y DONDE SECCION SEA NULL
	const registroHotel = await RegistroHotel.findOne({ nombre: hotel.nombre, 'days.fecha': fecha, seccion: { $type: 10 } });

	// SI ENCONTRAMOS UN DATO
	if (registroHotel) {
		// LO FILTRAMOS PARA SACAR LO QUE NECESITAMOS
		const result = registroHotel.days.filter(day => day.fecha === fecha);
		// ENVIAMOS LOS DATOS
		res.json(result[0]);
		return
	}

	return res.json(false)

})

// GET ALL HOTELES
router.get('/get/all/hoteles', async (req, res) => {

	const hoteles = await Hotel.find();
	res.json(hoteles);
});

// GET MY HOTELES
router.get('/get/my/hoteles', auth, async (req, res) => {

	let reqUser = req.userdecode

	console.log(reqUser);

	try {
		// FIND SI USER EXIST
		const user = await Usuario.findOne({ _id: reqUser.usuario.usuario._id });
		if (!user) {
			return res.status(400).json({ message: 'Usuario no encontrado' });
		}

		// SACAR LA INFO DE LOS HOTELES DEL USUARIO
		let hotelesFromDatabase = []

		for (let i = 0; i < user.hoteles.length; i++) {
			console.log(user.hoteles[i])
			let hotelEncontrado = await Hotel.findById(user.hoteles[i]._id)

			if (hotelEncontrado) {
				hotelesFromDatabase.push(hotelEncontrado)
			}

		}

		res.status(200).json({ hoteles: hotelesFromDatabase });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: 'Ha ocurrido un error en el servidor' });
	}
});

// CREATE REGISTRO DEL HOTEL
router.post('/', [
	check('nombre', 'campo nombre es requerido y tiene que ser de tipo string').isString().notEmpty(),
	check('days', 'campo days es requerido y tiene que ser de tipo array').isArray().notEmpty(),
	// check('seccion', 'campo seccion es requerido y tiene que ser de tipo string').isString().notEmpty(),
	check('days.*.fecha', 'campo days.fecha es requerido y tiene que ser de tipo string').isString().notEmpty(),
	check('days.*.data', 'campo days.data es requerido').notEmpty(),
], async (req, res) => {

	const errors = validationResult(req)
	if (!errors.isEmpty()) return res.status(400).json({ message: errors.array() })

	const { nombre, days, seccion } = req.body;
	const date = days[0].fecha;

	// BUSCAR EL HOTEL PARA VERIFICAR
	let hotel = await Hotel.findOne({ nombre })

	// SI NO EXISTE EL HOTEL, NOTIFICARLO
	if (!hotel) {
		return res.status(400).json({ message: `El hotel ${nombre} no existe` })
	}


	if (seccion !== undefined && seccion !== "") {
		// LLEGA LA SECCION
		// VERIFICAR QUE EL HOTEL TENGA LA SECCION
		let seccionEncontrada = hotel.secciones.find(item => item.nombreSeccion === seccion)

		if (!seccionEncontrada) {
			return res.status(400).json({ message: `El hotel ${nombre} no tiene la seccion ${seccion}` })
		}
	}


	// buscar si ya existe un registro de hotel con el mismo nombre, fecha y seccion
	let registroHotel = await RegistroHotel.findOne({ nombre, 'days.fecha': date, seccion: seccion });

	if (registroHotel) {
		// si existe, actualizar el registro

		if (seccion !== undefined && seccion !== "") {
			// TIENE SECCION
			registroHotel.seccion = seccion;
		}
		registroHotel.nombre = nombre;
		registroHotel.days = days;
		await registroHotel.save();
		return res.send({ message: 'Estadistica del hotel actualizado con éxito' });
	}

	if (seccion !== undefined && seccion !== "") {
		// SI LLEGA SECCION
		// si no existe, crear un nuevo registro de hotel

		registroHotel = new RegistroHotel({ nombre, days, seccion });
	} else {
		// NO LLEGA LA SECCION
		registroHotel = new RegistroHotel({ nombre, days, seccion: null });
	}

	await registroHotel.save();

	res.send({ message: 'Estadistica del hotel creado con éxito' });
})

// CREATE HOTEL
router.post('/create/hotel', [
	check('nombre', 'campo nombre es requerido y tiene que ser de tipo string').isString().notEmpty(),
	// check('secciones', 'campo secciones es requerido y de tipo array').notEmpty().isArray(),
	// check('secciones.*.nombreSeccion', 'campo secciones.nombreSeccion es requerido y de tipo string').notEmpty().isString(),
], async (req, res) => {

	const errors = validationResult(req)
	if (!errors.isEmpty()) return res.status(400).json({ message: errors.array() })

	const { nombre, secciones } = req.body;


	// buscar si ya existe un hotel con el mismo nombre
	let hotel = await Hotel.findOne({ nombre });

	if (hotel) {
		// si existe, decir que ya existe
		return res.status(400).json({ message: 'Ya existe un hotel con este nombre' });
	}


	// CHECK SI HAY SECCIONES
	if (secciones !== undefined && secciones.length >= 1) {

		// SI HAY SECCIONES
		// CHECK SI NO VIENE NINGUNA SECCION REPETIDA
		const uniqueSecciones = {};
		let isDuplicate = false;

		for (let seccion of secciones) {
			if (uniqueSecciones[seccion.nombreSeccion]) {
				isDuplicate = true;
				break;
			} else {
				uniqueSecciones[seccion.nombreSeccion] = true;
			}
		}

		if (isDuplicate) {
			return res.status(400).json({ message: 'Seccion repetida encontrada' });
		}

		hotel = new Hotel({
			nombre,
			secciones
		});
		await hotel.save();

		return res.send({ message: 'Hotel creado con éxito', hotel });


	} else {
		// SIN SECCIONES

		hotel = new Hotel({
			nombre
		});
		await hotel.save();

		return res.send({ message: 'Hotel creado con éxito', hotel });
	}

})

// AGREGAR SECCIONES A HOTEL
router.post('/agregar/secciones/hotel', [
	check('nombre', 'campo nombre es requerido y tiene que ser de tipo string').isString().notEmpty(),
	check('secciones', 'campo secciones es requerido y de tipo array').notEmpty().isArray(),
	check('secciones.*.nombreSeccion', 'campo secciones.nombreSeccion es requerido y de tipo string').notEmpty().isString(),
], async (req, res) => {

	const errors = validationResult(req)
	if (!errors.isEmpty()) return res.status(400).json({ message: errors.array() })

	const { nombre, secciones } = req.body;

	// CHECK SI NO VIENE NINGUNA SECCION REPETIDA
	const uniqueSecciones = {};
	let isDuplicate = false;

	for (let seccion of secciones) {
		if (uniqueSecciones[seccion.nombreSeccion]) {
			isDuplicate = true;
			break;
		} else {
			uniqueSecciones[seccion.nombreSeccion] = true;
		}
	}

	if (isDuplicate) {
		return res.status(400).json({ message: 'Seccion repetida encontrada' });
	}


	// buscar si EXISTE EL HOTEL A AGREGAR LAS SECCIONES
	let hotel = await Hotel.findOne({ nombre });

	if (!hotel) {
		return res.status(400).json({ message: `No existe el hotel ${nombre}` });
	}

	// Verifica si ALGUNA SECCION YA LA TIENE EL HOTEL
	const existingSeccionNames = hotel.secciones.map(seccion => seccion.nombreSeccion);
	for (const seccion of secciones) {
		if (existingSeccionNames.includes(seccion.nombreSeccion)) {
			return res.status(400).json({ message: `La seccion '${seccion.nombreSeccion}' ya existe en el hotel` });
		}
	}

	// Actualiza el HOTEL CON LAS NUEVAS SECCIONES
	hotel.secciones = [...hotel.secciones, ...secciones];
	await hotel.save();

	res.send({ message: 'Secciones agregadas con éxito' });
})

module.exports = router;