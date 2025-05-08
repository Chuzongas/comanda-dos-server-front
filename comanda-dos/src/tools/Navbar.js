import React, { useEffect, useState } from 'react';
import { animated, useTransition } from 'react-spring';
import { useNavigate } from 'react-router-dom';
import Logo from '../svg/Logo'

const Navbar = ({ items, center = false, backArrow = true }) => {

	// SPRING
	const transition = useTransition(true, {
		from: { opacity: 0, position: 'relative', zIndex: '500' },
		enter: { opacity: 1, position: 'relative', zIndex: '500' },
		leave: { opacity: 0, position: 'relative', zIndex: '500' },
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
									<nav style={{ height: '50px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
										<Logo style={{ height: '35px' }} />
										<h4 className='m-0 bold'>Monitor de comandas</h4>
										<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
											<div onClick={fullscreen} className='radius color-gray-2 pointer' style={{ marginLeft: '24px', fontSize: '28px', width: '48px', height: '48px', display: 'grid', placeContent: 'center' }}>
												<i className="ri-fullscreen-fill color-gray-2"></i>
											</div>
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