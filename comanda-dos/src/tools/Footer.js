import React, { useCallback, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import { BackendUri, SplitBy } from '../helpers/Helpers';
import Logo from '../svg/Logo'

import axios from 'axios'

const Footer = ({ tokenOptions, setReload, reload }) => {

	let navigate = useNavigate();

	const [time, setTime] = useState("");
	const [seconds, setSeconds] = useState();

	// FECHA
	const [fecha, setFecha] = useState("");

	// GET TIME
	useEffect(() => {
		axios.get('/api/amaDeLlaves/home/hora/sistema')
			.then(res => {

				setFecha(res.data.message.ttCorte[0].fecha_ini_corte)

				let time = res.data.message.ttCorte[0].Hora_ini_corte

				setSeconds(time)

				// calcTime(time)
			})
			.catch(err => {
				console.log(err.response.data)
			})

	}, [tokenOptions])

	const calcTime = useCallback(() => {
		let date = new Date()
		let hours = date.getHours()
		let minutes = date.getMinutes()
		let seconds = date.getSeconds()

		setTime(hours + ":" + minutes + ":" + seconds)

		setTimeout(() => {
			calcTime()
		}, 1000);
	}, [])

	useEffect(() => {
		calcTime()
	}, [calcTime])

	// const calcTime = useCallback((newSeconds) => {

	// 	let time

	// 	if (newSeconds == undefined) {
	// 		time = seconds
	// 	} else {
	// 		time = newSeconds
	// 	}

	// 	let horas = 0
	// 	let minutos = 0
	// 	let segundos = 0

	// 	function calcHoras(time) {
	// 		if (time - 3600 >= 0) {
	// 			time = time - 3600
	// 			horas++
	// 			calcHoras(time)
	// 		} else {
	// 			//console.log(horas)
	// 			calcMinutos(time)
	// 		}
	// 	}

	// 	function calcMinutos(time) {
	// 		if (time - 60 >= 0) {
	// 			time = time - 60
	// 			minutos++
	// 			calcMinutos(time)
	// 		} else {
	// 			//console.log(minutos)
	// 			calcSegundos(time)
	// 		}
	// 	}

	// 	function calcSegundos(time) {
	// 		segundos = time
	// 		//console.log('segundos', time)

	// 		setTime(horas + ":" + minutos + ":" + segundos)
	// 	}

	// 	calcHoras(time)

	// 	if (newSeconds !== undefined) {
	// 		setTimeout(() => {
	// 			calcTime(newSeconds + 1)
	// 		}, 1000);
	// 	} else {
	// 		setTimeout(() => {
	// 			calcTime(seconds + 1)
	// 		}, 1000);
	// 	}

	// }, [seconds])

	const logout = () => {
		localStorage.clear();
		navigate("/amallaves/login", { replace: false });
	}

	return (
		<>
			<div style={{ minHeight: 'calc(100vh - 50px)' }}>
				<Outlet />
			</div>
			{
				localStorage.getItem('userData') === null ? ''
					:
					<footer className='cool-shadow bgc-gray-2 white' style={{ height: '50px', display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', width: '100%', position: 'sticky', bottom: '0px', zIndex: '2' }}>
						<i onClick={() => setReload(reload + 1)} style={{ fontSize: '24px', zIndex: '3' }} className="ri-refresh-line pointer"></i>
						{
							JSON.parse(localStorage.getItem("userData"))["imagen"] === undefined || JSON.parse(localStorage.getItem("userData"))["imagen"] === "" ?
								<div className='bgc-gray radius-super' style={{ width: '30px', height: '30px', margin: '0px 0px 0px 0px', display: 'grid', placeContent: 'center' }}>
									<i className="ri-user-fill color-gray-2" style={{ fontSize: '16px' }}></i>
								</div>
								:
								<img className='radius-super strong-shadow' src={BackendUri !== "" ? BackendUri + JSON.parse(localStorage.getItem("userData"))["imagen"].split(SplitBy)[1] : JSON.parse(localStorage.getItem("userData"))["imagen"]} alt="" style={{ width: '30px', height: '30px', objectFit: 'cover', margin: '0px 0px 0px 0px' }} />

						}
						{/* <img className='radius-super strong-shadow' src={defaultcat} alt="gato" style={{ width: '48px', height: '48px', objectFit: 'cover' }} /> */}
						<span style={{ fontSize: '12px' }}>{JSON.parse(localStorage.getItem("userData"))["nombre"]}</span>
						{/* <span>Turno: 2</span>
			<span>Caja: AB12</span> */}
						{/* <span>Fecha: 22/11/2022</span> */}
						<div style={{ width: '100px', display: 'flex', justifyContent: 'center', fontSize: "12px", flexDirection: 'column' }}>
							<span className="text-center">{fecha.split('-')[2] + '/' + fecha.split('-')[1] + '/' + fecha.split('-')[0]}</span>
							<span className="text-center">Hora: {time}</span>
						</div>
						{/* <Logo onClick={() => goTo()} style={{ height: '30px' }} /> */}
						<i onClick={logout} style={{ fontSize: '20px' }} className="ri-logout-box-line white pointer"></i>
					</footer>
			}
		</>
	);
}

export default Footer;