import React from 'react';

import img from '../../img/comida.jpg'

import { VARS_EMPRESAS } from '../../helpers/Helpers'

const Home = () => {
	return (
		<>
			<div className="container mt-2">

				<div className='radius cool-shadow bgc-gray-light mb-3' style={{ border: `2px solid ${VARS_EMPRESAS['RAPPI'].COLOR}` }}>
					<div style={{ borderBottomLeftRadius: '0px', borderBottomRightRadius: '0px' }} className='py-2 px-3 color-gray-2 radius bgc-gray'>
						<div style={{ display: 'flex', justifyContent: 'space-between' }}>
							<div style={{ display: 'flex', gap: '30px', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
								<p><b>Comanda:</b><br />106,230</p>
								<p><b>Mesa:</b><br />10</p>
							</div>
							<div style={{ display: 'grid', placeContent: 'center' }}>
								<img src={VARS_EMPRESAS['RAPPI'].LOGO} alt="logo" style={{ height: '32px' }} />
							</div>
							<div style={{ display: 'flex', gap: '30px', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
								<p><b>Fecha:</b><br />07/03/2024</p>
								<p><b>Hora:</b><br />10:52</p>
							</div>
						</div>
					</div>
					<hr className='m-0' style={{ backgroundColor: '#999999' }} />
					<div className='radius'>
						<div>
							<div style={{ display: 'flex', flexDirection: 'column', height: '100%' }} className='my-tabla nice-shadow p-1'>
								<div className='my-tabla-header'>
									<div>
										<p></p>
									</div>
									<div>
										<p>Tiempo</p>
									</div>
									<div>
										<p>Cantidad</p>
									</div>
									<div>
										<p>Producto</p>
									</div>
									<div>
										<p>Guarnición</p>
									</div>
									<div>
										<p>Ordenado</p>
									</div>
									<div>
										<p>Cocinando</p>
									</div>
									<div>
										<p>Preparado</p>
									</div>
									<div>
										<p>Entregado</p>
									</div>
								</div>
								<div style={{ flex: '1', overflow: 'overlay' }} className='my-tabla-body'>
									<div className='my-tabla-row'>
										<div>
											<img src={img} alt="imagen" className='radius' style={{ height: '32px' }} />
										</div>
										<div>
											<p>1</p>
										</div>
										<div>
											<p>1</p>
										</div>
										<div>
											<p>Tacos</p>
										</div>
										<div>
											<p>De asada</p>
										</div>
										<div style={{ display: 'flex', flexFlow: 'column', justifyContent: 'center', alignItems: 'center' }}>
											<div className='radius-super bgc-green-3 white' style={{ display: 'grid', placeContent: 'center', height: '30px', width: '30px', fontSize: '14px' }}>
												<i className="ri-draft-fill"></i>
											</div>
											<span style={{ fontSize: '10px' }}>10:52</span>
										</div>
										<div style={{ display: 'flex', flexFlow: 'column', justifyContent: 'center', alignItems: 'center' }}>
											<div className='radius-super bgc-green-2 white' style={{ display: 'grid', placeContent: 'center', height: '30px', width: '30px', fontSize: '14px' }}>
												<i className="ri-restaurant-2-fill"></i>
											</div>
											<span style={{ fontSize: '10px' }}>10:52</span>
										</div>
										<div style={{ display: 'flex', flexFlow: 'column', justifyContent: 'center', alignItems: 'center' }}>
											<div className='radius-super bgc-green-1 white' style={{ display: 'grid', placeContent: 'center', height: '30px', width: '30px', fontSize: '14px' }}>
												<i className="ri-alarm-warning-fill"></i>
											</div>
											<span style={{ fontSize: '10px' }}>10:52</span>
										</div>
										<div style={{ display: 'flex', flexFlow: 'column', justifyContent: 'center', alignItems: 'center' }}>
											<div className='radius-super bgc-green white' style={{ display: 'grid', placeContent: 'center', height: '30px', width: '30px', fontSize: '14px' }}>
												<i className="ri-check-fill"></i>
											</div>
											<span style={{ fontSize: '10px' }}>10:52</span>
										</div>
									</div>
									<div className='notas bgc-gray radius' style={{ borderTopLeftRadius: '0px', borderTopRightRadius: '0px' }}>
										<span style={{ transform: 'translateX(100px)' }}>
											<b>Notas:</b> aaaaaaaaaaLorem ipsum dolor, sit amet consectetur adipisicing elit.
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

			</div>
		</>
	);
}

export default Home;