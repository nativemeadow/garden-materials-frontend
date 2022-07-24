// export function ZoomInit(container: HTMLDivElement, image: HTMLImageElement, lens: HTMLDivElement, result: HTMLDivElement) {}

export default function ZoomScript(
	container: HTMLDivElement,
	image: HTMLImageElement,
	lens: HTMLDivElement,
	result: HTMLDivElement
) {
	// const container: HTMLDivElement = document.querySelector('.container')!;
	// const image: HTMLImageElement = document.querySelector('.image')!;
	// const lens: HTMLDivElement = document.querySelector('.lens')!;
	// const result: HTMLDivElement = document.querySelector('.result')!;

	console.log('ZoomScript image: ', image);
	const containerRect = container.getBoundingClientRect();
	const imageRect = image.getBoundingClientRect();
	const lensRect = lens.getBoundingClientRect();
	const resultRect = result.getBoundingClientRect();

	container?.addEventListener('mousemove', zoomImage);
	container?.addEventListener('mouseout', hideZoom);

	lens.style.display = 'none';
	result.style.display = 'none';

	console.log('Is dom instance', image instanceof Element);
	console.log('Image element: ', image);
	console.log('ZoomScript image src: ', image.src);
	console.log('ZoomScript image alt: ', image.alt);
	console.log('Lens: ', lens);

	console.log('container: ', containerRect, lensRect);
	console.log('imageRect: ', imageRect, resultRect);

	result.style.backgroundImage = `url(${image.src})`;

	function deleteEventListeners() {
		container?.removeEventListener('mousemove', zoomImage);
		container?.removeEventListener('mouseout', hideZoom);
	}

	function zoomImage(e: MouseEvent) {
		console.log('zoom image', e.clientX, e.clientY);
		const { x, y } = getMousePos(e);

		lens.style.display = 'block';
		result.style.display = 'block';

		lens.style.left = `${x}px`;
		lens.style.top = `${y}px`;

		console.log('zoom image left: ', x, 'top: ', y);
		console.log(
			'lens rec with:',
			lensRect.width,
			'height:',
			lensRect.height
		);
		const fx = resultRect.width / lensRect.width;
		const fy = resultRect.height / lensRect.height;

		result.style.backgroundSize = `${imageRect.width * fx}px ${
			imageRect.height * fy
		}px`;
		result.style.backgroundPosition = `-${x * fx}px -${y * fy}px`;
	}

	function hideZoom() {
		result.style.display = 'none';
		lens.style.display = 'none';
	}

	function getMousePos(e: MouseEvent) {
		let x = e.clientX - containerRect.left - lensRect.width / 2;
		let y = e.clientY - containerRect.top - lensRect.height / 2;

		const minX = 0;
		const minY = 0;
		const maxX = containerRect.width - lensRect.width;
		const maxY = containerRect.height - lensRect.height;

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

		return { x, y };
	}

	return {
		deleteEventListeners: deleteEventListeners,
	};
}
