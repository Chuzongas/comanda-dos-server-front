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

	// GET COMANDAS INICIALES
	useEffect(() => {

		//console.log(tokenOptions)

		setSpinner(true)


		axios.get('api/comanda/all/comandas', tokenOptions)
			.then(res => {

				for (let i = 0; i < res.data[0].data.length; i++) {

					var tiposUnicos = res.data[0].data[i].productos.reduce((acc, item) => {
						if (!acc.some(el => el.movcmdpkt === item.movcmdpkt)) {
							acc.push({ movcmdpkt: item.movcmdpkt, nompaquete: item.nompaquete });
						}
						return acc;
					}, []);

					res.data[0].tiposUnicosInfo = tiposUnicos
					console.log(tiposUnicos)
				}


				setSpinner(false)
				setComandas(res.data)
				console.log(res.data)
				setComandasFiltradas(res.data)
				getCentrosYBarras(res.data)
			})
			.then(err => {
				setSpinner(false)
				//console.log(err)
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

		axios.get('api/comanda/all/comandas', tokenOptions)
			.then(res => {

				for (let i = 0; i < res.data.length; i++) {

					const tiposUnicosOrdenados = [...new Set(res.data[i].data[0].productos.map(item => item.movcmdpkt))];
					const tiposUnicosOrdenadosNombres = [...new Set(res.data[i].data[0].productos.map(item => item.nompaquete))];
					res.data[i].paquetesExistentes = tiposUnicosOrdenados
					res.data[i].paquetesExistentesNombres = tiposUnicosOrdenadosNombres
				}



				setSpinner(false)
				setComandas(res.data)
				console.log(res.data)
				setComandasFiltradas(res.data)
			})
			.then(err => {
				setSpinner(false)
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
		axios.put(`/api/comanda/actualizar/comanda/${comanda}/${terminal}/${movimientoComanda}`, data, tokenOptions)
			.then(res => {
				setSpinner(false)
				//console.log(res.data)
				reloadData()
			})
			.catch(err => {
				setSpinner(false)
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
		axios.put(`/api/comanda/actualizar/comanda/${comanda}/${terminal}/${movimientoComanda}`, data, tokenOptions)
			.then(res => {
				setSpinner(false)
				//console.log(res.data)
				reloadData()
			})
			.catch(err => {
				setSpinner(false)
			})
	}
	const sendEntregado = (producto, horaPasada, comanda, terminal, movimientoComanda) => {

		if (producto.entregado.hora !== undefined) return

		if (horaPasada === undefined) {
			return
		}

		let data = {
			"entregado": {
				"responsable": JSON.parse(localStorage.getItem(userData)).usuario
			}
		}

		setSpinner(true)
		axios.put(`/api/comanda/actualizar/comanda/${comanda}/${terminal}/${movimientoComanda}`, data, tokenOptions)
			.then(res => {
				setSpinner(false)
				//console.log(res.data)
				reloadData()
			})
			.catch(err => {
				setSpinner(false)
			})
	}

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
		// Copiar las comandas originales para trabajar con ellas
		let comandasFiltradasTemp = [...comandas];

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

		// Establecer las comandas filtradas en el estado
		setComandasFiltradas(comandasFiltradasTemp);

	}, [comandas, filtroCentroDeConsumo, filtroBarraDeAlimentos, filtroOculto, filtroCancelados]);

	const ocultarComanda = (comanda, terminal) => {

		setSpinner(true)

		axios.put(`api/comanda/ocultar/comanda/${comanda._id}/${terminal.terminal}`)
			.then(res => {
				setSpinner(false)
				//console.log(res.data)
				reloadData()
			})
			.catch(err => {
				setSpinner(false)
				//console.log(err)
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
			<div className="container mt-2">
				<div style={{ display: 'flex', justifyContent: 'space-between' }}>
					<h3>{barrasDeAlimentos.length === 1 ? barrasDeAlimentos[0] : ''}</h3>
					{
						filtroBarraDeAlimentos === '' & filtroCentroDeConsumo === '' ? '' :
							<>
								<h4>Filtro: <b>{filtroCentroDeConsumo} {filtroBarraDeAlimentos !== '' && filtroCentroDeConsumo !== '' ? '-' : ''} {filtroBarraDeAlimentos}</b> </h4>
							</>
					}
				</div>
				{
					filtroOculto ? <h4 style={{ textAlign: 'right' }}>Viendo: <b>ocultos</b></h4> : ''
				}
				{
					filtroCancelados ? <h4 style={{ textAlign: 'right' }}>Viendo: <b>cancelados</b></h4> : ''
				}
				{
					comandasFiltradas.map((item, i) => {
						return (
							item.tiposUnicosInfo.map((paqueteExistente, y) => {
								return (
									<Fragment key={i + y}>

										{
											item.data.map((terminal, t) => {
												if (terminal.productos.find(producto => producto.movcmdpkt === paqueteExistente.movcmdpkt)) {
													return (
														<div key={t + y + t} className='radius strong-shadow bgc-gray-light mb-3 border-gray-2' style={{ position: 'relative' }}>
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
															<div style={{ borderBottomLeftRadius: '0px', borderBottomRightRadius: '0px' }} className='py-2 px-3 color-gray-2 radius bgc-gray'>
																<div style={{ display: 'flex', justifyContent: 'space-around' }}>
																	<div style={{ display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
																		<div style={{ display: 'flex', height: '100%', justifyContent: 'space-between', gap: '8px', flexDirection: 'column' }}>
																			<img style={{ height: '32px' }} src={comanda} alt="" />
																			<p className='bold'>{item.comanda}</p>
																		</div>
																		<div style={{ display: 'flex', height: '100%', justifyContent: 'space-between', gap: '8px', flexDirection: 'column' }}>
																			<img style={{ height: '32px' }} src={mesa} alt="" />
																			<p className='bold'>{item.mesa}</p>
																		</div>
																		<div style={{ display: 'flex', height: '100%', justifyContent: 'space-between', gap: '8px', flexDirection: 'column' }}>
																			<i style={{ fontSize: '28px' }} className="ri-user-3-fill"></i>
																			<p className='bold'>{item.cantidadComensales}</p>
																		</div>
																	</div>
																	<div style={{ display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
																		{
																			item.meseros.map((mesero, i) => {
																				return (
																					<div key={i + y + t} style={{ display: 'flex', height: '100%', justifyContent: 'space-between', alignItems: 'center', gap: '8px', flexDirection: 'column' }}>
																						<div className={`radius ${mesero.imagen === '' || mesero.imagen === undefined ? '' : 'elevation-shadow'}`} style={{ height: '50px', width: '50px', overflow: 'hidden' }}>
																							{
																								mesero.imagen === '' || mesero.imagen === undefined ?
																									<div className='color-gray-2' style={{ fontSize: '24px', height: '100%', width: '100%', display: 'grid', placeContent: 'center' }}>
																										<i style={{ fontSize: '24px' }} className="ri-image-fill"></i>
																									</div>
																									:
																									<img style={{ objectFit: 'cover', objectPosition: 'center', height: '100%', width: '100%' }} src={mesero.imagen} alt="" />
																							}
																						</div>
																						<p className='bold'>{mesero.nombre}</p>
																					</div>
																				)
																			})
																		}
																	</div>
																	<div style={{ display: 'grid', placeContent: 'center' }}>
																		<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px' }}>
																			{
																				item.imagen !== undefined ?
																					<div className='radius elevation-shadow' style={{ overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center', flexFlow: 'column' }}>
																						<img src={item.imagen} alt="logo" style={{ height: '48px' }} />
																						{/* <p>{item.ccmo}</p> */}
																					</div>
																					:
																					<div className='radius' style={{ overflow: 'hidden', display: 'flex', placeContent: "center", flexFlow: 'column', alignItems: 'center' }}>
																						<i style={{ fontSize: '24px' }} className="ri-image-fill"></i>
																						{item.ccmo}
																					</div>
																			}

																			{
																				JSON.parse(localStorage.getItem("userData"))["terminales"].length === 0 ?


																					terminal.imagen !== undefined && terminal.imagen !== "" ?
																						<div className='radius elevation-shadow' style={{ overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center', flexFlow: 'column' }}>
																							<img src={terminal.imagen} alt="logo" style={{ height: '48px' }} />
																							{/* <p>{terminal.terminal}</p> */}
																						</div>
																						:
																						<div className='radius' style={{ overflow: 'hidden', display: 'flex', placeContent: "center", flexFlow: 'column', alignItems: 'center' }}>
																							<i style={{ fontSize: '24px' }} className="ri-image-fill"></i>
																							<p>{terminal.terminal}</p>
																						</div>
																					: ''



																			}
																		</div>



																	</div>
																	<div style={{ display: 'flex', gap: '24px', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
																		<p><b>Fecha:</b><br />{item.fecha}</p>
																		<p><b>Hora:</b><br />{item.hora}</p>
																	</div>
																</div>
															</div>
															<hr className='m-0' style={{ backgroundColor: '#999999' }} />
															<div className='radius'>
																<div>
																	<div style={{ display: 'flex', flexDirection: 'column', height: '100%' }} className='my-tabla nice-shadow p-1'>
																		<div className='my-tabla-header'>
																			<div>
																				<p></p>
																			</div>
																			<div>
																				<p>Tiempo</p>
																			</div>
																			<div>
																				<p>Comensal</p>
																			</div>
																			<div>
																				<p>Cantidad</p>
																			</div>
																			<div>
																				<p>Producto</p>
																			</div>
																			<div>
																				<p>Modificador <br /> Preparación</p>
																			</div>
																			{/* <div>
																	<p>Ordenado</p>
																</div> */}
																			<div>
																				<p>Cocinando</p>
																			</div>
																			<div>
																				<p>Preparado</p>
																			</div>
																			<div>
																				<p>Entregado</p>
																			</div>
																		</div>
																		<div style={{ flex: '1', overflow: 'overlay' }} className='my-tabla-body'>
																			{
																				terminal.productos.map((producto, p) => {

																					if (parseInt(producto.movcmdpkt) === parseInt(paqueteExistente.movcmdpkt)) {

																						return (
																							<Fragment key={p + y + i}>
																								<div className={`my-tabla-row ${producto.cancelado === true ? 'color-red' : ''}`}>
																									<div>
																										{
																											producto.imagen !== undefined && producto.imagen !== '' ?
																												<img src={producto.imagen} alt="prod" className='radius' style={{ height: '64px' }} />
																												:
																												<i style={{ fontSize: '20px' }} className="ri-image-fill"></i>
																										}
																									</div>
																									<div>
																										<p>{producto?.tiempo.toString() === '5' ? 'Para llevar' : producto?.tiempo}</p>
																									</div>
																									<div>
																										<p>{producto.comensal}</p>
																									</div>
																									<div>
																										<p>{producto.cantidad}</p>
																									</div>
																									{/* <div>
																									<p>{producto.movcmdpkt} paq</p>
																								</div> */}
																									<div>
																										<p>{producto.producto}</p>
																									</div>
																									<div>
																										{
																											producto.modificador.map(mod => {
																												return (
																													<>
																														<p>{mod}</p>
																													</>
																												)
																											})
																										}
																										{
																											producto.preparacion.map(prep => {
																												return (
																													<>
																														<p>{prep}</p>
																													</>
																												)
																											})
																										}
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
																												{/* <div style={{ display: 'flex', flexFlow: 'column', justifyContent: 'center', alignItems: 'center' }}>
																									<div className='radius-super white strong-shadow' style={{ backgroundColor: '#E2E8F0', display: 'grid', placeContent: 'center', height: '30px', width: '30px', maxWidth: '30px', maxHeight: '30px', minWidth: '30px', minHeight: '30px', fontSize: '14px' }}>
																										<img style={{ width: '15px' }} src={Ordenado} alt="" />
																									</div>
																									<span style={{ fontSize: '10px' }}>{getFecha(producto.ordenado)}</span>
																								</div> */}
																												<div onClick={() => { sendCocinando(producto, producto.ordenado.hora, item.comanda, terminal.terminal, producto.movcmd) }} style={{ display: 'flex', flexFlow: 'column', justifyContent: 'center', alignItems: 'center' }}>
																													<div className={`
																										${producto.cocinando.hora === undefined ? 'pointer' : ''} 
																										${producto.preparado.hora === undefined && producto.cocinando.hora !== undefined ? 'border-gray-2' : ''}
																										radius-super white strong-shadow`} style={{ background: `${producto.cocinando.hora !== undefined ? '#E2E8F0' : '#A5E1BF'}`, display: 'grid', placeContent: 'center', height: '30px', width: '30px', maxWidth: '30px', maxHeight: '30px', minWidth: '30px', minHeight: '30px', fontSize: '14px' }}>
																														<img style={{ width: '15px' }} src={Cocinando} alt="" />
																														{/* <i className="ri-restaurant-2-fill"></i> */}
																													</div>
																													<span style={{ fontSize: '10px' }}>{getFecha(producto.cocinando)}</span>
																												</div>
																												<div onClick={() => { sendPreparado(producto, producto.cocinando.hora, item.comanda, terminal.terminal, producto.movcmd) }} style={{ display: 'flex', flexFlow: 'column', justifyContent: 'center', alignItems: 'center' }}>
																													<div className={` 
																										${producto.cocinando.hora !== undefined && producto.entregado.hora === undefined && producto.preparado.hora === undefined ? 'white pointer' : 'color-gray-2'} 
																										${producto.entregado.hora === undefined && producto.preparado.hora !== undefined ? 'border-gray-2' : ''}
																										radius-super strong-shadow`}
																														style={{
																															backgroundColor: `${producto.cocinando.hora !== undefined && producto.entregado.hora === undefined && producto.preparado.hora === undefined ? '#97B544' : '#E2E8F0'}`,
																															display: 'grid', placeContent: 'center', height: '30px', width: '30px', maxWidth: '30px', maxHeight: '30px', minWidth: '30px', minHeight: '30px', fontSize: '14px'
																														}}>
																														<i className="ri-alarm-warning-fill"></i>
																													</div>
																													<span style={{ fontSize: '10px' }}>{getFecha(producto.preparado)}</span>
																												</div>
																												<div onClick={() => { sendEntregado(producto, producto.preparado.hora, item.comanda, terminal.terminal, producto.movcmd) }} style={{ display: 'flex', flexFlow: 'column', justifyContent: 'center', alignItems: 'center' }}>
																													<div className={`
																										${producto.preparado.hora !== undefined ? 'pointer' : 'color-gray-2'} 
																										${producto.entregado.hora !== undefined ? 'border-gray-2' : ''}
																										radius-super strong-shadow`}
																														style={{
																															backgroundColor: `${producto.preparado.hora !== undefined && producto.entregado.hora === undefined ? '#419E6A'/*<- verde*/ : '#E2E8F0'}`,
																															display: 'grid', placeContent: 'center', height: '30px', width: '30px', maxWidth: '30px', maxHeight: '30px', minWidth: '30px', minHeight: '30px', fontSize: '16px'
																														}}>
																														<i style={{ transform: 'translateY(0px)' }} className="ri-check-line"></i>
																													</div>
																													<span style={{ fontSize: '10px' }}>{getFecha(producto.entregado)}</span>
																												</div>
																												{/* <div style={{ display: 'flex', flexFlow: 'column', justifyContent: 'center', alignItems: 'center' }}>
																									<div className={` ${producto.preparado.hora === undefined ? '' : ''} radius-super strong-shadow white`} style={{ backgroundColor: `${producto.preparado.hora !== undefined ? '#419E6A' : '#E2E8F0'}`, display: 'grid', placeContent: 'center', height: '30px', width: '30px', maxWidth: '30px', maxHeight: '30px', minWidth: '30px', minHeight: '30px', fontSize: '14px' }}>
																										{
																											producto.preparado.hora !== undefined ?
																												<img style={{ width: '15px' }} src={EntregadoPrendido} alt="" />
																												:
																												<img style={{ width: '15px' }} src={Entregado} alt="" />
																										}
																									</div>
																									<span style={{ fontSize: '10px' }}>{getFecha(producto.entregado)}</span>
																								</div> */}
																											</>
																									}
																								</div>
																								<div className='notas bgc-gray radius' style={{ borderTopLeftRadius: '0px', borderTopRightRadius: '0px' }}>
																									<span style={{ transform: 'translateX(100px)' }}>
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
																							</Fragment>
																						)
																					} else {
																						return ("")
																					}

																				})
																			}
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
			</div >
		</>
	);
}

export default Home;