import React, { useEffect, useState } from 'react';

import axios from 'axios';
import { NameOfToken } from './Helpers'
import Spinner from '../tools/Spinner';
import { useNavigate } from 'react-router';
import { Outlet } from 'react-router-dom'

const Auth = () => {

	let navigate = useNavigate();

	const [user, setUser] = useState(undefined);
	const [redirect, setRedirect] = useState({
		redirect: false,
		url: ''
	});

	useEffect(() => {
		var jwt = localStorage.getItem(NameOfToken)

		if (!jwt) {
			setRedirect({
				redirect: true,
				url: '/login'
			})
			return
		}


		var options = {
			headers: {
				[NameOfToken]: jwt
			}
		}

		axios.get(`/api/auth`, options)
			.then(res => {
				setUser(res.data)
			})
			.catch(err => {
				localStorage.removeItem(NameOfToken)
				setRedirect({
					redirect: true,
					url: '/login'
				})
			})
	}, [])

	if (redirect.redirect) {
		navigate("/login", { replace: true });
	}
	if (user === undefined) {
		return (
			<Spinner show={true} />
		)
	}

	return (
		<Outlet />
	);

}
export default Auth;