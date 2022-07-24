import React, { useEffect, useState } from 'react';
import useImage from '../../shared/hooks/use-image';
import useGetImage from '../../shared/hooks/use-getImage';

import configData from '../../config.json';

const theImage = [
	`${configData.IMAGES}/products/1-2-1RedLaPazPebbles.jpg`,
	`${configData.IMAGES}/products/3-4crushedDrainRock.jpg`,
];

const GetImagesFromServer = function GetImagesFromServer() {
	const { src, error, getImage } = useGetImage('');

	getImage(theImage);

	return (
		<>
			<div>
				<img
					className='smartImage'
					src={src}
					alt={'test'}
					style={{ width: '500px' }}
				/>
			</div>
			{/* <div>
				<iframe
					width='100%'
					height='100%'
					title='test'
					frameBorder='0'
					allowFullScreen={true}
					src='https://www.youtube.com/embed/EFXUDCAyd4g'></iframe>
			</div> */}
		</>
	);
};

export default GetImagesFromServer;
