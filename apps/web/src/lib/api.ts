import { env } from '$env/dynamic/public';
import { EnclaveApi } from '@enclave/contracts';
export const api = new EnclaveApi(env.PUBLIC_API_URL || 'http://localhost:5080');
