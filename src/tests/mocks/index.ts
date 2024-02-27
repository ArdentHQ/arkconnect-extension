import { Environment } from '@ardenthq/sdk-profiles';
import { ARK } from '@ardenthq/sdk-ark';
import { StubStorage } from './StubStorage';
import { HttpClient } from '@/lib/services/HttpClient';
import { connectedTransport as ledgerTransportFactory } from '@/lib/utils/transport';

const getEnvironmentWithMocks = () =>
  new Environment({
    coins: { ARK },
    httpClient,
    storage: new StubStorage(),
    ledgerTransportFactory,
  });

export const env = getEnvironmentWithMocks();

export const httpClient = new HttpClient(10);
