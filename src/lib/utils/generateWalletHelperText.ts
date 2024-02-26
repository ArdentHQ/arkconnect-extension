import { Contracts } from '@ardenthq/sdk-profiles';

export const generateWalletHelperText = (wallet: Contracts.IReadWriteWallet, displayExtraData: boolean = true): string[] => {
  const amount = wallet.balance().toString();
  const helpText = [amount];

  if (displayExtraData) {
    const isDevNet = wallet.network().isTest();
    if (isDevNet && wallet.isLedger()) {
      helpText.push('Ledger Testnet');
    } else if (isDevNet) {
      helpText.push('Testnet');
    } else if (wallet.isLedger()) {
      helpText.push('Ledger');
    }
  }

  return helpText;
};
