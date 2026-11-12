import { ApiError, type EnclaveApi } from '@enclave/contracts';

export class SessionStorageError extends Error {}

// Store only the session token, never the student's original code.
export async function restoreEnrollment(api: EnclaveApi, storage: Storage, key: string) {
  const token = storage.getItem(key);
  if (!token) return null;
  try {
    return await api.studentEnrollment(token);
  } catch (error) {
    if (error instanceof ApiError && [401, 403, 410].includes(error.status)) {
      storage.removeItem(key);
      return null;
    }
    // Keep the token during outages so retrying does not require another code.
    throw error;
  }
}

export async function enrollStudent(api: EnclaveApi, storage: Storage, key: string, code: string) {
  const session = await api.enrollStudent(code.trim());
  try {
    storage.setItem(key, session.token);
  } catch {
    throw new SessionStorageError(
      'Unable to save your sign-in on this device. Check that app storage is available and try again.',
    );
  }
  return session.enrollment;
}
