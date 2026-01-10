# Serverless User CRUD API

A production-ready serverless User CRUD API built with AWS Lambda, API Gateway, DynamoDB, and the Serverless Framework.

## 🏗️ Architecture

- **Runtime**: Node.js 18.x
- **Compute**: AWS Lambda
- **API**: AWS API Gateway
- **Database**: AWS DynamoDB (PAY_PER_REQUEST billing)
- **Framework**: Serverless Framework
- **Testing**: Jest with aws-sdk-mock

## 📁 Project Structure

```
backend/
├── src/
│   ├── handlers/          # Lambda handler functions
│   │   ├── createUser.js
│   │   ├── getUser.js
│   │   ├── listUsers.js
│   │   ├── updateUser.js
│   │   └── deleteUser.js
│   ├── services/          # Business logic layer
│   │   └── userService.js
│   ├── config/            # Configuration files
│   │   └── dynamodb.js
│   ├── utils/             # Utility functions
│   │   ├── response.js
│   │   └── validator.js
│   └── constants/         # Constants
│       └── httpStatusCodes.js
├── tests/                 # Test files
│   ├── createUser.test.js
│   ├── getUser.test.js
│   ├── listUsers.test.js
│   ├── updateUser.test.js
│   └── deleteUser.test.js
├── serverless.yml         # Serverless configuration
├── package.json
├── jest.config.js
└── README.md
```

## 📋 User Model

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| UserID | UUID | Auto | Unique identifier (auto-generated) |
| Name | String | Yes | User's full name (2-100 characters) |
| Email | String | Yes | Email address (unique, validated format) |
| DOB | String | Yes | Date of birth (YYYY-MM-DD, must be 18+) |
| Phone | String | No | Phone number (optional) |
| Address | String | No | Address (optional) |
| CreatedAt | ISO String | Auto | Creation timestamp |
| UpdatedAt | ISO String | Auto | Last update timestamp |

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- AWS CLI configured with appropriate credentials
- Serverless Framework CLI installed globally

### Installation

1. **Install dependencies:**

```bash
npm install
```

2. **Install Serverless Framework globally (if not already installed):**

```bash
npm install -g serverless
```

3. **Configure AWS credentials:**

```bash
aws configure
```

Or set environment variables:
```bash
export AWS_ACCESS_KEY_ID=your-access-key
export AWS_SECRET_ACCESS_KEY=your-secret-key
export AWS_REGION=us-east-1
```

## 🧪 Testing

Run all tests with coverage:

```bash
npm test
```

This will:
- Run all test suites
- Generate coverage reports
- Ensure 80%+ code coverage

## 🏃 Local Development

Start the serverless offline environment:

```bash
npm run offline
```

The API will be available at `http://localhost:3000` (default port).

## 📡 API Endpoints

Base URL (after deployment): `https://{api-id}.execute-api.{region}.amazonaws.com/{stage}`

### 1. Create User

**POST** `/users`

Creates a new user with validation and duplicate email checking.

**Request Body:**
```json
{
  "Name": "John Doe",
  "Email": "john@example.com",
  "DOB": "1990-01-01",
  "Phone": "1234567890",
  "Address": "123 Main St"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "UserID": "550e8400-e29b-41d4-a716-446655440000",
    "Name": "John Doe",
    "Email": "john@example.com",
    "DOB": "1990-01-01",
    "Phone": "1234567890",
    "Address": "123 Main St",
    "CreatedAt": "2024-01-01T00:00:00.000Z",
    "UpdatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "User created successfully"
}
```

**Error Responses:**
- `400` - Validation failed
- `409` - Email already exists
- `500` - Internal server error

---

### 2. Get User

**GET** `/users/{UserID}`

