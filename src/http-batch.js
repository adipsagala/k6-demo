import http from 'k6/http';
import { check } from 'k6';

export default function() {
  const res = http.batch([
    ['GET', 'http://localhost:8080/healthcheck'],
    ['GET', 'http://localhost:8080/healthcheck'],
    ['GET', 'http://localhost:8080/healthcheck'],
  ]);

  check(res[0], {
    'status 200': (r) => r.status === 200,
  });
}
