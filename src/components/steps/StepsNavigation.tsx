/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentType, useState } from 'react';

import { FormikProps } from 'formik';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { ArrowButton, Container, Paragraph } from '@/shared/components';

export type Step = {
    component: ComponentType<any>;
    containerPaddingX?: '0' | '24';
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
                className={classNames(
                    'flex items-center justify-between gap-4 pb-6 text-light-black dark:text-white',
                    className,
                )}
                {...stepsProps}
            >
                <ArrowButton disabled={isPrevDisabled} onClick={handleStepBack} />
                <div className='flex h-2 w-[242px] overflow-hidden rounded-lg bg-theme-secondary-200 dark:bg-theme-secondary-600'>
                    <Container
                        style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                        bg='primary'
                        borderRadius='8'
                        width={((currentStep + 1) / totalSteps) * 100}
                    />
                </div>
                <Container padding='6'>
                    <Paragraph $typeset='body' fontWeight='medium'>
                        {currentStep + 1}/{totalSteps}
                    </Paragraph>
                </Container>
            </div>

            <div
                className={classNames('flex h-full flex-col', {
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
