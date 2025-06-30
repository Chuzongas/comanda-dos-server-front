import React, { useState } from 'react';
import { animated } from '@react-spring/web';
import OutsideClickHandler from 'react-outside-click-handler';
import { useTransition } from '@react-spring/core';

const ShowMeals = ({ cena, comida, desayuno, alimento }) => {

	const [up, setUp] = useState(false);

	const [show, setShow] = useState(false);
	const transition = useTransition(show, {
		config: {
			tension: 120,
			friction: 14,
			clamp: true,
			duration: 100
		},
		from: { transform: 'translateY(-5px)', opacity: '0', zIndex: '100', pointerEvents: 'none', position: 'relative' },
		enter: { transform: 'translateY(0px)', opacity: '1', zIndex: '100', pointerEvents: 'none', position: 'relative' },
		leave: { transform: 'translateY(5px)', opacity: '0', zIndex: '100', pointerEvents: 'none', position: 'relative' },
	})

	const changeShow = (id, max) => {

		if ((parseInt(id) === parseInt(max) || parseInt(id) === parseInt(max - 1)) && max > 4) {
			setUp(true)
		}
		setShow(!show)
	}
	// children
	// parentElement

	return (
		<>
			<OutsideClickHandler
				onOutsideClick={() => {
					setShow(false)
				}}
			>
				<div style={{ display: "flex", justifyContent: 'space-between', alignItems: 'center' }}>
					<p onClick={(e) => changeShow(e.target.parentElement.parentElement.parentElement.parentElement.parentElement.id, e.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.children.length - 1)} className="pointer" style={{ padding: '0px 4px 0px 0px', margin: '0px' }} >{alimento}</p>
					<i onClick={(e) => changeShow(e.target.parentElement.parentElement.parentElement.parentElement.parentElement.id, e.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.children.length - 1)} style={{ fontSize: '24px' }} className="ri-arrow-down-circle-line color-blue pointer"></i>
				</div>
				{
					transition((style, visible) =>
						visible &&
						<animated.div style={style}>
							<div className="cool-shadow radius bgc-white" style={{ display: 'flex', position: 'absolute', padding: '8px 12px', right: '0px', transform: `${up && 'translateY(-36px)'}`, bottom: `${up && '0px'}` }}>
								<div style={{ margin: '0px 4px' }}>
									<p style={{ margin: '0px' }}>Desayuno</p>
									{desayuno === true ? <i className="ri-check-line color-green" style={{ fontSize: '24px' }}></i> : <i className="ri-close-fill color-gray-2" style={{ fontSize: '24px' }}></i>}
								</div>
								<div style={{ margin: '0px 4px' }}>
									<p style={{ margin: '0px' }}>Comida</p>
									{comida === true ? <i className="ri-check-line color-green" style={{ fontSize: '24px' }}></i> : <i className="ri-close-fill color-gray-2" style={{ fontSize: '24px' }}></i>}
								</div>
								<div style={{ margin: '0px 4px' }}>
									<p style={{ margin: '0px' }}>Cena</p>
									{cena === true ? <i className="ri-check-line color-green" style={{ fontSize: '24px' }}></i> : <i className="ri-close-fill color-gray-2" style={{ fontSize: '24px' }}></i>}
								</div>
							</div>
						</animated.div>
					)
				}
			</OutsideClickHandler>
		</>
	);
}

export default ShowMeals;