const express = require('express');
const Comanda = require('../model/comandaSchema');
const auth = require('../middleware/auth')
const router = express.Router();
const CentroConsumo = require('../model/centroConsumoSchema')
const Terminal = require('../model/terminalSchema')

// Ruta para obtener comandas por terminal
router.get('/all/comandas', auth, async (req, res) => {
	try {
		// Obtener la fecha actual
		const ahora = new Date();

		// Calcular la fecha límite (hace 24 horas)
		const hace24Horas = new Date(ahora);
		hace24Horas.setHours(hace24Horas.getHours() - 24);

		// Construir el pipeline de agregación
		const pipeline = [
			{
				$addFields: {
					fechaHora: {
						$dateFromString: {
							dateString: {
								$concat: [
									{ $concat: ['20', { $substr: ['$fecha', 6, 2] }, '-', { $substr: ['$fecha', 3, 2] }, '-', { $substr: ['$fecha', 0, 2] }] },
									'T',
									'$hora'
								]
							}
						}
					}
				}
			},
			{
				$match: {
					fechaHora: { $gte: hace24Horas, $lte: ahora }
				}
			}
		];

		// Si no es admin, filtra por terminales
		if (!req.userdecode.usuario.admin) {
			const terminales = req.userdecode.usuario.terminales;

			// Filtro por terminales dentro de data.terminal
			pipeline.push({
				$match: {
					'data.terminal': { $in: terminales }
				}
			});
		}

		// Ejecutar la agregación
		let comandas = await Comanda.aggregate(pipeline);

		// Limpiar terminales vacías
		comandas.forEach(comanda => {
			comanda.data = comanda.data.filter(data => data.terminal !== "");
		});

		// Si no es admin, filtra las terminales en cada comanda
		if (!req.userdecode.usuario.admin) {
			const terminales = req.userdecode.usuario.terminales;
			comandas = comandas.map(comanda => {
				const dataFiltrada = comanda.data.filter(item => terminales.includes(item.terminal));
				return { ...comanda, data: dataFiltrada };
			});
		}

		// Responder con las comandas filtradas
		return res.json(comandas);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: 'Error al obtener las comandas' });
	}
});

// Ruta para crear una nueva comanda
router.post('/crear/comanda', async (req, res) => {
	try {
		// Acceder a req.userdecode.usuario para obtener el responsable
		const responsable = /* req.userdecode.usuario*/ "chuz";

		const centroConsumoExistente = await CentroConsumo.findOne({ centroConsumo: req.body.ccmo })

		if (centroConsumoExistente) {
			req.body.imagen = centroConsumoExistente.imagen
		} else {
			req.body.imagen = undefined
		}



		for (let i = 0; i < req.body.data.length; i++) {
			let terminalEncontrada = await Terminal.findOne({ terminal: req.body.data[i].terminal })

			if (terminalEncontrada) {
				req.body.data[i].imagen = terminalEncontrada.imagen
			} else {
				req.body.data[i].imagen = undefined
			}
		}

		console.log(req.body)

		// Crear una nueva instancia del modelo Comanda con los datos proporcionados en el cuerpo de la solicitud
		const nuevaComanda = new Comanda(req.body);

		// Iterar sobre los productos para asignar el responsable en ordenado.responsable
		nuevaComanda.data.forEach(terminal => {
			terminal.productos.forEach(producto => {
				producto.ordenado.responsable = responsable;
			});
		});

		// Guardar la nueva comanda en la base de datos
		const comandaGuardada = await nuevaComanda.save();

		// Enviar la comanda guardada como respuesta
		res.status(201).json(comandaGuardada);
	} catch (error) {
		// Manejar errores
		console.log(error);
		res.status(400).json({ message: error.message });
	}
});

