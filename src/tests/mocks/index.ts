import { StubStorage } from './StubStorage';
import { connectedTransport as ledgerTransportFactory } from '@/lib/utils/transport';
import { Environment } from '@/lib/profiles';

const getEnvironmentWithMocks = () =>
    new Environment({
        storage: new StubStorage(),
        ledgerTransportFactory,
    });

export const env = getEnvironmentWithMocks();
