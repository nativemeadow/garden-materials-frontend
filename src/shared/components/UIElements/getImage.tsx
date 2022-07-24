import React from 'react';
import useImage from '../../hooks/use-image';

interface Props {
	image: string;
	defaultImage: string;
	imageRef?: React.RefObject<HTMLImageElement>;
	cssClass?: string;
	alt?: string;
}

function GetImage({ image, defaultImage, imageRef, cssClass, alt }: Props) {
	const imagesArray = [image, defaultImage];
	const { src, error } = useImage(imagesArray);

	return !error ? (
		<img className={cssClass} src={src} alt={alt} ref={imageRef} />
	) : (
		<div>Error occurred</div>
	);
}

export default GetImage;
