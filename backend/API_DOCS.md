# API Documentation

## Authentication
Most endpoints require authentication via Supabase Auth. Include the `Authorization: Bearer <token>` header.

## Endpoints

### Calculators

#### `GET /api/calculators`
List calculators.
- **Query Params**:
  - `limit`: number (default 10)
  - `sort`: 'trending' | 'recent'
  - `owner_id`: string (optional)
  - `category`: string (optional)

#### `GET /api/calculators/[id]`
Get a single calculator by ID.

#### `POST /api/run`
Execute a calculator.
- **Body**:
  ```json
  {
    "spec": { ... },
    "inputs": { "var1": 10, "var2": 5 }
  }
  ```
- **Response**:
  ```json
  {
    "output1": 15,
    "output2": 50
  }
  ```

#### `POST /api/generate`
Generate a calculator from a prompt.
- **Body**: `{ "prompt": "Calculate BMI" }`
- **Response**: `{ "spec": { ... } }`

### Chat

#### `POST /api/chat`
Chat with AI Tutor.
- **Body**:
  ```json
  {
    "messages": [{ "role": "user", "content": "..." }],
    "context": { ... }
  }
  ```

### Payments

#### `POST /api/checkout`
Create Stripe Checkout Session.
- **Body**: `{ "priceId": "price_..." }`

## Rate Limiting
API is rate-limited to 100 requests per minute per IP.
Headers:
- `X-RateLimit-Limit`
- `X-RateLimit-Remaining`
