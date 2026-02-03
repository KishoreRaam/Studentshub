# Domain Availability Check API

This API provides DNS-based domain availability checking for `.edu.in` domains.

## How It Works

The API uses Node.js's built-in `dns.promises` module to check if a domain has DNS records:

1. Takes a domain name (e.g., `mycollegename`)
2. Appends `.edu.in` to create the full domain
3. Checks for DNS records (A, MX, NS)
4. Returns availability status:
   - **Available**: No DNS records found (domain appears available)
   - **Not Available**: DNS records exist (domain is in use)

**Note**: This is a probabilistic indicator, not a guarantee of availability.

## Installation

Navigate to the `api` directory and install dependencies:

```bash
cd api
npm install
```

## Running the API Server

### Development

Start the API server on port 3001:

```bash
npm start
```

Or from the root directory:

```bash
npm run api
```

### Running Both Frontend and API

From the root directory, run both Vite dev server and API server:

```bash
npm run dev:full
```

This will start:
- Frontend: http://localhost:3000
- API: http://localhost:3001

## API Endpoint

### POST `/api/check-domain`

Check if a `.edu.in` domain is available.

**Request Body:**
```json
{
  "domain": "mycollegename"
}
```

**Response (Available):**
```json
{
  "available": true
}
```

**Response (Not Available):**
```json
{
  "available": false
}
```

**Error Response:**
```json
{
  "error": "Error message"
}
```

## Testing the API

Using curl:
```bash
curl -X POST http://localhost:3001/api/check-domain \
  -H "Content-Type: application/json" \
  -d '{"domain":"testcollege"}'
```

Using Postman or similar tools:
- Method: POST
- URL: http://localhost:3001/api/check-domain
- Headers: Content-Type: application/json
- Body: {"domain": "testcollege"}

## Deployment

### Vercel (Recommended)

This API is designed to work as a Vercel serverless function:

1. Place `check-domain.js` in the `/api` directory
2. Deploy to Vercel
3. The endpoint will be available at: `https://yourdomain.vercel.app/api/check-domain`

### Other Platforms

The API can be adapted for other serverless platforms (AWS Lambda, Netlify Functions, etc.) by adjusting the module.exports handler signature.

## How DNS Checking Works

The API performs three DNS lookups:

1. **A Records**: IPv4 address records
2. **MX Records**: Mail exchange records
3. **NS Records**: Name server records

If ANY of these records exist, the domain is considered "not available" (in use).

If NONE of these records exist or all lookups fail, the domain is considered "available".

## Limitations

- This is a probabilistic check, not definitive
- Domains without DNS records may still be registered but not configured
- Does not check domain registrar databases
- Does not handle domain purchase or registration

## Security

- Input validation for domain format (alphanumeric and hyphens only)
- CORS enabled for cross-origin requests
- No authentication required (add if needed for production)
