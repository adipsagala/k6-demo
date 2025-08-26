import http from 'k6/http';
import { check } from 'k6';

export const options = {
  thresholds: {
    checks: ['rate>0.99'], // minimal 99% check harus lolos
  },
};

export default function() {
  let res = http.get('http://localhost:8080/healthcheck');
  check(res, {
    "status is 200": (r) => r.status === 200,
    'respons berisi data': (r) => r.body.length > 0,
  });
}
