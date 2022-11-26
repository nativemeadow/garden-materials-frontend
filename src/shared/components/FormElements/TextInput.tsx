import React, { useState } from 'react';
import './TextInput.css';

type Props = {
	id: string;
	label: string;
	errorMessage: string;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	inputProps: { [key: string]: any };
};

const TextInput: React.FC<Props> = (props: Props) => {
	const [focused, setFocused] = useState(false);
	const { id, label, errorMessage, onChange, inputProps } = props;

	const handleFocus = (event: React.ChangeEvent<HTMLInputElement>) => {
		setFocused(true);
	};

	return (
		<div className='TextInput'>
			<label>{label}</label>
			<input
				{...inputProps}
				onChange={onChange}
				onBlur={handleFocus}
				onFocus={() =>
					inputProps.name === 'confirmPassword' && setFocused(true)
				}
			/>
			<span>{errorMessage}</span>
		</div>
	);
};

export default TextInput;
