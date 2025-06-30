import React, { Fragment, useEffect, useState } from 'react';

import axios from 'axios'
import img from '../../img/comida.jpg'
import { VARS_EMPRESAS } from '../../helpers/Helpers'
import { userData } from '../../helpers/DataOfUser';
import Spinner from '../../tools/Spinner'
import { animated } from '@react-spring/web';
import OutsideClickHandler from 'react-outside-click-handler';
import { useTransition } from '@react-spring/core';

import Cocinando from '../../img/cocinando.png'
import Entregado from '../../img/entregado.png'
import EntregadoPrendido from '../../img/entregadoPrendido.png'
import Ordenado from '../../img/ordenado.png'

import comanda from '../../img/comanda.png'
import mesa from '../../img/mesa.png'

import sonidoUno from '../../sounds/sonidoUno.mp3'
import sonidoDos from '../../sounds/sonidoDos.mp3'

const colores = ["#796dfe", "#007da7", "#3c9261", "#0e00ab"];


const Home = ({ tokenOptions, reload }) => {

	// MAIN DATA
	const [comandas, setComandas] = useState([])
	const [comandasFiltradas, setComandasFiltradas] = useState([])
	const [centrosDeConsumo, setCentrosDeConsumo] = useState([])
	const [centrosDeConsumoImagenes, setCentrosDeConsumoImagenes] = useState([])
	const [barrasDeAlimentos, setBarrasDeAlimentos] = useState([])
	const [barrasDeAlimentosImagenes, setBarrasDeAlimentosImagenes] = useState([])

	// FILTROS
	const [filtroCentroDeConsumo, setFiltroCentroDeConsumo] = useState('')
	const [filtroBarraDeAlimentos, setFiltroBarraDeAlimentos] = useState('')
	const [filtroOculto, setFiltroOculto] = useState(false)
	const [filtroCancelados, setFiltroCancelados] = useState(false)


	// SPINNER
	const [spinner, setSpinner] = useState(false)

	// FILTERS
	const [showFilters, setShowFilters] = useState(false)

	//animations
	const transition = useTransition(showFilters, {
		config: {
			tension: 120,
			friction: 14,
			clamp: true,
			duration: 100
		},
		from: { transform: 'translateX(40px)', opacity: '0', zIndex: '100', position: 'fixed', bottom: '60px', right: '10px' },
		enter: { transform: 'translateX(0px)', opacity: '1', zIndex: '100', position: 'fixed', bottom: '60px', right: '10px' },
		leave: { transform: 'translateX(40px)', opacity: '0', zIndex: '100', position: 'fixed', bottom: '60px', right: '10px' },
	})

	function getColorParaId(id) {
		return colores[id % colores.length];
	}

	// GET COMANDAS INICIALES
	useEffect(() => {

		////console.log(tokenOptions)

		setSpinner(true)
		//console.log('to true')


		axios.get('api/comanda/all/comandas', tokenOptions)
			.then(res => {

				if (res.data.length === 0) {
					setSpinner(false)
					//console.log('toFalse')
					setComandas([])
					setComandasFiltradas([])
					return
				}


				for (let x = 0; x < res.data.length; x++) {

					let paquetones = []

					for (let i = 0; i < res.data[x].data.length; i++) {

						let paquetes = []

						res.data[x].data[i].productos.forEach(producto => {

							if (paquetes.some(el => el.movcmdpkt === producto.movcmdpkt)) return

							paquetes.push({ movcmdpkt: producto.movcmdpkt, nompaquete: producto.nompaquete });
						});

						paquetones = paquetones.concat(paquetes)

						let seenInPaquetes = new Set();

						paquetones = paquetones.filter(item => {
							if (seenInPaquetes.has(item.movcmdpkt)) return false;
							seenInPaquetes.add(item.movcmdpkt);
							return true;
						});

					}
					res.data[x].tiposUnicosInfo = paquetones
				}


				setSpinner(false)
				//console.log('toFalse')
				setComandas(res.data)
				// setComandasFiltradas(res.data)
				getCentrosYBarras(res.data)
			})
			.catch(err => {
				setSpinner(false)
				//console.log('toFalse')
				////console.log(err)
			})

	}, [tokenOptions, reload])

	const getCentrosYBarras = (data) => {
		let centrosDeConsumo = [];
		let centrosDeConsumoImagenes = [];
		let barrasDeAlimentos = [];
		let barrasDeAlimentosImagenes = [];

		data.forEach((pedido) => {
			pedido.data.forEach((terminalData, i) => {
				// Verificar si la terminal ya está en barrasDeAlimentos
				if (!barrasDeAlimentos.includes(terminalData.terminal)) {
					barrasDeAlimentos.push(terminalData.terminal);
					barrasDeAlimentosImagenes.push(terminalData.imagen);
				}
			});

			// Verificar si el ccmo ya está en centrosDeConsumo
			if (!centrosDeConsumo.includes(pedido.ccmo)) {
				centrosDeConsumo.push(pedido.ccmo);
				centrosDeConsumoImagenes.push(pedido.imagen);
			}
		});

		setCentrosDeConsumo(centrosDeConsumo)
		setCentrosDeConsumoImagenes(centrosDeConsumoImagenes)
		setBarrasDeAlimentos(barrasDeAlimentos)
		setBarrasDeAlimentosImagenes(barrasDeAlimentosImagenes)
	};


	const reloadData = () => {

		setSpinner(true)
		//console.log('to true')

		axios.get('api/comanda/all/comandas', tokenOptions)
			.then(res => {

				//console.log(res.data)
				//console.log(res.data.length)

				if (res.data.length === 0) {
					setSpinner(false)
					//console.log('toFalse')
					setComandas([])
					setComandasFiltradas([])
					return
				}


				for (let x = 0; x < res.data.length; x++) {

					let paquetones = []

					for (let i = 0; i < res.data[x].data.length; i++) {

						let paquetes = []

						res.data[x].data[i].productos.forEach(producto => {

							if (paquetes.some(el => el.movcmdpkt === producto.movcmdpkt)) return

							paquetes.push({ movcmdpkt: producto.movcmdpkt, nompaquete: producto.nompaquete });
						});

						paquetones = paquetones.concat(paquetes)

						let seenInPaquetes = new Set();

						paquetones = paquetones.filter(item => {
							if (seenInPaquetes.has(item.movcmdpkt)) return false;
							seenInPaquetes.add(item.movcmdpkt);
							return true;
						});

					}
					res.data[x].tiposUnicosInfo = paquetones
				}

				setSpinner(false)
				//console.log('toFalse')
				setComandas(res.data)
				//console.log(res.data)
				// setComandasFiltradas(res.data)
			})
			.catch(err => {
				setSpinner(false)
				//console.log('toFalse')
				//console.log(err.response)
				//console.log(err)
			})
	}

	const getFecha = (item) => {
		if (item.hora === undefined) {
			return 'NA'
		}

		return new Date(item.hora).toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric' })
	}

	const sendCocinando = (producto, horaPasada, comanda, terminal, movimientoComanda) => {

		if (producto.cocinando.hora !== undefined) return

		if (horaPasada === undefined) {
			return
		}

		let data = {
			"cocinando": {
				"responsable": JSON.parse(localStorage.getItem(userData)).usuario
			}
		}

		setSpinner(true)
		//console.log('to true')
		axios.put(`/api/comanda/actualizar/comanda/${comanda}/${terminal}/${movimientoComanda}`, data, tokenOptions)
			.then(res => {
				// setSpinner(false)
				//console.log('toFalse')
				////console.log(res.data)
				reloadData()
			})
			.catch(err => {
				setSpinner(false)
				//console.log('toFalse')
			})
	}
	const sendPreparado = (producto, horaPasada, comanda, terminal, movimientoComanda) => {

		if (producto.preparado.hora !== undefined) return

		if (horaPasada === undefined) {
			return
		}

		let data = {
			"preparado": {
				"responsable": JSON.parse(localStorage.getItem(userData)).usuario
			}
		}

		setSpinner(true)
		//console.log('to true')
		axios.put(`/api/comanda/actualizar/comanda/${comanda}/${terminal}/${movimientoComanda}`, data, tokenOptions)
			.then(res => {
				// setSpinner(false)
				//console.log('toFalse')
				////console.log(res.data)
				reloadData()
			})
			.catch(err => {
				setSpinner(false)
				//console.log('toFalse')
			})
	}
	const sendEntregado = (producto, horaPasada, comanda, terminal, movimientoComanda) => {
		if (producto.entregado.hora !== undefined) return Promise.resolve();

		let data = {
			"entregado": {
				"responsable": JSON.parse(localStorage.getItem(userData)).usuario
			}
		};

		setSpinner(true);
		return axios.put(`/api/comanda/actualizar/comanda/${comanda}/${terminal}/${movimientoComanda}`, data, tokenOptions)
			.then(res => {
				reloadData();
			})
			.catch(err => {
				setSpinner(false);
			});
	};

	const openFilters = () => {
		setShowFilters(!showFilters)
	}

	const filterCentroConsumo = (item) => {
		if (filtroCentroDeConsumo === item) {
			setFiltroCentroDeConsumo('')
		} else {
			setFiltroCentroDeConsumo(item)
		}
	}

	const filterBarraAlimentos = (item) => {
		if (filtroBarraDeAlimentos === item) {
			setFiltroBarraDeAlimentos('')
		} else {
			setFiltroBarraDeAlimentos(item)
		}
	}

	// Función para aplicar los filtros y obtener las comandas filtradas
	useEffect(() => {

		//console.log('entrando aqui')

		// Copiar las comandas originales para trabajar con ellas
		let comandasFiltradasTemp = [...comandas];

		//console.log(comandasFiltradasTemp, 'el temp')

		// Aplicar filtro por centro de consumo
		if (filtroCentroDeConsumo) {
			comandasFiltradasTemp = comandasFiltradasTemp.filter(comanda => comanda.ccmo === filtroCentroDeConsumo);
		}

		// Aplicar filtro por barra de alimentos
		if (filtroBarraDeAlimentos) {
			comandasFiltradasTemp = comandasFiltradasTemp.map(comanda => {
				// Filtrar los elementos de "data" que coinciden con el filtro de "barraDeAlimentos"
				const newData = comanda.data.filter(item => item.terminal === filtroBarraDeAlimentos);
				return { ...comanda, data: newData };
			}).filter(comanda => comanda.data.length > 0); // Eliminar comandas que no tengan elementos en "data" después del filtrado
		}

		// Aplicar filtro de oculto
		comandasFiltradasTemp = comandasFiltradasTemp.map(comanda => {
			// Filtrar los elementos de "data" que coinciden con el filtro de "barraDeAlimentos"

			var newData


			if (filtroCancelados) {
				newData = comanda.data.filter(item => {
					return item.productos.find(producto => producto.cancelado === filtroCancelados)
				});
			} else {
				newData = comanda.data.filter(item => item.oculto === filtroOculto);
			}

			return { ...comanda, data: newData };
		}).filter(comanda => comanda.data.length > 0); // Eliminar comandas que no tengan elementos en "data" después del filtrado

		//console.log(comandasFiltradasTemp)

		// Establecer las comandas filtradas en el estado
		setComandasFiltradas(comandasFiltradasTemp);

	}, [comandas, filtroCentroDeConsumo, filtroBarraDeAlimentos, filtroOculto, filtroCancelados]);

	const ocultarComanda = (comanda, terminal) => {

		setSpinner(true)
		//console.log('to true')

		axios.put(`api/comanda/ocultar/comanda/${comanda._id}/${terminal.terminal}`)
			.then(res => {
				// setSpinner(false)
				//console.log('toFalse')
				////console.log(res.data)
				reloadData()
			})
			.catch(err => {
				setSpinner(false)
				//console.log('toFalse')
				////console.log(err)
			})
	}

	const checkIfTerminalFullTerminada = (datos) => {

		// CHECK IF YA OCULTO
		if (datos.oculto === true) return false

		const productos = datos.productos;
		// Iterar sobre el arreglo de productos
		for (let j = 0; j < productos.length; j++) {
			const producto = productos[j];


			// RETURN TRUE SI ESTA CANCELADO
			if (producto.cancelado === true) continue;


			// Verificar si alguna de las propiedades hora es undefined
			if (
				producto.ordenado.hora === undefined ||
				producto.cocinando.hora === undefined ||
				producto.preparado.hora === undefined ||
				producto.entregado.hora === undefined
			) {
				return false // Si al menos una hora es undefined, regresa false
			}
		}
		return true // Si todas las horas están definidas, regresa true
	}

	// CHECK IF NUEVA TERMINAL PARA HACER SONIDO
	useEffect(() => {
		// Función para verificar si al menos una comanda cumple con la condición
		const checkCondition = () => {
			for (let comanda of comandas) {
				for (let dataItem of comanda.data) {
					for (let producto of dataItem.productos) {
						// Verificar si "ordenado" tiene una hora definida
						const hasOrdenadoTime = producto.ordenado?.hora;
						// Verificar si los otros estados no tienen hora definida
						const noOtherTimesDefined =
							!producto.cocinando?.hora &&
							!producto.preparado?.hora &&
							!producto.entregado?.hora &&
							!producto.servido?.hora;

						// Si se cumple la condición, regresamos true
						if (hasOrdenadoTime && noOtherTimesDefined) {
							return true;
						}
					}
				}
			}
			return false; // Si ninguna comanda cumple con la condición, regresamos false
		};

		// Actualizar el estado según la verificación
		const result = checkCondition();

		if (result) {
			new Audio(sonidoUno).play()
		}
	}, [comandas]); // Se ejecuta cada vez que las comandas cambian

	// Cambia endAllCard a async y espera la penúltima petición antes de la última
	const endAllCard = async (terminal, paqueteExistente, item) => {
		console.log(paqueteExistente.movcmdpkt);
		console.log(terminal.productos);

		const productos = terminal.productos;
		for (let i = 0; i < productos.length; i++) {
			if (i === productos.length - 2) {
				// Espera a que la penúltima petición termine antes de continuar
				await sendEntregado(productos[i], productos[i].preparado.hora, item.comanda, terminal.terminal, productos[i].movcmd);
			} else if (i === productos.length - 1) {
				// Última petición, se ejecuta después de la penúltima
				await sendEntregado(productos[i], productos[i].preparado.hora, item.comanda, terminal.terminal, productos[i].movcmd);
			} else {
				// Las demás pueden ser "fire and forget"
				sendEntregado(productos[i], productos[i].preparado.hora, item.comanda, terminal.terminal, productos[i].movcmd);
			}
		}
	};

	return (
		<>

			{/* SONIDO */}
			{/* <audio className='sonido' src={sonidoUno}></audio> */}
			{/* SONIDO */}

			{/* FILTROS */}
			<div onClick={() => { openFilters() }} className='white bgc-gray-2 radius-super strong-shadow pointer' style={{ display: 'grid', placeContent: 'center', zIndex: '100', height: '46px', width: '46px', fontSize: '26px', position: 'fixed', bottom: '60px', right: '10px' }}>
				<i className="ri-sound-module-line"></i>
			</div>

			{transition((style, visible) =>
				visible ?
					<animated.div style={style}>
						<OutsideClickHandler
							onOutsideClick={() => {
								setShowFilters(false)
							}}
						>
							<div className='py-2 px-3 radius bgc-gray strong-shadow' style={{ width: '250px' }}>
								<p className='text-center'>Centro de consumo</p>
								<div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
									{
										centrosDeConsumo.map((centroConsumo, i) => {
											return (
												<div onClick={() => { filterCentroConsumo(centroConsumo) }} key={i} className={`${filtroCentroDeConsumo === centroConsumo ? 'border-blue' : ''} pointer bgc-white strong-shadow radius`} style={{ height: '48px', width: '48px', display: 'flex', justifyContent: 'center', alignItems: 'center', flexFlow: 'column', fontSize: '20px' }}>
													{
														centrosDeConsumoImagenes[i] !== undefined ?
															<img src={centrosDeConsumoImagenes[i]} alt="" style={{ width: '100%' }} />
															:
															<>
																<i className="ri-image-fill"></i>
																<p style={{ fontSize: '12px' }}>{centroConsumo}</p>
															</>
													}
												</div>
											)
										})
									}
								</div>
								{
									barrasDeAlimentos.length === 1 ? '' :
										<>
											<p className=' mt-2 text-center'>Barra de alimentos</p>
											<div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
												{
													barrasDeAlimentos.map((barraAlimentos, i) => {
														return (
															<div onClick={() => { filterBarraAlimentos(barraAlimentos) }} key={i} className={`${filtroBarraDeAlimentos === barraAlimentos ? 'border-blue' : ''} pointer bgc-white strong-shadow radius`} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', height: '48px', width: '48px' }}>
																{
																	barrasDeAlimentosImagenes[i] !== undefined ?
																		<img className='radius' src={barrasDeAlimentosImagenes[i]} alt="" style={{ width: '100%' }} />
																		:
																		<>
																			<i className="ri-image-fill"></i>
																			<p style={{ fontSize: '12px' }}>{barraAlimentos}</p>
																		</>
																}
															</div>
														)
													})
												}
											</div>
										</>
								}
								<p className=' mt-2 text-center'>Ocultos</p>
								<div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
									<div onClick={() => { setFiltroOculto(!filtroOculto); setFiltroCancelados(false) }} className={`${filtroOculto ? 'border-blue' : ''} color-gray-2 pointer bgc-white strong-shadow radius`} style={{ display: 'grid', placeContent: 'center', fontSize: '22px', height: '48px', width: '48px' }}>
										<i className="ri-eye-off-line"></i>
									</div>
								</div>
								<p className=' mt-2 text-center'>Cancelados</p>
								<div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
									<div onClick={() => { setFiltroCancelados(!filtroCancelados); setFiltroOculto(false) }} className={`${filtroCancelados ? 'border-blue' : ''} color-gray-2 pointer bgc-white strong-shadow radius`} style={{ display: 'grid', placeContent: 'center', fontSize: '22px', height: '48px', width: '48px' }}>
										<i className="ri-close-circle-fill"></i>
									</div>
								</div>
							</div>
						</OutsideClickHandler>
					</animated.div>
					: ''
			)}

			{/* FILTROS */}

			<Spinner show={spinner} />
			<div className="mt-2 px-3">
				<div style={{ display: 'flex', justifyContent: 'space-between' }}>
					<h3>{barrasDeAlimentos.length === 1 ? barrasDeAlimentos[0] : ''}</h3>
					{
						filtroBarraDeAlimentos === '' & filtroCentroDeConsumo === '' ? '' :
							<>
								<h4>Filtro: <b>{filtroCentroDeConsumo} {filtroBarraDeAlimentos !== '' && filtroCentroDeConsumo !== '' ? '-' : ''} {filtroBarraDeAlimentos}</b> </h4>
							</>
					}
				</div>
				<div style={{ display: 'flex', flexWrap: 'nowrap', gap: '16px', overflow: 'scroll' }}>
					{
						filtroOculto ? <h4 style={{ textAlign: 'right' }}>Viendo: <b>ocultos</b></h4> : ''
					}
					{
						filtroCancelados ? <h4 style={{ textAlign: 'right' }}>Viendo: <b>cancelados</b></h4> : ''
					}
					{
						comandasFiltradas?.map((item, i) => {

							if (item.tiposUnicosInfo === undefined) {
								return (
									<p>{item.comanda} no tiene tiposUnicos = {i}</p>
								)
							}

							return (
								item?.tiposUnicosInfo?.map((paqueteExistente, y) => {
									return (
										<Fragment key={i + y}>

											{
												item.data.map((terminal, t) => {
													if (terminal.productos.find(producto => producto.movcmdpkt === paqueteExistente.movcmdpkt)) {
														return (
															<div key={t + y + t} className={`radius strong-shadow mb-3`} style={{ border: '1px solid #c3c3c3', position: 'relative', fontSize: '12px', display: 'flex', flexDirection: 'column', maxWidth: '300px', minWidth: '150px', flex: '0 0 auto' }}>
																{
																	checkIfTerminalFullTerminada(terminal) ?
																		''
																		// ocultarComanda(item, terminal)
																		:
																		''
																	// <div onClick={() => ocultarComanda(item, terminal)} className='radius-super bgc-gray color-gray-2 strong-shadow pointer' style={{ position: 'absolute', right: '-16px', top: '-16px', fontSize: '16px', display: 'grid', placeContent: 'center', height: '32px', width: '32px' }}>
																	// 	<i className="ri-eye-off-line"></i>
																	// </div>
																	// :
																	// ''
																}
																{
																	paqueteExistente.movcmdpkt !== 0 ?
																		<div className='color-gray-2 py-2' style={{ backgroundColor: '#cad3e0', display: 'grid', placeContent: 'center' }}>
																			<h2 className='mb-0 bold'>{paqueteExistente.nompaquete}</h2>
																		</div>
																		: ''
																}
																<div style={{ borderBottomLeftRadius: '0px', borderBottomRightRadius: '0px',backgroundColor: getColorParaId(item.comanda) }} className='py-2 px-3 color-gray-2 radius white'>
																	<div style={{ display: 'flex', justifyContent: 'space-around', flexDirection: 'column' }}>
																		<div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between', alignItems: 'center', textAlign: 'center' }}>
																			<div style={{ display: 'flex', height: '100%', justifyContent: 'space-between', gap: '8px', flexDirection: 'column' }}>
																				<p >Comanda:{item.comanda}</p>
																			</div>
																			<div style={{ display: 'flex', height: '100%', justifyContent: 'space-between', gap: '8px', flexDirection: 'column' }}>
																				<p >Mesa:{item.mesa}</p>
																			</div>
																		</div>
																		<div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between', alignItems: 'center', textAlign: 'center' }}>
																			<div style={{ display: 'flex', height: '100%', justifyContent: 'space-between', gap: '8px', flexDirection: 'column' }}>
																				{
																					item.meseros.map((mesero, i) => {
																						return (
																							<div key={i + y + t} style={{ display: 'flex', height: '100%', justifyContent: 'space-between', alignItems: 'center', gap: '8px', flexDirection: 'column' }}>
																								<p >Mesero: {mesero.nombre}</p>
																							</div>
																						)
																					})
																				}
																			</div>
																			<div style={{ display: 'flex', height: '100%', justifyContent: 'space-between', gap: '8px', flexDirection: 'column' }}>
																				<p>Hora:{item.hora}</p>
																			</div>
																		</div>
																	</div>
																</div>
																<div className='radius' style={{ display: 'flex', flex: '1' }}>
																	<div>
																		<div style={{ display: 'flex', flexDirection: 'column', height: '100%' }} className=' nice-shadow p-2'>
																			<div style={{ flex: '1', overflow: 'overlay', display: 'flex', justifyContent: 'space-between', flexDirection: 'column' }}>
																				<div>
																					{
																						terminal.productos.map((producto, p) => {

																							if (parseInt(producto.movcmdpkt) === parseInt(paqueteExistente.movcmdpkt)) {

																								return (
																									<Fragment key={p + y + i}>
																										<div style={{ display: 'flex', gap: '8px', padding: '16px', marginTop: `${p === 0 ? '0px' : '8px'}` }} className={`${producto.cancelado === true ? 'color-red' : ''} radius bgc-gray`}>
																											{producto.movcmd}
																											<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
																												{
																													producto.imagen !== undefined && producto.imagen !== '' ?
																														<img src={producto.imagen} alt="prod" className='radius' style={{ height: '64px' }} />
																														:
																														<i style={{ fontSize: '20px' }} className="ri-image-fill"></i>
																												}
																											</div>
																											<div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
																												<p>{producto.producto}</p>
																												<p>
																													{
																														producto.modificador.map(mod => mod)
																													}
																													{
																														producto.preparacion.map(prep => prep)
																													}
																												</p>
																												<div className='' style={{ borderTopLeftRadius: '0px', borderTopRightRadius: '0px' }}>
																													<span>
																														<b>Notas:</b> {producto.observaciones}
																													</span>
																													<div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
																														{
																															producto.complementos.map((complemento, i) => {
																																return (
																																	<div key={y + i + p + t} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '16px' }}>
																																		<div className='radius' style={{ height: '50px', width: '50px' }}>
																																			<img className='radius' src={complemento.imagen} style={{ objectFit: 'cover', height: '100%', width: '100%' }} alt="" />
																																		</div>
																																		<p style={{}}>{complemento.producto} - Cantidad:{complemento.cantidad}</p>
																																	</div>
																																)
																															})
																														}
																													</div>
																												</div>
																											</div>
																											{
																												producto.cancelado === true ?
																													<Fragment key={i + y + p + t}>
																														<div style={{ flexGrow: '4', fontSize: '18px', fontWeight: 'bold' }}>
																															<p>Cancelado</p>
																														</div>
																													</Fragment>
																													:
																													<>
																														<div onClick={() => { sendEntregado(producto, producto.preparado.hora, item.comanda, terminal.terminal, producto.movcmd) }} style={{ display: 'flex', flexFlow: 'column', justifyContent: 'center', alignItems: 'center' }}>
																															<div className={`${producto.preparado.hora !== undefined ? 'pointer' : 'color-gray-2'} ${producto.entregado.hora !== undefined ? 'border-gray-2' : ''} radius-super strong-shadow`}
																																style={{
																																	backgroundColor: `${producto.preparado.hora !== undefined && producto.entregado.hora === undefined ? '#419E6A'/*<- verde*/ : '#E2E8F0'}`,
																																	display: 'grid', placeContent: 'center', height: '30px', width: '30px', maxWidth: '30px', maxHeight: '30px', minWidth: '30px', minHeight: '30px', fontSize: '16px'
																																}}>
																																<i style={{ transform: 'translateY(0px)' }} className="ri-check-line"></i>
																															</div>
																															<span style={{ fontSize: '10px' }}>{getFecha(producto.entregado)}</span>
																														</div>
																													</>
																											}
																										</div>

																									</Fragment>
																								)
																							} else {
																								return ("")
																							}

																						})
																					}
																				</div>
																				<button onClick={() => endAllCard(terminal, paqueteExistente, item)} className='py-2 mt-2' style={{ width: '100%' }}>
																					Comanda terminada
																				</button>
																			</div>
																		</div>
																	</div>
																</div>
															</div>
														)
													} else {
														return ('')
													}
												})
											}

										</Fragment>
									)
								})
							)
						})
					}
				</div>
			</div >
		</>
	);
}

export default Home;