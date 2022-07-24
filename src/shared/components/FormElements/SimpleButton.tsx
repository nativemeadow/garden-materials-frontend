import React from 'react';
import { Link } from 'react-router-dom';

import './SimpleButton.css';

type Props = {
	href?: string;
	to?: string;
	inverse?: string;
	size?: string;
	danger?: string;
	type?: 'button' | 'submit' | 'reset' | undefined;
	onClick?: () => void;
	disabled?: true | false;
	children: string;
	override?: string;
	className?: string;
};

const SimpleButton = (props: Props) => {
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
			} ${props.inverse ? 'button--inverse' : ''} ${
				props.danger ? 'button--danger' : ''
			}`}
			type={props.type}
			onClick={props.onClick}
			disabled={props.disabled}>
			{props.children}
		</button>
	);
};

export default SimpleButton;
