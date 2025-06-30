import React, { useEffect, useState } from 'react';
import { animated, useTransition } from 'react-spring';

const ToolTip = ({ toolTipText, text, side }) => {

	// MAIN DATA
	const [width, setWidth] = useState(0);

	let toolTipContainer = window.document.getElementById('tooltipcontainer')

	const calc = () => {
		if (window.document.getElementById('tooltipcontainer')) {
			setWidth(window.document.getElementById('tooltipcontainer').offsetWidth)
		}
	}

	useEffect(() => {
		calc()
	}, [toolTipContainer])

	// SPRING
	const [enterAnimation, setEnterAnimation] = useState(false)
	const transition = useTransition(enterAnimation, {
		config: {
			duration: 100
		},
		from: { opacity: 0, transform: 'translateY(-25px)', pointerEvents: 'none' },
		enter: { opacity: 1, transform: 'translateY(0%)', pointerEvents: 'all' },
		leave: { opacity: 0, transform: 'translateY(-25px)', pointerEvents: 'none' },
	})

	if (width === 0) {
		calc()
	}

	return (

		<div id='tooltipcontainer' onMouseEnter={() => setEnterAnimation(true)} onMouseLeave={() => setEnterAnimation(false)} style={{ position: 'relative', zIndex: '20' }}>
			{text}
			{transition((style, visible) =>
				visible ?
					<animated.div style={style}>
						{
							side === undefined ?
								<div className='bgc-gray-2 white radius-small font-small' style={{ pointerEvents:'none', height: '26px', position: 'absolute', zIndex: '20', padding: '4px 8px', transform: `translate(calc(${width / 2}px - 50%), -200%)`, whiteSpace: 'nowrap' }}>

									{toolTipText}
								</div> :
								side === 'left' ?
									<div className='bgc-gray-2 white radius-small font-small' style={{ pointerEvents:'none', height: '26px', borderTopRightRadius: '4px', borderBottomRightRadius: '4px', position: 'absolute', zIndex: '20', padding: '4px 8px', transform: `translate(calc(-100% - 10px), -100%)`, whiteSpace: 'nowrap' }}>

										{toolTipText}
										<div style={{ backgroundColor: 'transparent', height: '26px', width: '30px', display: 'inline', position: 'absolute', borderLeft: '12px var(--gray-color-2) solid', borderBottom: '13px transparent solid', borderTop: '13px transparent solid', transform: 'translate( 6px ,-4px)' }} />
									</div> : ''
						}

					</animated.div>
					: ''
			)}
		</div >

	);
}

export default ToolTip;