/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentType, useState } from 'react';

import { FormikProps } from 'formik';
import { useNavigate } from 'react-router-dom';
import cn from 'classnames';
import { twMerge } from 'tailwind-merge';
import { ArrowButton } from '@/shared/components';

export type Step = {
    component: ComponentType<any>;
    containerPaddingX?: '0' | '24';
    onClickBack?: () => void;
};

interface StepNavigationProps<T> extends React.HTMLAttributes<HTMLDivElement> {
    steps: Step[];
    formik?: FormikProps<T>;
    disabledSteps?: number[];
    defaultStep?: number;
    onStepChange?: (step: number) => void;
}

const StepsNavigation = <T extends Record<string, any>>({
    className,
    steps,
    formik,
    disabledSteps,
    defaultStep,
    onStepChange,
    ...stepsProps
}: StepNavigationProps<T>) => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState<number>(defaultStep || 0);
    const totalSteps = steps.length;

    const handleStepBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
            onStepChange?.(currentStep - 1);
        } else {
            navigate(-1);
            onStepChange?.(-1);
        }
        if (steps[currentStep].onClickBack) {
            steps[currentStep].onClickBack?.();
        }
    };

    const handleStepForward = () => {
        if (steps.length > currentStep + 1) {
            setCurrentStep(currentStep + 1);
            onStepChange?.(currentStep + 1);
            return;
        }
        formik?.submitForm();
    };

    const CurrentStepComponent = steps[currentStep].component;
    const isPrevDisabled = disabledSteps?.includes(currentStep);

    return (
        <>
            <div
                className={twMerge(
                    'flex items-center justify-between gap-4 pb-6 text-light-black dark:text-white',
                    className,
                )}
                {...stepsProps}
            >
                <ArrowButton disabled={isPrevDisabled} onClick={handleStepBack} />
                <div className='flex h-2 w-[242px] overflow-hidden rounded-lg bg-theme-secondary-200 dark:bg-theme-secondary-600'>
                    <div
                        style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                        className='rounded-lg bg-theme-primary-700 dark:bg-theme-primary-650'
                    />
                </div>
                <div className='p-1.5'>
                    <p className='typeset-body font-medium'>
                        {currentStep + 1}/{totalSteps}
                    </p>
                </div>
            </div>

            <div
                className={cn('flex h-full flex-col', {
                    'px-6': steps[currentStep].containerPaddingX === '24',
                    'px-0': steps[currentStep].containerPaddingX === '0',
                })}
            >
                <CurrentStepComponent
                    goToNextStep={handleStepForward}
                    goToPrevStep={handleStepBack}
                    formik={formik}
                />
            </div>
        </>
    );
};

export default StepsNavigation;
