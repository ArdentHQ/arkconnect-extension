import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { UnitConverter } from '@arkecosystem/typescript-crypto';
import {
    DEFAULT_FEE_OPTION,
    DEFAULT_VIEW_TYPE,
    InputFeeOption,
    InputFeeOptions,
    InputFeeProperties,
    InputFeeViewType,
} from './InputFee.contracts';

import { InputFeeAdvanced } from './blocks/InputFeeAdvanced';
import { InputFeeSimple } from './blocks/InputFeeSimple';
import { calculateGasFee } from './InputFee.helpers';
import { BigNumber, get } from '@/lib/helpers';
import { Switch } from '@/shared/components';
import { Network } from '@/lib/mainsail/network';
import { DISPLAY_DECIMALS } from '@/lib/domains/transaction/utils';

export const getFeeMinMax = (network: Network) => {
    const milestone = network.milestone();

    const minGasPrice = BigNumber.make(
        UnitConverter.formatUnits(
            BigNumber.make(milestone['gas']['minimumGasPrice'] ?? 0).toString(),
            'gwei',
        ).toString(),
    );

    const maxGasPrice = BigNumber.make(
        UnitConverter.formatUnits(
            BigNumber.make(milestone['gas']['maximumGasPrice'] ?? 0).toString(),
            'gwei',
        ).toString(),
    );

    const minGasLimit = BigNumber.make(milestone['gas']['minimumGasLimit'] ?? 0);
    const maxGasLimit = BigNumber.make(milestone['gas']['maximumGasLimit'] ?? 0);

    return { maxGasLimit, maxGasPrice, minGasLimit, minGasPrice };
};

export const InputFee: React.FC<InputFeeProperties> = memo(
    ({
        min,
        avg,
        max,
        disabled,
        network,
        loading,
        onChangeGasPrice,
        estimatedGasLimit,
        onChangeGasLimit,
        gasPrice,
        gasLimit,
        ...properties
    }: InputFeeProperties) => {
        const { t } = useTranslation();

        const viewType = properties.viewType ?? DEFAULT_VIEW_TYPE;
        const selectedFeeOption = properties.selectedFeeOption ?? DEFAULT_FEE_OPTION;

        const ticker = network.ticker();

        const blockTime = get(network.milestone(), 'timeouts.blockTime') as number;

        const options: InputFeeOptions = {
            [InputFeeOption.Slow]: {
                displayValue: BigNumber.make(calculateGasFee(min, gasLimit)).decimalPlaces(
                    DISPLAY_DECIMALS,
                ),
                displayValueConverted: BigNumber.ZERO,
                gasPrice: min,
                label: t('TRANSACTION.FEES.SLOW'),
            },
            [InputFeeOption.Average]: {
                displayValue: BigNumber.make(calculateGasFee(avg, gasLimit)).decimalPlaces(
                    DISPLAY_DECIMALS,
                ),
                displayValueConverted: BigNumber.ZERO,
                gasPrice: avg,
                label: t('TRANSACTION.FEES.AVERAGE'),
            },
            [InputFeeOption.Fast]: {
                displayValue: BigNumber.make(calculateGasFee(max, gasLimit)).decimalPlaces(
                    DISPLAY_DECIMALS,
                ),
                displayValueConverted: BigNumber.ZERO,
                gasPrice: max,
                label: t('TRANSACTION.FEES.FAST'),
            },
        };

        const onChangeViewType = (newValue: InputFeeViewType) => {
            properties.onChangeViewType?.(newValue);

            if (newValue === InputFeeViewType.Simple) {
                onChangeGasPrice(options[selectedFeeOption].gasPrice);
                onChangeGasLimit(estimatedGasLimit);
            }
        };

        const onChangeOption = (newValue: InputFeeOption) => {
            properties.onChangeFeeOption?.(newValue);
            onChangeGasPrice(options[newValue].gasPrice);
        };

        const renderAdvanced = () => (
            <InputFeeAdvanced
                blockTime={blockTime}
                network={network}
                disabled={disabled || loading}
                onChangeGasPrice={(gasPrice: BigNumber | number | string) => {
                    const value = gasPrice === '' ? 0 : gasPrice;
                    onChangeGasPrice(BigNumber.make(value));
                }}
                onChangeGasLimit={(gasLimit: BigNumber | number | string) => {
                    const value = gasLimit === '' ? 0 : gasLimit;
                    onChangeGasLimit(BigNumber.make(value));
                }}
                gasPrice={gasPrice}
                gasLimit={gasLimit}
            />
        );

        if (disabled) {
            return renderAdvanced();
        }

        return (
            <div data-testid='InputFee' className='relative'>
                <div className='absolute right-0 -mt-7'>
                    <Switch
                        disabled={loading}
                        size='sm'
                        value={viewType}
                        onChange={onChangeViewType}
                        leftOption={{
                            label: t('TRANSACTION.INPUT_FEE_VIEW_TYPE.SIMPLE'),
                            value: InputFeeViewType.Simple,
                        }}
                        rightOption={{
                            label: t('TRANSACTION.INPUT_FEE_VIEW_TYPE.ADVANCED'),
                            value: InputFeeViewType.Advanced,
                        }}
                    />
                </div>

                {viewType === InputFeeViewType.Simple && (
                    <InputFeeSimple
                        blockTime={blockTime}
                        options={options}
                        loading={loading || !ticker}
                        ticker={ticker}
                        selectedOption={selectedFeeOption}
                        onChange={onChangeOption}
                    />
                )}

                {viewType === InputFeeViewType.Advanced && renderAdvanced()}
            </div>
        );
    },
);

InputFee.displayName = 'InputFee';