// Ruta para obtener productos con notificar igual a true y actualizar su estado a false
router.get('/notificar/comanda', async (req, res) => {
	try {
		// Buscar todos los productos con notificar igual a true
		const comandas = await Comanda.find({
			"data.productos": {
				$elemMatch: {
					$or: [
						{ "ordenado.notificar": true },
						{ "cocinando.notificar": true },
						{ "preparado.notificar": true },
						{ "entregado.notificar": true },
						{ "servido.notificar": true }
					]
				}
			}
		});

		// Crear arreglo de objetos para los resultados
		let resultados = [];

		// Recorrer todas las comandas
		comandas.forEach(comanda => {
			comanda.data.forEach(terminalData => {
				terminalData.productos.forEach(producto => {
					if (producto.ordenado.notificar) {
						resultados.push({
							comanda: comanda.comanda,
							caja: comanda.caja,
							cuenta: comanda.cuenta,
							cvecc: comanda.cvecc,
							mesa: comanda.mesa,
							movcmd: producto.movcmd,
							estatus: 1,
							fecha: producto.ordenado.hora.split('T')[0], // Extraer fecha de hora (formato GMT)
							hora: producto.ordenado.hora.split('T')[1].split('.')[0], // Extraer hora de hora (formato GMT)
							Usuario: producto.ordenado.responsable, // Obtener el usuario del responsable
							terminal: terminalData.terminal // Obtener la terminal del producto
						});
						producto.ordenado.notificar = false; // Cambiar notificar a false
					}
					if (producto.cocinando.notificar) {
						resultados.push({
							comanda: comanda.comanda,
							caja: comanda.caja,
							cuenta: comanda.cuenta,
							cvecc: comanda.cvecc,
							mesa: comanda.mesa,
							movcmd: producto.movcmd,
							estatus: 2,
							fecha: producto.cocinando.hora.split('T')[0], // Extraer fecha de hora (formato GMT)
							hora: producto.cocinando.hora.split('T')[1].split('.')[0], // Extraer hora de hora (formato GMT)
							Usuario: producto.cocinando.responsable, // Obtener el usuario del responsable
							terminal: terminalData.terminal // Obtener la terminal del producto
						});
						producto.cocinando.notificar = false; // Cambiar notificar a false
					}
					if (producto.preparado.notificar) {
						resultados.push({
							comanda: comanda.comanda,
							caja: comanda.caja,
							cuenta: comanda.cuenta,
							cvecc: comanda.cvecc,
							mesa: comanda.mesa,
							movcmd: producto.movcmd,
							estatus: 3,
							fecha: producto.preparado.hora.split('T')[0], // Extraer fecha de hora (formato GMT)
							hora: producto.preparado.hora.split('T')[1].split('.')[0], // Extraer hora de hora (formato GMT)
							Usuario: producto.preparado.responsable, // Obtener el usuario del responsable
							terminal: terminalData.terminal // Obtener la terminal del producto
						});
						producto.preparado.notificar = false; // Cambiar notificar a false
					}
					if (producto.entregado.notificar) {
						resultados.push({
							comanda: comanda.comanda,
							caja: comanda.caja,
							cuenta: comanda.cuenta,
							cvecc: comanda.cvecc,
							mesa: comanda.mesa,
							movcmd: producto.movcmd,
							estatus: 4,
							fecha: producto.entregado.hora.split('T')[0], // Extraer fecha de hora (formato GMT)
							hora: producto.entregado.hora.split('T')[1].split('.')[0], // Extraer hora de hora (formato GMT)
							Usuario: producto.entregado.responsable, // Obtener el usuario del responsable
							terminal: terminalData.terminal // Obtener la terminal del producto
						});
						producto.entregado.notificar = false; // Cambiar notificar a false
					}
					if (producto.servido.notificar) {
						resultados.push({
							comanda: comanda.comanda,
							caja: comanda.caja,
							cuenta: comanda.cuenta,
							cvecc: comanda.cvecc,
							mesa: comanda.mesa,
							movcmd: producto.movcmd,
							estatus: 6,
							fecha: producto.servido.hora.split('T')[0], // Extraer fecha de hora (formato GMT)
							hora: producto.servido.hora.split('T')[1].split('.')[0], // Extraer hora de hora (formato GMT)
							Usuario: producto.servido.responsable, // Obtener el usuario del responsable
							terminal: terminalData.terminal // Obtener la terminal del producto
						});
						producto.servido.notificar = false; // Cambiar notificar a false
					}
				});
			});
		});

		// Guardar los cambios en las comandas
		await Promise.all(comandas.map(comanda => comanda.save()));

		res.json({ resultado: resultados });
	} catch (error) {
		// Manejar errores
		res.status(400).json({ message: error.message });
	}
});

