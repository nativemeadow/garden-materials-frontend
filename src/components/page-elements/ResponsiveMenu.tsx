import React, { useState, useEffect } from 'react';
import { useWindowSize } from '../../shared/hooks/widowSize-hook';

import classes from './ResponsiveMenu.module.css';

export default function Hamburger(props: {
	openResponsive: boolean;
	setOpenResponsive: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	const [menuOpen, setMenuOpen] = useState(props.openResponsive);
	const windowSize = useWindowSize();

	function toggleOpen(event: React.MouseEvent<HTMLDivElement>) {
		event.preventDefault();
		setMenuOpen(!menuOpen);
		props.setOpenResponsive(!menuOpen);
	}

	const renderHamburger = () => {
		return (
			<>
				<div className={classes['bar1']}></div>
				<div className={classes['bar2']}></div>
				<div className={classes['bar3']}></div>
			</>
		);
	};

	useEffect(() => {
		if (windowSize.width! > 1024) {
			setMenuOpen(false);
		}
	}, [windowSize.width]);

	useEffect(() => {
		setMenuOpen(props.openResponsive);
		renderHamburger();
	}, [props.openResponsive]);

	return (
		<div
			className={`${classes['container']} ${
				menuOpen ? classes['change'] : ''
			}`}
			onClick={toggleOpen}>
			{renderHamburger()}
		</div>
	);
}
