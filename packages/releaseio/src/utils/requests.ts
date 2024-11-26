import ky from 'ky';
import { GitLog, Log } from '../types';
import { gitLogsToLogPayload } from './gitUtils';

// const BASE_URL = 'https://releasio.vercel.app';
const BASE_URL = 'http://localhost:3000';

const api = ky.create({
  prefixUrl: BASE_URL, // Your base URL
  retry: 0,
});

export async function validateToken(token: string) {
  const tokenExists = await api
    .get<{ data: unknown }>(`api/tokens/${token}`)
    .json()
    .then(d => d.data);
  if (!tokenExists) throw new Error('Token does not exist');
}

export async function getLogs(token: string) {
  return await api
    .get<{ data: Log[] }>(`api/tokens/${token}/logs`)
    .json()
    .then(d => d.data);
}

async function createLogRequest(token: string, payload: unknown) {
  return await api
    .post(`api/tokens/${token}/logs`, {
      json: payload,
    })
    .json<{ data: Log }>()
    .then(d => d.data);
}

export function getLogUrl(token: string, logId: string) {
  return `${BASE_URL}/tokens/${token}/logs/${logId}`;
}

export async function createLog({ token, logs }: { token: string; logs: GitLog[] }) {
  const log = gitLogsToLogPayload(logs);
  const createdLog = await createLogRequest(token, log);
  return createdLog;
}
