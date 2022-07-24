import React, { Dispatch, SetStateAction } from 'react';
import configData from '../../../config.json';
import { Pricing } from '../../../shared/interfaces/product';

import classes from './product-detail.module.css';

type Props = {
	productThumbs: Pricing[] | undefined;
	selectedThumb: string | undefined;
	setSelectedThumb: Dispatch<SetStateAction<string | undefined>>;
	setProductImage: Dispatch<SetStateAction<string>>;
	setProductSku: Dispatch<SetStateAction<string>>;
	setProductOptions: Dispatch<SetStateAction<string>>;
	setSelectedValue: Dispatch<SetStateAction<string>>;
	productUnit: (units: string) => string;
	updateSelectedUnit: (unit: string) => void;
	updateThumbsImage: (unit: string) => void;
};

export default function ProductThumbs(props: Props) {
	const selectThumb = (
		event: React.MouseEvent<HTMLImageElement, MouseEvent>
	) => {
		const id = event.currentTarget.id.substring(6);
		if (props.productThumbs) {
			const selectedOption =
				props.productThumbs[+id].description +
				props.productThumbs[+id].units;
			props.updateSelectedUnit(props.productThumbs[+id].units);
			props.setSelectedThumb(props.productThumbs[+id].image);
			props.setProductImage(props.productThumbs[+id].image);
			props.setProductSku(props.productThumbs[+id].sku);
			props.setSelectedValue(selectedOption);
			const title = props.productUnit(selectedOption);
			props.setProductOptions(title);
			props.updateThumbsImage(props.productThumbs[+id].image);
			console.log('thumbs image:', props.productThumbs[+id].image);
		}
	};

	return (
		<div className={classes['product-detail_variations-grid']}>
			{props.productThumbs?.map((price: Pricing, index: number) => {
				return (
					<div key={index}>
						<img
							id={`thumb-${index}`}
							className={`
                                ${classes['product-detail_variations-image']} ${
								props.selectedThumb === price.image &&
								classes[
									'product-detail_variations-image-selected'
								]
							}
                            `}
							src={`${configData.IMAGES}/products/${price.image}`}
							alt={`${price.title}`}
							onClick={selectThumb}
						/>
					</div>
				);
			})}
		</div>
	);
}
