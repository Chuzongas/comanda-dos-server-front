import React from 'react';

const NumbersKeyboard = ({ value, setValue, action }) => {

	const addValue = (key) => {

		let newValue
		if (value === undefined) {
			newValue = key
		} else {
			newValue = value + key
		}

		setValue(newValue)
	}

	const subtractValue = () => {

		let newValue
		if (value === undefined) {
			return;
		} else {
			newValue = value.slice(0, -1);
		}

		setValue(newValue)
	}

	const deleteAllValue = () => {
		setValue("")
	}

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
			<div className='bgc-gray radius numbers-keyboard'>
				<button onClick={(e) => { addValue(e.target.innerText) }} className='radius bgc-white'>
					<p className='color-gray-2'>1</p>
				</button>
				<button onClick={(e) => { addValue(e.target.innerText) }} className='radius bgc-white'>
					<p className='color-gray-2'>2</p>
				</button>
				<button onClick={(e) => { addValue(e.target.innerText) }} className='radius bgc-white'>
					<p className='color-gray-2'>3</p>
				</button>
				<button onClick={(e) => { addValue(e.target.innerText) }} className='radius bgc-white'>
					<p className='color-gray-2'>4</p>
				</button>
				<button onClick={(e) => { addValue(e.target.innerText) }} className='radius bgc-white'>
					<p className='color-gray-2'>5</p>
				</button>
				<button onClick={(e) => { addValue(e.target.innerText) }} className='radius bgc-white'>
					<p className='color-gray-2'>6</p>
				</button>
				<button onClick={(e) => { addValue(e.target.innerText) }} className='radius bgc-white'>
					<p className='color-gray-2'>7</p>
				</button>
				<button onClick={(e) => { addValue(e.target.innerText) }} className='radius bgc-white'>
					<p className='color-gray-2'>8</p>
				</button>
				<button onClick={(e) => { addValue(e.target.innerText) }} className='radius bgc-white'>
					<p className='color-gray-2'>9</p>
				</button>
				<button onClick={(e) => { addValue(e.target.innerText) }} className='radius bgc-white'>
					<p className='color-gray-2'>.</p>
				</button>
				<button onClick={(e) => { addValue(e.target.innerText) }} className='radius bgc-white'>
					<p className='color-gray-2'>0</p>
				</button>
				<button onClick={subtractValue} className='radius bgc-white'>
					<p className='color-gray-2'>
						<i className="ri-delete-back-2-fill color-gray-2"></i>
					</p>
				</button>
				<button onClick={fullscreen} className='radius bgc-white'>
					<p className='color-gray-2'>
						<i className="ri-fullscreen-fill color-gray-2"></i>
					</p>
				</button>
				<button onClick={deleteAllValue} className='radius bgc-white'>
					<p className='color-gray-2'>
						<i className="ri-close-fill color-red"></i>
					</p>
				</button>
				<button onClick={action} className='radius bgc-white'>
					<p className='color-gray-2'>
						<i className="ri-check-fill color-green"></i>
					</p>
				</button>
			</div>
		</>
	);
}

export default NumbersKeyboard;