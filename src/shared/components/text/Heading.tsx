import { twMerge } from 'tailwind-merge';

interface Props extends React.HTMLAttributes<HTMLHeadingElement> {
    level: 2 | 3 | 4;
}

export const Heading = ({ level, className, ...properties }: Props) => {
    if (level === 4) {
        return (
            <h4
                className={twMerge(
                    'text-light-black text-lg leading-[23px] font-medium dark:text-white',
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
                    'text-light-black text-xl leading-[25px] font-bold dark:text-white',
                    className,
                )}
                {...properties}
            />
        );
    }

    return (
        <h2 className={twMerge('text-2xl leading-[30px] font-bold', className)} {...properties} />
    );
};
