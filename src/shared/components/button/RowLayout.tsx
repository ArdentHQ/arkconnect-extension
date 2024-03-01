import styled, { WebTarget } from 'styled-components';
import {
    border,
    BorderProps,
    color,
    ColorProps,
    layout,
    LayoutProps,
    position,
    PositionProps,
    shadow,
    ShadowProps,
    space,
    SpaceProps,
    variant,
} from 'styled-system';
import { forwardRef } from 'react';
import { Theme } from '@/shared/theme';
import { Container, FlexContainer, Icon, IconDefinition, Paragraph } from '@/shared/components';
import { flexVariant, FlexVariantProps } from '@/shared/theme/variants';
import constants from '@/constants';
import { Address, LedgerIcon, TestnetIcon } from '@/components/wallet/address/Address.blocks';
import { isFirefox } from '@/lib/utils/isFirefox';
import Amount from '@/components/wallet/Amount';
import cn from 'classnames';

type VariantProps = {
    variant?: 'primary' | 'errorFree';
};

type BaseProps = ColorProps<Theme> &
    SpaceProps<Theme> &
    LayoutProps<Theme> &
    PositionProps<Theme> &
    ShadowProps<Theme> &
    BorderProps<Theme> &
    FlexVariantProps &
    VariantProps & {
        hasPointer?: boolean;
    };

type RowLayoutProps = React.ComponentPropsWithRef<typeof StyledRow> & {
    iconLeading?: React.ReactNode;
    iconTrailing?: IconDefinition;
    title?: string;
    helperText?: string | string[];
    rightHelperText?: string;
    children?: React.ReactNode | React.ReactNode[];
    testnetIndicator?: boolean;
    ledgerIndicator?: boolean;
    color?: ColorProps<Theme>;
    disabled?: boolean;
    currency?: string;
    address?: string;
    tabIndex?: number;
    as?: void | WebTarget | undefined;
    iconClassName?: string;
};

const StyledRow = styled.div<BaseProps>`
    position: relative;
    display: flex;
    width: 100%;
    max-height: 74px;
    padding: 16px;
    grid-gap: 12px;

    &:disabled {
        cursor: not-allowed;
        pointer-events: none;
    }

    cursor: ${({ hasPointer }) => (hasPointer ? 'pointer' : 'auto')};

    ${({ as }) =>
        as === 'button' &&
        `
    border: none;
    background-color: transparent;
  `}

    ${space}
  ${color}
  ${layout}
  ${position}
  ${shadow}
  ${border}
  ${flexVariant}

  ${({ theme }) =>
        variant({
            variants: {
                primary: {
                    borderRadius: '16px',
                    backgroundColor: `${theme.colors.inputBackground}`,
                    boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.05)',
                    transition: isFirefox
                        ? `${theme.transitions.firefoxSmoothEase}`
                        : `${theme.transitions.smoothEase}`,

                    '&:focus-visible': isFirefox
                        ? {
                              'outline-style': 'solid',
                              'outline-width': '2px',
                              'outline-offset': '-2px',
                          }
                        : {},

                    '&:hover': {
                        boxShadow: `0px 0px 0px 1px ${theme.colors.toggleInactive}`,
                    },
                },
                errorFree: {
                    borderRadius: '20px',
                    backgroundColor: `${theme.colors.inputBackground}`,
                    boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.05)',
                    border: `1px solid ${theme.colors.primary}`,

                    '&:focus-visible': isFirefox
                        ? {
                              'outline-style': 'solid',
                              'outline-width': '2px',
                              'outline-offset': '-2px',
                          }
                        : {},
                },
            },
        })};
`;

