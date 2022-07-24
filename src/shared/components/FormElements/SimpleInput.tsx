import React, { useReducer, useEffect } from 'react';
import { validate } from '../../util/validators';

import styles from './SimpleInput.module.css';

type action = {
	type: string;
	value?: string | number;
	validators?: any;
};

const inputReducer = (state: any, action: action) => {
	switch (action.type) {
		case 'CHANGE':
			return {
				...state,
				value: action.value,
				isValid: validate(action.value, action.validators),
			};
		case 'TOUCH':
			return {
				...state,
				isTouched: true,
			};
		default:
			return state;
	}
};

const initialValue = (props: Props) => {
	console.log(`${props.label}:`, props.value);
	const initialValue = {
		value: props.value,
		isTouched: false,
		isValid: props.initialIsValid || false,
	};
	return initialValue;
};

interface Props {
	id: string;
	type: string;
	name: string;
	value: string;
	onInput: (id: string, value: string | number, isValid: boolean) => void;
	placeholder: string;
	label: string;
	validators: any[];
	errorText?: string;
	initialIsValid?: boolean;
	parentStyles?: { readonly [key: string]: string };
	cssField?: string;
	cssErrorWrapper?: string;
}

const SimpleInput: React.FC<Props> = (props: Props) => {
	const [inputState, dispatch] = useReducer(
		inputReducer,
		initialValue(props)
	);

	const { id, onInput } = props;
	const { value, isValid } = inputState;
	const errorWrapperCSS = props.cssErrorWrapper
		? props.cssErrorWrapper
		: 'col-start-2';

	const classes = props.parentStyles
		? { ...styles, ...props.parentStyles }
		: styles;

	useEffect(() => {
		onInput(id, value, isValid);
	}, [id, value, isValid, onInput]);

	const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
		console.log(`in SimpleInput onChangeHandler: ${event.target.value}`);
		dispatch({
			type: 'CHANGE',
			value: event.target.value,
			validators: props.validators,
		});
	};

	const onBlurHandler = (event: React.FocusEvent<HTMLInputElement>) => {
		console.log(event.target.value);
		dispatch({
			type: 'TOUCH',
		});
	};

	return (
		<div
			data-input-id={props.id}
			className={`${classes['form-fields-grid']} ${
				classes['form-control']
			} ${
				!inputState.isValid &&
				inputState.isTouched &&
				classes['form-control--invalid']
			}
			}`}>
			<label className={classes['form-field-label']} htmlFor={props.id}>
				{props.label}
			</label>
			<input
				className={classes['form-field']}
				type={props.type}
				id={props.id}
				data-input-id={props.id}
				name={props.name}
				placeholder={props.placeholder}
				value={inputState.value}
				onChange={onChangeHandler}
				onBlur={onBlurHandler}
			/>

			<div className={`${classes.required}`}>
				{classes.required && '*'}
			</div>
			<div className={`relative ${errorWrapperCSS}`}>
				{!inputState.isValid && inputState.isTouched && (
					<p className={`error w-full ${classes.error}`}>
						{props.errorText}
					</p>
				)}
			</div>
		</div>
	);
};

export default SimpleInput;