// Ruta para actualizar estatus de un producto en una comanda
router.put('/actualizar/comanda/:comanda/:terminal/:movcmd', auth, async (req, res) => {

	const numComanda = req.params.comanda;
	const terminal = req.params.terminal;
	const movcmd = req.params.movcmd;

	// console.log(req.body)
	// return

	// VERIFICAR SI NO ES ADMIN
	if (req.userdecode.usuario.admin !== true) {

		// NO ES ADMIN

		// VERIFICAR QUE LA TERMINAL QUE LLEGO SEA TUYA Y ESTES LOGEADO EN ELLA
		const terminales = req.userdecode.usuario.terminales; ///regresa arreglo

		// SI ES LA TERMINAL QUE ESCOGISTE
		if (!terminales.includes(terminal)) { //verifica en arreglo
			return res.status(401).json({ message: 'No tienes esta terminal seleccionada' })
		}
	}


	try {
		// Encontrar la comanda que coincida con los parámetros proporcionados
		const comanda = await Comanda.findOne({
			'comanda': numComanda,
			'data': {
				$elemMatch: {
					'terminal': terminal,
					'productos': {
						$elemMatch: {
							'movcmd': movcmd
						}
					}
				}
			}
		});

		// Verificar si la comanda existe
		if (!comanda) {
			return res.status(404).json({ message: 'Comanda no encontrada' });
		}

		// Obtener el producto específico dentro de la comanda
		const terminalData = comanda.data.find(data => data.terminal === terminal);
		if (!terminalData) {
			return res.status(404).json({ message: 'Terminal no encontrada en la comanda' });
		}

		const producto = terminalData.productos.find(producto => producto.movcmd == movcmd);
		if (!producto) {
			return res.status(404).json({ message: 'Producto no encontrado en la comanda' });
		}

		// Actualizar los estatus recibidos en el cuerpo de la solicitud
		if (req.body.ordenado) {
			const { responsable } = req.body.ordenado;
			actualizarEstatus(producto, 'ordenado', responsable);
			producto.ordenado.notificar = true;
		}

		if (req.body.cocinando) {
			const { responsable } = req.body.cocinando;
			actualizarEstatus(producto, 'cocinando', responsable);
			producto.cocinando.notificar = true;
		}

		if (req.body.preparado) {
			const { responsable } = req.body.preparado;
			actualizarEstatus(producto, 'preparado', responsable);
			producto.preparado.notificar = true;
		}

		if (req.body.entregado) {
			const { responsable } = req.body.entregado;
			actualizarEstatus(producto, 'entregado', responsable);
			producto.entregado.notificar = true;

			let todoTerminado = true

			// VERIFICAR SI TODOS LOS PRODUCTOS TIENEN TODAS LAS HORAS DEFINIDAS PARA OCULTAR DE UNA VEZ
			for (let i = 0; i < terminalData.productos.length; i++) {

				if (terminalData.productos[i].cancelado === true) {
					continue;
				}

				// SI AL MENOS UN ESTATUS NO TIENE HORA, NO HACER NADA
				if (terminalData.productos[i].entregado.hora === undefined) {

					todoTerminado = false

					break;
				}
			}
			console.log('apoco acaaaaaaaaa')
			if (todoTerminado) {
				// OCULTAR LA COMANDA, TODO TERMINADO
				terminalData.oculto = true
			}

		}

		if (req.body.servido) {
			const { responsable } = req.body.servido;
			actualizarEstatus(producto, 'servido', responsable);
			producto.entregado.notificar = true;
		}

		// Guardar los cambios en la comanda actualizada
		const comandaActualizada = await comanda.save();
		res.json(comandaActualizada);
	} catch (error) {
		// Manejar errores
		res.status(400).json({ message: error.message });
	}
});

