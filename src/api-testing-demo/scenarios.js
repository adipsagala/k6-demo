import { check } from 'k6';
import { login } from './lib/auth.js';
import { getItems } from './lib/items.js';

export const options = {
  scenarios: {
    shared_iterations: {
      executor: 'shared-iterations',
      exec: 'runSharedIterations',
      vus: 2,
      iterations: 6,
      startTime: '0s',
      tags: { type: 'loadtest' },
    },
    per_vu_iterations: {
      executor: 'per-vu-iterations',
      exec: 'runPerVUIterations',
      vus: 2,
      iterations: 3,
      startTime: '1s',
    },
    constant_vus: {
      executor: 'constant-vus',
      exec: 'runConstantVUs',
      vus: 2,
      duration: '5s',
      startTime: '2s',
    },
    ramping_vus: {
      executor: 'ramping-vus',
      exec: 'runRampingVUs',
      stages: [
        { duration: '2s', target: 5 },
        { duration: '2s', target: 0 },
      ],
      startTime: '3s',
    },
    constant_arrival_rate: {
      executor: 'constant-arrival-rate',
      exec: 'runConstantArrival',
      rate: 5,
      timeUnit: '1s',
      duration: '5s',
      preAllocatedVUs: 4,
      startTime: '4s',
    },
    ramping_arrival_rate: {
      executor: 'ramping-arrival-rate',
      exec: 'runRampingArrival',
      startRate: 1,
      timeUnit: '1s',
      preAllocatedVUs: 2,
      maxVUs: 10,
      stages: [
        { target: 4, duration: '2s' },
        { target: 6, duration: '2s' },
        { target: 0, duration: '1s' },
      ],
      startTime: '5s',
    }
  },
};

const API_USERNAME = 'user1';
const API_PASSWORD = '1234';

export function setup() {
  const token = login(API_USERNAME, API_PASSWORD);
  if (!token) throw new Error('❌ Failed to login and retrieve token');
  return token;
}

export function runSharedIterations(token) {
  const res = getItems(token);
  check(res, { '[shared-iterations] got items': (r) => r.status === 'SUCCESS' });
}

export function runPerVUIterations(token) {
  const res = getItems(token);
  check(res, { '[per-vu-iterations] got items': (r) => r.status === 'SUCCESS' });
}

export function runConstantVUs(token) {
  const res = getItems(token);
  check(res, { '[constant-vus] got items': (r) => r.status === 'SUCCESS' });
}

export function runRampingVUs(token) {
  const res = getItems(token);
  check(res, { '[ramping-vus] got items': (r) => r.status === 'SUCCESS' });
}

export function runConstantArrival(token) {
  const res = getItems(token);
  check(res, { '[constant-arrival-rate] got items': (r) => r.status === 'SUCCESS' });
}

export function runRampingArrival(token) {
  const res = getItems(token);
  check(res, { '[ramping-arrival-rate] got items': (r) => r.status === 'SUCCESS' });
}