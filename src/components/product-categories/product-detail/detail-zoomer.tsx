/**
 * adapted from https://www.codesdope.com/blog/article/mouse-rollover-zoom-effect-on-images/
 */

import React, {
	useState,
	useRef,
	useEffect,
	useLayoutEffect,
	Suspense,
} from 'react';
// import { useImage } from 'react-image';
// import LoadingSpinner from '../../../shared/components/UIElements/LoadingSpinner';
import ZoomScript from './zoom-script';

import './detail-zoom.css';

type Props = {
	productImage: string;
	defaultImage: string;
	imagePath: string;
	alt?: string;
	imageLensSize?: string;
};

type lensType = {
	width: string;
	height: string;
};

const DetailZoom: React.FC<Props> = (
	{ productImage, defaultImage, imagePath, alt, imageLensSize },
	ref
) => {
	console.log('Rendering the Zoomer component');
	const containerRef = useRef<HTMLDivElement | null>(null);
	const imageRef = useRef<HTMLImageElement | null>(null);
	const lensRef = useRef<HTMLDivElement | null>(null);
	const resultRef = useRef<HTMLDivElement | null>(null);
	const lensSizeRef = useRef<lensType | null>(JSON.parse(imageLensSize!));
	console.log('lens:', lensSizeRef.current);

	const [backgroundImage, setBackGroundImage] = useState<string>();

	useLayoutEffect(() => {
		console.log('image:', imageRef.current!);
		const zoom = ZoomScript(
			containerRef.current!,
			imageRef.current!,
			lensRef.current!,
			resultRef.current!
		);
		return () => {
			zoom.deleteEventListeners();
		};
	}, [backgroundImage]);

	useEffect(() => {
		const img: string | undefined = imagePath + productImage || undefined;
		setBackGroundImage(img);
	}, [setBackGroundImage, productImage, imagePath]);

	return (
		<div className={'zoom-container'} ref={containerRef}>
			<div className='zoom-tint'></div>
			<img
				className={'zoom-image'}
				src={backgroundImage}
				alt={alt}
				ref={imageRef}
			/>
			<div
				className={'zoom-lens'}
				style={{ ...lensSizeRef.current }}
				ref={lensRef}></div>
			<div className={'zoom-result'} ref={resultRef}></div>
		</div>
	);
};

export default DetailZoom;
