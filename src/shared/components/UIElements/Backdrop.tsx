import React from 'react';
import ReactDOM from 'react-dom';

import './Backdrop.css';

interface Props {
	onClick: () => void;
}

const Backdrop: React.FC<Props> = (props) => {
	return ReactDOM.createPortal(
		<div className='backdrop' onClick={props.onClick}></div>,
		document.getElementById('backdrop-hook') as HTMLDivElement
	);
};

export default Backdrop;
