import { StubStorage } from './StubStorage';
import { HttpClient } from '@/lib/services/HttpClient';
import { connectedTransport as ledgerTransportFactory } from '@/lib/utils/transport';
import { Environment } from '@/lib/profiles';

// TODO fix HTTP client
export const httpClient = new HttpClient(10);

const getEnvironmentWithMocks = () =>
    new Environment({
        httpClient,
        storage: new StubStorage(),
        ledgerTransportFactory,
    });

export const env = getEnvironmentWithMocks();
