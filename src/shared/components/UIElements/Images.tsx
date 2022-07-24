import React, { Suspense } from 'react';
import { useImage } from 'react-image';
// import useImage from '../../../shared/hooks/use-image';

import LoadingSpinner from '../../../shared/components/UIElements/LoadingSpinner';

type ImageData = {
	src: string[];
	alt: string;
	cssClass?: string;
	onClick?: () => {};
};
function ImageComponent(props: ImageData) {
	const { src } = useImage({
		srcList: props.src,
	});

	return (
		<img
			src={src}
			alt={props.alt}
			className={props.cssClass}
			onClick={props.onClick}
		/>
	);
}

export default function Image(props: ImageData) {
	// console.log('Image props:', props);
	return (
		<Suspense fallback={<LoadingSpinner />}>
			<ImageComponent {...props} />
		</Suspense>
	);
}
