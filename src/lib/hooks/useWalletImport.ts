import { Contracts } from '@/lib/profiles';
import { Network } from '@/lib/mainsail/network';

type PrivateKey = string;
type Mnemonic = string;
type WIF = string;
type Address = string;

type WalletGenerationInput = PrivateKey | Mnemonic | WIF | Address;

const useWalletImport = ({ profile }: { profile: Contracts.IProfile }) => {
    const importWallet = async ({
        network,
        value,
    }: {
        network: Network;
        value: WalletGenerationInput;
    }): Promise<Contracts.IReadWriteWallet | undefined> => {
        const defaultOptions = {
            coin: network.coin(),
            network: network.id(),
        };

        return profile.wallets().push(
            await profile.walletFactory().fromMnemonicWithBIP39({
                ...defaultOptions,
                mnemonic: value,
            }),
        );
    };

    return { importWallet };
};

export default useWalletImport;
