import React, { useState } from 'react';

import { useTransition, animated } from 'react-spring'

const Keyboard = ({ show, setShow, editFocused, position, }) => {

	let transitionObject = position === "down" ? {
		from: { opacity: 0, transform: 'translateY(200%)', position: 'absolute', zIndex: '999', width: '100%', left: '0px', bottom: '0px' },
		enter: { opacity: 1, transform: 'translateY(0%)', position: 'absolute', zIndex: '999', width: '100%', left: '0px', bottom: '0px' },
		leave: { opacity: 0, transform: 'translateY(200%)', position: 'absolute', zIndex: '999', width: '100%', left: '0px', bottom: '0px' },
	} :
		{
			from: { opacity: 0, transform: 'translateY(-200%)', position: 'absolute', zIndex: '999', width: '100%', left: '0px', top: '0px' },
			enter: { opacity: 1, transform: 'translateY(0%)', position: 'absolute', zIndex: '999', width: '100%', left: '0px', top: '0px' },
			leave: { opacity: 0, transform: 'translateY(-200%)', position: 'absolute', zIndex: '999', width: '100%', left: '0px', top: '0px' },
		}

	const transitionEnter = useTransition(show, transitionObject)

	const [level, setLevel] = useState(0);
	const [shiftLevel, setShiftLevel] = useState(0);

	const doClick = (e) => {
		editFocused(e.target.innerText)

		if (shiftLevel === 1) {
			quitShift()
		}

	}

	const deleteClick = () => {
		editFocused(false)
	}

	const spaceClick = () => {
		editFocused(true)
	}

	const setShift = () => {


		if (shiftLevel === 2) {

			quitShift()
		} else {

			upShift()
		}
	}

	const quitShift = () => {
		var keys = document.getElementsByClassName('keyboard-button')

		setShiftLevel(0)
		for (let i = 0; i < keys.length; i++) {
			// SI NO EXISTE UN HIJO I DENTRO DEL SPAN
			if (keys[i].children[0].children[0] === undefined) {
				keys[i].children[0].innerText = keys[i].children[0].innerText.toLowerCase()
			}
		}
	}

	const upShift = () => {
		var keys = document.getElementsByClassName('keyboard-button')

		setShiftLevel(shiftLevel + 1)
		for (let i = 0; i < keys.length; i++) {
			// SI NO EXISTE UN HIJO I DENTRO DEL SPAN
			if (keys[i].children[0].children[0] === undefined) {
				keys[i].children[0].innerText = keys[i].children[0].innerText.toUpperCase()
			}
		}
	}

	return (
		transitionEnter((style, visible) => (
			visible &&
			<animated.div style={style}>
				<div className="container" style={{ width: '100%' }}>
					{
						level === 0 ?
							<KeyboardOne
								doClick={doClick}
								deleteClick={deleteClick}
								spaceClick={spaceClick}
								setShift={setShift}
								shiftLevel={shiftLevel}
								level={level}
								setLevel={setLevel}
								setShow={setShow}
								position={position}
							/>
							:
							<KeyboardTwo
								doClick={doClick}
								deleteClick={deleteClick}
								spaceClick={spaceClick}
								setShift={setShift}
								shiftLevel={shiftLevel}
								level={level}
								setLevel={setLevel}
								setShow={setShow}
								position={position}
							/>
					}
				</div>
			</animated.div>
		))
	);
}

