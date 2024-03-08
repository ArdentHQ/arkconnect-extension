import { ThemeValue } from 'styled-system';
import classNames from 'classnames';
import { ArrowButton, CloseButton, Container, Heading, Layout } from '@/shared/components';
import { Theme } from '@/shared/theme';

type Props = {
    children: React.ReactNode | React.ReactNode[];
    title: string;
    withStickyHeader?: boolean;
    hideCloseButton?: boolean;
    paddingBottom?: ThemeValue<'space', Theme>;
    onBack?: 'goHome' | 'goBack';
};

const SubPageLayout = ({
    children,
    title,
    withStickyHeader = false,
    hideCloseButton = true,
    onBack,
    paddingBottom = '16',
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
                        <Heading $typeset='h4' fontWeight='medium' color='base'>
                            {title}
                        </Heading>
                    </div>

                    {!hideCloseButton && <CloseButton />}
                </div>
            </div>
            <Container paddingX='16' paddingBottom={paddingBottom} height='100%'>
                {children}
            </Container>
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
