import http from 'k6/http';
import { fail, check } from 'k6';

export const options = {
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% request harus < 500ms
    http_req_failed: ['rate<0.01'], // error rate harus < 1%
    checks: ['rate>0.99'], // minimal 99% check harus lolos
  },
};

export default function () {
  let res = http.get('http://localhost:8080/healthcheck');
  let body = JSON.parse(res.body);

  if (!body.status || !body.message) {
    fail('❌ Failed retrieve body response');
  }
  
  check(body, {
    'status tidak boleh "ERROR"': (d) => d.status !== 'ERROR',
    'message harus "Service is healthy"': (d) => d.message === 'Service is healthy',
  });
}