const KeyboardOne = ({ doClick, deleteClick, spaceClick, setShift, shiftLevel, level, setLevel, setShow, position }) => {
	return (
		<div className='keyboard strong-shadow'>
			<div className='keyboard-row' >
				<button onClick={doClick} className="keyboard-button"><span>1</span></button>
				<button onClick={doClick} className="keyboard-button"><span>2</span></button>
				<button onClick={doClick} className="keyboard-button"><span>3</span></button>
				<button onClick={doClick} className="keyboard-button"><span>4</span></button>
				<button onClick={doClick} className="keyboard-button"><span>5</span></button>
				<button onClick={doClick} className="keyboard-button"><span>6</span></button>
				<button onClick={doClick} className="keyboard-button"><span>7</span></button>
				<button onClick={doClick} className="keyboard-button"><span>8</span></button>
				<button onClick={doClick} className="keyboard-button"><span>9</span></button>
				<button onClick={doClick} className="keyboard-button"><span>0</span></button>
			</div>
			<div className='keyboard-row' >
				<button onClick={doClick} className="keyboard-button"><span>q</span></button>
				<button onClick={doClick} className="keyboard-button"><span>w</span></button>
				<button onClick={doClick} className="keyboard-button"><span>e</span></button>
				<button onClick={doClick} className="keyboard-button"><span>r</span></button>
				<button onClick={doClick} className="keyboard-button"><span>t</span></button>
				<button onClick={doClick} className="keyboard-button"><span>y</span></button>
				<button onClick={doClick} className="keyboard-button"><span>u</span></button>
				<button onClick={doClick} className="keyboard-button"><span>i</span></button>
				<button onClick={doClick} className="keyboard-button"><span>o</span></button>
				<button onClick={doClick} className="keyboard-button"><span>p</span></button>
			</div>
			<div className='keyboard-row' >
				<button onClick={doClick} className="keyboard-button"><span>a</span></button>
				<button onClick={doClick} className="keyboard-button"><span>s</span></button>
				<button onClick={doClick} className="keyboard-button"><span>d</span></button>
				<button onClick={doClick} className="keyboard-button"><span>f</span></button>
				<button onClick={doClick} className="keyboard-button"><span>g</span></button>
				<button onClick={doClick} className="keyboard-button"><span>h</span></button>
				<button onClick={doClick} className="keyboard-button"><span>j</span></button>
				<button onClick={doClick} className="keyboard-button"><span>k</span></button>
				<button onClick={doClick} className="keyboard-button"><span>l</span></button>
				<button onClick={doClick} className="keyboard-button"><span>ñ</span></button>
			</div>
			<div className='keyboard-row' >
				{
					shiftLevel === 0 ?
						<button onClick={setShift} className="keyboard-button bgc-gray-light" style={{ width: 'calc((100% / 6.666) - 16px)' }}><span><i className="ri-arrow-up-line"></i></span></button>
						: shiftLevel === 1 ?
							<button onClick={setShift} className="keyboard-button bgc-gray-light" style={{ width: 'calc((100% / 6.666) - 16px)' }}><span><i className="ri-arrow-up-line color-blue"></i></span></button>
							:
							<button onClick={setShift} className="keyboard-button bgc-gray-light" style={{ width: 'calc((100% / 6.666) - 16px)' }}><span><i className="ri-arrow-up-fill color-blue"></i></span></button>

				}
				<button onClick={doClick} className="keyboard-button"><span>z</span></button>
				<button onClick={doClick} className="keyboard-button"><span>x</span></button>
				<button onClick={doClick} className="keyboard-button"><span>c</span></button>
				<button onClick={doClick} className="keyboard-button"><span>v</span></button>
				<button onClick={doClick} className="keyboard-button"><span>b</span></button>
				<button onClick={doClick} className="keyboard-button"><span>n</span></button>
				<button onClick={doClick} className="keyboard-button"><span>m</span></button>
				<button onClick={deleteClick} className="keyboard-button bgc-gray-light" style={{ width: 'calc((100% / 6.666) - 16px)' }}><span><i className="ri-delete-back-2-fill"></i></span></button>
			</div>
			<div className='keyboard-row' >
				{
					level === 0 ?
						<button className="keyboard-button bgc-gray-light" onClick={() => setLevel(1)}><span>!#1</span></button>
						:
						<button className="keyboard-button bgc-gray-light" onClick={() => setLevel(0)}><span>ABC</span></button>
				}
				<button onClick={doClick} className="keyboard-button"><span>@</span></button>
				<button onClick={doClick} className="keyboard-button"><span>,</span></button>
				<button onClick={spaceClick} className="keyboard-button" style={{ width: 'calc((100% / 2.5) - 16px)' }}><span><i className="ri-space"></i></span></button>
				<button onClick={doClick} className="keyboard-button"><span>.</span></button>
				<button onClick={doClick} className="keyboard-button"><span>-</span></button>
				<button onClick={() => setShow(false)} className="keyboard-button bgc-gray-light"><span>{position === "down" ?
					<i className="ri-arrow-down-line color-blue"></i>
					:
					<i className="ri-arrow-up-line color-blue"></i>
				}</span></button>
			</div>
		</div>
	)
}

