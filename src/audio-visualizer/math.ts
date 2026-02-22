export const clamp = (value: number, min: number, max: number): number => {
	return Math.min(max, Math.max(min, value));
};

export const lerp = (from: number, to: number, by: number): number => {
	return from + (to - from) * by;
};

export const average = (values: readonly number[]): number => {
	if (values.length === 0) {
		return 0;
	}

	const sum = values.reduce((acc, value) => acc + value, 0);
	return sum / values.length;
};
