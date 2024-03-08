import { tabs } from 'webextension-polyfill';
import { Contracts } from '@ardenthq/sdk-profiles';
import { ProfileData } from '../background/contracts';

export enum ExtensionSupportedEvents {
    AddressChanged = 'addressChanged',
    Disconnected = 'disconnected',
    Connected = 'connected',
}

type EventNames = 'addressChanged' | 'disconnected' | 'connected';

interface WalletData {
    network: string;
    address: string;
    coin: string;
}

interface ExtensionEventsProperties {
    profile?: Contracts.IProfile | null;
}

export function ExtensionEvents(properties?: ExtensionEventsProperties) {
    const supportedEvents: string[] = [
        ExtensionSupportedEvents.AddressChanged,
        ExtensionSupportedEvents.Disconnected,
        ExtensionSupportedEvents.Connected,
    ];

    return {
        /**
         * Determines whether an event is supported.
         *
         * @param {string} eventName
         * @returns {boolean}
         */
        isSupported(eventName: EventNames): boolean {
            return supportedEvents.includes(eventName);
        },
        /**
         * Returns the browser tab ids
         * that have active sessions in extension.
         *
         * @param {string} domain
         * @returns {Promise<number[]>}
         */
        async sessionTabIds(domain?: string): Promise<number[]> {
            const profile = properties?.profile;

            if (!profile) {
                throw new Error('Cannot resolve sessions. Profile is missing');
            }

            const sessions = Object.values(profile.settings().get(ProfileData.Sessions) ?? {});
            const queriedTabs = await tabs.query({});

            const sessionTabs = queriedTabs.filter((tab) => {
                if (!tab.id) {
                    return false;
                }

                if (domain) {
                    return !!tab.url && new URL(domain).host === new URL(tab.url).host;
                }

                return sessions.some((session) => {
                    return !!tab.url && new URL(session.domain).host === new URL(tab.url).host;
                });
            });

            return sessionTabs.map((tab) => tab.id) as number[];
        },
        /**
         * Emits disconnected event to tabs in the provided domain.
         *
         * If domain is not provided, it will emit disconnect for all tabs
         * that have active sessions.
         *
         * @param {string} domain
         * @returns {Promise<void>}
         */
        async disconnect(domain?: string): Promise<void> {
            const tabIds = await this.sessionTabIds(domain);

            for (const id of tabIds) {
                tabs.sendMessage(id, {
                    type: ExtensionSupportedEvents.Disconnected,
                });
            }
        },
        /**
         * Emits addressChanged event.
         *
         * @param {Object} data
         * @returns {Promise<void>}
         */
        async changeAddress(data: { wallet: WalletData }): Promise<void> {
            const tabIds = await this.sessionTabIds();

            for (const id of tabIds) {
                tabs.sendMessage(id, {
                    type: ExtensionSupportedEvents.AddressChanged,
                    data,
                });
            }
        },

        /**
         * Emits connected event.
         *
         * @param {string} domain
         * @returns {Promise<void>}
         */
        async connect(domain: string): Promise<void> {
            const tabIds = await this.sessionTabIds(domain);

            for (const id of tabIds) {
                tabs.sendMessage(id, {
                    type: ExtensionSupportedEvents.Connected,
                });
            }
        },
    };
}
