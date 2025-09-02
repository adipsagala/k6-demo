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
export default function () {
  // Login untuk mendapatkan token
  const loginRes = http.post(`${BASE_URL}/login`, JSON.stringify({
    username: USERNAME,
    password: PASSWORD,
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  const body = JSON.parse(loginRes.body);

  if (!body.data || !body.data.token) {
    fail('❌ Failed to login and retrieve token');
  }

  const token = body.data.token;

  // Akses endpoint /items dengan token
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