import useClipboard from '@/lib/hooks/useClipboard';
import trimAddress from '@/lib/utils/trimAddress';
import { FlexContainer, Paragraph, Container, Icon } from '@/shared/components';
import { useLocation } from 'react-router-dom';
import Amount from '../wallet/Amount';
import { ToastPosition } from '../toast/ToastContainer';
import getActiveCoin from '@/lib/utils/getActiveCoin';
import ActionDetails, { ActionDetailsRow } from './ActionDetails';
import { WalletNetwork } from '@/lib/store/wallet';

const TransactionApprovedBody = () => {
  const { state } = useLocation();
  const { copy } = useClipboard();

  return (
    <Container width='100%'>
      <ActionDetails maxHeight='229px'>
        <ActionDetailsRow label='Sender'>
          <Paragraph $typeset='headline' fontWeight='medium' color='base'>
            {trimAddress(state?.transaction.sender, 'short')}
          </Paragraph>
        </ActionDetailsRow>

        <ActionDetailsRow label='Amount'>
          <FlexContainer gridGap='4px' alignItems='baseline'>
            <Paragraph $typeset='headline' fontWeight='medium' color='base' as='div'>
              <Amount
                value={state?.transaction.amount}
                ticker={getActiveCoin(state?.walletNetwork)}
              />
            </Paragraph>
            {state.walletNetwork === WalletNetwork.MAINNET && (
              <Paragraph $typeset='body' fontWeight='medium' color='gray'>
                <Amount
                  value={state?.transaction.convertedAmount as number}
                  ticker={state?.transaction.exchangeCurrency as string}
                />
              </Paragraph>
            )}
          </FlexContainer>
        </ActionDetailsRow>

        <ActionDetailsRow label='Receiver'>
          <Paragraph $typeset='headline' fontWeight='medium' color='base'>
            {trimAddress(state?.transaction.receiver, 'short')}
          </Paragraph>
        </ActionDetailsRow>

        <ActionDetailsRow label='Transaction Fee'>
          <FlexContainer gridGap='4px' alignItems='baseline'>
            <Paragraph $typeset='headline' fontWeight='medium' color='base' as='div'>
              <Amount value={state?.transaction.fee} ticker={getActiveCoin(state?.walletNetwork)} />
            </Paragraph>
            {state.walletNetwork === WalletNetwork.MAINNET && (
              <Paragraph $typeset='body' fontWeight='medium' color='gray'>
                <Amount
                  value={state?.transaction.convertedFee as number}
                  ticker={state?.transaction.exchangeCurrency as string}
                />
              </Paragraph>
            )}
          </FlexContainer>
        </ActionDetailsRow>

        <ActionDetailsRow label='Total Amount'>
          <FlexContainer gridGap='4px' alignItems='baseline'>
            <Paragraph $typeset='headline' fontWeight='medium' color='base' as='div'>
              <Amount
                value={state?.transaction.total}
                ticker={getActiveCoin(state?.walletNetwork)}
              />
            </Paragraph>
            {state.walletNetwork === WalletNetwork.MAINNET && (
              <Paragraph $typeset='body' fontWeight='medium' color='gray'>
                <Amount
                  value={state?.transaction.convertedTotal as number}
                  ticker={state?.transaction.exchangeCurrency as string}
                />
              </Paragraph>
            )}
          </FlexContainer>
        </ActionDetailsRow>

        <ActionDetailsRow label='Transaction ID'>
          <FlexContainer gridGap='4px' alignItems='center'>
            <Paragraph $typeset='headline' fontWeight='medium' color='base'>
              {trimAddress(state?.transaction.id, 'short')}
            </Paragraph>
            <Container
              className='c-pointer'
              onClick={() => copy(state?.transaction.id, 'Transaction ID', ToastPosition.HIGH)}
            >
              <Icon icon='copy' color='primary' width='20px' height='20px' />
            </Container>
          </FlexContainer>
        </ActionDetailsRow>
      </ActionDetails>
    </Container>
  );
};

export default TransactionApprovedBody;
