import React from 'react';

const Spinner = ({show = true}) => {
	return (
		show ?
		<>
			<div className='bgc-gray-opacity' style={{ height: '100vh', width:'100%', display:'grid', placeContent:'center', position:'fixed', zIndex:'2000', top:'0', left:'0' }}>
				<i className="ri-loader-4-fill color-gray-2 spinner"></i>
			</div>
		</>
		:''
	);
}

export default Spinner;