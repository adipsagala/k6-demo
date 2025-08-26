import http from 'k6/http';
import { check } from 'k6';

export default function() {
  const url = 'http://localhost:8080/register';
  const payload = JSON.stringify({
    username: 'user2',
    password: '1234',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post(url, payload, params);
  check(res, {
    'status 201': (r) => r.status === 201,
  });
}