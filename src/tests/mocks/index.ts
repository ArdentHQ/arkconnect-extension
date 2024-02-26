import { connectedTransport as ledgerTransportFactory } from '@/lib/utils/transport';
import { Environment } from '@ardenthq/sdk-profiles';
import { ARK } from '@ardenthq/sdk-ark';
import { HttpClient } from '@/lib/services/HttpClient';
import { StubStorage } from './StubStorage';
export const httpClient = new HttpClient(10);

const getEnvironmentWithMocks = () =>
  new Environment({
    coins: { ARK },
    httpClient,
    storage: new StubStorage(),
    ledgerTransportFactory,
  });

export const env = getEnvironmentWithMocks();
