import { twMerge } from 'tailwind-merge';

interface Props extends React.HTMLAttributes<HTMLHeadingElement> {
    level: 2 | 3 | 4;
}

export const Heading = ({ level, className, ...properties }: Props) => {
    if (level === 4) {
        return (
            <h4
                className={twMerge(
                    'text-lg font-medium leading-[23px] text-light-black dark:text-white',
                    className,
                )}
                {...properties}
            />
        );
    }

    if (level === 3) {
        return (
            <h3
                className={twMerge(
                    'text-xl font-bold leading-[25px] text-light-black dark:text-white',
                    className,
                )}
                {...properties}
            />
        );
    }

    return (
        <h2 className={twMerge('text-2xl font-bold leading-[30px]', className)} {...properties} />
    );
};
