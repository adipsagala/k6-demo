import { check } from 'k6';
import { getAPIMetadata, fire } from './lib/api.js';

export const options = {
  stages: [
    { duration: '5s', target: 100 },
    { duration: '5s', target: 200 },
    { duration: '5s', target: 300 },
    { duration: '5s', target: 400 },
    { duration: '5s', target: 500 },
    { duration: '5s', target: 1000 },
    { duration: '5s', target: 500 },
    { duration: '5s', target: 400 },
    { duration: '5s', target: 300 },
    { duration: '5s', target: 200 },
    { duration: '5s', target: 100 },
    { duration: '5s', target: 0 },
  ],
};

// default to PHP_NATIVE, 
// supports:
// - PHP_NATIVE 
// - EXPRESS_JS
// - LARAVEL
// - GOLANG
const appName = __ENV.APP_NAME || 'PHP_NATIVE';

// default to HELLO, 
// support:
// - HELLO
// - GET_PRODUCTS
// - GET_PRODUCTS_WHERE_LIKE
// - GET_PRODUCTS_WITH_CACHE
const functionName = __ENV.FUNCTION_NAME || 'HELLO'; 

export function setup() {
  // log the appName and functionName
  console.log(`APP_NAME      : ${appName}`);
  console.log(`FUNCTION_NAME : ${functionName}`);

  // get the API metadata
  let res = getAPIMetadata(appName, functionName);

  // log the URL
  console.log(`URL          : ${res.URL}`);

  return res.URL;
}

export default function(URL) {
  let res = fire(URL);
  check(res, { "status is 200": (res) => res.status === 200 });
}
