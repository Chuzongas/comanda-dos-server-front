import React, { useEffect } from 'react';
import { NameOfToken } from './Helpers';
import { Outlet } from 'react-router';


const TokenOptions = ({ getToken }) => {


	let letToken = localStorage.getItem(NameOfToken)

	useEffect(() => {

		// console.log('cambio el token a', localStorage.getItem(NameOfToken));

		getToken(localStorage.getItem(NameOfToken))
	}, [letToken, getToken])

	return (
		<>
			<Outlet />
		</>
	);
}

export default TokenOptions;