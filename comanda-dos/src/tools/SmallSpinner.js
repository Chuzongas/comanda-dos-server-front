import React from 'react';

const SmallSpinner = ({ show = true }) => {
	return (
		show ?
			<>
				<div style={{ display: 'grid', placeContent: 'center' }}>
					<i className="ri-loader-4-fill color-gray-2 spinner"></i>
				</div>
			</>
			: ''
	);
}

export default SmallSpinner;