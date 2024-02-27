import { Contracts } from '@ardenthq/sdk-profiles';
import Amount from '../wallet/Amount';
import ActionDetails, { ActionDetailsRow } from './ActionDetails';
import trimAddress from '@/lib/utils/trimAddress';
import { FlexContainer, Paragraph } from '@/shared/components';
import { getNetworkCurrency } from '@/lib/utils/getActiveCoin';
import { useExchangeRate } from '@/lib/hooks/useExchangeRate';

type Props = {
  amount: number;
  total: number;
  fee: number;
  receiverAddress: string;
  wallet: Contracts.IReadWriteWallet;
};

const RequestedTransactionBody = ({ wallet, amount, fee, total, receiverAddress }: Props) => {
  const exchangeCurrency = wallet.exchangeCurrency() ?? 'USD';

  const coin = getNetworkCurrency(wallet.network());

  const { convert } = useExchangeRate({
    exchangeTicker: wallet.exchangeCurrency(),
    ticker: wallet.currency(),
  });

  return (
    <ActionDetails>
      <ActionDetailsRow label='Amount'>
        <FlexContainer gridGap='4px' alignItems='end'>
          <Paragraph $typeset='headline' fontWeight='medium' color='base'>
            <Amount value={amount} ticker={coin} withTicker />
          </Paragraph>
          {wallet.network().isLive() && (
            <Paragraph $typeset='body' fontWeight='medium' color='gray'>
              <Amount value={convert(amount)} ticker={exchangeCurrency} />
            </Paragraph>
          )}
        </FlexContainer>
      </ActionDetailsRow>

      <ActionDetailsRow label='Receiver'>
        <Paragraph $typeset='headline' fontWeight='medium' color='base'>
          {trimAddress(receiverAddress as string, 10)}
        </Paragraph>
      </ActionDetailsRow>

      <ActionDetailsRow label='Transaction Fee'>
        <FlexContainer gridGap='4px' alignItems='end'>
          <Paragraph $typeset='headline' fontWeight='medium' color='base'>
            <Amount value={fee} ticker={coin} withTicker />
          </Paragraph>
          {wallet.network().isLive() && (
            <Paragraph $typeset='body' fontWeight='medium' color='gray'>
              <Amount value={convert(fee)} ticker={exchangeCurrency} />
            </Paragraph>
          )}
        </FlexContainer>
      </ActionDetailsRow>

      <ActionDetailsRow label='Total Amount'>
        <FlexContainer gridGap='4px' alignItems='end'>
          <Paragraph $typeset='headline' fontWeight='medium' color='base'>
            <Amount value={total} ticker={coin} withTicker />
          </Paragraph>
          {wallet.network().isLive() && (
            <Paragraph $typeset='body' fontWeight='medium' color='gray'>
              <Amount value={convert(total)} ticker={exchangeCurrency} />
            </Paragraph>
          )}
        </FlexContainer>
      </ActionDetailsRow>
    </ActionDetails>
  );
};

export default RequestedTransactionBody;
