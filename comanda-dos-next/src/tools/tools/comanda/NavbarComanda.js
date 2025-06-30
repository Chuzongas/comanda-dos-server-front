import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { animated, useTransition } from 'react-spring';
// import Menu from './menu/Menu'

// import axios from 'axios'
import Logo from '../../svg/Logo'
import { comensalKey, tiempoKey } from '../../helpers/comanda/DataOfUser';

const Navbar = ({ tokenOptions, lugarEstanciaAbrirMesa, inputFilter, setInputFilter, maxComensales, setSelectedComensalForOrdenar, setSelectedTiempoForOrdenar, selectedComensal }) => {

	//HISTORY
	var navigate = useNavigate()
	let location = useLocation()

	// MAIN DATA
	const [showMenu, setShowMenu] = useState(false);
	// const [menu, setMenu] = useState();

	// const [axiosIcons, setAxiosIcons] = useState([]);



	// useEffect(() => {
	// 	if (tokenOptions !== undefined) {

	// 		let letTokenOptions = tokenOptions

	// 		getMenuData(letTokenOptions)
	// 		getIcons(letTokenOptions)
	// 	}
	// }, [tokenOptions])

	// const getMenuData = (letTokenOptions) => {


	// 	axios.get(`/api/menu/get`, letTokenOptions)
	// 		.then(res => {
	// 			console.log(res.data);
	// 			setMenu(res.data.message[0])
	// 		})
	// 		.catch(err => {
	// 			console.log(err.response)
	// 		})
	// }
	// const getIcons = (letTokenOptions) => {

	// 	axios.get('/api/icono', letTokenOptions)
	// 		.then(res => {
	// 			setAxiosIcons(res.data.message)
	// 		})
	// 		.catch(err => {
	// 			console.log(err)
	// 		})
	// }

	const goTo = (where) => {
		navigate(`/comanda/${where}`, { replace: false })
	}

	// SPRING
	const transition = useTransition(true, {
		from: { opacity: 0, position: 'relative', zIndex: '500' },
		enter: { opacity: 1, position: 'relative', zIndex: '500' },
		leave: { opacity: 0, position: 'relative', zIndex: '500' },
	})
	// ENTER GRAY BACKGROUND ANIMATION
	const transitionGrayAnimation = useTransition(showMenu, {
		from: { opacity: 0, position: 'fixed', top: '0px', left: '0px', pointerEvents: 'none' },
		enter: { opacity: 1, position: 'fixed', top: '0px', left: '0px', pointerEvents: 'all' },
		leave: { opacity: 0, position: 'fixed', top: '0px', left: '0px', pointerEvents: 'none' },
	})

	const fullscreen = () => {
		var elem = document.documentElement;

		if (!document.fullscreenElement && !document.mozFullScreenElement &&
			!document.webkitFullscreenElement && !document.msFullscreenElement) {
			if (elem.requestFullscreen) {
				elem.requestFullscreen();
			} else if (elem.msRequestFullscreen) {
				elem.msRequestFullscreen();
			} else if (elem.mozRequestFullScreen) {
				elem.mozRequestFullScreen();
			} else if (elem.webkitRequestFullscreen) {
				elem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
			}
		} else {
			if (document.exitFullscreen) {
				document.exitFullscreen();
			} else if (document.msExitFullscreen) {
				document.msExitFullscreen();
			} else if (document.mozCancelFullScreen) {
				document.mozCancelFullScreen();
			} else if (document.webkitExitFullscreen) {
				document.webkitExitFullscreen();
			}
		}
	}

	return (
		<>
			{
				transition((style, visible) =>
					visible ?
						<animated.div style={style}>
							<div className='cool-shadow'>
								<div className="container">
									<nav style={{ height: '75px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
										{/* MANU GRAY BACKGROUND */}
										{
											transitionGrayAnimation((style, visible) => visible ? <animated.div style={style}><div className='bgc-gray-opacity' onClick={() => setShowMenu(false)} style={{ height: '100vh', width: '100vw', position: 'fixed', top: '0px', left: '0px' }} /></animated.div> : '')
										}
										{/* MANU GRAY BACKGROUND */}
										{/* <div style={{ position: 'relative' }}>
											<i onClick={() => setShowMenu(!showMenu)} style={{ fontSize: '32px' }} className="ri-menu-fill color-gray-2 pointer"></i>
											<Menu
												axiosIcons={axiosIcons}
												show={showMenu}
												setShowMenu={setShowMenu}
												menuData={menu}
											/>
										</div> */}
										<Logo onClick={() => goTo('mapamesas')} style={{ height: '60px' }} />
										{/* <div style={{ display: 'flex' }}>
											<div className="border-gray radius-small" style={{ height: '36px', display: 'grid', placeContent: 'center', padding: '0px 10px', borderRight: '10px', borderTopRightRadius: '0px', borderBottomRightRadius: '0px' }}>
												<i style={{ fontSize: '24px' }} className="ri-search-line"></i>
											</div>
											<input onChange={(e) => setInputFilter(e.target.value)} value={inputFilter} type="text" style={{ width: '100%', borderTopLeftRadius: '0px', borderBottomLeftRadius: '0px' }} className="normal-input bgc-gray-light border-gray radius-small" />
										</div> */}
										{
											location.pathname.includes('ordenar') ?
												<NavbarOrdenarRightSection
													maxComensales={maxComensales}
													setSelectedComensalForOrdenar={setSelectedComensalForOrdenar}
													setSelectedTiempoForOrdenar={setSelectedTiempoForOrdenar}
													selectedComensal={selectedComensal}
												/>
												:
												<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
													<div style={{ display: 'flex', aligntItems: "center" }} className='pointer' onClick={() => goTo(`nuevamesa?estancia=${lugarEstanciaAbrirMesa}`)} >
														<span style={{ alignSelf: "center" }}>Abrir mesa</span>
														<div className="bgc-green radius-super" style={{ height: '32px', width: '32px', display: 'grid', placeContent: 'center', marginLeft: '8px' }}>
															<i style={{ fontSize: '24px' }} className="ri-add-line pointer white"></i>
														</div>
													</div>
													<div onClick={fullscreen} className='radius color-gray-2 pointer' style={{ marginLeft: '24px', fontSize: '28px', width: '48px', height: '48px', display: 'grid', placeContent: 'center' }}>
														<i className="ri-fullscreen-fill color-gray-2"></i>
													</div>
												</div>
										}

									</nav>
								</div>
							</div>
						</animated.div >
						: ''
				)
			}
		</>
	);
}

const NavbarOrdenarRightSection = ({ maxComensales, setSelectedComensalForOrdenar, setSelectedTiempoForOrdenar, selectedComensal }) => {

	const [comensal, setComensal] = useState(selectedComensal);
	const [tiempo, setTiempo] = useState(1);

	useEffect(() => {

		localStorage.setItem(comensalKey, comensal)
		localStorage.setItem(tiempoKey, tiempo)

	}, [comensal, tiempo])

	const changeComensal = (operation) => {
		if (operation === true) {
			if (comensal <= maxComensales - 1 && comensal >= 1) {
				setComensal(comensal + 1)
				setSelectedComensalForOrdenar(comensal + 1)
			}
		} else {
			if (comensal >= 2 && comensal <= maxComensales) {
				setComensal(comensal - 1)
				setSelectedComensalForOrdenar(comensal - 1)
			}
		}

	}

	const changeTiempo = (operation) => {
		if (operation === true) {
			if (tiempo <= 2 && tiempo >= 1) {
				setTiempo(tiempo + 1)
				setSelectedTiempoForOrdenar(tiempo + 1)
			}
		} else {
			if (tiempo >= 2 && tiempo <= 3) {
				setTiempo(tiempo - 1)
				setSelectedTiempoForOrdenar(tiempo - 1)
			}
		}

	}

	return (
		<>
			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
				<div className="cool-shadow bgc-white radius" style={{ display: 'flex', gap: '12px', padding: '12px', alignItems: 'center' }}>
					<i className="color-gray-2 ri-user-fill" style={{ fontSize: '24px' }}></i>
					<span>Comensal</span>
					<div className='cool-shadow radius-super pointer' onClick={() => changeComensal(false)} style={{ height: '40px', width: '40px', display: 'grid', placeContent: "center" }}>
						<i className="color-gray-2 ri-arrow-left-s-line" style={{ fontSize: '24px' }}></i>
					</div>
					{comensal}
					<div className='cool-shadow radius-super pointer' onClick={() => changeComensal(true)} style={{ height: '40px', width: '40px', display: 'grid', placeContent: "center" }}>
						<i className="color-gray-2 ri-arrow-right-s-line" style={{ fontSize: '24px' }}></i>
					</div>
				</div>
				<div className="cool-shadow bgc-white radius" style={{ display: 'flex', gap: '12px', padding: '12px', alignItems: 'center' }}>
					<i className="color-gray-2 ri-time-line" style={{ fontSize: '24px' }}></i>
					<span>Tiempo</span>
					<div className='cool-shadow radius-super pointer' onClick={() => changeTiempo(false)} style={{ height: '40px', width: '40px', display: 'grid', placeContent: "center" }}>
						<i className="color-gray-2 ri-arrow-left-s-line" style={{ fontSize: '24px' }}></i>
					</div>
					{tiempo}
					<div className='cool-shadow radius-super pointer' onClick={() => changeTiempo(true)} style={{ height: '40px', width: '40px', display: 'grid', placeContent: "center" }}>
						<i className="color-gray-2 ri-arrow-right-s-line" style={{ fontSize: '24px' }}></i>
					</div>
				</div>
			</div>
		</>
	);
}

export default Navbar;