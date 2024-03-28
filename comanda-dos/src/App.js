import React, { useEffect, useState } from 'react';
import 'remixicon/fonts/remixicon.css'

import { Route } from 'react-router-dom'
import { Navigate, Routes } from 'react-router';
// import Footer from './tools/Footer';
import Navbar from './tools/Navbar';
import Notificaciones from './tools/Notificaciones';

import { useNavigate, useLocation } from 'react-router';
import axios from 'axios'
import Login from './components/Login/Login';
import PreConfig from './components/Login/PreConfig/PreConfig'
import Auth from './helpers/Auth'
import { NameOfToken } from './helpers/Helpers'
import TokenOptions from './helpers/TokenOptions'
import Footer from './tools/Footer'
import Home from './components/home/Home';

const App = () => {

	let navigate = useNavigate()
	let location = useLocation()

	const [token, setToken] = useState();
	const [tokenOptions, setTokenOptions] = useState();

	// RELOAD BUTTON
	const [reload, setReload] = useState(0);

	// NOTIFICACIONES
	const [alerts, setAlerts] = useState(null);
	const [alertsClassName, setAlertsClassName] = useState("");
	const [triggerAlert, setTriggerAlert] = useState(false);

	useEffect(() => {
		if (alerts !== "") setTriggerAlert(true)

	}, [alerts])

	const getToken = (token) => {
		setToken(token)
	}

	useEffect(() => {
		if (token !== undefined) {

			// TOKEN OPTIONS
			setTokenOptions({
				headers: {
					'Content-Type': 'application/json',
					[NameOfToken]: token,
				}
			})
		}
	}, [token])

	const createAlert = (text, classNames) => {
		setAlerts("")
		setTimeout(() => {
			setAlerts(text)
			setAlertsClassName(classNames)
		}, 2);
	}

	return (
		<>
			<Notificaciones alert={alerts} alertsClassName={alertsClassName} setAlerts={setAlerts} triggerAlert={triggerAlert} setTriggerAlert={setTriggerAlert} />

			<Routes>

				{/* TOKEN OPTIONS */}
				{/* TOKEN OPTIONS */}

				<Route
					path="/"
					exact
					element={<Navigate to="/login" replace />}
				/>

				{/* COMANDA */}
				<Route exact path='/login' element={<Login createAlert={createAlert} />} />
				<Route exact path='/pre' element={<PreConfig tokenOptions={tokenOptions} />} />
				<Route element={<TokenOptions getToken={getToken} />}>
					<Route element={
						<>
							<Footer setReload={setReload} reload={reload} tokenOptions={tokenOptions} />
						</>
					}>
						<Route element={<Auth />}>
							<Route exact path='/home' element={
								<>
									<Navbar
										tokenOptions={tokenOptions}
									/>
									<Home
										reload={reload}
										tokenOptions={tokenOptions}
										createAlert={createAlert}
									/>
								</>
							} />
						</Route>
					</Route>
				</Route>

				{/* COMANDA */}


			</Routes>

		</>
	);
}

export default App;