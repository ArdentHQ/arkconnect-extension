import { Contracts } from '@/lib/profiles';

type PrivateKey = string;
type Mnemonic = string;
type WIF = string;
type Address = string;

type WalletGenerationInput = PrivateKey | Mnemonic | WIF | Address;

const useWalletImport = ({ profile }: { profile: Contracts.IProfile }) => {
    const importWallet = async ({
        value,
    }: {
        value: WalletGenerationInput;
    }): Promise<Contracts.IReadWriteWallet | undefined> => {
        return profile.wallets().push(
            await profile.walletFactory().fromMnemonicWithBIP39({
                mnemonic: value,
            }),
        );
    };

    return { importWallet };
};

export default useWalletImport;