const KeyboardTwo = ({ doClick, deleteClick, spaceClick, setShift, shiftLevel, level, setLevel, setShow, position }) => {
	return (
		<div className='keyboard strong-shadow'>
			<div className='keyboard-row' >
				<button onClick={doClick} className="keyboard-button"><span>1</span></button>
				<button onClick={doClick} className="keyboard-button"><span>2</span></button>
				<button onClick={doClick} className="keyboard-button"><span>3</span></button>
				<button onClick={doClick} className="keyboard-button"><span>4</span></button>
				<button onClick={doClick} className="keyboard-button"><span>5</span></button>
				<button onClick={doClick} className="keyboard-button"><span>6</span></button>
				<button onClick={doClick} className="keyboard-button"><span>7</span></button>
				<button onClick={doClick} className="keyboard-button"><span>8</span></button>
				<button onClick={doClick} className="keyboard-button"><span>9</span></button>
				<button onClick={doClick} className="keyboard-button"><span>0</span></button>
			</div>
			<div className='keyboard-row' >
				<button onClick={doClick} className="keyboard-button"><span>+</span></button>
				<button onClick={doClick} className="keyboard-button"><span>×</span></button>
				<button onClick={doClick} className="keyboard-button"><span>÷</span></button>
				<button onClick={doClick} className="keyboard-button"><span>=</span></button>
				<button onClick={doClick} className="keyboard-button"><span>/</span></button>
				<button onClick={doClick} className="keyboard-button"><span>_</span></button>
				<button onClick={doClick} className="keyboard-button"><span>&lt;</span></button>
				<button onClick={doClick} className="keyboard-button"><span>&gt;</span></button>
				<button onClick={doClick} className="keyboard-button"><span>[</span></button>
				<button onClick={doClick} className="keyboard-button"><span>]</span></button>
			</div>
			<div className='keyboard-row' >
				<button onClick={doClick} className="keyboard-button"><span>!</span></button>
				<button onClick={doClick} className="keyboard-button"><span>@</span></button>
				<button onClick={doClick} className="keyboard-button"><span>#</span></button>
				<button onClick={doClick} className="keyboard-button"><span>$</span></button>
				<button onClick={doClick} className="keyboard-button"><span>%</span></button>
				<button onClick={doClick} className="keyboard-button"><span>^</span></button>
				<button onClick={doClick} className="keyboard-button"><span>&</span></button>
				<button onClick={doClick} className="keyboard-button"><span>*</span></button>
				<button onClick={doClick} className="keyboard-button"><span>(</span></button>
				<button onClick={doClick} className="keyboard-button"><span>)</span></button>
			</div>
			<div className='keyboard-row' >
				<button onClick={doClick} className="keyboard-button"><span>¡</span></button>
				<button onClick={doClick} className="keyboard-button"><span>¿</span></button>
				<button onClick={doClick} className="keyboard-button"><span>-</span></button>
				<button onClick={doClick} className="keyboard-button"><span>'</span></button>
				<button onClick={doClick} className="keyboard-button"><span>"</span></button>
				<button onClick={doClick} className="keyboard-button"><span>:</span></button>
				<button onClick={doClick} className="keyboard-button"><span>;</span></button>
				<button onClick={doClick} className="keyboard-button"><span>,</span></button>
				<button onClick={doClick} className="keyboard-button"><span>?</span></button>
				<button onClick={deleteClick} className="keyboard-button bgc-gray-light"><span><i className="ri-delete-back-2-fill"></i></span></button>
			</div>
			<div className='keyboard-row' >
				{
					level === 0 ?
						<button className="keyboard-button bgc-gray-light" onClick={() => setLevel(1)}><span>!#1</span></button>
						:
						<button className="keyboard-button bgc-gray-light" onClick={() => setLevel(0)}><span>ABC</span></button>
				}
				<button onClick={doClick} className="keyboard-button"><span>@</span></button>
				<button onClick={doClick} className="keyboard-button"><span>,</span></button>
				<button onClick={spaceClick} className="keyboard-button" style={{ width: 'calc((100% / 2.5) - 16px)' }}><span><i className="ri-space"></i></span></button>
				<button onClick={doClick} className="keyboard-button"><span>.</span></button>
				<button onClick={doClick} className="keyboard-button"><span>-</span></button>
				<button onClick={() => setShow(false)} className="keyboard-button bgc-gray-light"><span>{position === "down" ?
					<i className="ri-arrow-down-line color-blue"></i>
					:
					<i className="ri-arrow-up-line color-blue"></i>
				}</span></button>
			</div>
		</div>
	)
}

export default Keyboard;