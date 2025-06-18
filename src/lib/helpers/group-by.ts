import { FunctionReturning } from './types.js';

export const groupBy = <T>(iterable: T[], iteratee: FunctionReturning): object => {
    const groupedValues: Record<any, any> = {};

    for (const value of iterable) {
        const keyValue = iteratee(value);

        if (!groupedValues[keyValue]) {
            groupedValues[keyValue] = [];
        }

        groupedValues[keyValue].push(value);
    }

    return groupedValues;
};
