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

const Home = ({ tokenOptions, reload }) => {

	// MAIN DATA
	const [comandas, setComandas] = useState([])
	const [comandasFiltradas, setComandasFiltradas] = useState([])
	const [centrosDeConsumo, setCentrosDeConsumo] = useState([])
	const [barrasDeAlimentos, setBarrasDeAlimentos] = useState([])

	const [filtroCentroDeConsumo, setFiltroCentroDeConsumo] = useState('')
	const [filtroBarraDeAlimentos, setFiltroBarraDeAlimentos] = useState('')


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

		console.log(tokenOptions)

		setSpinner(true)


		axios.get('api/comanda/all/comandas', tokenOptions)
			.then(res => {
				setSpinner(false)
				setComandas(res.data)
				setComandasFiltradas(res.data)
				getCentrosYBarras(res.data)
			})
			.then(err => {
				setSpinner(false)
				console.log(err)
			})

	}, [tokenOptions, reload])

	const getCentrosYBarras = (data) => {
		let centrosDeConsumo = [];
		let barrasDeAlimentos = [];

		data.forEach((pedido) => {
			pedido.data.forEach((terminalData) => {
				// Verificar si la terminal ya está en barrasDeAlimentos
				if (!barrasDeAlimentos.includes(terminalData.terminal)) {
					barrasDeAlimentos.push(terminalData.terminal);
				}
			});

			// Verificar si el ccmo ya está en centrosDeConsumo
			if (!centrosDeConsumo.includes(pedido.ccmo)) {
				centrosDeConsumo.push(pedido.ccmo);
			}
		});

		setCentrosDeConsumo(centrosDeConsumo)
		setBarrasDeAlimentos(barrasDeAlimentos)
	};


	const reloadData = () => {

		setSpinner(true)

		axios.get('api/comanda/all/comandas', tokenOptions)
			.then(res => {
				setSpinner(false)
				setComandas(res.data)
				setComandasFiltradas(res.data)
			})
			.then(err => {
				setSpinner(false)
				console.log(err)
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
				console.log(res.data)
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
				console.log(res.data)
				reloadData()
			})
			.catch(err => {
				setSpinner(false)
			})
	}
	const sendEntregado = (producto, horaPasada, comanda, terminal, movimientoComanda) => {


		return

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
				console.log(res.data)
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

		// Establecer las comandas filtradas en el estado
		setComandasFiltradas(comandasFiltradasTemp);

	}, [comandas, filtroCentroDeConsumo, filtroBarraDeAlimentos]);

	const ocultarComanda = (id) => {

		setSpinner(true)

		axios.put(`api/comanda/ocultar/comanda/:id`)
			.then(res => {
				setSpinner(false)
				console.log(res.data)
			})
			.catch(err => {
				setSpinner(false)
				console.log(err)
			})
	}

	return (
		<>

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
							<div className='py-2 px-3 radius bgc-gray strong-shadow' style={{ width: '300px' }}>
								<h3 className='text-center'>Centro <br /> de consumo</h3>
								<div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
									{
										centrosDeConsumo.map((centroConsumo, i) => {
											return (
												<div onClick={() => { filterCentroConsumo(centroConsumo) }} key={i} className={`${filtroCentroDeConsumo === centroConsumo ? 'border-blue' : ''} pointer bgc-white strong-shadow radius`} style={{ height: '48px', width: '48px' }}>
													{centroConsumo}
												</div>
											)
										})
									}
								</div>
								{
									barrasDeAlimentos.length === 1 ? '' :
										<>
											<h3 className=' mt-2 text-center'>Barra de <br /> alimentos</h3>
											<div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
												{
													barrasDeAlimentos.map((barraAlimentos, i) => {
														return (
															<div onClick={() => { filterBarraAlimentos(barraAlimentos) }} key={i} className={`${filtroBarraDeAlimentos === barraAlimentos ? 'border-blue' : ''} pointer bgc-white strong-shadow radius`} style={{ height: '48px', width: '48px' }}>
																{barraAlimentos}
															</div>
														)
													})
												}
											</div>
										</>
								}
							</div>
						</OutsideClickHandler>
					</animated.div>
					: ''
			)}

			{/* FILTROS */}

			<Spinner show={spinner} />
			<div className="container mt-2">
				<div style={{ display: 'flex', justifyContent: 'space-between' }}>
					<h3>{barrasDeAlimentos.length === 1 ? barrasDeAlimentos[0] : 'Monitor de comandas'}</h3>
					{
						filtroBarraDeAlimentos === '' & filtroCentroDeConsumo === '' ? '' :
							<>
								<h4>Filtro: {filtroCentroDeConsumo} {filtroBarraDeAlimentos !== '' && filtroCentroDeConsumo !== '' ? '-' : ''} {filtroBarraDeAlimentos} </h4>
							</>
					}
				</div>
				{
					comandasFiltradas.map((item, i) => {
						return (
							<Fragment key={i}>

								{
									item.data.map((terminal, t) => {
										return (
											<div key={t} className='radius cool-shadow bgc-gray-light mb-3' style={{ border: `2px solid ${VARS_EMPRESAS['RAPPI'].COLOR}` }}>
												<div style={{ borderBottomLeftRadius: '0px', borderBottomRightRadius: '0px' }} className='py-2 px-3 color-gray-2 radius bgc-gray'>
													<div style={{ display: 'flex', justifyContent: 'space-between' }}>
														<div style={{ display: 'flex', gap: '30px', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
															<p><b>Comanda:</b><br />{item.comanda}</p>
															<p><b>Mesa:</b><br />{item.mesa}</p>
														</div>
														<div style={{ display: 'grid', placeContent: 'center' }}>
															<img src={VARS_EMPRESAS['RAPPI'].LOGO} alt="logo" style={{ height: '32px' }} />
														</div>
														<div style={{ display: 'flex', gap: '30px', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
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
																	<p>Cantidad</p>
																</div>
																<div>
																	<p>Producto</p>
																</div>
																<div>
																	<p>Guarnición</p>
																</div>
																<div>
																	<p>Ordenado</p>
																</div>
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
																		return (
																			<Fragment key={p}>
																				<div className={`my-tabla-row ${producto.cancelado === true ? 'color-red' : ''}`}>
																					<div>
																						<img src={img} alt="imagen" className='radius' style={{ height: '32px' }} />
																					</div>
																					<div>
																						<p>{producto.tiempo}</p>
																					</div>
																					<div>
																						<p>{producto.cantidad}</p>
																					</div>
																					<div>
																						<p>{producto.producto}</p>
																					</div>
																					<div>
																						<p>{producto.prepguar}</p>
																					</div>
																					{
																						producto.cancelado === true ?
																							<Fragment key={i}>
																								<div style={{ flexGrow: '4', fontSize: '18px', fontWeight: 'bold' }}>
																									<p>Cancelado</p>
																								</div>
																							</Fragment>
																							:
																							<>
																								<div style={{ display: 'flex', flexFlow: 'column', justifyContent: 'center', alignItems: 'center' }}>
																									<div className='radius-super white strong-shadow' style={{ backgroundColor: '#E2E8F0', display: 'grid', placeContent: 'center', height: '30px', width: '30px', fontSize: '14px' }}>
																										<img style={{ width: '15px' }} src={Ordenado} alt="" />
																										{/* <i className="ri-draft-fill"></i> */}
																									</div>
																									<span style={{ fontSize: '10px' }}>{getFecha(producto.ordenado)}</span>
																								</div>
																								<div onClick={() => { sendCocinando(producto, producto.ordenado.hora, item.comanda, terminal.terminal, producto.movcmd) }} style={{ display: 'flex', flexFlow: 'column', justifyContent: 'center', alignItems: 'center' }}>
																									<div className={`${producto.cocinando.hora === undefined ? 'pointer' : ''} radius-super white strong-shadow`} style={{ background: `${producto.cocinando.hora !== undefined ? '#E2E8F0' : '#A5E1BF'}`, display: 'grid', placeContent: 'center', height: '30px', width: '30px', fontSize: '14px' }}>
																										<img style={{ width: '15px' }} src={Cocinando} alt="" />
																										{/* <i className="ri-restaurant-2-fill"></i> */}
																									</div>
																									<span style={{ fontSize: '10px' }}>{getFecha(producto.cocinando)}</span>
																								</div>
																								<div onClick={() => { sendPreparado(producto, producto.cocinando.hora, item.comanda, terminal.terminal, producto.movcmd) }} style={{ display: 'flex', flexFlow: 'column', justifyContent: 'center', alignItems: 'center' }}>
																									<div className={` ${producto.cocinando.hora !== undefined && producto.entregado.hora === undefined && producto.preparado.hora === undefined ? 'white pointer' : 'color-gray-2'} radius-super strong-shadow`} style={{ backgroundColor: `${producto.cocinando.hora !== undefined && producto.entregado.hora === undefined && producto.preparado.hora === undefined ? '#97B544' : '#E2E8F0'}`, display: 'grid', placeContent: 'center', height: '30px', width: '30px', fontSize: '14px' }}>
																										<i className="ri-alarm-warning-fill"></i>
																									</div>
																									<span style={{ fontSize: '10px' }}>{getFecha(producto.preparado)}</span>
																								</div>
																								<div style={{ display: 'flex', flexFlow: 'column', justifyContent: 'center', alignItems: 'center' }}>
																									<div className={` ${producto.preparado.hora === undefined ? '' : ''} radius-super strong-shadow white`} style={{ backgroundColor: `${producto.preparado.hora !== undefined ? '#419E6A' : '#E2E8F0'}`, display: 'grid', placeContent: 'center', height: '30px', width: '30px', fontSize: '14px' }}>
																										{
																											producto.preparado.hora !== undefined ?
																												<img style={{ width: '15px' }} src={EntregadoPrendido} alt="" />
																												:
																												<img style={{ width: '15px' }} src={Entregado} alt="" />
																										}
																										{/* <i className="ri-check-fill"></i> */}
																									</div>
																									<span style={{ fontSize: '10px' }}>{getFecha(producto.entregado)}</span>
																								</div>
																							</>
																					}
																				</div>
																				<div className='notas bgc-gray radius' style={{ borderTopLeftRadius: '0px', borderTopRightRadius: '0px' }}>
																					<span style={{ transform: 'translateX(100px)' }}>
																						<b>Notas:</b> {producto.observaciones}
																					</span>
																				</div>
																			</Fragment>
																		)
																	})
																}
															</div>
														</div>
													</div>
												</div>
											</div>
										)
									})
								}

							</Fragment>

						)
					})
				}
			</div >
		</>
	);
}

export default Home;