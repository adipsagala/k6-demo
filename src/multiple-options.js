import http from "k6/http";
import { sleep, check } from "k6";

export const options = {
  vus: 50,
  stages: [
    { duration: "5s", target: 20 }, // naik (ramp-up) ke 20 VU
    { duration: "5s", target: 20 }, // tetap 20 VU
    { duration: "5s", target: 0 }, // turun (ramp-down) ke 0 VU
  ],
  thresholds: {
    http_req_duration: ['p(95)<500', 'avg<10'], // 95% request harus < 500ms, request rata-rata harus < 10ms
    http_req_failed: ['rate<0.01'], // error rate harus < 1%
  },
  summaryTrendStats: ['avg', 'p(95)', 'min', 'max'], // menampilkan statistik summary
  rps: 100, // membuat maksimal 100 RPS, meskipun brust request aktif
};

export default function () {
  let res = http.get("http://localhost:8080/healthcheck");
  check(res, { "status is 200": (res) => res.status === 200 });
  // sleep(1); matikan sleep untuk membuat burst request
}
