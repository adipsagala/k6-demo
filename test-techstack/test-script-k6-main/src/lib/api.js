import http from "k6/http";
import { fail } from "k6";

// Base URL for the API, can be overridden by environment variable
const API_BASE_URL = __ENV.API_BASE_URL || 'http://localhost';

// API APP PORTS, can be overridden by environment variable
const API_PORT_PHP_NATIVE = __ENV.API_PORT_PHP_NATIVE || '8000';
const API_PORT_EXPRESS_JS = __ENV.API_PORT_EXPRESS_JS || '8001';
const API_PORT_LARAVEL = __ENV.API_PORT_PHP_LARAVEL || '8002';
const API_PORT_GOLANG = __ENV.API_PORT_GOLANG || '8003';

// API APP URLS
const API_URI_HELLO = '/hello';
const API_URI_HELLO_PHP_NATIVE = '/hello.php';

const API_URI_GET_PRODUCTS = '/products';
const API_URI_GET_PRODUCTS_PHP_NATIVE = '/get-products.php';

const API_URI_GET_PRODUCTS_WHERE_LIKE = '/products-where-like';
const API_URI_GET_PRODUCTS_WHERE_LIKE_PHP_NATIVE = '/get-products-where-like.php';

const API_URI_GET_PRODUCTS_WITH_CACHE = '/products-with-cache';
const API_URI_GET_PRODUCTS_WITH_CACHE_PHP_NATIVE = '/get-products-with-cache.php';


// getAPIMetadata function, to be used in the test files.
// params: appName, functionName
// return: object with appName, functionName, URL
export function getAPIMetadata(appName, functionName) {

  let URL = ""
  
  switch (appName) {
    case 'PHP_NATIVE':
      URL = `${API_BASE_URL}:${API_PORT_PHP_NATIVE}`;
      break;
    case 'EXPRESS_JS':
      URL = `${API_BASE_URL}:${API_PORT_EXPRESS_JS}`;
      break;
    case 'LARAVEL':
      URL = `${API_BASE_URL}:${API_PORT_LARAVEL}`;
      break;
    case 'GOLANG':  
      URL = `${API_BASE_URL}:${API_PORT_GOLANG}`;
      break;
    default:
      fail('❌ Unknown appName');
  }

  switch (functionName) {
    case 'HELLO':
      if (appName === 'PHP_NATIVE') {
        URL += API_URI_HELLO_PHP_NATIVE;
      } else {
        URL += API_URI_HELLO;
      }
      break;
    case 'GET_PRODUCTS':
      if (appName === 'PHP_NATIVE') {
        URL += API_URI_GET_PRODUCTS_PHP_NATIVE;
      } else {
        URL += API_URI_GET_PRODUCTS;
      }
      break;
    case 'GET_PRODUCTS_WHERE_LIKE':
      if (appName === 'PHP_NATIVE') {
        URL += API_URI_GET_PRODUCTS_WHERE_LIKE_PHP_NATIVE;
      } else {
        URL += API_URI_GET_PRODUCTS_WHERE_LIKE;
      }
      break;
    case 'GET_PRODUCTS_WITH_CACHE':
      if (appName === 'PHP_NATIVE') {
        URL += API_URI_GET_PRODUCTS_WITH_CACHE_PHP_NATIVE;
      } else {
        URL += API_URI_GET_PRODUCTS_WITH_CACHE;
      }
      break;
    default:
      fail('❌ Unknown functionName');
  }

  return { appName, functionName, URL };  
}

// fire function, to be used hit the URL of API
// params: URL
// return: response object
export function fire(URL) {
  const res = http.get(URL, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return res;
}
