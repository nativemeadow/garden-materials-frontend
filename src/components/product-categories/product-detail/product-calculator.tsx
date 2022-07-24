import React, {
	useState,
	useEffect,
	useRef,
	Dispatch,
	SetStateAction,
	ReactElement,
} from 'react';
import { Product, Pricing } from '../../../shared/interfaces/product';
import { selectListOptions } from './product-detail';
import { round } from '../../../shared/util/math-utilities';

import parse from 'html-react-parser';

import classes from './product-calculator.module.css';

type Props = {
	products: Product;
	productQty: number;
	selectedValue: string;
	setProductQty: Dispatch<SetStateAction<number>>;
	setSelectedValue: Dispatch<SetStateAction<string>>;
	updateSelectedUnit: (unit: string) => void;
	setProductSku: Dispatch<SetStateAction<string>>;
	productSelectHandler: (event: React.ChangeEvent<HTMLSelectElement>) => void;
	updateProductPrice: (price: number) => void;
};

const ProductCalculator: React.FC<Props> = ({
	products,
	productQty,
	selectedValue,
	setProductQty,
	setSelectedValue,
	updateSelectedUnit,
	setProductSku,
	productSelectHandler,
	updateProductPrice,
}) => {
	console.log('Calculator props:', products, productQty);

	//const store = useStore((state) => state);

	const [minDeliveryQty, setMinDeliveryQty] = useState('');
	const [costPerUnit, setCostPerUnit] = useState('');
	const [hasUsack, setHasUsack] = useState(false);
	const [neededUnit, setNeededUnit] = useState('');
	const [selectList, setSelectList] = useState<selectListOptions[]>([]);
	const [width, setWidth] = useState('');
	const [length, setLength] = useState('');
	const [sqrFootage, setSqrFootage] = useState('');
	const [coverage, setCoverage] = useState<{
		coverage: string;
		coverageValue: number;
	}>({ coverage: '', coverageValue: 0 });

	const calculatedAreaRef = useRef('');
	const minDeliveryQtyRef = useRef('');
	const costPerUnitRef = useRef('');
	const subTotalRef = useRef('');
	const uSackNeededRef = useRef('');
	const depthRef = useRef<HTMLInputElement | null>(null);
	const depthMeasureRef = useRef('12');

	const size = 5;

	const uSackSegment = (): any => {
		return (
			<>
				<div className={classes['calculated-usacks-needed']}>
					<span className={classes['calculated-unit']}>
						U-sacks Needed:
					</span>
					<span className={classes['calculated-amount']}>
						{uSackNeededRef.current}
					</span>
				</div>
				<div className={classes['calculator-message-wrapper']}>
					<span className={classes['calculator-disclaimer']}>
						U-Sacks are not available for purchase online. Please
						visit our store to U-Sack it yourself!
					</span>
				</div>
			</>
		);
	};

	const selectFromProducts = () => {
		return (
			selectList.length! > 1 && (
				<select
					name='product_select'
					value={selectedValue}
					onChange={productSelectHandler}
					className={classes['mult-calc']}>
					<option value=''>Select size</option>
					{selectList.map((price, key) => {
						return (
							<option
								key={key}
								value={price.description + price.units}>
								{price.description}
							</option>
						);
					})}
				</select>
			)
		);
	};

	interface UnitsKey {
		[key: string]: ReactElement;
	}

	const quantityNeededLabel: UnitsKey = {
		ton: <div>Tons Needed</div>,
		yd: (
			<div
				className={`${classes['calculated-amount-result-grp']} ${classes['calculated-yards-amount-result-grp']}`}>
				<span id='cubic-label' className={classes['calculated-label']}>
					Cubic Yards
				</span>
				<span className={classes['calculated-label-mm']}>
					(yd<sup>3</sup>)
				</span>
				<span>Needed:</span>
			</div>
		),
	};

	interface ResultLabelsIf {
		[key: string]: { [key: string]: ReactElement };
	}

	const resultsLabels: ResultLabelsIf = {
		ton: {
			needed: (
				<span className={classes['calculated-label']}>Tons needed</span>
			),
			deliverymin: (
				<>
					<span className={classes['calculated-label']}>
						Online Minimum
					</span>
					<span className={classes['mm']}>(1 ton For Delivery)</span>
				</>
			),
			cost: (
				<span className={classes['calculated-label']}>Cost / ton</span>
			),
		},
		yd: {
			needed: (
				<>
					<span className={classes['calculated-label']}>
						Cubic Yards
					</span>
					<span className={classes['mm']}>
						(yd<sup>3</sup>)
					</span>
				</>
			),
			deliverymin: (
				<>
					<span className={classes['calculated-label']}>
						Online Minimum (yd<sup>3</sup>)
					</span>
					<span className={classes['mm']}>(1 yard For Delivery)</span>
				</>
			),
			cost: (
				<span className={classes['calculated-label']}>
					Cost / yd<sup>3</sup>
				</span>
			),
		},
	};

	useEffect(() => {
		for (let idx in products.pricing) {
			if (products.pricing[idx].units === 'sk') {
				console.log('calc for usack');
				setHasUsack(true);
			} else {
				setNeededUnit(products.pricing[idx].units);
			}
		}

		const selectProds = products.pricing
			.filter((item) => item.units !== 'sk')
			.map((item: Pricing) => {
				return {
					sku: item.sku,
					price: item.price,
					units: item.units,
					description: item.description,
					image: item.image,
					coverage: item.coverage,
					coverage_value: item.coverage_value,
					online_minimum: item.online_minimum,
				};
			});
		setSelectList(selectProds);
		setMinDeliveryQty(selectProds[0].online_minimum.toFixed(2));
		setCostPerUnit(selectProds[0].price.toFixed(2));
		setCoverage({
			coverage: selectProds[0].coverage,
			coverageValue: selectProds[0].coverage_value,
		});
		setSelectedValue(selectProds[0].description + selectProds[0].units);
		updateSelectedUnit(selectProds[0].units);
		setProductSku(selectProds[0].sku);
		updateProductPrice(selectProds[0].price);
	}, [
		products,
		setSelectedValue,
		updateSelectedUnit,
		setProductSku,
		updateProductPrice,
	]);

	const lengthChangeHandler = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const length = event.target.value;
		console.log('change to length:', length);
		setLength(length);
	};

	const widthChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
		const width = event.target.value;
		console.log('change to width:', width);
		setWidth(width);
	};

	const sqFootChangeHandler = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const sqrFt = event.target.value;
		console.log('change to footage:', sqrFt);
		setSqrFootage(sqrFt);
	};

	const depthMessagedByChangeHandler = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const depthBy = event.target.value;

		// setDepthMeasure(depthBy);
		depthMeasureRef.current = depthBy;
		console.log('depth is by', depthBy);
	};

	const calculateAmounts = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();

		const enteredLength = parseFloat(length);
		const enteredWidth = parseFloat(width);
		const enteredSqrFootage = parseFloat(sqrFootage);
		let calculatedArea = 0;
		let cost = 0;

		const enteredDepth = parseFloat(depthRef.current?.value!);
		const enteredDepthMeasure = parseFloat(depthMeasureRef.current);
		minDeliveryQtyRef.current = minDeliveryQty;
		costPerUnitRef.current = costPerUnit;

		if (enteredLength || enteredWidth) {
			calculatedArea =
				(enteredLength *
					enteredWidth *
					(enteredDepth / enteredDepthMeasure)) /
				27;
		} else if (enteredSqrFootage) {
			calculatedArea =
				(enteredSqrFootage * (enteredDepth / enteredDepthMeasure)) / 27;
		}
		setProductQty(round(calculatedArea));
		cost =
			parseFloat(minDeliveryQty) > calculatedArea
				? parseFloat(minDeliveryQty) *
				  parseFloat(costPerUnitRef.current)
				: calculatedArea * parseFloat(costPerUnitRef.current);

		subTotalRef.current = cost.toFixed(2);
		calculatedAreaRef.current = calculatedArea.toFixed(2);
		uSackNeededRef.current = (calculatedArea / 0.037037).toFixed();
	};

	const resetCalculator = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		setLength('');
		setWidth('');
		setSqrFootage('');
		calculatedAreaRef.current = '';
		depthRef.current!.value = '';
		minDeliveryQtyRef.current = '';
		costPerUnitRef.current = '';
		subTotalRef.current = '';
		uSackNeededRef.current = '';
	};

	return (
		<div className={classes['modal']}>
			<div className={classes['container']}>
				<div className={`${classes['input-cell']}`}>
					<label className={classes['calc-label']}>length</label>
					<input
						id='calc-length'
						type='text'
						name='length'
						value={length}
						size={size}
						maxLength={size}
						className={classes['calc-input']}
						onChange={lengthChangeHandler}
						disabled={!!sqrFootage}
					/>
					<div className={classes['calc-detail']}>feet</div>
				</div>
				<div className={`${classes['do-grp']} ${classes['maths']}`}>
					<span>×</span>
				</div>

				<div className={`${classes['input-cell']}`}>
					<label className={classes['calc-label']}>width</label>
					<input
						id='calc-width'
						type='text'
						name='width'
						value={width}
						size={size}
						maxLength={size}
						className={classes['calc-input']}
						onChange={widthChangeHandler}
						disabled={!!sqrFootage}
					/>
					<div className={classes['calc-detail']}>feet</div>
				</div>

				<div className={`${classes['do-grp']} ${classes['txtlabel']}`}>
					<span>or</span>
				</div>

				<div className={`${classes['input-cell']}`}>
					<label className={classes['calc-label']}>
						square footage
					</label>
					<input
						id='calc-sqrfoot'
						type='text'
						name='sqrfoot'
						value={sqrFootage}
						size={size}
						maxLength={size}
						className={`${classes['calc-input']}`}
						onChange={sqFootChangeHandler}
						disabled={!!width && !!length}
					/>
					<div className={classes['calc-detail']}>
						ft<sup>2</sup>
					</div>
				</div>

				<div className={`${classes['do-grp']} ${classes['maths']}`}>
					<span>×</span>
				</div>

				<div className={`${classes['input-cell']}`}>
					<label className={classes['calc-label']}>depth</label>
					<input
						id='calc-depth'
						type='text'
						name='depth'
						size={size}
						maxLength={size}
						className={classes['calc-input']}
						ref={depthRef}
					/>
					<ul className={classes['depth-radio-set']}>
						<li className='pl-1'>
							<input
								id='calc-inch'
								name='depthMeasure'
								type='radio'
								value='12'
								defaultChecked={
									depthMeasureRef.current === '12'
								}
								onChange={depthMessagedByChangeHandler}
							/>
							inches
						</li>
						<li className='pl-1 pt-1'>
							<input
								id='calc-foot'
								name='depthMeasure'
								type='radio'
								value='1'
								onChange={depthMessagedByChangeHandler}
							/>
							feet
						</li>
					</ul>
				</div>
				<div
					className={`${classes['input-cell']} ${classes['calculate-button']}`}>
					<button
						id='go-calc'
						name='calculateButton'
						className='button go-calc'
						onClick={calculateAmounts}>
						Calculate
					</button>
					<button
						id='reset-calc'
						className={`${classes['calc-detail']} ${classes['calc-reset']}`}
						onClick={resetCalculator}>
						Reset
					</button>
				</div>
			</div>
			<div className={classes['calculated-amount-needed']}>
				<div className={classes['calculated-unit']}>
					{quantityNeededLabel[neededUnit]}
				</div>
				<div className={classes['calculated-amount']}>
					{calculatedAreaRef.current}
				</div>
			</div>
			<div className={classes['calculator-separator-line']}></div>
			{hasUsack && (
				<>
					<div className={classes['calculated-amount-needed']}>
						{hasUsack && uSackSegment()}
					</div>
					<div className={classes['calculator-separator-line']}></div>
				</>
			)}

			<div className={classes['calculated-amount-result']}>
				<div
					className={`row-start-1 row-end-1 col-start-1 col-span-1 ${classes['calculated-amount-result-wrapper']}`}>
					<div className={classes['calculated-amount-result-grp']}>
						{neededUnit && resultsLabels[neededUnit].needed}
					</div>
				</div>
				<div
					className={`row-start-2 row-end-2 col-start-1 col-span-1 md:row-start-1 md:row-end-1 md:col-start-2 md:col-span-1 ${classes['calculated-amount-result-grp']}`}>
					{neededUnit && resultsLabels[neededUnit].deliverymin}
				</div>
				<div
					className={`row-start-3 row-end-3 col-start-1 col-span-1 md:row-start-1 md:row-end-1 md:col-start-3  md:col-span-1 ${classes['maths']}`}>
					<span>×</span>
				</div>
				<div
					className={`row-start-4 row-end-4 col-start-1 col-span-1 md:row-start-1 md:row-end-1 md:col-start-4 md:col-span-1 ${classes['calculated-amount-result-grp']}`}>
					{neededUnit && resultsLabels[neededUnit].cost}
				</div>
				<div
					className={`row-start-5 row-end-5 col-start-1 col-span-1 md:row-start-1 md:row-end-1 md:col-start-5 md:col-span-1 ${classes['maths']}`}>
					<span>=</span>
				</div>
				<div
					className={`row-start-6 row-end-6 col-start-1 col-span-1 md:row-start-1 md:row-end-1 md:col-start-6 md:col-span-1 ${classes['calculated-amount-result-grp']}`}>
					<span className={classes['calculated-label']}>
						Subtotal
					</span>
				</div>
				<div
					className={`row-start-1 row-end-1 col-start-2 md:row-start-2 md:row-end-2 md:col-start-1 col-span-1  ${classes['calculated-amount-result-grp']}`}>
					<span
						id='cubic-result'
						className={classes['calculated-total-amount']}>
						{calculatedAreaRef.current}
					</span>
				</div>
				<div
					className={`row-start-2 row-end-2 col-start-2 col-span-1 md:row-start-2 md:row-end-2 md:col-start-2 md:col-span-1 ${classes['calculated-amount-result-grp']}`}>
					<span className={classes['calculated-total-amount']}>
						{minDeliveryQtyRef.current}
					</span>
				</div>
				<div
					className={`row-start-3 col-start-2 row-end-3 col-span-1  md:row-start-2 md:row-end-2 md:col-start-3 md:col-span-1 ${classes['calculated-amount-result-grp']}`}></div>
				<div
					className={`row-start-4 row-end-4 col-start-2 col-span-1  md:row-start-2 md:row-end-2 md:col-start-4 md:col-span-1 ${classes['calculated-amount-result-grp']}`}>
					<span className={classes['calculated-total-amount']}>
						{costPerUnitRef.current}
					</span>
				</div>
				<div
					className={`row-start-5 row-end-5 col-start-2col-span-1  md:row-start-2 md:row-end-2 md:col-start-1  ${classes['calculated-amount-result-grp']}`}></div>
				<div
					className={`row-start-6 row-end-6 col-start-2 col-span-1  md:row-start-2 md:row-end-2 md:col-start-6  md:col-span-1 ${classes['calculated-amount-result-grp']}`}>
					<span className={classes['calculated-total-amount']}>
						{subTotalRef.current}
					</span>
				</div>
			</div>
			<div className={classes['select-product']}>
				{selectFromProducts()}
			</div>
			<div className={classes['select-product']}>
				<input
					className={classes['add-to-cart']}
					type='submit'
					value='Add to Cart'
				/>
			</div>
		</div>
	);
};

export default ProductCalculator;
