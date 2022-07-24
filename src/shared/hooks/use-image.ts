import { useEffect, useState, useRef } from 'react';

const useImage = (srcPath: string | string[] | null) => {
	const [src, setSrc] = useState('');
	const [error, setError] = useState<Error | null>(null);
	const success = useRef(false);
	const responseStatus = useRef<number>(200);

	useEffect(() => {
		function fetchImage(imagePath: string) {
			console.log('called fetchIt', imagePath);

			fetch(imagePath)
				.then((response) => {
					if (!response.ok) {
						responseStatus.current = response.status;
						setError(new Error('Could not fetch image'));
					}
					return response.blob();
				})
				.then((objectUrl) => {
					if (!success.current && responseStatus.current === 200) {
						setSrc(imagePath);
						success.current = true;
					}
					responseStatus.current = 200;
				})
				.catch((error) => {
					setError(error);
				});
		}

		async function fetchAllImages(imagePaths: string[]) {
			await Promise.allSettled(imagePaths.map(fetchImage));
		}

		if (!srcPath) {
			return;
		}

		if (Array.isArray(srcPath) && srcPath.length > 0) {
			fetchAllImages(srcPath);
		} else {
			fetchImage(srcPath as string);
		}
	}, [srcPath]);

	return { src, error };
};

export default useImage;
