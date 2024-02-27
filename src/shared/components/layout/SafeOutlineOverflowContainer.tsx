import { ComponentProps } from 'react';
import { Container } from './Container';

interface Props extends ComponentProps<typeof Container> {}

const SafeOutlineOverflowContainer = (props: Props): JSX.Element => {
  return <Container paddingX='2' marginX='-2' overflow='hidden' {...props} />;
};

export default SafeOutlineOverflowContainer;
