import styled from 'styled-components';
import { ThemeValue } from 'styled-system';
import classNames from 'classnames';
import {
    ArrowButton,
    CloseButton,
    Container,
    FlexContainer,
    Heading,
    Layout,
} from '@/shared/components';
import { Theme } from '@/shared/theme';
import { isFirefox } from '@/lib/utils/isFirefox';

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

export const SettingsRowItem = styled(FlexContainer)`
    padding: 18px 16px;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;

    ${({ theme }) => `
    color: ${theme.colors.base};
    &.active {
      color: ${theme.colors.primary};
      background-color: ${theme.colors.lightGreen};
      font-weight: ${theme.fontWeights.medium} !important;
    }

    ${isFirefox ? theme.browserCompatibility.firefox.focus : ''}

    &:hover {
      background-color: ${theme.colors.lightestGray};
    }
  `}
`;

export default SubPageLayout;
