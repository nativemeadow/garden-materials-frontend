export function removeDuplicateCharacters(string: string) {
	return string
		.toLocaleLowerCase()
		.split('')
		.filter(function (item, pos, self) {
			return self.indexOf(item) === pos;
		})
		.join('');
}

// https://www.30secondsofcode.org/js/s/replace-last
export const replaceLast = (str: string, pattern: any, replacement: any) => {
	const match =
		typeof pattern === 'string'
			? pattern
			: (str.match(new RegExp(pattern.source, 'g')) || []).slice(-1)[0];
	if (!match) return str;
	const last = str.lastIndexOf(match);
	return last !== -1
		? `${str.slice(0, last)}${replacement}${str.slice(last + match.length)}`
		: str;
};

export const removeHtmlTags = (text: string) => {
	return text.replace(/(<([^>]+)>)/gi, '');
};
