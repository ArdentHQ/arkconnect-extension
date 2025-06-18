import { configManager } from './config.manager';
import { NetworkConfig } from '@/lib/mainsail/contracts';

export const applyCryptoConfiguration = ({ crypto, height }: { crypto: NetworkConfig; height: number }): void => {
    configManager.setConfig(crypto);
    configManager.setHeight(height);
};
