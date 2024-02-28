import RequestedBy from './RequestedBy';
import { FlexContainer, Heading, Icon, IconDefinition } from '@/shared/components';
import useThemeMode from '@/lib/hooks/useThemeMode';
import cn from 'classnames';

type Props = {
    appLogo?: string;
    appDomain: string;
    icon: IconDefinition;
    actionLabel: string;
    iconClassNames?: string;
};

const ActionHeader = ({ appDomain, appLogo, icon, actionLabel, iconClassNames }: Props) => {
    const { getThemeColor } = useThemeMode();

    return (
        <FlexContainer flexDirection='column' alignItems='center' gridGap='24px' mb='24'>
            <RequestedBy appDomain={appDomain} appLogo={appLogo} />

            <FlexContainer flexDirection='column' alignItems='center' gridGap='12px' px='16'>
                <FlexContainer
                    justifyContent='center'
                    alignItems='center'
                    width='56px'
                    height='56px'
                    backgroundColor={getThemeColor('primary100', 'lightGreen')}
                    border='1px solid'
                    borderColor={getThemeColor('primary300', 'primary800')}
                    borderRadius='16'
                >
                    <Icon
                        icon={icon}
                        className={cn('text-theme-primary-700 dark:text-theme-primary-600 h-8 w-8', iconClassNames)}
                    />
                </FlexContainer>

                <Heading $typeset='h3' fontWeight='bold' color='base'>
                    {actionLabel}
                </Heading>
            </FlexContainer>
        </FlexContainer>
    );
};

export default ActionHeader;
