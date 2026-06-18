import { Array_ } from '@/lib/helpers';

import { NetworkHost, NetworkHostType } from '@/lib/mainsail/networks';
import { HostSet, HostMap } from '@/lib/profiles/contracts';
import { ConfigRepository } from '@/lib/mainsail/config.repository';

export const filterHosts = (hosts: NetworkHost[], type: NetworkHostType): NetworkHost[] =>
    hosts.filter((host: NetworkHost) => host.type === type);

export const randomHost = (hosts: NetworkHost[], type: NetworkHostType): NetworkHost =>
    Array_.randomElement(filterHosts(hosts, type));

export const groupCustomHosts = (hosts: HostSet): HostMap => {
    const customHosts: HostMap = {};

    for (const { host, name } of hosts) {
        if (customHosts[name] === undefined) {
            customHosts[name] = [];
        }
        customHosts[name].push({ host, name });
    }

    return customHosts;
};

// DRY helpers for coin implementations
export const filterHostsFromConfig = (
    config: ConfigRepository,
    type: NetworkHostType,
): NetworkHost[] => filterHosts(config.get<NetworkHost[]>('network.hosts'), type);

export const randomNetworkHostFromConfig = (
    config: ConfigRepository,
    type: NetworkHostType = 'full',
): NetworkHost => randomHost(config.get<NetworkHost[]>('network.hosts'), type);
