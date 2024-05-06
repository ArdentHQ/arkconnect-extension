import cn from 'classnames';
import { twMerge } from 'tailwind-merge';
import { ArrowButton, CloseButton, Heading, Layout } from '@/shared/components';

type Props = {
    children: React.ReactNode | React.ReactNode[];
    title: string;
    withStickyHeader?: boolean;
    hideCloseButton?: boolean;
    noPaddingBottom?: boolean;
    onBack?: 'goHome' | 'goBack';
    className?: string;
};

const SubPageLayout = ({
    children,
    title,
    withStickyHeader = false,
    hideCloseButton = true,
    onBack,
    noPaddingBottom = false,
    className
}: Props) => {
    if (!onBack) {
        onBack = hideCloseButton ? 'goHome' : 'goBack';
    }
    return (
        <Layout>
            <div
                className={cn(
                    'flex items-center justify-between bg-subtle-white p-4 dark:bg-light-black',
                    {
                        'sticky top-12.5': withStickyHeader,
                    },
                )}
            >
                <div className='flex w-full items-center justify-between'>
                    <div className='flex items-center gap-3'>
                        <ArrowButton action={onBack} />
                        <Heading level={4}>{title}</Heading>
                    </div>

                    {!hideCloseButton && <CloseButton />}
                </div>
            </div>
            <div
                className={cn('h-full px-4', {
                    'pb-4': !noPaddingBottom,
                }, className)}
            >
                {children}
            </div>
        </Layout>
    );
};

interface SettingsRowItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    active?: boolean;
}

export const SettingsRowItem = ({
    active = false,
    className,
    ...properties
}: SettingsRowItemProps) => {
    return (
        <button
            type='button'
            className={twMerge(
                cn(
                    'flex w-full items-center justify-between px-4 py-4.5 text-light-black hover:bg-theme-secondary-50 dark:text-white dark:hover:bg-theme-secondary-700',
                    {
                        'bg-theme-primary-50 font-medium text-theme-primary-700 dark:bg-theme-primary-650/15 dark:text-theme-primary-650':
                            active,
                    },
                ),
                className,
            )}
            {...properties}
        />
    );
};

export default SubPageLayout;
