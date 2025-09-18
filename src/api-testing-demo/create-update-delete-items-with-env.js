import { check } from 'k6';
import exec from 'k6/execution'; // Import exec for execution context
import { login } from './lib/auth.js'; // Import login function from auth.js
import { createItem, updateItem, deleteItem } from './lib/items.js'; // Import createItem function from items.js

// options for the test
export const options = {
  vus: __ENV.VUS || 1, // Number of virtual users (VUs), can be set via environment variable
  iterations: __ENV.ITERATIONS || 5, // Number of iterations, can be set via environment variable
};

// username and password for the API, can be set via environment variables
const API_USERNAME = __ENV.API_USERNAME || 'user1';
const API_PASSWORD = __ENV.API_PASSWORD || '1234';

// setup function to run once before all VUs start
export function setup() {
  const token = login(API_USERNAME, API_PASSWORD); // Call the login function to get the token
  if (!token) {
    throw new Error('❌ Failed to login and retrieve token');
  }
  return token; // Return the token for use in the default function
}

// default function for VU
export default function (token) {
  // Get the VU ID
  const VU_ID = exec.vu.idInInstance; 
  
  // Get the iteration ID
  const ITERATION_ID = exec.vu.iterationInInstance; 

  // Log the execution context
  console.log(`🚀 EXEC CONTEXT: VU_ID: ${VU_ID} | ITERATION_ID: ${ITERATION_ID}`);

  // Create a unique ID for the item to be created
  const id = `item-by-k6-${VU_ID}-${ITERATION_ID}`;

	// Create titles for the item
  const titleCreate = `Created by ${id}`;
  const titleUpdate = `Updated by ${id}`;

  // STEP 1: Create item to delete
  const res = createItem(token, id, titleCreate);
  
  if (res.status === "SUCCESS") {
    console.log(`✅ Successfully CREATED item with id: ${id}`);
  } else {
    fail(`❌ Failed to CREATE item ${id}`);
  }
  
  check(res, {
    'item created': (r) => r.status === "SUCCESS",
  });

  // STEP 2: Update the item
  const updateRes = updateItem(token, id, titleUpdate);

  if (updateRes.status === "SUCCESS") {
    console.log(`✅ Successfully UPDATED item with id: ${id}`);
  } else {
    fail(`❌ Failed to UPDATE item ${id}`);
  }

  check(updateRes, {
    'item updated': (r) => r.status === "SUCCESS",
  });

  // STEP 3: Delete the item
  const delRes = deleteItem(token, id);

  if (delRes.status === "SUCCESS") {
    console.log(`✅ Successfully DELETED item with id: ${id}`);
  } else {
    fail(`❌ Failed to DELETE item ${id}`);
  }

  check(delRes, {
    'item deleted': (r) => r.status === "SUCCESS",
  });
}