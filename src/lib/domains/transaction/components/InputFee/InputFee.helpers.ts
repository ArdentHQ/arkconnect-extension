import { UnitConverter } from '@arkecosystem/typescript-crypto';
import { BigNumber } from '@/lib/helpers';

export const useStepMath = (step: number, value: number | string) => ({
    decrement: () =>
        BigNumber.make(value)
            .minus(BigNumber.make(step))
            .toFixed(12)
            .replace(/\.?0+$/, ''),
    increment: () =>
        BigNumber.make(value)
            .plus(step)
            .toFixed(12)
            .replace(/\.?0+$/, ''),
});

export const calculateGasFee = (gasPrice?: BigNumber, gasLimit?: BigNumber): BigNumber => {
    if (!gasPrice || !gasLimit) {
        return BigNumber.ZERO;
    }

    return BigNumber.make(
        UnitConverter.formatUnits(gasLimit.times(gasPrice).toString(), 'gwei').toString(),
    );
};
