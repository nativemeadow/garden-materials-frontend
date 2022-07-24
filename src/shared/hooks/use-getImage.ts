import React, { useEffect, useState, useRef, useCallback } from 'react';

function useGetImage(srcPath: string | string[] | null) {
	const [src, setSrc] = useState('');
	const [error, setError] = useState<Error | null>(null);
	const success = useRef(false);
	const responseStatus = useRef<number>(200);

	const fetchImage = useCallback(async (imagePath: string) => {
		console.log('called fetchImage', imagePath);

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
	}, []);

	const fetchAll = useCallback(
		async function fetchAllImages(imagePaths: string[]) {
			await Promise.allSettled(imagePaths.map(fetchImage));
		},
		[fetchImage]
	);

	const getImage = useCallback(
		(srcPath: string | string[]) => {
			if (!srcPath) {
				return;
			}

			if (Array.isArray(srcPath) && srcPath.length > 0) {
				fetchAll(srcPath);
			} else {
				fetchImage(srcPath as string);
			}
		},
		[fetchAll, fetchImage]
	);

	useEffect(() => {
		if (srcPath) {
			getImage(srcPath);
		}
	}, [getImage, srcPath]);

	return { src, error, getImage };
}

export default useGetImage;
