export function formatDate(date: string) {
	if (date.length === 0) {
		return date;
	}
	const newData = new Date(date);
	return newData.toISOString().split('T')[0];
}
