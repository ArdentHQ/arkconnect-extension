import { Contracts } from '@ardenthq/sdk-profiles';
import { FlexContainer, Paragraph, RowLayout } from '@/shared/components';
import { WalletCard } from './WalletCard';

type Props = {
  wallet?: Contracts.IReadWriteWallet;
};

const ConnectWithWallet = ({ wallet }: Props) => {
  return (
    <FlexContainer flexDirection='column' alignItems='center' px='16' flex={1}>
      <Paragraph $typeset='body' fontWeight='medium' color='gray' mb='8'>
        Connecting with
      </Paragraph>
      {wallet ? (
        <WalletCard wallet={wallet} />
      ) : (
        <RowLayout
          variant='errorFree'
          color='primary'
          title='No wallets found in your profile!'
          helperText={'Create or import new wallet'}
        />
      )}
    </FlexContainer>
  );
};

export default ConnectWithWallet;
