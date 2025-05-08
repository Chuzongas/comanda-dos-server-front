import React, { useState } from 'react';

import RegisterSvg from '../../svg/RegisterSvg';
import OutsideClickHandler from 'react-outside-click-handler';
import Logo from '../../svg/Logo';
import NumbersKeyboard from '../../tools/NumbersKeyboard';
import Keyboard from '../../tools/Keyboard';

import { useTransition, animated } from 'react-spring'

import axios from 'axios'
import { NameOfToken } from '../../helpers/Helpers';
import { useNavigate } from 'react-router';

// import { userData, mesero, nombre, activo, cod_puesto, re_abrir, centro_consumo, imagen } from '../../helpers/DataOfUser'

const Login = ({ createAlert }) => {

	let navigate = useNavigate()

	// MAIN DATA
	const [password, setPassword] = useState("");

	const [focused, setFocused] = useState();
	const [showKeyboard, setShowKeyboard] = useState(false);
	const [keyboardPosition, setKeyboardPosition] = useState('down');

	const transitionEnter = useTransition(true, {
		from: { opacity: 0, },
		enter: { opacity: 1, },
		leave: { opacity: 0 },
	})

	const editFocused = (key) => {

		// let focused = document.getElementById('id-password')

		if (key === true) {
			let letPassword = password
			letPassword += " "
			setPassword(letPassword)
		} else if (key === false) {
			let letPassword = password
			letPassword = letPassword.slice(0, -1);
			setPassword(letPassword)
		} else {
			let letPassword = password
			letPassword = letPassword + key
			setPassword(letPassword)
		}

	}

	const showUpKeyboard = (elementFocused, e) => {

		//console.log(e.clientY > window.innerHeight / 2)
		if (e.clientY > window.innerHeight / 2) setKeyboardPosition("up");
		if (e.clientY < window.innerHeight / 2) setKeyboardPosition("down");

		setShowKeyboard(!showKeyboard);
		setFocused(elementFocused);

	}

	const login = () => {

		let data = {
			clave: password
		}

		axios.post('/api/auth/login', data)
			.then(res => {
				console.log(res.data);

				// ES ADMIN
				if (res.data.admin) {

					localStorage.setItem("userData", JSON.stringify({
						terminales: res.data.usuario.terminales,
						usuario: res.data.usuario.usuario,
					}))

					localStorage.setItem(NameOfToken, res.data.token)
					goToHomeAdmin()

					return
				}

				localStorage.setItem("userData", JSON.stringify({
					terminales: res.data.usuario.terminales,
					usuario: res.data.usuario.usuario,
				}))

				localStorage.setItem(NameOfToken, res.data.token)
				goNextPage()
			})
			.catch(err => {
				console.log(err.response.data)

				if (err.response)

					if (typeof err.response.data === 'string' || err.response.data instanceof String) {
						if (err.response.data.includes("Usuario o Contraseña Invalidos")) {
							createAlert("Nip incorrecto", "bgc-red white")
						}
					} else if (Object.keys(err.response.data).length === 0) {
						createAlert("Nip incorrecto", "bgc-red white")
					} else {
						createAlert("Nip incorrecto", "bgc-red white")
					}

			})
	}

	const goNextPage = () => {
		navigate('/home', { replace: false })
	}

	const goToHomeAdmin = () => {
		navigate('/home', { replace: false })
	}

	return (
		transitionEnter((style, visible) => (
			visible &&
			<animated.div style={style}>
				<Keyboard show={showKeyboard} setShow={setShowKeyboard} editFocused={editFocused} position={keyboardPosition} />

				<div className='container' style={{ display: 'flex', justifyContent: 'center', height: '100vh', alignItems: "center" }}>
					<div className='cool-shadow my-2 radius' style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', maxWidth: '500px' }}>
						<div style={{ display: 'flex', flexDirection: 'column', padding: '24px' }}>
							<Logo style={{ height: '50px' }} />
							<h3 className='text-center'>Utilicé contraseña</h3>
							<OutsideClickHandler
								onOutsideClick={(e) => {
									if (e.target.className !== undefined) {
										if (!e.target.className.toString().includes('keyboard')) {
											setFocused()
										}
									}
								}}
							>
								<div className={`chido-container ${focused === "id-password" && 'focused'}`} onClick={(e) => { setFocused("id-password") }} style={{ display: 'flex', position: 'relative', marginBottom: '12px' }}>
									<input onChange={(e) => setPassword(e.target.value)} required value={password} className="chido-input" type="password" name='password' id='id-password' style={{ width: '100%', padding: '10px 48px 10px 10px' }} />
									<span className='chido-span'>Contraseña</span>
									<i onClick={(e) => { showUpKeyboard("id-password", e) }} className="ri-keyboard-box-fill color-gray-2 pointer" style={{ fontSize: '32px', position: 'absolute', marginRight: '10px', right: '0px' }}></i>
								</div>
								<NumbersKeyboard value={password} setValue={setPassword} action={login} />
							</OutsideClickHandler>
						</div>
						{/* <div style={{ display: 'flex', flexFlow: 'column', justifyContent: 'center', alignItems: 'center', padding: '24px', maxWidth: '300px', margin: 'auto' }}>
							<div style={{ height: '100%', width: '100%', display: 'flex' }}>
								<RegisterSvg style={{ width: '100%' }} />
							</div>
						</div> */}
					</div>
				</div>
			</animated.div>
		))
	);
}

export default Login;