const sanitize = (str: string): string => {
	let result = '';
	for (let i = 0; i < str.length; i++) {
		const charCode = str.charCodeAt(i);
		if (
			(charCode >= 65 && charCode <= 90) || // A-Z
			(charCode >= 97 && charCode <= 122) || // a-z
			(charCode >= 1040 && charCode <= 1103) || // а-яА-Я
			(charCode >= 48 && charCode <= 57) || // 0-9
			charCode === 32
		) {
			result += str[i];
		}
	}
	return result.trim();
};

export const getFirstLetters = (str: string): string => {
	const words = str.split(' ').slice(0, 2).map(sanitize);

	if (words.length === 1) {
		return words[0].substring(0, 2);
	} else {
		const [firstWord, secondWord] = words;
		const firstLetter = firstWord.charAt(0);
		const secondLetter = secondWord.charAt(0);
		return `${firstLetter}${secondLetter}`;
	}
};
