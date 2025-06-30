import React, { useCallback, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import { BackendUri, SplitBy } from '../../helpers/catalogos/Helpers';

const Footer = ({ tokenOptions, setReload, reload }) => {

	let navigate = useNavigate();

	const [time, setTime] = useState("");

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
		localStorage.clear();
		navigate("/catalogos/login", { replace: false });
	}

	const goTo = () => {
		if (JSON.parse(localStorage.getItem("userData")).datos_varios === "camaristo") {
			navigate("/catalogos/tareas", { replace: false });
		} else {
			navigate("/catalogos/inicio", { replace: false });
		}
	}

	return (
		<>
			<div style={{ minHeight: 'calc(100vh - 50px - 40px)' }}>
				<Outlet />
			</div>
			{
				localStorage.getItem('userData') === null ? ''
					:
					<footer className='cool-shadow bgc-gray-2 white' style={{ height: '50px', display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', width: '100%', position: 'sticky', bottom: '0px', zIndex: '2' }}>
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
						<div style={{ width: '100px', display: 'grid', placeContent: 'center', fontSize: "12px" }}>
							<span>Hora: {time}</span>
						</div>
						{/* <Logo onClick={() => goTo()} style={{ height: '30px' }} /> */}
						<i onClick={logout} style={{ fontSize: '20px' }} className="ri-logout-box-line white pointer"></i>
					</footer>
			}
		</>
	);
}

export default Footer;