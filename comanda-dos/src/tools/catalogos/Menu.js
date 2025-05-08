import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MENU_ITEMS } from './MenuItems';

const Menu = ({ closeMenu, menuPhase, setMenuPhase, selectedPhaseOne, setSelectedPhaseOne }) => {

	let navigate = useNavigate();

	// USER TODO:
	let USER = "ADMIN"

	const selectElementOfPhaseOne = (item) => {
		setSelectedPhaseOne(item)
		setMenuPhase(true)
	}

	const regresar = () => {
		setMenuPhase(false)
	}

	const goToProgram = (item) => {
		navigate(`/catalogos/${item.value}`, { replace: false });
		closeMenu()
	}

	return (
		<>
			<div className='radius bgc-white strong-shadow' style={{ position: 'absolute', padding: '8px 0px', top: '-24px', left: '16px', whiteSpace: 'nowrap' }}>
				<h5 className='text-center bold' style={{ padding: '8px 16px' }}>Menú principal</h5>
				<hr style={{ margin: '8px 0px 0px 0px' }} />
				{
					menuPhase === false ?

						MENU_ITEMS[USER].items.map((item, i) => {
							return (
								<div key={i} onClick={() => selectElementOfPhaseOne(item)} className='item-menu' style={{ width: '100%', padding: '0px 8px', height: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
									<p>{item.text}</p>
									<i className="ri-arrow-right-s-line"></i>
								</div>
							)
						})

						:
						<>
							<div onClick={() => regresar()} className='item-menu' style={{ width: '100%', padding: '0px 8px', height: '32px', display: 'flex', alignItems: 'center', gap: '8px' }}>
								<i className="ri-arrow-left-s-line"></i>
								<p>Regresar</p>
							</div>
							<hr style={{ margin: '0px 0px 8px 0px' }} />

							{
								selectedPhaseOne.children.map((child, c) => {
									return (
										<div key={c} onClick={() => goToProgram(child)} className='item-menu' style={{ width: '100%', padding: '0px 8px', height: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
											<p>{child.text}</p>
											<i className="ri-window-fill"></i>
										</div>
									)
								})
							}
						</>
				}
			</div>
		</>
	);
}

export default Menu;