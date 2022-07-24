export function removeDuplicateCharacters(string: string) {
	return string
		.toLocaleLowerCase()
		.split('')
		.filter(function (item, pos, self) {
			return self.indexOf(item) === pos;
		})
		.join('');
}
