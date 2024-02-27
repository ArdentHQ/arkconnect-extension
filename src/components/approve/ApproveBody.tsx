import { Contracts } from '@ardenthq/sdk-profiles';
import { Container, FlexContainer, Paragraph, RowLayout } from '@/shared/components';
import trimAddress from '@/lib/utils/trimAddress';
import { generateWalletHelperText } from '@/lib/utils/generateWalletHelperText';

type Props = {
  wallet: Contracts.IReadWriteWallet;
  error?: string;
  header: string;
  children: React.ReactNode;
};

const ApproveBody = ({ wallet, header, children, error }: Props) => {
  if (!wallet) return <></>;

  return (
    <FlexContainer flexDirection='column' alignItems='center' px='16' flex='1' overflowY='auto'>
      <Paragraph $typeset='body' fontWeight='medium' color='gray' mb='8'>
        {header}
      </Paragraph>

      <RowLayout
        variant='errorFree'
        color='primary'
        title={wallet.alias() ? wallet.alias() : trimAddress(wallet.address(), 'long')}
        helperText={generateWalletHelperText(wallet, false)}
        testnetIndicator={wallet.network().isTest()}
        ledgerIndicator={wallet.isLedger()}
        currency={wallet.currency()}
        address={wallet.address()}
        tabIndex={-1}
      />

      {!!error && (
        <Paragraph $typeset='body' color='error' marginTop='8'>
          {error}
        </Paragraph>
      )}
      <Container my='24' width='100%' overflow='auto' className='custom-scroll' height='100%'>
        {children}
      </Container>
    </FlexContainer>
  );
};

export default ApproveBody;
