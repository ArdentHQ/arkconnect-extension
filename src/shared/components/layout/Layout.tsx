import { Container, FlexContainer, Header } from '@/shared/components';
import { ComponentProps } from 'react';

interface Props extends ComponentProps<typeof Container> {
  children: React.ReactNode | React.ReactNode[];
  withHeader?: boolean;
  className?: string;
}

export const Layout = ({ children, withHeader = true, className, ...props }: Props) => {
  return (
    <>
      {withHeader && <Header />}
      <FlexContainer
        className={className}
        paddingTop={`${withHeader ? '59' : '0'}`}
        paddingBottom='16'
        height='100vh'
        flexDirection={'column'}
        {...props}
      >
        {children}
      </FlexContainer>
    </>
  );
};
