import { FlexContainer, Heading, Paragraph } from '@/shared/components';
import Amount from './Amount';

type BalanceProps = {
  convertedBalance?: number;
  exchangeCurrency: string;
  currency: string;
  balance: number;
};

const Balance = ({ balance, currency, exchangeCurrency, convertedBalance }: BalanceProps) => {
  return (
    <FlexContainer justifyContent='space-between' alignItems='center' color='white'>
      <Heading $typeset='h2' fontWeight='bold'>
        <Amount value={balance} ticker={currency} />
      </Heading>
      {convertedBalance !== undefined && (
        <Paragraph $typeset='headline' fontWeight='medium'>
          <Amount value={convertedBalance} ticker={exchangeCurrency} withTicker />
        </Paragraph>
      )}
    </FlexContainer>
  );
};

export default Balance;
