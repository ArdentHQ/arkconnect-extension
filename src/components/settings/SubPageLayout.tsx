import cn from 'classnames';
import { twMerge } from 'tailwind-merge';
import { ArrowButton, CloseButton, Heading, Layout } from '@/shared/components';

type Props = {
    children: React.ReactNode | React.ReactNode[];
    title: string;
    withStickyHeader?: boolean;
    hideCloseButton?: boolean;
    withPaddingBottom?: boolean;
    onBack?: 'goHome' | 'goBack';
    className?: string;
    bodyClassName?: string;
    footer?: React.ReactNode;
    sideButton?: React.ReactNode;
};

const SubPageLayout = ({
    children,
    title,
    withStickyHeader = false,
    hideCloseButton = true,
    onBack,
    withPaddingBottom = false,
    className,
    bodyClassName,
    footer,
    sideButton,
}: Props) => {
    if (!onBack) {
        onBack = hideCloseButton ? 'goHome' : 'goBack';
    }
    return (
        <Layout withPadding={false}>
            <div
                className={twMerge(
                    cn(
                        'flex h-[calc(100vh-59px)] flex-col',
                        {
                            'pb-4': withPaddingBottom,
                        },
                        className,
                    ),
                )}
            >
                <div className='custom-scroll compensate-scroll flex flex-1 flex-col'>
                    <div
                        className={cn(
                            'bg-subtle-white dark:bg-light-black flex items-center justify-between p-4',
                            {
                                'sticky top-0': withStickyHeader,
                            },
                        )}
                    >
                        <div className='flex w-full items-center justify-between'>
                            <div className='flex items-center gap-3'>
                                <ArrowButton action={onBack} />
                                <Heading level={4}>{title}</Heading>
                            </div>

                            {!hideCloseButton && <CloseButton />}
                            {sideButton}
                        </div>
                    </div>

                    <div className={twMerge('px-4', bodyClassName)}>{children}</div>
                </div>

                {footer && <div className='w-full flex-none'>{footer}</div>}
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
                    'text-light-black hover:bg-theme-secondary-50 dark:hover:bg-theme-secondary-700 flex w-full items-center justify-between px-4 py-4.5 dark:text-white',
                    {
                        'bg-theme-primary-50 text-theme-primary-700 dark:bg-theme-primary-650/15 dark:text-theme-primary-650 font-medium':
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
