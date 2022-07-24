import React from 'react';
import { Link } from 'react-router-dom';

import './Button.css';

type Props = {
	href?: string;
	to?: string;
	inverse?: string;
	size?: string;
	danger?: string;
	type?: string;
	onClick?: () => void;
	disabled?: false;
	children: string;
	override?: string;
};

const Button = (props: any) => {
	if (props.href) {
		return (
			<a
				href={props.href}
				className={`button button--${props.size || 'default'}
				${props.inverse && 'button--inverse'}
				${props.danger && 'button--danger'}`}>
				{props.children}
			</a>
		);
	}
	if (props.to) {
		return (
			<Link
				to={props.to}
				className={`button button--${props.size || 'default'} ${
					props.inverse && 'button--inverse'
				} ${props.danger && 'button--danger'}`}>
				{props.children}
			</Link>
		);
	}
	return (
		<button
			className={`${props.override || 'button'} button--${
				props.size || 'default'
			} ${props.inverse && 'button--inverse'} ${
				props.danger && 'button--danger'
			}`}
			type={props.type}
			onClick={props.onClick}
			disabled={props.disabled}>
			{props.children}
		</button>
	);
};

export default Button;
