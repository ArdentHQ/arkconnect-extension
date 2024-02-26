import useClipboard from '@/lib/hooks/useClipboard';
import trimAddress from '@/lib/utils/trimAddress';
import { Container, FlexContainer, Icon, Paragraph, Tooltip } from '@/shared/components';
import { useLocation } from 'react-router-dom';
import Amount from '../wallet/Amount';
import getActiveCoin from '@/lib/utils/getActiveCoin';
import ActionDetails, { ActionDetailsRow } from './ActionDetails';
import styled from 'styled-components';
import { Contracts } from '@ardenthq/sdk-profiles';
import { WalletNetwork } from '@/lib/store/wallet';

const StyledSpan = styled.span`
  width: 260px;
  display: block;
  overflow-wrap: break-word;
  text-align: left;
`;

const VoteApprovedBody = ({ wallet }: { wallet: Contracts.IReadWriteWallet }) => {
  const { state } = useLocation();
  const { copy } = useClipboard();

  return (
    <Container width='100%'>
      <ActionDetails maxHeight='229px'>
        <ActionDetailsRow label='Sender'>
          <Paragraph $typeset='headline' fontWeight='medium' color='base'>
            {trimAddress(state?.vote.sender ?? '', 10)}
          </Paragraph>
        </ActionDetailsRow>

        <ActionDetailsRow label='Transaction Fee'>
          <FlexContainer gridGap='4px' alignItems='baseline'>
            <Paragraph $typeset='headline' fontWeight='medium' color='base'>
              {state?.vote.fee} {getActiveCoin(state?.walletNetwork)}
            </Paragraph>
            {state.walletNetwork === WalletNetwork.MAINNET && (
              <Paragraph $typeset='body' fontWeight='medium' color='gray'>
                <Amount
                  value={state?.vote.convertedFee as number}
                  ticker={state?.vote.exchangeCurrency as string}
                />
              </Paragraph>
            )}
          </FlexContainer>
        </ActionDetailsRow>

        {state?.vote.unvoteDelegateName && (
          <ActionDetailsRow label='Unvote Delegate Name'>
            <Paragraph $typeset='headline' fontWeight='medium' color='base'>
              {state?.vote.unvoteDelegateName}
            </Paragraph>
          </ActionDetailsRow>
        )}

        {state?.vote.unvotePublicKey && wallet.isLedger() && (
          <ActionDetailsRow label='Unvote Delegate Pubkey'>
            <Tooltip
              content={<StyledSpan>{state?.vote.unvotePublicKey ?? ''}</StyledSpan>}
              placement='bottom-end'
            >
              <Paragraph $typeset='headline' fontWeight='medium' color='base'>
                {trimAddress(state?.vote.unvotePublicKey ?? '', 10)}
              </Paragraph>
            </Tooltip>
          </ActionDetailsRow>
        )}

        {state?.vote.unvoteDelegateAddress && !wallet.isLedger() && (
          <ActionDetailsRow label='Unvote Delegate Address'>
            <Paragraph $typeset='headline' fontWeight='medium' color='base'>
              {trimAddress(state.vote.unvoteDelegateAddress ?? '', 10)}
            </Paragraph>
          </ActionDetailsRow>
        )}

        {state?.vote.voteDelegateName && (
          <ActionDetailsRow label='Vote Delegate Name'>
            <Paragraph $typeset='headline' fontWeight='medium' color='base'>
              {state?.vote.voteDelegateName}
            </Paragraph>
          </ActionDetailsRow>
        )}

        {state?.vote.votePublicKey && wallet.isLedger() && (
          <ActionDetailsRow label='Vote Delegate Pubkey'>
            <Tooltip
              content={<StyledSpan>{state?.vote.votePublicKey ?? ''}</StyledSpan>}
              placement='bottom-end'
            >
              <Paragraph $typeset='headline' fontWeight='medium' color='base'>
                {trimAddress(state?.vote.votePublicKey ?? '', 10)}
              </Paragraph>
            </Tooltip>
          </ActionDetailsRow>
        )}

        {state?.vote.voteDelegateAddress && !wallet.isLedger() && (
          <ActionDetailsRow label='Vote Delegate Address'>
            <Paragraph $typeset='headline' fontWeight='medium' color='base'>
              {trimAddress(state.vote.voteDelegateAddress ?? '', 10)}
            </Paragraph>
          </ActionDetailsRow>
        )}

        <ActionDetailsRow label='Transaction ID'>
          <FlexContainer gridGap='4px' alignItems='center'>
            <Paragraph $typeset='headline' fontWeight='medium' color='base'>
              {trimAddress(state?.vote.id, 'short')}
            </Paragraph>
            <Container className='c-pointer' onClick={() => copy(state?.vote.id, 'Transaction ID')}>
              <Icon icon='copy' color='primary' width='20px' height='20px' />
            </Container>
          </FlexContainer>
        </ActionDetailsRow>
      </ActionDetails>
    </Container>
  );
};

export default VoteApprovedBody;
