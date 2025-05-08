import React, { useCallback, useState } from 'react';

const DisplayLongText = ({ center = false, color = "bgc-gray-light", radius = false, text, width, height = "24px", fontSizeProps = '16px', recorrer8px = false }) => {

	const [spanRef, setSpanRef] = useState();

	const speed = 65

	const resetThings = useCallback((e, comeFromRender = false) => {
		if (e.propertyName === 'opacity') return

		let elementGradient
		let currentBgc
		let newBgc

		if (comeFromRender === true) {
			// GET THE CURRENT BGC AND SET OPCITY TO 0 ON LEFT
			elementGradient = e.parentElement.parentElement.parentElement.children[0]
			currentBgc = getComputedStyle(elementGradient).background
			newBgc = currentBgc.split(") 0%")[0] + " , 0) 0%" + currentBgc.split(") 0%")[1]
		} else {
			// GET THE CURRENT BGC AND SET OPCITY TO 0 ON LEFT
			elementGradient = e.target.parentElement.parentElement.parentElement.children[0]
			currentBgc = getComputedStyle(elementGradient).background
			newBgc = currentBgc.split(") 0%")[0] + " , 0) 0%" + currentBgc.split(") 0%")[1]
		}

		// SET THE NEW BGC
		elementGradient.style.background = newBgc

		// HIDE SPAN
		spanRef.style.opacity = '0'

		// QUIT THE TRANSITION
		spanRef.style.transition = ''

		// RETURN IT TO THE START 
		spanRef.style.transform = 'translateX(0px)'


		setTimeout(() => {
			// ADD THE TRANSITION
			spanRef.style.transition = `transform ${spanRef.clientWidth / speed}s 0s linear, opacity 1s 0s linear`
			// SHOW SPAN
			spanRef.style.opacity = '1'

		}, 50);
	}, [spanRef])

	const spanCallBackRef = useCallback(node => {
		if (node === null || node === undefined) {
			// DOM node referenced by ref has been unmounted
		} else {
			// DOM node referenced by ref has changed and exists
			// RUN THIS ON READY
			setSpanRef(node)

			if (node.parentElement.clientWidth < node.parentElement.parentElement.clientWidth) {
				// QUITAR EL BLUR DE LA IZQUIERDA

				// PUEDE ESTAR CENTRADO SI ENTRA AQUI
				// CENTRAR
				if (center === true) {
					node.parentElement.parentElement.style.placeContent = 'center'
				}

				// NO CORRA AL INSTANTE PARA ALCANZAR A CALCULAR TAMAÑOS Y COSAS ASI
				setTimeout(() => {
					resetThings(node, true)
					// node.style.transform = `translateX(-${node.clientWidth}px)`
				}, 100);

				return
			}

			// NO CORRA AL INSTANTE PARA ALCANZAR A CALCULAR TAMAÑOS Y COSAS ASI
			setTimeout(() => {
				node.style.transform = `translateX(-${node.clientWidth}px)`
			}, 500);

		}
	}, [center, resetThings]); // adjust deps

	const runAgainTransition = (e) => {

		// NO DEJAR CORRER LA ANIMACION CUANDO ES TEXTO SEA MENOR AL CUADRO
		if (e.target.clientWidth > e.target.children[1].children[0].clientWidth) {
			return
		}

		let target = e.target.children[0]

		setTimeout(() => {

			// QUITAMOS EL BGC DEL STYLES
			target.style["background-image"] = null;
			target.style["background-position-x"] = null;
			target.style["background-position-y"] = null;
			target.style["background-size"] = null;
			target.style["background-repeat-x"] = null;
			target.style["background-repeat-y"] = null;
			target.style["background-attachment"] = null;
			target.style["background-origin"] = null;
			target.style["background-clip"] = null;
			target.style["background-color"] = null;

			// RUN ANIMATION 
			spanRef.style.transform = `translateX(-${spanRef.clientWidth}px)`
		}, 200);
	}


	return (
		<div onClick={(e) => runAgainTransition(e)} style={{ width, overflow: 'hidden', position: 'relative', cursor: 'pointer', height: height, transform: `${recorrer8px === true ? 'translateX(-10px)' : ''}` }}>
			<div className={`${radius === true && "radius"} div-transition-display-long-text-${color}`} style={{ pointerEvents: 'none', height: height, width: '100%', position: 'absolute', zIndex: '1' }} />
			<div style={{ pointerEvents: 'none', display: 'flex', height: height, alignItems: 'center' }}>
				<div>
					<span onTransitionEnd={(e) => resetThings(e)} ref={spanCallBackRef} style={{ pointerEvents: 'none', height: '100%', width: '100%', alignItems: 'center', justifyContent: 'flex-start', whiteSpace: 'nowrap', display: 'grid', transition: `transform ${spanRef !== undefined && spanRef.clientWidth / speed}s 0s linear, opacity 1s 0s linear`, fontSize: fontSizeProps }}>
						{text}
					</span>
				</div>
			</div>
		</div>
	);
}

export default DisplayLongText;