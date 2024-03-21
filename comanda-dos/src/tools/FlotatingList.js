import React, { useState } from 'react';
import { animated, useTransition } from 'react-spring';
import OutsideClickHandler from 'react-outside-click-handler';

const FloatingList = ({ array, comensal, changeComensal, uuid, tiempo = false }) => {

	// MAIN DATA
	const [showTrigger, setShowTrigger] = useState(false);
	const [selectedElement, setSelectedElement] = useState(comensal - 1);

	const transitionEnter = useTransition(showTrigger, {
		from: { opacity: 0, position: 'absolute', top: '30px', left: '-40px', zIndex: '1', transform:'translateY(-10px)', pointerEvents:'none' },
		enter: { opacity: 1, position: 'absolute', top: '30px', left: '-40px', zIndex: '1', transform:'translateY(0px)', pointerEvents:'all' },
		leave: { opacity: 0, position: 'absolute', top: '30px', left: '-40px', zIndex: '1', transform:'translateY(10px)', pointerEvents:'none' },
	})

	return (
		<OutsideClickHandler
			onOutsideClick={() => {
				setShowTrigger(false)
			}}
		>
			<div style={{ position: 'relative' }}>
				<span className='pointer' onClick={() => setShowTrigger(!showTrigger)} style={{ position: 'relative', display: 'flex', flexWrap: 'nowrap', whiteSpace: 'nowrap', alignItems: 'center'}}>
					{tiempo === true ? 'Tiempo' : 'Comensal'} {comensal} <i style={{fontSize:'22px'}} className="ri-arrow-down-s-line color-gray-2"></i>
				</span>
				{
					transitionEnter((style, visible) =>
						visible &&
						<animated.div style={style}>

							<div className='bgc-white cool-shadow radius' style={{ padding: '8px 0px', cursor: 'default', maxHeight: '200px', overflow: 'scroll' }}>
								{
									array.map((item, i) => {
										return (
											<p onClick={() => {
												setSelectedElement(i);
												setShowTrigger(false);
												changeComensal(uuid, i + 1)
											}} className={` ${selectedElement === i && 'bgc-blue'} pointer`} key={i} style={{ padding: '8px', marginBottom: '0px' }}>{tiempo === true ? 'Tiempo' : 'Comensal'} {item} <br /></p>
										)
									})
								}
							</div>
						</animated.div>
					)
				}
			</div>
		</OutsideClickHandler>

	);
}

export default FloatingList;