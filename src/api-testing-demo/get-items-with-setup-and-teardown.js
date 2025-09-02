import http from 'k6/http';
import { check, fail } from 'k6';

// options for the test
export const options = {
  vus: 100,
  duration: '5s',
};

// base URL for the API
const BASE_URL = 'http://localhost:8080';
const USERNAME = 'user1';
const PASSWORD = '1234';

// setup function to run once before all VUs start
export function setup() {
  const userName = USERNAME;
  const password = PASSWORD;

  console.log(`🔑 Logging in to get token for user: ${userName}`);

  const loginRes = http.post(`${BASE_URL}/login`, JSON.stringify({
    username: userName,
    password: password,
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  const body = JSON.parse(loginRes.body);
  if (!body.data || !body.data.token) {
    fail('❌ Failed to login and retrieve token');
  }

  const token = body.data.token;
  console.log(`✅ Token retrieved successfully: ${token}`);

  // return as object
  return { userName, token };
}

// default function for VU
export default function (setupData) {
  const token = setupData.token;

  const res = http.get(`${BASE_URL}/items`, {
    headers: {
      'Authorization': token,
    },
  });

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response contains data': (r) => r.body.includes('title'),
  });
}

// teardown function to run after all VUs finish
export function teardown(setupData) {
  console.log(`🧹 Teardown called. Token used: ${setupData.token}, for user: ${setupData.userName}`);
}
