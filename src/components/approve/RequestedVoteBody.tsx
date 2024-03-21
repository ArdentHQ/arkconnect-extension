import { Contracts } from '@ardenthq/sdk-profiles';
import { VoteBody } from './Vote/VoteBody';

type Props = {
    vote: Contracts.VoteRegistryItem | null;
    unvote: Contracts.VoteRegistryItem | null;
    fee: number;
    convertedFee: number;
    wallet: Contracts.IReadWriteWallet;
};

const RequestedVoteBody = ({ vote, unvote, fee, convertedFee, wallet }: Props) => {
    return (
        <VoteBody
            isApproved={false}
            showFiat={wallet.network().isLive()}
            wallet={wallet}
            fee={fee}
            convertedFee={convertedFee}
            exchangeCurrency={wallet.exchangeCurrency() ?? 'USD'}
            walletNetwork={wallet.network()}
            unvote={{
                delegateName: unvote?.wallet?.username(),
                publicKey: unvote?.wallet?.publicKey(),
                delegateAddress: unvote?.wallet?.address(),
            }}
            vote={{
                delegateName: vote?.wallet?.username(),
                publicKey: vote?.wallet?.publicKey(),
                delegateAddress: vote?.wallet?.address(),
            }}
            maxHeight='165px'
        />
    );
};

export default RequestedVoteBody;
