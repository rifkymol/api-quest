# API Quest Delivery Plan

## Current Scope: Phase 1 and Level 1 Readiness

- [x] Create task tracking files for the challenge workflow.
- [x] Scaffold a minimal Express API project.
- [x] Implement centralized response helpers.
- [x] Implement `GET /health`.
- [x] Implement `GET /ping`.
- [x] Add JSON 404 and error handling, including invalid JSON.
- [x] Add Jest + Supertest integration tests.
- [x] Run automated tests locally.
- [x] Run manual local curl checks.
- [x] Document endpoint contracts and manual commands in `README.md`.

## Endpoint Contracts

### Health Check

Method and path:

```http
GET /health
```

Purpose:

Confirm the API process is alive and returning JSON.

Success response:

```http
200 OK
```

```json
{
  "success": true,
  "data": {
    "status": "ok"
  },
  "message": "Service is healthy"
}
```

Test cases:

| Case | Expected |
| --- | --- |
| Valid request | 200 JSON health payload |
| Wrong path | 404 JSON error |

Manual curl:

```bash
curl http://localhost:3000/health
```

### Ping

Method and path:

```http
GET /ping
```

Purpose:

Provide a simple challenge-style ping response.

Success response:

```http
200 OK
```

```json
{
  "success": true,
  "data": {
    "pong": true
  },
  "message": "pong"
}
```

Note:

If API Quest gives an exact different response shape for Level 1, that exact contract should replace this implementation before submission.

Test cases:

| Case | Expected |
| --- | --- |
| Valid request | 200 JSON ping payload |
| Wrong path | 404 JSON error |

Manual curl:

```bash
curl http://localhost:3000/ping
```

## Verification

Automated:

```bash
npm test
```

Result:

```text
Test Suites: 3 passed, 3 total
Tests: 4 passed, 4 total
```

Manual local checks on port `3100`:

| Check | Result |
| --- | --- |
| `GET /health` | 200 with expected JSON |
| `GET /ping` | 200 with expected JSON |
| `GET /not-exist` | 404 with JSON error |
| `/health` timing | `0.006403s` |
| `npm start` on port `3101` | served `GET /health` successfully |

## Review

Phase 1 and Level 1 readiness skeleton is complete. The only known caveat is that API Quest may require an exact `/ping` response body such as `{ "message": "pong" }`; if the challenge contract says that, update the endpoint and test before submitting.

## Current Scope: Phase 2 Item API

- [x] Add in-memory item store with reset support for tests.
- [x] Add item service for list, create, find, update, and delete.
- [x] Add validation for item names, IDs, and pagination query params.
- [x] Implement `GET /items`.
- [x] Implement `POST /items`.
- [x] Implement `GET /items/:id`.
- [x] Implement `PUT /items/:id`.
- [x] Implement `DELETE /items/:id`.
- [x] Add integration tests for CRUD, validation, not-found, and pagination edge cases.
- [x] Run automated tests locally.
- [x] Run manual local curl checks.
- [x] Update README with item endpoint contracts.

### List Items

Method and path:

```http
GET /items?page=1&limit=10
```

Success response:

```http
200 OK
```

```json
{
  "success": true,
  "data": {
    "items": [],
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalItems": 0,
      "totalPages": 0,
      "hasNextPage": false,
      "hasPreviousPage": false
    }
  },
  "message": "Items retrieved"
}
```

### Create Item

Method and path:

```http
POST /items
```

Request body:

```json
{
  "name": "Item name"
}
```

Success response:

```http
201 Created
```

### Item By ID

Methods and paths:

```http
GET /items/:id
PUT /items/:id
DELETE /items/:id
```

Rules:

- Missing item IDs return `404`.
- Missing or empty names return `400`.
- Valid deletes return `200` with the deleted item.
- IDs are strings consistently.

### Phase 2 Verification

Automated:

```bash
npm test
```

Result:

```text
Test Suites: 4 passed, 4 total
Tests: 19 passed, 19 total
```

Manual local checks on port `3102`:

| Check | Result |
| --- | --- |
| `GET /health` | 200 with expected JSON |
| `POST /items` | 201 with item `id: "1"` |
| `GET /items?page=1&limit=10` | 200 with one item |
| `GET /items/1` | 200 with created item |
| `PUT /items/1` | 200 with updated name |
| `DELETE /items/1` | 200 with deleted item |
| `GET /items/1` after delete | 404 |
| `GET /items?page=abc` | 400 |

