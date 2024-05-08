import cn from 'classnames';
import { twMerge } from 'tailwind-merge';
import { Header } from '@/shared/components';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    withHeader?: boolean;
    className?: string;
    withPadding?: boolean;
}

export const Layout = ({ withHeader = true, className, withPadding = true, ...props }: Props) => {
    return (
        <>
            {withHeader && <Header />}
            <div
                className={twMerge(
                    cn('flex h-screen flex-col', {
                        'pt-[59px]': withHeader,
                        'pb-4': withPadding,
                    }),
                    className,
                )}
                {...props}
            />
        </>
    );
};
