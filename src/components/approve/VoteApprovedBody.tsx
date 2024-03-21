import { useLocation } from 'react-router-dom';
import { Contracts } from '@ardenthq/sdk-profiles';
import { VoteBody } from './Vote/VoteBody';
import { WalletNetwork } from '@/lib/store/wallet';
import trimAddress from '@/lib/utils/trimAddress';

const VoteApprovedBody = ({ wallet }: { wallet: Contracts.IReadWriteWallet }) => {
    const { state } = useLocation();
    const showFiat = state.walletNetwork === WalletNetwork.MAINNET;

    return (
        <VoteBody 
            isApproved
            wallet={wallet}
            sender={trimAddress(state?.vote.sender ?? '', 10)}
            showFiat={showFiat}
            fee={state?.vote.fee}
            convertedFee={state?.vote.convertedFee as number}
            exchangeCurrency={state?.vote.exchangeCurrency as string}
            walletNetwork={state?.walletNetwork}
            unvote={{
                delegateName: state?.vote.unvoteDelegateName,
                publicKey: state?.vote.unvotePublicKey,
                delegateAddress: state?.vote.unvoteDelegateAddress,
            }}
            vote={{
                delegateName: state?.vote.voteDelegateName,
                publicKey: state?.vote.votePublicKey,
                delegateAddress: state?.vote.voteDelegateAddress,
            }}
            transactionId={state?.vote.id}
            maxHeight='229px'
        />
    );
};

export default VoteApprovedBody;