### Phase 2 Review

Item CRUD and pagination readiness are complete using in-memory storage. The implementation remains intentionally simple: no database, string IDs, route/controller/service separation, and deterministic tests with store resets.

## Current Scope: Final Local Readiness

- [x] Add fixed bearer-token auth middleware.
- [x] Implement `GET /protected`.
- [x] Test valid, missing, malformed, and invalid auth headers.
- [x] Add deployment-ready config and docs.
- [x] Run full automated test suite.
- [x] Run manual local checks for core, CRUD, auth, errors, and performance.
- [x] Update final readiness checklist.

### Protected Endpoint

Method and path:

```http
GET /protected
```

Required header:

```http
Authorization: Bearer api-quest-secret
```

Success response:

```http
200 OK
```

```json
{
  "success": true,
  "data": {
    "authenticated": true
  },
  "message": "Authorized"
}
```

Auth rules:

- Missing or malformed auth returns `401`.
- Wrong token returns `403`.
- Token comes from `API_TOKEN`, defaulting to `api-quest-secret` for local challenge use.

### Final Local Verification

Automated:

```bash
npm test
```

Result:

```text
Test Suites: 5 passed, 5 total
Tests: 24 passed, 24 total
```

Manual local checks on port `3103`:

| Check | Result |
| --- | --- |
| `GET /health` | 200 |
| `GET /ping` | 200 |
| `POST /items` | 201 with item `id: "1"` |
| `GET /items?page=1&limit=10` | 200 with one item |
| `GET /protected` with valid token | 200 |
| `GET /protected` without token | 401 |
| `GET /protected` with wrong token | 403 |
| `GET /not-exist` | 404 |
| `GET /items?page=0` | 400 |
| `/health` timing | `0.001498s` |

### Final Readiness Checklist

Core:

- [ ] API is publicly accessible.
- [x] No localhost dependency in application code.
- [x] `/health` works locally.
- [x] `/ping` works locally.
- [x] CRUD endpoints exist locally.
- [x] JSON response is valid.
- [x] Correct local status codes are covered by tests.
- [x] Unknown route returns JSON 404.
- [x] Invalid input returns 400.
- [x] Server errors are handled safely.

Architecture:

- [x] Routes separated.
- [x] Controllers separated.
- [x] Services separated.
- [x] In-memory store abstracted.
- [x] Middleware used for errors and auth.
- [x] Environment variables supported.
- [x] CORS enabled.
- [x] Logging enabled outside tests.

Testing:

- [x] Integration tests pass.
- [x] Manual curl-style tests pass locally.
- [x] Invalid input tested.
- [x] Missing resource tested.
- [x] Empty data tested.
- [x] Pagination edge cases tested.
- [x] Auth edge cases tested.
- [x] Performance sanity check done locally.
- [ ] Manual tests pass on deployed URL.

Deployment:

- [x] `npm start` works locally.
- [x] `process.env.PORT` used.
- [x] `.env` is ignored.
- [x] `.env.example` exists.
- [x] Render config exists.
- [ ] Public URL tested.
- [ ] Base URL submitted.

### Final Review

Local implementation is complete through the planned challenge phases: health, ping, CRUD, validation, pagination, auth, JSON errors, tests, docs, and deployment readiness. Remaining unchecked items require a public deployment URL.

## Correction: Level 2 Echo Endpoint

- [x] Implement exact `POST /echo` route.
- [x] Return `req.body` directly with status `200`.
- [x] Do not wrap echo responses in the standard response format.
- [x] Test normal JSON object echo.
- [x] Test empty object echo.
- [x] Verify locally with curl-style requests.

### Echo Endpoint

Method and path:

```http
POST /echo
```

Purpose:

Parse a JSON body and return the exact same JSON body.

Success response:

```http
200 OK
```

Request:

```json
{
  "hello": "world"
}
```

Response:

```json
{
  "hello": "world"
}
```

### Echo Verification

Automated:

```bash
npm test
```

Result:

```text
Test Suites: 6 passed, 6 total
Tests: 26 passed, 26 total
```

Manual local checks on port `3105`:

| Check | Result |
| --- | --- |
| `POST /echo` with `{"hello":"world"}` | 200, `{"hello":"world"}` |
| `POST /echo` with `{}` | 200, `{}` |

