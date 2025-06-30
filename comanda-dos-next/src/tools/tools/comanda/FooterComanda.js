import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { mesaBloqueada, regMesaBloqueada, tipoMovimientoMesaBloqueada } from '../../helpers/comanda/DataOfUser';
import { Outlet } from 'react-router-dom'

import IdleBar from '../IdleBar';

const Footer = ({ tokenOptions, getMesas }) => {

	let navigate = useNavigate()

	// RANGE
	const [rangeValue, setRangeValue] = useState(10000);

	const [tiempoTranscurrido, setTiempoTranscurrido] = useState(0);

	const [time, setTime] = useState("");

	useEffect(() => {

		if (tiempoTranscurrido + 1000 > rangeValue) {
			setTiempoTranscurrido(0)
			getMesas()
			return
		}

		setTiempoTranscurrido(tiempoTranscurrido + 1000)

	}, [time])



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

	const logout = () => {

		let letMesaBloqueada = localStorage.getItem(mesaBloqueada)
		let letRegMesaBloqueada = localStorage.getItem(regMesaBloqueada)
		let letTipoMovimientoMesaBloqueada = localStorage.getItem(tipoMovimientoMesaBloqueada)

		axios.post(`/api/comanda/mesas/desbloquearmesa/${letMesaBloqueada}/${letTipoMovimientoMesaBloqueada}/${letRegMesaBloqueada}`, {}, tokenOptions)
			.then(res => {
				//console.log(res.data.message)

				localStorage.clear();
				navigate('/comanda/login', { replace: false })

			})
	}

	const millisToMinutesAndSeconds = (millis) => {
		var minutes = Math.floor(millis / 60000);
		var seconds = ((millis % 60000) / 1000).toFixed(0);
		return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
	}

	return (
		<>

			<div style={{ minHeight: 'calc(100vh - 50px - 40px)' }}>
				<Outlet />
			</div>

			<footer className='cool-shadow bgc-gray-light' style={{ height: '50px', display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', width: '100%', position: 'absolute', top: 'calc(100vh - 50px)', zIndex: '1' }}>
				{
					JSON.parse(localStorage.getItem("userData"))["ephyr-imagen-pdv"] === undefined ?
						<div className='bgc-gray radius-super' style={{ width: '48px', height: '48px', margin: '0px 0px 0px 0px', display: 'grid', placeContent: 'center' }}>
							<i className="ri-user-fill black gray-2" style={{ fontSize: '24px' }}></i>
						</div>
						:
						<img className='radius-super strong-shadow' src={JSON.parse(localStorage.getItem("userData"))["ephyr-imagen-pdv"]} alt="" style={{ width: '48px', height: '48px', objectFit: 'cover', margin: '0px 0px 0px 0px' }} />

				}
				{/* <img className='radius-super strong-shadow' src={defaultcat} alt="gato" style={{ width: '48px', height: '48px', objectFit: 'cover' }} /> */}
				<span>{JSON.parse(localStorage.getItem("userData"))["ephyr-nombre-pdv"]}</span>
				{/* <span>Turno: 2</span>
			<span>Caja: AB12</span> */}
				{/* <span>Fecha: 22/11/2022</span> */}
				<div style={{ width: '150px', display: 'grid', placeContent: 'center' }}>
					<span>Hora: {time}</span>
				</div>
				<input value={rangeValue} onChange={(e) => setRangeValue(e.target.value)} type="range" min={0} max={100000} step={10000} className='my-range' list="tickmarks" />
				<div style={{ width: '100px', display: 'grid', placeContent: 'center' }}>
					{millisToMinutesAndSeconds(tiempoTranscurrido)} / {millisToMinutesAndSeconds(rangeValue)}
				</div>
				<datalist id="tickmarks">
					<option value="0" label="0%" />
					<option value="10000" />
					<option value="20000" />
					<option value="30000" />
					<option value="40000" />
					<option value="50000" label="50%" />
					<option value="60000" />
					<option value="70000" />
					<option value="80000" />
					<option value="90000" />
					<option value="100000" label="100%" />
				</datalist>
				<i onClick={logout} style={{ fontSize: '32px' }} className="ri-logout-box-line color-gray-2 pointer"></i>
				<IdleBar
					logout={logout}
				/>
			</footer>
		</>
	);
}

export default Footer;