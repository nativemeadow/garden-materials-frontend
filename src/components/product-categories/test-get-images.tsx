import React from 'react';
import GetImage from '../../shared/components/UIElements/getImage';
import configData from '../../config.json';

const theImage = [
	`${configData.IMAGES}/products/1-2-1RedLaPazPebbles.jpg`,
	`${configData.IMAGES}/products/3-4crushedDrainRock.jpg`,
];

export default function TestGetImages() {
	return (
		<div>
			<GetImage
				image={theImage[0]}
				defaultImage={theImage[1]}
				cssClass={'smartImage'}
			/>
		</div>
	);
}
