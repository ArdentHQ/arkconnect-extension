import { StubStorage } from './StubStorage';
import { connectedTransport as ledgerTransportFactory } from '@/lib/utils/transport';
import { Environment } from '@/lib/profiles';
import { Http} from '@/lib/mainsail';

// TODO fix HTTP client
export const httpClient = new Http.HttpClient(10);

const getEnvironmentWithMocks = () =>
    new Environment({
        httpClient,
        storage: new StubStorage(),
        ledgerTransportFactory,
    });

export const env = getEnvironmentWithMocks();
