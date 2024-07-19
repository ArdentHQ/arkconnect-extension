import { useEffect, useState } from 'react';
import cn from 'classnames';

export const ProgressBar = ({
    activeIndex,
    filledSegments,
}: {
    activeIndex: number;
    filledSegments: boolean[];
}) => {
    const [animateIndex, setAnimateIndex] = useState<number | null>(null);

    useEffect(() => {
        setAnimateIndex(activeIndex);
    }, [activeIndex]);

    const bars = filledSegments.map((isFilled, index) => {
        const shouldAnimate = index === animateIndex;

        return (
            <div
                key={index}
                className='relative h-1.25 w-full overflow-hidden rounded-2.5xl bg-theme-secondary-200 dark:bg-theme-secondary-600'
            >
                <div
                    className={cn(
                        'h-full rounded-3xl bg-theme-primary-700 dark:bg-theme-primary-650',
                        {
                            'w-full': isFilled && shouldAnimate || index < activeIndex,
                            'w-0': !isFilled || isFilled && !shouldAnimate,
                            'animate-fillProgress': shouldAnimate,
                        },
                    )}
                />
            </div>
        );
    });

    return <div className='flex gap-2'>{bars}</div>;
};
