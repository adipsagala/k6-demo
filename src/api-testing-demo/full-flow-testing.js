import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 1,
  iterations: 1,
};

const BASE_URL = 'http://localhost:8080';

export default function() {
  // 1. Register
  const registerRes = http.post(`${BASE_URL}/register`, JSON.stringify({
    username: 'user1',
    password: '1234',
  }), {
    headers: {'Content-Type': 'application/json'},
  });

  check(registerRes, {
    'register status is 201 or 400 (if already exists)': (r) =>
      r.status === 201 || r.status === 400,
  });

  //2. Login
  const loginRes = http.post(`${BASE_URL}/login`, JSON.stringify({
    username: 'user1',
    password: '1234',
  }), {
    headers: {'Content-Type': 'application/json'},
  });

  check(loginRes, {
    'login success': (r) => r.status === 200 && JSON.parse(r.body).data?.token !== '',
  });

  const token = JSON.parse(loginRes.body).data?.token;
  const authHeaders = {
    headers: {
      'Authorization': token,
      'Content-Type': 'application/json',
    },
  };

  // 3. Create Item
  const createRes = http.post(`${BASE_URL}/items`, JSON.stringify({
    id: 'test-1',
    title: 'K6 Testing',
  }), authHeaders);

  check(createRes, {
    'item created': (r) => r.status === 201,
  });

  // 4. Get Items
  const getRes = http.get(`${BASE_URL}/items`, authHeaders);

  check(getRes, {
    'fetched items': (r) => r.status === 200 && r.body.includes('K6 Testing'),
  });

  // 5. Update Item
  const updateRes = http.put(`${BASE_URL}/items/test-1`, JSON.stringify({
    title: 'K6 Testing Updated',
  }), authHeaders);

  check(updateRes, {
    'item updated': (r) => r.status === 200,
  });

  // 6. Delete Item
  const deleteRes = http.del(`${BASE_URL}/items/test-1`, null, authHeaders);

  check(deleteRes, {
    'item deleted': (r) => r.status === 200,
  });

  sleep(1); // optional: just to slow down if needed
}
