import React, { useCallback, useEffect, useState } from 'react';
import { animated, useTransition } from 'react-spring';
import Logo from '../../../svg/Logo';
import RegisterSvg from '../../../svg/RegisterSvg';

// import defaultcat from '../../../img/defaultcat.jpg'
import axios from 'axios';
import { NameOfToken, NameOfTokenPreAuth } from '../../../helpers/Helpers';
import { useNavigate } from 'react-router';
import { userData, mesero, nombre, imagen } from '../../../helpers/DataOfUser'

const PreConfig = ({ userDatas = JSON.parse(localStorage.getItem(userData)) || "" }) => {

	let navigate = useNavigate()

	const [cajas, setCajas] = useState([]);

	const [cajaSeleccionada, setCajaSeleccionada] = useState();

	const goNext = () => {
		navigate('/home', { replace: false })
	}

	const goBack = useCallback(() => {
		navigate('/login', { replace: false })
	}, [navigate])

	useEffect(() => {

		var options = {
			headers: {
				'Content-Type': 'application/json',
				[NameOfTokenPreAuth]: localStorage.getItem(NameOfToken),
			}
		}

		axios.get('/api/auth/get/predata', options)
			.then(res => {
				setCajas(res.data.user.terminales);
				console.log(res.data.user)
			})
			.catch(err => {
				// console.log(err)
				if (err.response !== undefined) {
					if (err.response.status === 401) {
						goBack()
					}
				}
			})
	}, [navigate, goBack])

	const seleccionarPreData = () => {

		let data = {
			terminal:cajaSeleccionada
		}

		var options = {
			headers: {
				'Content-Type': 'application/json',
				[NameOfTokenPreAuth]: localStorage.getItem(NameOfToken),
			}
		}

		axios.post('/api/auth/select/predata', data, options)
			.then(res => {
				//console.log('nuevo token', res.data.token)
				localStorage.removeItem(NameOfToken)
				localStorage.setItem(NameOfToken, res.data.token)
				goNext()
			})
			.catch(err => {
				//console.log(err)
			})
	}

	const transitionEnter = useTransition(true, {
		from: { opacity: 0, },
		enter: { opacity: 1, },
		leave: { opacity: 0 },
	})

	return (
		transitionEnter((style, visible) => (
			visible &&
			<animated.div style={style}>

				<div className='container' style={{ height: '100vh', display: 'grid', placeContent: "center" }}>
					<div className='cool-shadow radius' style={{ display: 'flex', justifyContent: 'space-between' }}>
						<div style={{ display: 'flex', flexFlow: 'column nowrap', marginRight: '24px', padding: '24px' }}>
							<h3 style={{ margin: '0px', textAlign:'center' }}>Seleccione una terminal</h3>
							{
								userDatas[imagen] === undefined ?
									<div className='bgc-gray radius-super' style={{ width: '128px', height: '128px', margin: '24px auto', display: 'grid', placeContent: 'center' }}>
										<i className="ri-user-fill gray-2" style={{ fontSize: '50px' }}></i>
									</div>
									:
									<img className='radius-super strong-shadow' src={userDatas[imagen]} alt="" style={{ width: '128px', height: '128px', objectFit: 'cover', margin: '24px auto' }} />
							}

							<div className='chido-container' style={{ display: 'flex', position: 'relative', marginBottom: '12px' }}>
								<input value={userDatas['usuario']} required onChange={() => 'nel jaja'} className="chido-input" type="text" name='description' style={{ width: '100%', padding: '10px 48px 10px 10px' }} />
								<span className='chido-span'>Usuario</span>
							</div>

							{/* <div className='chido-container' style={{ display: 'flex', position: 'relative', marginBottom: '12px' }}>
								<input value={userDatas[nombre]} required onChange={() => 'nel jaja'} className="chido-input" type="text" name='description' style={{ width: '100%', padding: '10px 48px 10px 10px' }} />
								<span className='chido-span'>Nombre</span>
							</div> */}

							<div className='chido-container' style={{ marginBottom: '16px', width: '100%' }}>
								<select value={cajaSeleccionada} onChange={(e) => setCajaSeleccionada(e.target.value)} className="form-select create-input chido-select" aria-label="Default select example">
									<option value="">Seleccione terminal</option>
									{
										cajas.map((caja, i) => {
											return (
												<option key={i} value={caja}>{caja}</option>
											)
										})
									}
								</select>
								<p className="chido-span-alone" style={{ marginBottom: '0px' }}>Terminal</p>
							</div>

							<button onClick={seleccionarPreData} className={`py-1 border-blue ${cajaSeleccionada === "" || cajaSeleccionada === undefined ? 'disabled bgc-white color-blue' : 'bgc-blue white'}`}>Confirmar</button>

						</div>

						<div style={{ display: 'flex', flexFlow: 'column', justifyContent: 'space-between', alignItems: 'center', padding: '24px', width: '400px' }}>
							<Logo style={{ height: '105px', marginTop: '12px', marginBottom: '48px' }} />
							<div style={{ height: '100%', width: '100%', display: 'flex' }}>
								<RegisterSvg style={{ width: '100%' }} />
							</div>
						</div>
					</div>
				</div>

			</animated.div>
		))
	);
}

export default PreConfig;