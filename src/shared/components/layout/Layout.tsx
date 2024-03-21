import cn from 'classnames';
import { Header } from '@/shared/components';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    withHeader?: boolean;
    className?: string;
}

export const Layout = ({ withHeader = true, className, ...props }: Props) => {
    return (
        <>
            {withHeader && <Header />}
            <div
                className={cn(
                    'flex h-screen flex-col pb-4',
                    {
                        'pt-[59px]': withHeader,
                    },
                    className,
                )}
                {...props}
            />
        </>
    );
};
