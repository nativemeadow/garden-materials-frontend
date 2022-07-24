/**
 *
 * @param errorList - comma separated list of server side generated errors.
 * @returns JSX
 * @todo: enhance the messaging so the server response code displays
 *        above the error messages.
 */
export function formatError(errorList: string | null, cssClass: string) {
	let errorArray = errorList?.split(',');
	return errorArray?.map((error, key) => {
		return (
			<li key={key} className={cssClass}>
				{error}
			</li>
		);
	});
}
