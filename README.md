# API Quest

Simple Express REST API for the API Quest backend challenge.

## Setup

```bash
npm install
npm test
npm start
```

## Environment

Copy `.env.example` to `.env` for local development if needed.

```env
PORT=3000
NODE_ENV=development
API_TOKEN=api-quest-secret
```

## Endpoints

### `GET /health`

```json
{
  "success": true,
  "data": {
    "status": "ok"
  },
  "message": "Service is healthy"
}
```

Manual test:

```bash
curl http://localhost:3000/health
```

### `GET /ping`

```json
{
  "success": true,
  "data": {
    "pong": true
  },
  "message": "pong"
}
```

Manual test:

```bash
curl http://localhost:3000/ping
```

### `POST /echo`

Echoes the exact JSON body that was sent. This endpoint intentionally does not use the standard response wrapper because API Quest Level 2 requires the same JSON back.

Manual test:

```bash
curl -X POST http://localhost:3000/echo \
  -H "Content-Type: application/json" \
  -d "{\"hello\":\"world\"}"
```

Expected:

```json
{
  "hello": "world"
}
```

Empty object test:

```bash
curl -X POST http://localhost:3000/echo \
  -H "Content-Type: application/json" \
  -d "{}"
```

Expected:

```json
{}
```

### `POST /books`

Creates a book and returns the raw created object. This endpoint intentionally does not use the standard response wrapper because API Quest Level 3 expects raw JSON.

Manual test:

```bash
curl -X POST http://localhost:3000/books \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Clean Code\",\"author\":\"Robert C. Martin\",\"year\":2008}"
```

Expected status:

```http
201 Created
```

Expected body:

```json
{
  "id": 1,
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "year": 2008
}
```

### `GET /books`

Returns a raw array.

```bash
curl http://localhost:3000/books
```

### `GET /books/:id`

Returns one raw book object.

```bash
curl http://localhost:3000/books/1
```

### Unknown Route

Returns:

```http
404 Not Found
```

```json
{
  "success": false,
  "error": {
    "message": "Route not found",
    "code": "NOT_FOUND"
  }
}
```

## Items

Items are stored in memory and reset when the server restarts.

### `GET /items?page=1&limit=10`

Returns paginated items:

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

Manual test:

```bash
curl "http://localhost:3000/items?page=1&limit=10"
```

### `POST /items`

Creates an item:

```bash
curl -X POST http://localhost:3000/items \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test Item\"}"
```

Success:

```http
201 Created
```

Validation failure:

```http
400 Bad Request
```

```json
{
  "success": false,
  "error": {
    "message": "Name is required",
    "code": "VALIDATION_ERROR"
  }
}
```

### `GET /items/:id`

Manual test:

```bash
curl http://localhost:3000/items/1
```

Missing item:

```http
404 Not Found
```

### `PUT /items/:id`

Manual test:

```bash
curl -X PUT http://localhost:3000/items/1 \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Updated Item\"}"
```

### `DELETE /items/:id`

Manual test:

```bash
curl -X DELETE http://localhost:3000/items/1
```

## Auth

Auth uses a fixed bearer token from `API_TOKEN`.

### `GET /protected`

Manual success test:

```bash
curl http://localhost:3000/protected \
  -H "Authorization: Bearer api-quest-secret"
```

Success:

```json
{
  "success": true,
  "data": {
    "authenticated": true
  },
  "message": "Authorized"
}
```

Missing or malformed token:

```http
401 Unauthorized
```

Invalid token:

```http
403 Forbidden
```

## Deployment

The app is ready for Render-style deployment.

Required environment variables:

```env
NODE_ENV=production
API_TOKEN=api-quest-secret
```

Render settings:

```text
Build command: npm install
Start command: npm start
```

After deployment, test the public URL before submitting:

```bash
curl https://your-api-url.com/health
curl https://your-api-url.com/ping
curl -X POST https://your-api-url.com/echo \
  -H "Content-Type: application/json" \
  -d "{\"hello\":\"world\"}"
curl -X POST https://your-api-url.com/books \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Clean Code\",\"author\":\"Robert C. Martin\",\"year\":2008}"
curl https://your-api-url.com/books
curl https://your-api-url.com/books/1
curl "https://your-api-url.com/items?page=1&limit=10"
curl https://your-api-url.com/protected \
  -H "Authorization: Bearer api-quest-secret"
```
