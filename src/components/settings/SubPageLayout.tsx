import classNames from 'classnames';
import { ArrowButton, CloseButton, HeadingTODO, Layout } from '@/shared/components';

type Props = {
    children: React.ReactNode | React.ReactNode[];
    title: string;
    withStickyHeader?: boolean;
    hideCloseButton?: boolean;
    noPaddingBottom?: boolean;
    onBack?: 'goHome' | 'goBack';
};

const SubPageLayout = ({
    children,
    title,
    withStickyHeader = false,
    hideCloseButton = true,
    onBack,
    noPaddingBottom = false,
}: Props) => {
    if (!onBack) {
        onBack = hideCloseButton ? 'goHome' : 'goBack';
    }
    return (
        <Layout>
            <div
                className={classNames(
                    'flex items-center justify-between bg-subtle-white p-4 dark:bg-light-black',
                    {
                        'sticky top-[50px]': withStickyHeader,
                    },
                )}
            >
                <div className='flex w-full items-center justify-between'>
                    <div className='flex items-center gap-3'>
                        <ArrowButton action={onBack} />
                        <HeadingTODO level={4}>{title}</HeadingTODO>
                    </div>

                    {!hideCloseButton && <CloseButton />}
                </div>
            </div>
            <div
                className={classNames('h-full px-4', {
                    'pb-4': !noPaddingBottom,
                })}
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
            className={classNames(
                'flex w-full items-center justify-between px-4 py-4.5 text-light-black hover:bg-theme-secondary-50 dark:text-white dark:hover:bg-theme-secondary-700',
                {
                    'bg-theme-primary-50 font-medium text-theme-primary-700 dark:bg-theme-primary-650/15 dark:text-theme-primary-650':
                        active,
                },
                className,
            )}
            {...properties}
        />
    );
};

export default SubPageLayout;
