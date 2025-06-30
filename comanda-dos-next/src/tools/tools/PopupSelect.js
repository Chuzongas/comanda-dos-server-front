import React, { useState } from 'react';
import { animated, useTransition } from 'react-spring';
import { animationInStandart } from '../helpers/Helpers';

const PopupSelect = (props) => {

	const [popupAnimation, setPopupAnimation] = useState(props.show)
	const transitionPopupAnimation = useTransition(popupAnimation, {
		config: {
			duration: animationInStandart
		},
		from: { opacity: 0, position: 'fixed', zIndex: '501', height: '100vh', width: '100%', top: '0px' },
		enter: { opacity: 1, position: 'fixed', zIndex: '501', height: '100vh', width: '100%', top: '0px' },
		leave: { opacity: 0, position: 'fixed', zIndex: '501', height: '100vh', width: '100%', top: '0px' },
	})

	if (popupAnimation !== props.show) {
		setPopupAnimation(props.show)
	}

	return (
		transitionPopupAnimation((style, visible) =>
			visible ?
				<animated.div style={style}>
					{props.children}
				</animated.div>
				: ''
		)
	);
}

export default PopupSelect;