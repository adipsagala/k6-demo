import http from "k6/http";
import { fail } from "k6";

// Base URL for the API, can be overridden by environment variable
const API_BASE_URL = __ENV.API_BASE_URL || 'http://localhost:8080'

// Function to get items from the API
export function getItems(token) {
    const res = http.get(`${API_BASE_URL}/items`, {
        headers: { 
            'Authorization': token,
            'Content-Type': 'application/json',
        },
    });
    
    const body = JSON.parse(res.body);
    if (body.status !== "SUCCESS") {
        fail('❌ Failed to retrieve items');
    }
    
    return body;
}

// Function to create an item in the API
export function createItem(token, id, title) {
    const res = http.post(`${API_BASE_URL}/items`, JSON.stringify({
        id: id,
        title: title,
    }), {
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json',
        },
    });
    
    const body = JSON.parse(res.body);
    if (body.status !== "SUCCESS") {
        fail('❌ Failed to create item');
    }
    
    return body;
}

// Function to update an item in the API
export function updateItem(token, id, title) {
    const res = http.put(`${API_BASE_URL}/items/${id}`, JSON.stringify({
        title: title,
    }), {
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json',
        },
    });
    
    const body = JSON.parse(res.body);
    if (body.status !== "SUCCESS") {
        fail('❌ Failed to update item');
    }
    
    return body;
}

// Function to delete an item in the API
export function deleteItem(token, id) {
    const res = http.del(`${API_BASE_URL}/items/${id}`, null, {
        headers: {
            'Authorization': token,
        },
    });
    
    const body = JSON.parse(res.body);
    if (body.status !== "SUCCESS") {
        fail('❌ Failed to delete item');
    }
    
    return body;
}