import React, { useEffect, useState } from 'react';

const OnOff = ({ id, isOnInitial, action }) => {

	useEffect(() => {
		setIsOn(isOnInitial)
	}, [isOnInitial])

	const [isOn, setIsOn] = useState(isOnInitial);

	const stylesTransitionForOn = 'translateX(24px)';
	const stylesTransitionForOff = 'translateX(0px)';

	const stylesColorForOn = "bgc-green";
	const stylesColorForOff = "bgc-gray";

	const transitionStyles = "all 0.2s ease-in-out"

	const runAction = (id) => {
		setIsOn(!isOn);

		action(isOn, id)
			.then(res => {
				//console.log(res)
			})
			.catch(err => {
				//console.log(err)
				//console.log(err.response)
				wentWrong()
			})
	}

	const wentWrong = () => {
		setIsOn(isOn)
	}

	return (
		<>
			<div onClick={() => runAction(id)} className={`${isOn ? stylesColorForOn : stylesColorForOff} radius-super pointer cool-shadow`} style={{ transition: transitionStyles, width: '48px', height: '24px', padding: '2px', margin: 'auto' }}>
				<div className='bgc-white radius-super pointer' style={{ transition: transitionStyles, height: '20px', width: '20px', transform: `${isOn ? stylesTransitionForOn : stylesTransitionForOff}` }} />
			</div>
		</>
	);
}

export default OnOff;