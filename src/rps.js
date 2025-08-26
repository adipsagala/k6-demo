import http from "k6/http";
import { sleep, check } from "k6";

export const options = {
  vus: 50,
  duration: '10s',
  rps: 100, // membuat maximal 100 RPS, meskipun burst request aktif
};

export default function () {
  let res = http.get("http://localhost:8080/healthcheck");
  check(res, { "status is 200": (res) => res.status === 200 });
  // sleep(1); matikan sleep untuk membuat burst request
}
