import { Contracts } from '@ardenthq/sdk-profiles';
import styled from 'styled-components';
import { Container, FlexContainer, Paragraph } from '@/shared/components';
import constants from '@/constants';
import { generateWalletHelperText } from '@/lib/utils/generateWalletHelperText';
import trimAddress from '@/lib/utils/trimAddress';
import { LedgerIcon, TestnetIcon } from '../wallet/address/Address.blocks';
import Amount from '../wallet/Amount';

type Props = React.ComponentProps<typeof StyledRow> & {
  wallet: Contracts.IReadWriteWallet;
};

export const WalletCard = ({ wallet }: Props) => {
  const hasAlias = wallet.alias() !== undefined;

  const title = hasAlias ? wallet.alias() : trimAddress(wallet.address(), 'long');

  const helperText = generateWalletHelperText(wallet, false);
  const testnetIndicator = wallet.network().isTest();
  const ledgerIndicator = wallet.isLedger();

  return (
    <StyledRow>
      <FlexContainer width='100%' gridGap='12px' alignItems='flex-start'>
        <FlexContainer alignItems='center' justifyContent='space-between' width='100%'>
          <FlexContainer flexDirection='column' alignItems='flex-start' gridGap='4px'>
            <FlexContainer flexDirection='row' alignItems='center' gridGap='6px'>
              <Paragraph $typeset='headline' fontWeight='medium' color='base'>
                {title}
              </Paragraph>

              {ledgerIndicator && <LedgerIcon />}
              {testnetIndicator && <TestnetIcon />}
            </FlexContainer>

            <StyledFlexContainer color={'gray'}>
              {hasAlias && (
                <>
                  <Container>{trimAddress(wallet.address(), 10)}</Container>
                  <Container> • </Container>
                </>
              )}

              {helperText.map((item, index) => {
                if (index === 0) {
                  return (
                    <Amount
                      value={Number(item)}
                      withTicker
                      ticker={wallet.currency()}
                      key={index}
                      maxDigits={constants.SHORTER_CURRENCY_DIGITS_ALLOWED}
                    />
                  );
                } else {
                  return (
                    <Container key={index}>
                      {index > 0 && helperText.length > 1 && (
                        <FlexContainer gridGap='5px'>
                          <Container> • </Container>
                          <Container>{item}</Container>
                        </FlexContainer>
                      )}
                    </Container>
                  );
                }
              })}
            </StyledFlexContainer>
          </FlexContainer>
        </FlexContainer>
      </FlexContainer>
    </StyledRow>
  );
};

const StyledRow = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  max-height: 74px;
  padding: 16px;
  grid-gap: 12px;
  border-radius: 20px;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.05);

  &:disabled {
    cursor: not-allowed;
    pointer-events: none;
  }

  ${({ theme }) => `
    background-color: ${theme.colors.inputBackground};
    border: 1px solid ${theme.colors.primary};
  `}
`;

const StyledFlexContainer = styled(FlexContainer)`
  font-size: 14px;
  line-height: 18px;
  text-align: left;
  align-items: center;
  grid-gap: 5px;
`;
