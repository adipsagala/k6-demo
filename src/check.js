import http from 'k6/http';
import { check } from 'k6';

export default function() {
  let res = http.get('http://localhost:8080/healthcheck');
  check(res, {
    "status is 200": (r) => r.status === 200,
    'respons berisi data': (r) => r.body.length > 0,
  });
}
