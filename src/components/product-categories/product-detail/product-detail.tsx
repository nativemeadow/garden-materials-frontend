import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';

import BreadCrumbs from '../../navigation/bread-crumbs';
import Modal from '../../../shared/components/UIElements/Modal';
import Button from '../../../shared/components/FormElements/SimpleButton';
//import ErrorModal from '../../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../../shared/components/UIElements/LoadingSpinner';
import { Product, Pricing } from '../../../shared/interfaces/product';
import { parser } from '../../../shared/util/html-parse';
import parse from 'html-react-parser';
import ProductBuilder from '../product-builder';
import configData from '../../../config.json';
import ProductCalculator from './product-calculator';
import httpFetch from '../../../shared/http/http-fetch';
// import Image from '../../../shared/components/UIElements/Images';
import { Items } from '../../../shared/interfaces/items';
import ProductThumbs from './product-thumbs';
import AddToCartForm from './product-form';
import DetailZoom from './detail-zoom';
import { useWindowSize } from '../../../shared/hooks/widowSize-hook';
import useStore from '../../../zustand/store';
import useShoppingCart from '../../../zustand/shoppingCart';

import classes from './product-detail.module.css';
import './product-detail.css';
import useManageCart from '../../../shared/hooks/use-manageCart';

const productLabelMessage = 'Please Select Product Options';
export type selectListOptions = {
	sku: string;
	price: number;
	units: string;
	description: string;
	image: string;
	coverage: string;
	coverage_value: number;
	online_minimum: number;
};
const ProductDetail = (props: any) => {
	const { productId, categoryId, sku } = useParams();

	const [products, setProducts] = useState<Product>();
	const [productSize, setProductSize] = useState('');
	const [productSku, setProductSku] = useState('');
	const [productOptions, setProductOptions] =
		useState<string>(productLabelMessage);
	const [selectList, setSelectList] = useState<selectListOptions[]>([]);
	const [selectedValue, setSelectedValue] = useState(String);
	const [showCalculator, setShowCalculator] = useState(false);
	const [showAddToCart, setShowAddToCart] = useState(false);
	const [productQty, setProductQty] = useState<number>(1);
	const [productImage, setProductImage] = useState('');
	const [productThumbs, setProductThumbs] = useState<Pricing[] | undefined>(
		[]
	);
	const [selectedThumb, setSelectedThumb] = useState<string>();
	const windowSize = useWindowSize();

	const selectedPriceRef = useRef(0);
	const selectedUnitRef = useRef('');
	const productImageRef = useRef('');
	const coverageValueRef = useRef(0);

	const {
		extendedValue,
		extendedRules,
		removeExtendedValue,
		removeExtendedRule,
	} = useStore();

	const { addItem } = useShoppingCart();

	const { add } = useManageCart();

	const navigate = useNavigate();

	const selectProductBySku = useCallback(
		(productOptions: any) => {
			if (sku) {
				for (const item of productOptions) {
					if (item.sku === sku) {
						setSelectedThumb(item.image);
						setProductSku(item.sku);
						updateSelectedUnit(item.units);
						if (item.image && item.image.length > 0) {
							setProductImage(item.image);
						}
					}
				}
			}
		},
		[sku]
	);

	const {
		isLoading,
		isError,
		data: productData,
		error,
	} = useQuery<Product, Error>(['product', productId], async () => {
		try {
			return await httpFetch<Product>(
				`${configData.BACKEND_URL}/products/${categoryId}/${productId}`
			);
		} catch (error: any) {
			throw new Error(error);
		}
	});

	useEffect(() => {
		// clear extended value and rules from zustand store when product detail is mounted
		removeExtendedValue();
		removeExtendedRule();
	}, []);

	useEffect(() => {
		let currentProduct;
		let pricing: Pricing[];
		if (productData) {
			currentProduct = ProductBuilder(productData);
			pricing = currentProduct.pricing;

			setProducts(currentProduct);
			setProductImage(currentProduct.image);
			pricing.forEach((price) => {
				coverageValueRef.current = price.coverage_value;
			});
			// only one unit price
			if (currentProduct && currentProduct.pricing.length === 1) {
				setProductSize(currentProduct.pricing[0].units);
			}

			productImageRef.current = currentProduct?.image;

			const productOptions = currentProduct.pricing.map((item) => {
				return {
					sku: item.sku,
					units: item.units,
					price: item.price,
					description: item.description,
					image: item.image,
					coverage: item.coverage,
					coverage_value: item.coverage_value,
					online_minimum: item.online_minimum,
				};
			});
			setSelectList(productOptions);

			selectProductBySku(productOptions);

			// get thumbnail images if any
			const thumbs = currentProduct.pricing.filter((price) => {
				return price.image && price.image.length > 0;
			});
			setProductThumbs(thumbs);

			if (currentProduct.pricing.length === 1) {
				setProductOptions(
					currentProduct?.pricing[0].title +
						`<span className=${classes['products-detail-pricing-usd-selected']}>$` +
						currentProduct?.pricing[0].price.toFixed(2) +
						'<span>'
				);
			}
		}
	}, [productData, selectProductBySku]);

	const updateProductPrice = (price: number) => {
		selectedPriceRef.current = price;
	};

	const productUnit = (units: string) => {
		let priceTitle = productLabelMessage;
		setProductSize(units);

		products?.pricing.forEach((price) => {
			if (price.description + price.units === units) {
				selectedPriceRef.current = price.price;
				return (priceTitle =
					price.title +
					`<span className=${classes['products-detail-pricing-usd-selected']}>$` +
					price.price.toFixed(2) +
					'</span>');
			}
		});
		return priceTitle;
	};

	const calculator = () => {
		return (
			<div className={classes['product-detail__calculator--button']}>
				<img
					src='/images/assets/calc-icon-sm.png'
					alt='calculator button'
					onClick={openCalculatorHandler}
				/>
				<div
					className={
						classes['product-detail__calculator--button__label']
					}>
					<span onClick={openCalculatorHandler}>Calculator</span>
				</div>
			</div>
		);
	};

	const filterPricing = () => {
		const filterPrices =
			products &&
			products.pricing.filter((value, index, array) => {
				return (
					index === array.findIndex((t) => t.price === value.price)
				);
			});

		return filterPrices?.map((price, key) => {
			return (
				<li key={key} id={`price-${price.key}`}>
					<span className={classes['products-detail-pricing-usd']}>
						${price.price.toFixed(2)}
					</span>
					&nbsp;/
					{parser(price.units)}
				</li>
			);
		});
	};

	const addToCartHandler = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const productJson: Items = {
			category_id: products?.categoryId,
			product_id: products?.id,
			// if the product does not have multiple pricing, then the sku comes for the parent product not from pricing
			sku: productSku ? productSku : products?.sku,
			title: products?.title,
			image: productImageRef.current,
			// if the product does not have multiple pricing, then the price comes for the first pricing element
			price: selectedPriceRef.current
				? selectedPriceRef.current
				: products?.pricing[0].price!,
			quantity: productQty,
			// if the product does not have multiple pricing, then the units comes for the first pricing element
			unit: selectedUnitRef.current
				? selectedUnitRef.current
				: products?.pricing[0].units,
			color: extendedValue,
		};

		const addCartItem = async () => {
			const cartItem = await add(productJson);
			if (cartItem) {
				addItem(cartItem);
			}
		};
		addCartItem();
		openAddToCartHandler();
	};

	const calculatorAddToCartHandler = (
		event: React.FormEvent<HTMLFormElement>
	) => {
		addToCartHandler(event);
		closeCalculatorHandler();
	};

	const imageHandler = () => {
		if (windowSize.width! > 768 && products?.imageLensSize) {
			return (
				<DetailZoom
					productImage={productImage}
					defaultImage={'default_image.png'}
					imagePath={`${configData.IMAGES}/products/`}
					imageLensSize={products?.imageLensSize}
					alt={products?.title !== undefined ? products?.title : ''}
				/>
			);
		}
		return (
			<img
				src={`${configData.IMAGES}/products/${productImage}`}
				alt={products?.title !== undefined ? products?.title : ''}
			/>
		);
	};

	const productSelectHandler = (
		event: React.ChangeEvent<HTMLSelectElement>
	) => {
		const selected = event.target.value;
		setSelectedValue(selected);
		const title = productUnit(selected);
		setProductOptions(title);
		// if there is thumb highlighted in the drop down select list.
		if (productThumbs) {
			selectList.forEach((item) => {
				if (item.description + item.units === selected) {
					setSelectedThumb(item.image);
					setProductSku(item.sku);
					updateSelectedUnit(item.units);
					if (item.image && item.image.length > 0) {
						setProductImage(item.image);
					}
				}
			});
		}
	};

	/**
	 * Used here and in product-thumbs component to set the value of
	 * the selectedUnit ref variable.
	 * @param unit
	 */
	const updateSelectedUnit = (unit: string) => {
		selectedUnitRef.current = unit;
	};

	const updateThumbsImage = (image: string) => {
		if (image && image.length > 0) {
			productImageRef.current = image;
			setProductImage(image);
		}
	};

	const openCalculatorHandler = () => {
		setShowCalculator(true);
	};

	const closeCalculatorHandler = () => {
		setShowCalculator(false);
	};

	const closeAddToCartHandler = () => {
		setShowAddToCart(false);
	};

	const viewShoppingCartHandler = () => {
		setShowAddToCart(false);
		navigate('/shopping-cart');
	};

	const openAddToCartHandler = () => {
		setShowAddToCart(true);
	};

	if (!products) {
		return null;
	}

	return (
		<>
			{products && (
				<BreadCrumbs categoryId={categoryId} productId={productId} />
			)}
			<Modal
				show={showCalculator}
				onCancel={closeCalculatorHandler}
				onSubmit={calculatorAddToCartHandler}
				header={'Calculator'}
				className='calculator__modal'
				headerClass={` font-bold text-lg ${classes['calculator_heading']}`}
				contentClass='calculator-item__modal-content'
				footerClass='calculator-item__modal-actions'>
				<div className={classes['calculator-container']}>
					<ProductCalculator
						products={products}
						productQty={productQty}
						selectedValue={selectedValue}
						setProductQty={setProductQty}
						setSelectedValue={setSelectedValue}
						updateSelectedUnit={updateSelectedUnit}
						setProductSku={setProductSku}
						productSelectHandler={productSelectHandler}
						updateProductPrice={updateProductPrice}
					/>
				</div>
			</Modal>
			<Modal
				show={showAddToCart}
				onCancel={closeAddToCartHandler}
				header={'Add to Cart'}
				headerClass='item__modal-header'
				contentClass='addToCart-item__modal-content'
				footerClass='addToCart-item__modal-actions'
				footer={
					<>
						<Button
							className={'addToCartButton'}
							onClick={viewShoppingCartHandler}>
							View Cart
						</Button>
						<Button
							className={'addToCartButton'}
							onClick={closeAddToCartHandler}>
							Continue Shopping
						</Button>
					</>
				}>
				<div className={classes['addToCart-dialog']}>
					<h2>Add to Cart</h2>
					<p>1 Item(s) Consolidated into cart.</p>
				</div>
			</Modal>
			<div className={classes['product-detail']}>
				{isLoading && (
					<div className='center'>
						<LoadingSpinner asOverlay />
					</div>
				)}
				{/* <ErrorModal error={error} onClear={clearError} /> */}
				{isError && <div className='error'>{error?.message}</div>}
				<div className={classes['product-detail-container']}>
					<div className={classes['product-detail__image']}>
						<div
							className={
								classes['product-detail__image--wrapper']
							}>
							{productImage && imageHandler()}
						</div>
						<ProductThumbs
							productThumbs={productThumbs}
							selectedThumb={selectedThumb}
							setSelectedThumb={setSelectedThumb}
							setProductImage={setProductImage}
							setProductSku={setProductSku}
							setSelectedValue={setSelectedValue}
							productUnit={productUnit}
							setProductOptions={setProductOptions}
							updateSelectedUnit={updateSelectedUnit}
							updateThumbsImage={updateThumbsImage}
						/>
					</div>
					<div className={classes['product-detail']}>
						<h1>
							{products?.title !== undefined
								? parser(products?.title)
								: ''}
						</h1>
						<ul className={classes['products-detail-pricing']}>
							{filterPricing()}
						</ul>
						<AddToCartForm
							products={products}
							productSize={productSize}
							productQty={productQty}
							selectedValue={selectedValue}
							selectList={selectList}
							productThumbs={productThumbs}
							productOptions={productOptions}
							setProductQty={setProductQty}
							addToCartHandler={addToCartHandler}
							productSelectHandler={productSelectHandler}
						/>
						{coverageValueRef.current ? calculator() : ''}
						<div className={classes['product-detail__description']}>
							{products?.description !== undefined
								? parse(products?.description)
								: ''}
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default ProductDetail;
