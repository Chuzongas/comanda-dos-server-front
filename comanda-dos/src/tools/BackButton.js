import React from 'react';

import { useHistory } from 'react-router';

const BackButton = () => {

	let history = useHistory()

	const goBack = () =>{
		history.goBack()
	}

	return (
		<>
			<div className="container" >
				<div onClick={goBack} className='bgc-gray-opacity radius-super pointer' style={{display:'inline-grid', placeContent:'center', height:'48px', width:'48px',position:'absolute', zIndex:'100', top:'4px'}}>
					<i style={{fontSize:'32px', fontWeight:'bold', pointerEvents:'none'}} className="ri-arrow-left-s-line pointer"></i>
				</div>
			</div>
		</>
	);
}

export default BackButton;