import { useState, useEffect } from 'react';
import { Container, FlexContainer } from '@/shared/components';

export const ProgressBar = () => {
    const [activeBarIndex, setActiveBarIndex] = useState<number>(0);
    const [filledSegments, setFilledSegments] = useState<boolean[]>([false, false, false]);

    useEffect(() => {
        if (activeBarIndex !== 0) return;
        const timeout = setTimeout(() => {
            setFilledSegments([true, false, false]);
        }, 300);

        return () => {
            clearTimeout(timeout);
        };
    }, [activeBarIndex]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (activeBarIndex === filledSegments.length - 1) {
                setFilledSegments([false, false, false]);
                setActiveBarIndex(0);
                return;
            }
            const newArray = [...filledSegments];
            newArray[activeBarIndex + 1] = true;
            setFilledSegments(newArray);
            setActiveBarIndex((prevIndex) => (prevIndex + 1) % 3);
        }, 4900);

        return () => clearInterval(intervalId);
    }, [filledSegments]);

    const bars = filledSegments.map((isFilled, index) => (
        <Container
            key={index}
            width='100%'
            height='5px'
            backgroundColor='toggleInactive'
            position='relative'
            borderRadius='20'
            overflow='hidden'
        >
            <Container
                width={isFilled ? '100%' : 0}
                height='100%'
                backgroundColor='primary'
                borderRadius='24'
                style={{
                    transition:
                        activeBarIndex === index && isFilled ? 'width 5s ease-in-out' : 'unset',
                }}
            />
        </Container>
    ));

    return <FlexContainer gridGap='8px'>{bars}</FlexContainer>;
};