## Correction: Level 3 Books Endpoint

- [x] Implement exact `POST /books` route.
- [x] Implement exact `GET /books` route returning a raw array.
- [x] Implement exact `GET /books/:id` route returning a raw book object.
- [x] Use numeric `id` values.
- [x] Do not wrap book responses in the standard response format.
- [x] Test created book response shape.
- [x] Test list response is an array.
- [x] Test get-by-id response shape.
- [x] Verify locally with curl-style requests.

### Books Endpoint Contract

Create:

```http
POST /books
```

Request:

```json
{
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "year": 2008
}
```

Response:

```http
201 Created
```

```json
{
  "id": 1,
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "year": 2008
}
```

List:

```http
GET /books
```

Response must be a raw array:

```json
[
  {
    "id": 1,
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "year": 2008
  }
]
```

### Books Verification

Automated:

```bash
npm test
```

Result:

```text
Test Suites: 7 passed, 7 total
Tests: 30 passed, 30 total
```

Manual local checks on port `3106`:

| Check | Result |
| --- | --- |
| `POST /books` | 201, raw book with numeric `id` |
| `GET /books` | 200, raw array |
| `GET /books/1` | 200, raw book object |
| `GET /books/999` | 404 |

## Correction: Level 4 Book Update/Delete

- [x] Implement exact `PUT /books/:id` route.
- [x] Implement exact `DELETE /books/:id` route.
- [x] Preserve numeric `id` on update.
- [x] Persist updates in the same books array.
- [x] Remove deleted books from the same books array.
- [x] Return `204` with no body for successful delete.
- [x] Return raw `{ "error": "Book not found" }` for missing update/delete targets.
- [x] Verify locally with curl-style create, update, get, delete, get sequence.

### Book Update/Delete Contract

Update:

```http
PUT /books/1
```

Request:

```json
{
  "title": "Dune Updated",
  "author": "Frank Herbert",
  "year": 1965
}
```

Response:

```http
200 OK
```

```json
{
  "id": 1,
  "title": "Dune Updated",
  "author": "Frank Herbert",
  "year": 1965
}
```

Delete:

```http
DELETE /books/1
```

Response:

```http
204 No Content
```

### Book Update/Delete Verification

Automated:

```bash
npm test
```

Result:

```text
Test Suites: 7 passed, 7 total
Tests: 36 passed, 36 total
```

Manual local checks on port `3107`:

| Check | Result |
| --- | --- |
| `POST /books` | 201 |
| `PUT /books/1` | 200 |
| `GET /books/1` after update | title is `Dune Updated` |
| `DELETE /books/1` | 204 |
| `GET /books/1` after delete | 404 |

## Correction: Level 5 Auth Guard

- [x] Implement exact `POST /auth/token` route.
- [x] Return raw `{ "token": "api-quest-token" }` for `admin` / `password`.
- [x] Return raw `{ "error": "Invalid credentials" }` with `401` for wrong credentials.
- [x] Protect only `GET /books`.
- [x] Return raw `{ "error": "Unauthorized" }` with `401` for missing/invalid token on `GET /books`.
- [x] Keep `GET /books` successful response as a raw array when token is valid.
- [x] Do not protect `POST /books`, `GET /books/:id`, `PUT /books/:id`, or `DELETE /books/:id`.
- [x] Verify locally with token success, wrong credentials, missing token, and valid token list.

### Auth Token Contract

```http
POST /auth/token
```

Request:

```json
{
  "username": "admin",
  "password": "password"
}
```

Response:

```json
{
  "token": "api-quest-token"
}
```

### Protected Books List Contract

```http
GET /books
Authorization: Bearer api-quest-token
```

Response remains a raw array:

```json
[]
```

### Auth Guard Verification

Automated:

```bash
npm test
```

Result:

```text
Test Suites: 8 passed, 8 total
Tests: 40 passed, 40 total
```

Manual local checks on port `3108`:

| Check | Result |
| --- | --- |
| `POST /auth/token` with correct credentials | 200, `{"token":"api-quest-token"}` |
| `POST /auth/token` with wrong password | 401, `{"error":"Invalid credentials"}` |
| `GET /books` without token | 401, `{"error":"Unauthorized"}` |
| `GET /books` with `Bearer api-quest-token` | 200, raw array |
