import { check } from 'k6';
import { login } from './lib/auth.js'; // Import login function from auth.js
import { getItems } from './lib/items.js'; // Import getItems function from items.js

// options for the test
export const options = {
  vus: 100,
  duration: '5s',
};

// username and password for the API
const USERNAME = 'user1';
const PASSWORD = '1234';

// setup function to run once before all VUs start
export function setup() {
  const token = login(USERNAME, PASSWORD); // Call the login function to get the token
  if (!token) {
    throw new Error('❌ Failed to login and retrieve token');
  }
  return token; // Return the token for use in the default function
}

// default function for VU
export default function (token) {
  const res = getItems(token); // Call the getItems function to retrieve items

  check(res, {
    'status is 200': (r) => r.status === "SUCCESS",
  });
}
