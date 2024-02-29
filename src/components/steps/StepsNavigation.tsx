import { ArrowButton, Container, FlexContainer, Paragraph } from '@/shared/components';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentType, useState } from 'react';

import { FormikProps } from 'formik';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

export type Step = {
    component: ComponentType<any>;
};

type StepNavigationProps<T> = React.ComponentProps<typeof StyledFlexContainer> & {
    steps: Step[];
    formik?: FormikProps<T>;
    disabledSteps?: number[];
    defaultStep?: number;
};

const StepsNavigation = <T extends Record<string, any>>({
    steps,
    formik,
    disabledSteps,
    defaultStep,
    ...stepsProps
}: StepNavigationProps<T>) => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState<number>(defaultStep || 0);
    const totalSteps = steps.length;

    const handleStepBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        } else {
            navigate(-1);
        }
    };

    const handleStepForward = () => {
        if (steps.length > currentStep + 1) {
            setCurrentStep(currentStep + 1);
            return;
        }
        formik?.submitForm();
    };

    const CurrentStepComponent = steps[currentStep].component;
    const isPrevDisabled = disabledSteps?.includes(currentStep);

    return (
        <>
            <StyledFlexContainer color='base' {...stepsProps}>
                <ArrowButton disabled={isPrevDisabled} onClick={handleStepBack} />
                <FlexContainer
                    height='8px'
                    borderRadius='8'
                    overflow='hidden'
                    bg='toggleInactive'
                    width='242px'
                >
                    <Container
                        style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                        bg='primary'
                        borderRadius='8'
                        width={((currentStep + 1) / totalSteps) * 100}
                    />
                </FlexContainer>
                <Container padding='6'>
                    <Paragraph $typeset='body' fontWeight='medium'>
                        {currentStep + 1}/{totalSteps}
                    </Paragraph>
                </Container>
            </StyledFlexContainer>
            <FlexContainer flexDirection='column' height='100%'>
                <CurrentStepComponent
                    goToNextStep={handleStepForward}
                    goToPrevStep={handleStepBack}
                    formik={formik}
                />
            </FlexContainer>
        </>
    );
};

const StyledFlexContainer = styled(FlexContainer)`
    grid-gap: 16px;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 24px;
`;

export default StepsNavigation;
