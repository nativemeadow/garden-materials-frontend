import React from 'react';

import Modal from './Modal';
import Button from '../FormElements/SimpleButton';

interface Props {
	error: JSX.Element[] | undefined;
	onClear: () => void;
}

const ErrorModal: React.FC<Props> = (props) => {
	return (
		<Modal
			onCancel={props.onClear}
			header='An Error Occurred!'
			show={!!props.error}
			footer={<Button onClick={props.onClear}>Okay</Button>}>
			<div>{props.error}</div>
		</Modal>
	);
};

export default ErrorModal;
