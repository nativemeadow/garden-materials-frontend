import { useReducer, useCallback } from 'react';

// describes the the form state item.
export interface formStateItemIf {
	value: string | number | Date;
	isValid: boolean;
}

// describes the form state JSON object that contains 1 to n form state items
export interface formStateIf {
	[key: string]: formStateItemIf;
}

export interface actionIf {
	type: string;
	inputId: string | null;
	value: string | number | null;
	inputs?: formStateIf;
	isValid: boolean;
	forIsValid?: boolean | null;
}

interface stateIf {
	inputs: formStateIf;
	isValid: boolean;
}

const formReducer = (state: any, action: actionIf) => {
	switch (action.type) {
		case 'INPUT_CHANGE':
			let formIsValid = true;
			for (const inputId in state.inputs) {
				if (!state.inputs[inputId]) {
					continue;
				}
				formIsValid =
					inputId === action.inputId
						? formIsValid && action.isValid
						: formIsValid && state.inputs[inputId].isValid;
			}
			return {
				...state,
				inputs: {
					...state.inputs,
					[action.inputId as string]: {
						value: action.value,
						isValid: action.isValid,
					},
				},
				isValid: formIsValid,
			};
		case 'SET_DATA':
			console.log('SET_DATA', action.inputs);
			return {
				inputs: action.inputs,
				isValid: action.forIsValid,
			};
		default:
			return state;
	}
};

export const useForm = (
	initialInputs: formStateIf,
	initialFormValidity: boolean
) => {
	const [formState, dispatch] = useReducer(formReducer, {
		inputs: initialInputs,
		isValid: initialFormValidity,
	});

	const inputHandler = useCallback(
		(id: string, value: string | number, isValid: boolean) => {
			dispatch({
				type: 'INPUT_CHANGE',
				value,
				isValid,
				inputId: id,
			});
		},
		[]
	);

	const setFormData = useCallback(
		(inputData: formStateIf, formValidity: boolean) => {
			dispatch({
				type: 'SET_DATA',
				isValid: true,
				inputId: null,
				value: null,
				inputs: inputData,
				forIsValid: formValidity,
			});
		},
		[]
	);

	return [formState, inputHandler, setFormData];
};
