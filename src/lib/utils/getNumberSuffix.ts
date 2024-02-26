const getNumberSuffix = (number: number): string => {
  if (number === 1) {
    return '1st';
  } else if (number === 2) {
    return '2nd';
  } else if (number === 3) {
    return '3rd';
  } else if (number >= 4 && number <= 20) {
    return `${number}th`;
  } else {
    const lastDigit = number % 10;
    if (lastDigit === 1) {
      return `${number}st`;
    } else if (lastDigit === 2) {
      return `${number}nd`;
    } else if (lastDigit === 3) {
      return `${number}rd`;
    } else {
      return `${number}th`;
    }
  }
};

export default getNumberSuffix;
