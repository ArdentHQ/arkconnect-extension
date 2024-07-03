import { useEffect, useState } from 'react';
import cn from 'classnames';

export const ProgressBar = ({ itemsLength }: {itemsLength: number}) => {
    const [activeBarIndex, setActiveBarIndex] = useState<number>(0);
    const [filledSegments, setFilledSegments] = useState<boolean[]>(Array(itemsLength).fill(false));

    useEffect(() => {
        if (activeBarIndex !== 0) return;
        const timeout = setTimeout(() => {
            setFilledSegments([true, ...Array(itemsLength - 1).fill(false)]);
        }, 300);

        return () => {
            clearTimeout(timeout);
        };
    }, [activeBarIndex]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (activeBarIndex === filledSegments.length - 1) {
                setFilledSegments(Array(itemsLength).fill(false));
                setActiveBarIndex(0);
                return;
            }
            const newArray = [...filledSegments];
            newArray[activeBarIndex + 1] = true;
            setFilledSegments(newArray);
            setActiveBarIndex((prevIndex) => (prevIndex + 1) % itemsLength);
        }, 4900);

        return () => clearInterval(intervalId);
    }, [filledSegments, itemsLength]);

    const bars = filledSegments.map((isFilled, index) => (
        <div
            key={index}
            className='relative h-1.25 w-full overflow-hidden rounded-2.5xl bg-theme-secondary-200 dark:bg-theme-secondary-600'
        >
            <div
                className={cn('h-full rounded-3xl bg-theme-primary-700 dark:bg-theme-primary-650', {
                    'w-full': isFilled,
                    'w-0': !isFilled,
                })}
                style={{
                    transition:
                        activeBarIndex === index && isFilled ? 'width 5s ease-in-out' : 'unset',
                }}
            />
        </div>
    ));

    return <div className='flex gap-2'>{bars}</div>;
};
