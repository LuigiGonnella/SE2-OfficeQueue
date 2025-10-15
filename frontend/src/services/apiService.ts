import { DefaultApi } from '../API/api.ts';
import { Configuration } from '../API/configuration.ts';

const config = new Configuration({
    basePath: 'http://localhost:3001' // modifica con l'URL del tuo backend
});

export const api = new DefaultApi(config);