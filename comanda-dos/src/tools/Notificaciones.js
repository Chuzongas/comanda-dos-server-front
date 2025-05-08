import React, { useEffect, useState } from 'react';
import { animated, useTransition } from 'react-spring';

const Notificaciones = ({ alert, triggerAlert, setTriggerAlert, alertsClassName = "bgc-white" }) => {

	const [show, setShow] = useState(triggerAlert);

	// useEffect(() => {

	// 	console.log("triger alert es", triggerAlert, 'y alert es', alert)

	// 	if (alert === null) return

	// 	setShow(triggerAlert)
	// }, [triggerAlert, setTriggerAlert, alert])

	useEffect(() => {

		//console.log("Alert es", alert)

		if (alert === null) return

		setShow(false)

		setTimeout(() => {
			setShow(true)

			setTimeout(() => {
				setShow(false)
			}, 3000);

		}, 10);

	}, [alert])

	const enterTransition = useTransition(show, {
		from: { opacity: 0, transform: 'translateX(-100%)', zIndex: '1000', top: 'calc(100vh - 60px - 52px)', left: '16px', position: 'fixed', display: 'inline-flex' },
		enter: { opacity: 1, transform: 'translateX(0%)', zIndex: '1000', top: 'calc(100vh - 60px - 52px)', left: '16px', position: 'fixed', display: 'inline-flex' },
		leave: { opacity: 0, transform: 'translateX(-100%)', zIndex: '1000', top: 'calc(100vh - 60px - 52px)', left: '16px', position: 'fixed', display: 'inline-flex' },
	})

	return (
		enterTransition((style, visible) =>

			visible &&
			<animated.div style={style}>
				<div className={`${alertsClassName} radius-small strong-shadow`} style={{ zIndex: '1000', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0px' }}>
					<span style={{ padding: '8px 16px', fontSize: '12px' }} >{alert}</span>
					{/* <div className='bgc-gray' style={{ height: '36px', width: '1px' }} />
					<i style={{ fontSize: '24px', padding: '8px 16px' }} onClick={() => setShow(false)} className="ri-close-line pointer"></i> */}
				</div>
			</animated.div>
		)
	);
}

export default Notificaciones;