// Ruta para TERMINAR COMANDA
router.put('/terminar/comanda/:comanda/:cvecc/:movcmd/:mesa/:responsable/:fecha/:hora/:cancelada', async (req, res) => {

	const comanda = req.params.comanda;
	const cvecc = req.params.cvecc;
	const movcmd = req.params.movcmd;
	const mesa = req.params.mesa
	const responsable = req.params.responsable
	const fecha = req.params.fecha
	const hora = req.params.hora
	const cancelada = req.params.cancelada

	try {
		// Encontrar la comanda que coincida con los parámetros proporcionados
		const comandaEncontrada = await Comanda.findOne({
			'comanda': comanda,
			'cvecc': cvecc,
			'data': {
				$elemMatch: {
					'productos': {
						$elemMatch: {
							'movcmd': movcmd
						}
					}
				}
			},
			'mesa': mesa // Incluir la búsqueda por el campo mesa
		});

		// Verificar si la comanda existe
		if (!comandaEncontrada) {
			return res.status(404).json({ message: 'Comanda no encontrada' });
		}

		// Si cancelada es true, actualizar el campo cancelada del producto y retornar
		if (cancelada === 'true') {

			// TODO, cancelada Si es <- cancelar la cancelacion

			var producto
			var varTerminal

			for (const terminal of comandaEncontrada.data) {
				producto = terminal.productos.find(producto => producto.movcmd == movcmd);
				if (producto) {
					varTerminal = terminal
					break;
				}
			}

			if (!producto) {
				return res.status(404).json({ message: 'Producto no encontrado en la comanda' });
			}

			if (producto.cancelado === true) {

				producto.cancelado = false;
				varTerminal.oculto = false
			} else {
				producto.cancelado = true;

				// actualizarEstatus(producto, 'entregado', 'web');
				// producto.entregado.notificar = true;

				let todoTerminado = true

				// VERIFICAR SI TODOS LOS PRODUCTOS TIENEN TODAS LAS HORAS DEFINIDAS PARA OCULTAR DE UNA VEZ
				for (let i = 0; i < varTerminal.productos.length; i++) {

					if (varTerminal.productos[i].cancelado === true) {
						continue;
					}

					// SI AL MENOS UN ESTATUS NO TIENE HORA, NO HACER NADA
					if (varTerminal.productos[i].entregado.hora === undefined) {

						todoTerminado = false

						break;
					}
				}
				if (todoTerminado) {
					// OCULTAR LA COMANDA, TODO TERMINADO
					varTerminal.oculto = true
				}
			}

			console.log(comandaEncontrada)

			await comandaEncontrada.save();
			// return res.json(comandaActualizada);
		}

		// Obtener el producto específico dentro de la comanda
		let productoEncontrado = null;
		comandaEncontrada.data.forEach(terminalData => {
			const producto = terminalData.productos.find(prod => prod.movcmd == movcmd);
			if (producto) {
				productoEncontrado = producto;
			}
		});

		if (!productoEncontrado) {
			return res.status(404).json({ message: 'Producto no encontrado en la comanda' });
		}

		// Actualizar los estatus a entregado
		// actualizarEstatus(productoEncontrado, 'servido', responsable, fecha, hora);
		// productoEncontrado.servido.notificar = true;


		// Guardar los cambios en la comanda actualizada
		const comandaActualizada = await comandaEncontrada.save();
		res.json(comandaActualizada);
	} catch (error) {
		// Manejar errores
		console.error(error)
		res.status(400).json({ message: error.message });
	}
});