export const RowLayout = forwardRef(function RowLayout(
    {
        iconLeading,
        iconTrailing,
        title,
        helperText,
        rightHelperText,
        children,
        testnetIndicator,
        ledgerIndicator,
        variant = 'primary',
        color,
        disabled,
        currency,
        address,
        tabIndex = 0,
        as,
        iconClassName,
        ...rest
    }: RowLayoutProps,
    forwardedRef: React.Ref<HTMLDivElement>,
) {
    const containerAs = as === 'button' ? 'span' : undefined;

    return (
        <StyledRow
            variant={variant}
            tabIndex={tabIndex}
            as={as}
            {...rest}
            hasPointer={rest.onClick !== undefined}
            ref={forwardedRef}
        >
            <FlexContainer width='100%' gridGap='12px' alignItems='flex-start' as={containerAs}>
                {iconLeading && iconLeading}
                <FlexContainer
                    alignItems='center'
                    justifyContent='space-between'
                    width='100%'
                    as={containerAs}
                >
                    <FlexContainer
                        flexDirection='column'
                        alignItems='flex-start'
                        gridGap='4px'
                        as={containerAs}
                    >
                        <FlexContainer
                            flexDirection='row'
                            alignItems='center'
                            gridGap='6px'
                            as={containerAs}
                        >
                            {title && (
                                <Paragraph
                                    $typeset='headline'
                                    fontWeight={helperText ? 'medium' : 'regular'}
                                    color={disabled ? 'gray' : 'base'}
                                    as={containerAs}
                                >
                                    {title}
                                </Paragraph>
                            )}
                            {ledgerIndicator && <LedgerIcon as={containerAs} />}
                            {testnetIndicator && <TestnetIcon as={containerAs} />}
                        </FlexContainer>
                        {helperText && (
                            <StyledFlexContainer color={'gray'} as={containerAs}>
                                {address && (
                                    <>
                                        <Address
                                            address={address}
                                            tooltipPlacement='bottom-start'
                                        />
                                        <Container as={containerAs}> • </Container>
                                    </>
                                )}
                                {Array.isArray(helperText)
                                    ? helperText.map((item, index) => {
                                          if (index === 0) {
                                              return (
                                                  <Amount
                                                      value={Number(item)}
                                                      maxDigits={
                                                          constants.MAX_CURRENCY_DIGITS_ALLOWED
                                                      }
                                                      ticker={currency ?? ''}
                                                      withTicker={!!currency}
                                                      key={index}
                                                      tooltipPlacement='bottom-start'
                                                  />
                                              );
                                          } else {
                                              return (
                                                  <Container as={containerAs} key={index}>
                                                      {index > 0 && helperText.length > 1 && (
                                                          <FlexContainer
                                                              as={containerAs}
                                                              gridGap='5px'
                                                          >
                                                              <Container as={containerAs}>
                                                                  {' '}
                                                                  •{' '}
                                                              </Container>
                                                              <Container as={containerAs}>
                                                                  {item}
                                                              </Container>
                                                          </FlexContainer>
                                                      )}
                                                  </Container>
                                              );
                                          }
                                      })
                                    : helperText}
                            </StyledFlexContainer>
                        )}
                    </FlexContainer>
                    <FlexContainer alignItems='center' as={containerAs}>
                        {rightHelperText && (
                            <Paragraph
                                $typeset='headline'
                                fontWeight='regular'
                                color='gray'
                                mr='8'
                                as={containerAs}
                            >
                                {rightHelperText}
                            </Paragraph>
                        )}
                        {children && (
                            <Container mr={iconTrailing ? '16' : '0'} as={containerAs}>
                                {children}
                            </Container>
                        )}
                        {iconTrailing && (
                            <FlexContainer alignItems='center' gridGap='8px' as={containerAs}>
                                {iconTrailing && (
                                    <Icon
                                        className={cn(
                                            'h-5 w-5',
                                            {
                                                'text-theme-secondary-500 dark:text-theme-secondary-300':
                                                    disabled,
                                                'text-light-black dark:text-white': !disabled,
                                            },
                                            iconClassName,
                                        )}
                                        icon={iconTrailing}
                                    />
                                )}
                            </FlexContainer>
                        )}
                    </FlexContainer>
                </FlexContainer>
            </FlexContainer>
        </StyledRow>
    );
});

const StyledFlexContainer = styled(FlexContainer)`
    font-size: 14px;
    line-height: 18px;
    text-align: left;
    align-items: center;
    grid-gap: 5px;
`;
