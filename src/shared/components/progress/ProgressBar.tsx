import { useEffect, useState } from 'react';
import cn from 'classnames';

export const ProgressBar = ({ itemsLength, activeIndex }: { itemsLength: number, activeIndex: number }) => {
    const [filledSegments, setFilledSegments] = useState<boolean[]>(Array(itemsLength).fill(false));

    useEffect(() => {
        const newFilledSegments = Array(itemsLength).fill(false).map((_, index) => index <= activeIndex);
        setFilledSegments(newFilledSegments);
    }, [activeIndex, itemsLength]);

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
                    transition: isFilled ? 'width 5s ease-in-out' : 'unset',
                }}
            />
        </div>
    ));

    return <div className='flex gap-2'>{bars}</div>;
};
