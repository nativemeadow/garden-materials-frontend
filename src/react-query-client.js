import { QueryClient } from 'react-query';

const client = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60,
            cacheTime: 10000
        }
    }
});

export default client;