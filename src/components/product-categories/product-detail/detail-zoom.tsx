/**
 * adapted from https://www.codesdope.com/blog/article/mouse-rollover-zoom-effect-on-images/
 */

import React, { useState, useRef, useEffect, Suspense } from 'react';
import useImage from '../../../shared/hooks/use-image';
import useGetImage from '../../../shared/hooks/use-getImage';

// import { useImage } from 'react-image';
// import LoadingSpinner from '../../../shared/components/UIElements/LoadingSpinner';

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
	//@FIXME need the useTransition hook but cannot import useTransition hook; can't be found in react????
	// const { src } = useImage({
	// 	srcList: srcPath,
	// });

	console.log('Rendering the Zoom component');
	const [display, setDisplay] = useState('none');
	const [left, setLeft] = useState<string>('');
	const [top, setTop] = useState<string>('');

	const containerRef = useRef<HTMLDivElement | null>(null);
	const imageRef = useRef<HTMLImageElement | null>(null);
	const lensRef = useRef<HTMLDivElement | null>(null);
	const resultRef = useRef<HTMLDivElement | null>(null);
	const lensSizeRef = useRef<lensType | null>(JSON.parse(imageLensSize!));
	console.log('lens:', lensSizeRef.current);

	const [backgroundSize, setBackgroundSize] = useState<string>('');
	const [backgroundPosition, setBackgroundPosition] = useState<string>('');
	const [backgroundImage, setBackGroundImage] = useState<string>();
	const [defaultImageSrc, setDefaultImageSrc] = useState<string>();

	const [containerRect, setContainerRect] = useState<DOMRect>();
	const [imageRect, setImageRect] = useState<DOMRect>();
	const [lensRect, setLensRect] = useState<DOMRect>();
	const [resultRect, setResultRect] = useState<DOMRect>();
	const { src, error, getImage } = useGetImage('');

	useEffect(() => {
		const img: string | undefined = imagePath + productImage;
		setBackGroundImage(img);
	}, [setBackGroundImage, productImage, imagePath]);

	// useEffect(() => {
	// 	const img: string | undefined = imagePath + productImage;
	// 	const defaultImg: string | undefined = imagePath + defaultImage;

	// 	console.log('**** img:', img);
	// 	console.log('**** defaultImg:', defaultImg);

	// 	getImage([img]);
	// 	productImage;
	// }, [productImage, defaultImage, imagePath, getImage]);

	console.log('backgroundImage:', backgroundImage);

	function zoomImage(event: React.MouseEvent) {
		setContainerRect(containerRef?.current?.getBoundingClientRect());
		setImageRect(imageRef?.current?.getBoundingClientRect());
		setLensRect(lensRef?.current?.getBoundingClientRect());
		setResultRect(resultRef?.current?.getBoundingClientRect());
		const { x, y } = getMousePos(event);

		// lens only tracks to the right side of the image.
		if (x >= containerRect?.width! - lensRect?.width!) {
			return;
		}

		setDisplay('block');

		setLeft(`${x}px`);
		setTop(`${y}px`);

		const fx = resultRect?.width! / lensRect?.width!;
		const fy = resultRect?.height! / lensRect?.height!;

		setBackgroundSize(
			`${imageRect?.width! * fx}px ${imageRect?.height! * fy}px`
		);
		setBackgroundPosition(`-${x * fx}px -${y * fy}px`);
	}

	function hideZoom() {
		setDisplay('none');
	}

	function getMousePos(e: React.MouseEvent) {
		let x = e.clientX - containerRect?.left! - lensRect?.width! / 2;
		let y = e.clientY - containerRect?.top! - lensRect?.height! / 2;

		const minX = 0;
		const minY = 0;
		const maxX = containerRect?.width! - lensRect?.width!;
		const maxY = containerRect?.height! - lensRect?.height! - 3;

		if (x <= minX) {
			x = minX;
		} else if (x >= maxX) {
			x = maxX;
		}
		if (y <= minY) {
			y = minY;
		} else if (y >= maxY) {
			y = maxY;
		}

		console.log(x, y);
		return { x, y };
	}

	return (
		<div
			className={'zoom-container'}
			onMouseMove={zoomImage}
			onMouseOut={hideZoom}
			// onTouchStart={zoomImage}
			ref={containerRef}>
			<div className='zoom-tint'></div>
			{/* <Suspense fallback={<LoadingSpinner />}> */}
			<img
				className={'zoom-image'}
				src={backgroundImage}
				alt={alt}
				ref={imageRef}
			/>
			{/* </Suspense> */}
			<div
				className={'zoom-lens'}
				style={{
					display,
					top,
					left,
					...lensSizeRef.current,
				}}
				ref={lensRef}></div>
			<div
				className={'zoom-result'}
				ref={resultRef}
				style={{
					display,
					backgroundImage: `url(${backgroundImage})`,
					backgroundSize,
					backgroundPosition,
				}}></div>
		</div>
	);
};

export default DetailZoom;
