import http from "k6/http";
import { sleep, check } from "k6";

export const options = {
  vus: 10,
  iterations: 100,
  thresholds: {
    http_req_duration: ['p(95)<500'], //95% request harus < 500ms
    http_req_failed: ['rate<0.01'], //error rate harus < 1%
  },
};

export default function () {
  let res = http.get("http://localhost:8080/healthcheck");
  check(res, { "status is 200": (res) => res.status === 200 });
  // sleep(1);
}
