import { AppWrapper, MainWrapper } from '@/App';
import { render as testingLibraryRender } from '@testing-library/react';

const Wrapper = ({ children }: { children?: React.ReactNode }) => (
  <MainWrapper>
    <AppWrapper>{children}</AppWrapper>
  </MainWrapper>
);

export const render = (component: React.ReactElement, options: any = {}) =>
  testingLibraryRender(component, { wrapper: Wrapper, ...options });
