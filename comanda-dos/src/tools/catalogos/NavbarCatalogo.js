import React, { useState } from 'react';
import { animated, useTransition } from 'react-spring';
import { useNavigate } from 'react-router-dom';
import Logo from '../../svg/Logo'
import Menu from './Menu';

const Navbar = () => {

	let navigate = useNavigate();

	// SHOW MENU
	const [showMenu, setShowMenu] = useState(false);

	// MENU PHASE
	// false = 1, true = 2
	const [menuPhase, setMenuPhase] = useState(false);

	// SELECTED PHASE 1
	const [selectedPhaseOne, setSelectedPhaseOne] = useState();

	const goTo = () => {
		if (JSON.parse(localStorage.getItem("userData")).datos_varios === "camaristo") {
			navigate("/catalogos/tareas", { replace: false });
		} else {
			navigate("/catalogos/home", { replace: false });
		}
	}

	const openMenu = () => {
		setShowMenu(!showMenu)
	}

	// SPRING
	const transition = useTransition(true, {
		from: { opacity: 0, position: 'relative', zIndex: '500' },
		enter: { opacity: 1, position: 'relative', zIndex: '500' },
		leave: { opacity: 0, position: 'relative', zIndex: '500' },
	})
	// MENU ANIMATION
	const transitionMenu = useTransition(showMenu, {
		from: { opacity: 0, position: 'relative', zIndex: '500', transform: "translateX(-10px)" },
		enter: { opacity: 1, position: 'relative', zIndex: '500', transform: "translateX(0px)" },
		leave: { opacity: 0, position: 'relative', zIndex: '500', transform: "translateX(-10px)" },
		config: {
			// duration: 250
		}
	})

	const closeMenu = () => {
		setShowMenu(false)
	}

	return (
		<>
			{/* GRAY BACKGROUND */}
			{
				showMenu ?
					<div onClick={() => setShowMenu(false)} className='bgc-gray-opacity' style={{ position: 'fixed', height: '100%', width: '100%' }}></div>
					: ''
			}
			{/* GRAY BACKGROUND */}
			{
				transition((style, visible) =>
					visible ?
						<animated.div style={style}>
							<div className='cool-shadow'>
								<div className="container">
									<nav style={{ height: '40px', display: 'flex', alignItems: 'center' }}>
										<div style={{ position: 'relative', zIndex: '3' }}>
											<i onClick={openMenu} style={{ fontSize: '32px', zIndex: '2' }} className="ri-menu-line pointer color-gray-2"></i>
											{
												transitionMenu((style, visible) =>
													visible ?
														<animated.div style={style}>
															<Menu
																closeMenu={closeMenu}
																menuPhase={menuPhase}
																setMenuPhase={setMenuPhase}
																selectedPhaseOne={selectedPhaseOne}
																setSelectedPhaseOne={setSelectedPhaseOne}
															/>
														</animated.div>
														: ''
												)
											}
										</div>
										<div style={{ display: 'grid', height: "40px", placeContent: 'center', width: '100%', transform: 'translateX(-16px)', zIndex: '2' }}>
											<Logo onClick={() => goTo()} style={{ height: '30px' }} />
										</div>
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

export default Navbar;