import { useEffect, useState } from 'react';
import cn from 'classnames';

export const ProgressBar = ({ itemsLength, activeSlide, setActiveSlide }: { itemsLength: number, activeSlide: number, setActiveSlide: (slide: number) => void }) => {
    const [filledSegments, setFilledSegments] = useState<boolean[]>(Array(itemsLength).fill(false));

    useEffect(() => {
        const timeout = setTimeout(() => {
            setFilledSegments([true, ...Array(itemsLength - 1).fill(false)]);
            setActiveSlide(0);
        }, 300);

        return () => {
            clearTimeout(timeout);
        };
    }, [itemsLength, setActiveSlide]);

    // Update filled segments when activeSlide changes
    useEffect(() => {
        setFilledSegments(() => {
            const newSegments = Array(itemsLength).fill(false);
            for (let i = 0; i <= activeSlide; i++) {
                newSegments[i] = true;
            }
            return newSegments;
        });
    }, [activeSlide, itemsLength]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (activeSlide === itemsLength - 1) {
                setFilledSegments(Array(itemsLength).fill(false));
                setActiveSlide(0);
                return;
            }
            setFilledSegments((prevSegments) => {
                const newSegments = [...prevSegments];
                newSegments[activeSlide + 1] = true;
                return newSegments;
            });
            setActiveSlide((prevSlide) => (prevSlide + 1) % itemsLength);
        }, 4900);

        return () => clearInterval(intervalId);
    }, [activeSlide, itemsLength, setActiveSlide]);

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
                        activeSlide === index && isFilled ? 'width 5s ease-in-out' : 'unset',
                }}
            />
        </div>
    ));

    return <div className='flex gap-2'>{bars}</div>;
};
