const express = require('express');
const Comanda = require('../model/comandaSchema');

const router = express.Router();

// Ruta para obtener todas las comandas
router.get('/all/comandas', async (req, res) => {
    try {
        // Buscar todas las comandas
        const comandas = await Comanda.find();

        res.json({ comandas: comandas });
    } catch (error) {
        // Manejar errores
        res.status(400).json({ message: error.message });
    }
});

// Ruta para crear una nueva comanda
router.post('/crear/comanda', async (req, res) => {
	try {
		// Acceder a req.userdecode.usuario para obtener el responsable
		const responsable = /* req.userdecode.usuario*/ "chuz";

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
						{ "entregado.notificar": true }
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
router.put('/actualizar/comanda/:comanda/:terminal/:movcmd', async (req, res) => {
	const numComanda = req.params.comanda;
	const terminal = req.params.terminal;
	const movcmd = req.params.movcmd;

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
		}

		// Guardar los cambios en la comanda actualizada
		const comandaActualizada = await comanda.save();
		res.json(comandaActualizada);
	} catch (error) {
		// Manejar errores
		res.status(400).json({ message: error.message });
	}
});

// Función para actualizar un estatus específico en un producto
const actualizarEstatus = (producto, estatus, responsable) => {
	producto[estatus].responsable = responsable;
	producto[estatus].hora = new Date().toISOString(); // Asigna la hora actual en formato ISO
};


module.exports = router;
