import React from 'react';

interface Props {
	title: string;
	description?: string;
	content?: string;
}

const ContentWrapper = (props: Props) => {
	return (
		<div>
			<h1>{props.title}</h1>
			<p>{props?.description}</p>
		</div>
	);
};
export default ContentWrapper;
