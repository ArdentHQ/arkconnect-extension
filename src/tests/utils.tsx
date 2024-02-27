import { render as testingLibraryRender } from '@testing-library/react';
import { AppWrapper, MainWrapper } from '@/App';

const Wrapper = ({ children }: { children?: React.ReactNode }) => (
  <MainWrapper>
    <AppWrapper>{children}</AppWrapper>
  </MainWrapper>
);

export const render = (component: React.ReactElement, options: any = {}) =>
  testingLibraryRender(component, { wrapper: Wrapper, ...options });
