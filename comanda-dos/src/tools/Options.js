import React, { useState } from 'react';
import { useEffect } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import { useTransition, animated } from 'react-spring';

const Options = ({ x = 0, y = 0, thisShow = false, items = ['asasdd', 'asad', 'asdasdasdsd', 'as asdsad ad'], itemSelected }) => {

	const [show, setShow] = useState(thisShow);

	// HANDLE SHOW CHANGE FROM OUT
	useEffect(() => {
		setShow(thisShow)
	}, [thisShow])

	return (
		<OutsideClickHandler
			onOutsideClick={(e) => {
				setShow(false)
			}}
		>
			<div className="strong-shadow bgc-white radius" style={{
				transition: 'opacity 0.2s ease, transform 0.2s ease',
				transform: `${show === true ? 'scale(1)' : 'scale(0.8)'}`,
				transformOrigin: 'top left',
				opacity: `${show === true ? '1' : '0'}`,
				pointerEvents: `${show === true ? 'all' : 'none'}`,
				top: y,
				left: x,
				position: 'absolute',
				display: 'flex',
				flexDirection: 'column',
				flexWrap: 'wrap',
				padding: '8px 0px',
				zIndex: '502'
			}}>
				{
					items.map((item, i) => {
						return (
							<p key={i} onClick={() => item.action(itemSelected)} className="pointer hover" style={{ padding: '0px 8px', fontSize: '14px' }}>{item.text}</p>
						)
					})
				}
			</div>
		</OutsideClickHandler>
	);
}

export default Options;