// Función para obtener la hora actual en formato GMT
const getCurrentGMTTime = () => {
	const now = new Date();
	return now.toISOString(); // Devuelve la hora actual en formato ISO (GMT)
};

// Ruta para TERMINAR TODOS LOS PRODUCTOS DE UNA COMANDA (servidos todos)
router.post('/terminar/todacuenta', async (req, res) => {
	const { caja, cuenta, cvecc, mesa } = req.body; // Obtener los valores del body

	try {
		// Buscar las comandas que coincidan con los criterios dados
		const comandas = await Comanda.find({ caja, cuenta, cvecc, mesa });

		// Si no se encuentran registros
		if (comandas.length === 0) {
			return res.status(404).json({ message: 'No se encontraron comandas que coincidan con los criterios proporcionados.' });
		}

		// Iterar sobre cada comanda
		for (const comanda of comandas) {
			for (const data of comanda.data) {
				// Establecer el campo "oculto" en true
				data.oculto = true;

				for (const producto of data.productos) {
					// Definir los campos a actualizar si están vacíos o indefinidos
					const actualizarCampos = ['cocinando', 'preparado', 'entregado', 'servido'];

					actualizarCampos.forEach((campo) => {
						if (!producto[campo].hora) { // Si "hora" es undefined o vacío
							producto[campo].responsable = 'admin';
							producto[campo].hora = getCurrentGMTTime();
							producto[campo].notificar = true;
						}
					});
				}
			}
			// Guardar los cambios en la comanda actual
			await comanda.save();
		}

		res.status(200).json({ message: 'Comandas actualizadas correctamente.' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Error al actualizar las comandas.' });
	}
});

const actualizarEstatus = (producto, estatus, responsable, fecha, hora) => {
	producto[estatus].responsable = responsable;

	if (fecha === undefined || hora === undefined) {
		// Si fecha o hora son undefined, calcular la fecha y hora actual en formato ISO
		const fechaHoraActual = new Date().toISOString();
		producto[estatus].hora = fechaHoraActual;
	} else {
		// Formatear la fecha en el formato adecuado (YYYY-MM-DD) para ser interpretada correctamente
		const partesFecha = fecha.split('-'); // Dividir la fecha en partes
		const fechaFormateada = `${partesFecha[2]}-${partesFecha[1]}-${partesFecha[0]}`; // Formato: YYYY-MM-DD
		// Combinar fecha y hora proporcionadas en una cadena de fecha y hora ISO en formato GMT
		const fechaHoraGMT = new Date(`${fechaFormateada}T${hora}`).toISOString();
		producto[estatus].hora = fechaHoraGMT; // Asigna la fecha y hora combinadas en formato ISO
	}
};


// Ruta para actualizar el estado de oculto de una comanda
router.put('/ocultar/comanda/:id/:terminal', async (req, res) => {
	const { id, terminal } = req.params;

	try {
		// Buscar la comanda por su ID
		const comanda = await Comanda.findById(id);

		if (!comanda) {
			return res.status(404).json({ message: 'Comanda no encontrada' });
		}

		let terminalIndex = comanda.data.findIndex(item => item.terminal === terminal)

		if (terminalIndex === -1) return res.status(404).json({ message: 'terminal no encontrada' })

		// Actualizar el valor de oculto a true
		comanda.data[terminalIndex].oculto = true;

		// Guardar la comanda actualizada en la base de datos
		await comanda.save();

		return res.status(200).json({ message: 'Estado de oculto actualizado correctamente' });
	} catch (error) {
		console.error('Error al actualizar el estado de oculto:', error);
		return res.status(500).json({ message: 'Error interno del servidor' });
	}
});


module.exports = router;
