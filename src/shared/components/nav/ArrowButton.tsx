import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FlexContainer, Icon } from '@/shared/components';
import { isFirefox } from '@/lib/utils/isFirefox';

export const ArrowButton = ({
  action = 'goBack',
  disabled = false,
  onClick,
}: {
  action?: 'goBack' | 'goHome';
  disabled?: boolean;
  onClick?: () => void;
}) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    if (disabled) return;

    if (onClick) {
      onClick();
      return;
    }

    if (action === 'goBack') {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <ContainerWithHover
      borderRadius='50'
      padding='7'
      onClick={handleNavigate}
      tabIndex={0}
      as='button'
      border='none'
      backgroundColor='transparent'
      className={disabled ? '' : 'c-pointer'}
    >
      <Icon
        icon='arrow-left'
        width='18px'
        height='18px'
        color={disabled ? 'disabledGray' : 'base'}
      />
    </ContainerWithHover>
  );
};

export const ContainerWithHover = styled(FlexContainer)`
  cursor: pointer;
  ${(props) => `
  transition: ${isFirefox ? 'background 0.2s ease-in-out' : 'all 0.2s ease-in-out'};
  &:not(:disabled):hover {
    background-color: ${props.theme.colors.lightGrayHover};
  }

  ${isFirefox ? props.theme.browserCompatibility.firefox.focus : ''}
`}
`;
