import React from 'react';

import classes from './Dropdown.module.css';

function Dropdown(props: { user: string; children: any }) {
	return (
		<div className={classes['dropdown']}>
			<div className={classes['dropbtn']}>{props.user}</div>
			<div className={classes['dropdown-content']}>{props.children}</div>
		</div>
	);
}

export default Dropdown;