Retrieves a user by UserID.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "UserID": "550e8400-e29b-41d4-a716-446655440000",
    "Name": "John Doe",
    "Email": "john@example.com",
    "DOB": "1990-01-01",
    "Phone": "1234567890",
    "Address": "123 Main St",
    "CreatedAt": "2024-01-01T00:00:00.000Z",
    "UpdatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "User retrieved successfully"
}
```

**Error Responses:**
- `400` - UserID is required
- `404` - User not found
- `500` - Internal server error

---

### 3. List Users

**GET** `/users`

Lists users with pagination support.

**Query Parameters:**
- `limit` (optional): Number of items per page (1-100, default: 10)
- `lastEvaluatedKey` (optional): Base64-encoded pagination token

**Example:**
```
GET /users?limit=20&lastEvaluatedKey=eyJVc2VySUQiOiJsYXN0LWtleSJ9
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "UserID": "550e8400-e29b-41d4-a716-446655440000",
        "Name": "John Doe",
        "Email": "john@example.com",
        "DOB": "1990-01-01",
        "CreatedAt": "2024-01-01T00:00:00.000Z",
        "UpdatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "count": 1,
      "limit": 20,
      "lastEvaluatedKey": "eyJVc2VySUQiOiJsYXN0LWtleSJ9"
    }
  },
  "message": "Users retrieved successfully"
}
```

**Error Responses:**
- `400` - Invalid limit parameter
- `500` - Internal server error

---

### 4. Update User

**PUT** `/users/{UserID}`

Updates an existing user. Only provided fields will be updated.

**Request Body:**
```json
{
  "Name": "John Updated",
  "Phone": "9876543210"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "UserID": "550e8400-e29b-41d4-a716-446655440000",
    "Name": "John Updated",
    "Email": "john@example.com",
    "DOB": "1990-01-01",
    "Phone": "9876543210",
    "Address": "123 Main St",
    "CreatedAt": "2024-01-01T00:00:00.000Z",
    "UpdatedAt": "2024-01-02T00:00:00.000Z"
  },
  "message": "User updated successfully"
}
```

**Error Responses:**
- `400` - Validation failed or no update data provided
- `404` - User not found
- `409` - Email already exists
- `500` - Internal server error

---

### 5. Delete User

**DELETE** `/users/{UserID}`

Deletes a user by UserID.

**Response (204 No Content):**
```json
{
  "success": true,
  "data": {},
  "message": "User deleted successfully"
}
```

**Error Responses:**
- `400` - UserID is required
- `404` - User not found
- `500` - Internal server error

---

## 📝 Response Format

### Success Response

```json
{
  "success": true,
  "data": {},
  "message": "Operation successful"
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message",
  "details": ["Additional error details"],
  "statusCode": 400
}
```

## ✅ Validation Rules

### Name
- Required
- Must be a string
- Length: 2-100 characters

### Email
- Required
- Must be a valid email format
- Must be unique across all users
- Case-insensitive (stored in lowercase)

### Date of Birth (DOB)
- Required
- Format: YYYY-MM-DD
- Must be a past date
- User must be at least 18 years old

### Phone
- Optional
- Must be a string if provided

### Address
- Optional
- Must be a string if provided

## 🚀 Deployment

### Deploy to AWS

Deploy to default stage (dev):

```bash
npm run deploy
```

Deploy to a specific stage:

```bash
serverless deploy --stage production
```

### View Logs

View function logs:

```bash
npm run logs
```

View logs for a specific function:

```bash
serverless logs -f createUser --tail
```

### Remove Deployment

Remove all AWS resources:

```bash
serverless remove
```

## 🔧 Configuration

### Environment Variables

The following environment variables are automatically set by Serverless Framework:

- `USERS_TABLE`: DynamoDB table name (format: `{service}-{stage}-users`)
- `STAGE`: Deployment stage (dev, staging, production, etc.)
- `AWS_REGION`: AWS region (default: us-east-1)

### DynamoDB Table

- **Table Name**: Auto-generated based on service and stage
- **Partition Key**: `UserID` (String)
- **Global Secondary Index**: `EmailIndex` on `Email` attribute
- **Billing Mode**: PAY_PER_REQUEST (on-demand)

### IAM Permissions

The Lambda functions have the following DynamoDB permissions:
- `dynamodb:Query`
- `dynamodb:Scan`
- `dynamodb:GetItem`
- `dynamodb:PutItem`
- `dynamodb:UpdateItem`
- `dynamodb:DeleteItem`

## 🧪 Testing Examples

### Using cURL

**Create User:**
```bash
curl -X POST https://your-api-id.execute-api.us-east-1.amazonaws.com/dev/users \
  -H "Content-Type: application/json" \
  -d '{
    "Name": "John Doe",
    "Email": "john@example.com",
    "DOB": "1990-01-01",
    "Phone": "1234567890",
    "Address": "123 Main St"
  }'
```

**Get User:**
```bash
curl -X GET https://your-api-id.execute-api.us-east-1.amazonaws.com/dev/users/{UserID}
```

**List Users:**
```bash
curl -X GET "https://your-api-id.execute-api.us-east-1.amazonaws.com/dev/users?limit=10"
```

**Update User:**
```bash
curl -X PUT https://your-api-id.execute-api.us-east-1.amazonaws.com/dev/users/{UserID} \
  -H "Content-Type: application/json" \
  -d '{
    "Name": "John Updated",
    "Phone": "9876543210"
  }'
```

**Delete User:**
```bash
curl -X DELETE https://your-api-id.execute-api.us-east-1.amazonaws.com/dev/users/{UserID}
```

## 📊 Code Quality

- **ES6+ Syntax**: Modern JavaScript features
- **Async/Await**: No callback hell
- **JSDoc Comments**: Comprehensive documentation
- **DRY Principle**: Reusable code patterns
- **Error Handling**: Centralized error management
- **Test Coverage**: 80%+ coverage requirement

## 🔒 Security Considerations

- Input validation on all endpoints
- Email uniqueness enforcement
- Age verification (18+)
- No internal error exposure
- CORS enabled for cross-origin requests
- IAM role-based access control

## 📦 Dependencies

### Production
- `aws-sdk`: AWS SDK for JavaScript
- `uuid`: UUID generation

### Development
- `jest`: Testing framework
- `aws-sdk-mock`: Mocking AWS SDK for tests
- `serverless-offline`: Local development server


## 🆘 Troubleshooting

### Common Issues

**Issue**: `Serverless command not found`
- **Solution**: Install Serverless Framework globally: `npm install -g serverless`

**Issue**: `Access Denied` errors
- **Solution**: Verify AWS credentials and IAM permissions

**Issue**: DynamoDB table not found
- **Solution**: Ensure the table is created during deployment. Check CloudFormation stack.

**Issue**: Tests failing
- **Solution**: Run `npm install` to ensure all dependencies are installed


