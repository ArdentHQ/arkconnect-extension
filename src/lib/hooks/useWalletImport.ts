import { Contracts } from '@/lib/profiles';

const useWalletImport = ({ profile }: { profile: Contracts.IProfile }) => {
    const importWallet = async ({
        value,
    }: {
        value: string;
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
