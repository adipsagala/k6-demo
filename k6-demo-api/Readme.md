# 📦 Simple Go REST API with JWT Auth
Author by **Adi P Sagala**

<a href="https://triwicaksono.com/?utm_source=labs&utm_medium=demo-projects&utm_campaign=k6-demo-api-readme" target="_blank"><img src="https://ugc.production.linktr.ee/320fdfa3-933e-4049-9d64-0ecba75f92f2_Et0zhDNurGT7OirAVreew-X30cIduW5hMtVVyCqGrxriFTuig2-ZD8YabW5V0hTn6Ux1KJ7WWzc-s800-c-k-c0x00ffffff-no-.jpeg?io=true&size=avatar-v3_0" 
alt="IMAGE ALT TEXT HERE" height="15" /> Website</a> | <a href="https://triwicaksono.com/portfolio?utm_source=labs&utm_medium=demo-projects&utm_campaign=k6-demo-api-readme" target="_blank"><img src="https://ugc.production.linktr.ee/320fdfa3-933e-4049-9d64-0ecba75f92f2_Et0zhDNurGT7OirAVreew-X30cIduW5hMtVVyCqGrxriFTuig2-ZD8YabW5V0hTn6Ux1KJ7WWzc-s800-c-k-c0x00ffffff-no-.jpeg?io=true&size=avatar-v3_0" 
alt="IMAGE ALT TEXT HERE" height="15" /> Portfolio</a> | <a href="https://triwicaksono.com/courses?utm_source=labs&utm_medium=demo-projects&utm_campaign=k6-demo-api-readme" target="_blank"><img src="https://ugc.production.linktr.ee/320fdfa3-933e-4049-9d64-0ecba75f92f2_Et0zhDNurGT7OirAVreew-X30cIduW5hMtVVyCqGrxriFTuig2-ZD8YabW5V0hTn6Ux1KJ7WWzc-s800-c-k-c0x00ffffff-no-.jpeg?io=true&size=avatar-v3_0" 
alt="IMAGE ALT TEXT HERE" height="15" /> Courses</a> | <a href="https://trw.my.id/linkedin" target="_blank"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/LinkedIn_icon.svg/2048px-LinkedIn_icon.svg.png" 
alt="IMAGE ALT TEXT HERE" height="15" /> LinkedIn</a> | <a href="https://trw.my.id/instagram" target="_blank"><img src="https://ugc.production.linktr.ee/a8ba242a-a7f1-4d2e-93f0-15124dbbb705_IMG-4598.jpeg?io=true&size=thumbnail-stack-v1_0" 
alt="IMAGE ALT TEXT HERE" height="15" /> Instagram </a> | <a href="https://trw.my.id/tiktok" target="_blank"><img src="https://ugc.production.linktr.ee/1337bda6-534c-41f7-b6ce-bac8ef9a10e5_IMG-4599.jpeg?io=true&size=thumbnail-stack-v1_0" 
alt="IMAGE ALT TEXT HERE" height="15" /> TikTok </a> | <a href="https://trw.my.id/youtube" target="_blank"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/YouTube_full-color_icon_%282017%29.svg/1280px-YouTube_full-color_icon_%282017%29.svg.png" 
alt="IMAGE ALT TEXT HERE" height="15" /> Youtube</a>

Demo API sederhana menggunakan **Golang** dan **JWT Authentication**. Cocok untuk testing atau demo API.

## 🚀 Features

* Register & Login (JWT-based)
* Protected CRUD endpoints for "items"
* In-memory storage (tanpa database)
* Standard JSON response format

---

# **🛠️ Cara Menjalankan**

Pastikan kamu sudah memiliki Go (versi 1.18 atau lebih baru).

### **🔹 Jalankan melalui RUN:**

```bash
go run main.go
```

### **🔹 Jalankan melalui build menjadi file binary:**

```bash
go build -o my-api
./my-api
```

### **🔹 Atau jalankan melalui Docker:**

```bash
docker compose build && docker compose up -d
```

> API akan berjalan di: [http://localhost:8080](http://localhost:8080/)
>

---

## 📚 API Documentation

#### GET `/healthcheck`

Default enpoint untuk success response.

**Response:**

```json
{
    "status": "SUCCESS",
    "message": "Service is healthy"
}
```

**cURL Example:**

```bash
curl --location 'http://localhost:8080/healthcheck'
```

---

#### POST `/register`

Register user baru.

**Request Body:**

```json
{
  "username": "user1",
  "password": "1234"
}
```

**Response:**

```json
{
  "status": "SUCCESS",
  "message": "User registered"
}
```

**cURL Example:**

```bash
curl -X POST http://localhost:8080/register \
  -H "Content-Type: application/json" \
  -d '{"username": "user1", "password": "1234"}'
```

---

#### POST `/login`

Login dan mendapatkan JWT token.

**Request Body:**

```json
{
  "username": "user1",
  "password": "1234"
}
```

**Response:**

```json
{
  "status": "SUCCESS",
  "message": "Login successful",
  "data": {
    "token": "<jwt_token_here>"
  }
}
```

> 💡 Simpan `token` dari response untuk digunakan pada endpoint yang dilindungi.

**cURL Example:**

```bash
curl -X POST http://localhost:8080/login \
  -H "Content-Type: application/json" \
  -d '{"username": "user1", "password": "1234"}'
```


---

### 📦 Items

> ✅ **Semua endpoint `/items` harus menyertakan header:**

```
Authorization: <jwt_token>
```

---

#### GET `/items`

Ambil semua item.

**Response:**

```json
{
  "status": "SUCCESS",
  "message": "Fetched items",
  "data": [
    { "id": "1", "title": "First Book" },
    { "id": "2", "title": "Second Item" },
    { "id": "3", "title": "GoLang Guide" }
  ]
}
```

**cURL Example:**

```bash
curl -X GET http://localhost:8080/items \
  -H "Authorization: <token>"
```

---

#### POST `/items`

Buat item baru.

**Request Body:**

```json
{
  "id": "4",
  "title": "New Book"
}
```

**Response:**

```json
{
  "status": "SUCCESS",
  "message": "Item created",
  "data": {
    "id": "4",
    "title": "New Book"
  }
}
```

**cURL Example:**

```bash
curl -X POST http://localhost:8080/items \
  -H "Content-Type: application/json" \
  -H "Authorization: <token>" \
  -d '{"id": "4", "title": "New Book"}'
```

---

#### PUT `/items/{id}`

Update item berdasarkan ID.

**Request Body:**

```json
{
  "title": "Updated Title"
}
```

**Response:**

```json
{
  "status": "SUCCESS",
  "message": "Item updated",
  "data": {
    "id": "4",
    "title": "Updated Title"
  }
}
```

**cURL Example:**

```bash
curl -X PUT http://localhost:8080/items/4 \
  -H "Content-Type: application/json" \
  -H "Authorization: <token>" \
  -d '{"title": "Updated Title"}'
```

---

#### DELETE `/items/{id}`

Hapus item berdasarkan ID.

**Response:**

```json
{
  "status": "SUCCESS",
  "message": "Item deleted"
}
```

```bash
curl -X DELETE http://localhost:8080/items/4 \
  -H "Authorization: <token>"
```

---

## ⚠️ Notes

* Data disimpan hanya di memori (RAM), akan hilang saat server restart.
* JWT berlaku selama 5 menit.
* Token dikirim melalui header `Authorization`.

---

## 📦 Response Format

Semua API akan merespon dalam format berikut:

```json
{
  "status": "SUCCESS | ERROR | INVALID | UNAUTHORIZED",
  "message": "Descriptive message",
  "data": { ...optional }
}
```