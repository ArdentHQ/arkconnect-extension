import RequestedBy from './RequestedBy';
import { FlexContainer, Heading, Icon, IconDefinition } from '@/shared/components';
import useThemeMode from '@/lib/hooks/useThemeMode';

type Props = {
  appLogo?: string;
  appDomain: string;
  icon: IconDefinition;
  actionLabel: string;
  iconDimensions?: { width: number; height: number };
};

const ActionHeader = ({ appDomain, appLogo, icon, actionLabel, iconDimensions }: Props) => {
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
            color={getThemeColor('primary700', 'primary600')}
            width={iconDimensions?.width ?? 32}
            height={iconDimensions?.height ?? 32}
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
