import http from "k6/http";
import { fail } from "k6";

// Base URL for the API, can be overridden by environment variable
const API_BASE_URL = __ENV.API_BASE_URL || 'http://localhost:8080';

// Function to login and retrieve token
export function login(username, password) {
    const res = http.post(`${API_BASE_URL}/login`, JSON.stringify({
        username: username,
        password: password,
    }), {
        headers: { 'Content-Type': 'application/json' },
    });
    
    const body = JSON.parse(res.body);
    if (!body.data || !body.data.token) {
        fail('❌ Failed to login and retrieve token');
    }
    
    return body.data.token;
}
