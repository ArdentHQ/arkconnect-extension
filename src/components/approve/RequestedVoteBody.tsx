import { Contracts } from '@ardenthq/sdk-profiles';
import styled from 'styled-components';
import Amount from '../wallet/Amount';
import ActionDetails, { ActionDetailsRow } from './ActionDetails';
import { FlexContainer, Paragraph, Tooltip } from '@/shared/components';
import trimAddress from '@/lib/utils/trimAddress';
import { getNetworkCurrency } from '@/lib/utils/getActiveCoin';

type Props = {
  vote: Contracts.VoteRegistryItem | null;
  unvote: Contracts.VoteRegistryItem | null;
  fee: number;
  convertedFee: number;
  wallet: Contracts.IReadWriteWallet;
};

const RequestedVoteBody = ({ vote, unvote, fee, convertedFee, wallet }: Props) => {
  return (
    <ActionDetails maxHeight='165px'>
      <ActionDetailsRow label='Transaction Fee'>
        <FlexContainer gridGap='4px' alignItems='baseline'>
          <Paragraph $typeset='headline' fontWeight='medium' color='base'>
            {fee} {getNetworkCurrency(wallet.network())}
          </Paragraph>
          {wallet.network().isLive() && (
            <Paragraph $typeset='body' fontWeight='medium' color='gray'>
              <Amount value={convertedFee} ticker={wallet.exchangeCurrency() ?? 'USD'} />
            </Paragraph>
          )}
        </FlexContainer>
      </ActionDetailsRow>

      {unvote && (
        <ActionDetailsRow label='Unvote Delegate Name'>
          <Paragraph $typeset='headline' fontWeight='medium' color='base'>
            {unvote.wallet?.username() ?? ''}
          </Paragraph>
        </ActionDetailsRow>
      )}

      {unvote && !wallet.isLedger() && (
        <ActionDetailsRow label='Unvote Delegate Address'>
          <Paragraph $typeset='headline' fontWeight='medium' color='base'>
            {trimAddress(unvote.wallet?.address() ?? '', 10)}
          </Paragraph>
        </ActionDetailsRow>
      )}

      {unvote && wallet.isLedger() && (
        <ActionDetailsRow label='Unvote Delegate Pubkey'>
          <Tooltip
            content={<StyledSpan>{unvote.wallet?.publicKey() ?? ''}</StyledSpan>}
            placement='bottom-end'
          >
            <Paragraph $typeset='headline' fontWeight='medium' color='base'>
              {trimAddress(unvote.wallet?.publicKey() ?? '', 10)}
            </Paragraph>
          </Tooltip>
        </ActionDetailsRow>
      )}

      {vote && (
        <ActionDetailsRow label='Vote Delegate Name'>
          <Paragraph $typeset='headline' fontWeight='medium' color='base'>
            {vote.wallet?.username() ?? ''}
          </Paragraph>
        </ActionDetailsRow>
      )}

      {vote && !wallet.isLedger() && (
        <ActionDetailsRow label='Vote Delegate Address'>
          <Paragraph $typeset='headline' fontWeight='medium' color='base'>
            {trimAddress(vote.wallet?.address() ?? '', 10)}
          </Paragraph>
        </ActionDetailsRow>
      )}

      {vote && wallet.isLedger() && (
        <ActionDetailsRow label='Vote Delegate Pubkey'>
          <Tooltip
            content={<StyledSpan>{vote.wallet?.publicKey() ?? ''}</StyledSpan>}
            placement='bottom-end'
          >
            <Paragraph $typeset='headline' fontWeight='medium' color='base'>
              {trimAddress(vote.wallet?.publicKey() ?? '', 10)}
            </Paragraph>
          </Tooltip>
        </ActionDetailsRow>
      )}
    </ActionDetails>
  );
};

const StyledSpan = styled.span`
  width: 260px;
  display: block;
  overflow-wrap: break-word;
  text-align: left;
`;

export default RequestedVoteBody;
