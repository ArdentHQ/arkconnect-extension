export const formatDecimalNumber = (value: number, maxDecimalDigits: number = 8): number => {
    return Number(value.toFixed(maxDecimalDigits).replace(/\.?0+$/, ''));
};