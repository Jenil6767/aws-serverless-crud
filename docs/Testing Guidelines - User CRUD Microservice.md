# 🧪 Testing Guidelines - User CRUD Microservice

Complete guide to execute tests for your serverless User CRUD API.

---

## 📋 Table of Contents

1. [Backend Unit Tests](#backend-unit-tests)
2. [Backend Integration Tests](#backend-integration-tests)
3. [API Testing with Postman/Curl](#api-testing)
4. [Frontend Testing](#frontend-testing)
5. [End-to-End Testing](#e2e-testing)
6. [Test Coverage](#test-coverage)

---

## 🔧 Backend Unit Tests

### Prerequisites

Ensure you're in the backend directory:

```bash
cd backend
npm install
```

### Running All Unit Tests

```bash
# Run all tests
npm test

# Run tests with coverage report
npm run test:coverage

# Run tests in watch mode (re-runs on file changes)
npm run test:watch

# Run specific test file
npm test createUser.test.js

# Run tests matching pattern
npm test -- --testNamePattern="should create user"
```

### Understanding Test Output

**Successful Test:**
```
 PASS  tests/createUser.test.js
  Create User Handler
    ✓ should create user successfully (45ms)
    ✓ should return 400 for invalid email (12ms)
    ✓ should return 409 for duplicate user (18ms)

Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
```

**Failed Test:**
```
 FAIL  tests/createUser.test.js
  Create User Handler
    ✕ should create user successfully (52ms)
    
  ● Create User Handler › should create user successfully

    Expected: 201
    Received: 400
```

### Test Files Structure

```
tests/
├── unit/
│   ├── createUser.test.js    # Test POST /users
│   ├── getUser.test.js        # Test GET /users/{id}
│   ├── listUsers.test.js      # Test GET /users
│   ├── updateUser.test.js     # Test PUT /users/{id}
│   ├── deleteUser.test.js     # Test DELETE /users/{id}
│   └── validator.test.js      # Test validation functions
└── integration/
    └── api.test.js            # Full workflow tests
```

### Running Individual Test Suites

```bash
# Test Create User functionality
npm test createUser.test.js

# Test Get User functionality
npm test getUser.test.js

# Test Update User functionality
npm test updateUser.test.js

# Test Delete User functionality
npm test deleteUser.test.js

# Test all validation functions
npm test validator.test.js
```

### Test Coverage Report

```bash
# Generate coverage report
npm run test:coverage
```

**Output:**
```
--------------------|---------|----------|---------|---------|-------------------
File                | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
--------------------|---------|----------|---------|---------|-------------------
All files           |   92.5  |   88.2   |   95.0  |   92.8  |                   
 handlers           |   95.2  |   90.5   |  100.0  |   95.5  |                   
  createUser.js     |   96.0  |   92.0   |  100.0  |   96.2  | 45,67            
  getUser.js        |   94.5  |   89.0   |  100.0  |   94.8  | 34               
 utils              |   88.5  |   85.0   |   90.0  |   88.9  |                   
  validator.js      |   88.5  |   85.0   |   90.0  |   88.9  | 23,45,67         
--------------------|---------|----------|---------|---------|-------------------
```

**Coverage will be saved in:** `coverage/lcov-report/index.html`

Open in browser to see detailed report:
```bash
# Windows
start coverage/lcov-report/index.html

# Mac
open coverage/lcov-report/index.html

# Linux
xdg-open coverage/lcov-report/index.html
```

---

## 🔗 Backend Integration Tests

Integration tests verify the complete flow including DynamoDB operations.

### Setup for Integration Tests

**Option 1: Using Serverless Offline**

```bash
# Install serverless-offline plugin
npm install --save-dev serverless-offline

# Start local API
serverless offline start

# In another terminal, run integration tests
npm run test:integration
```

**Option 2: Test Against Deployed API**

```bash
# Set environment variable for deployed API
export API_ENDPOINT=https://xxxxx.execute-api.us-east-1.amazonaws.com/dev

# Run integration tests
npm run test:integration
```

### Example Integration Test Flow

```javascript
describe('User CRUD Integration', () => {
  let userId;
  
  test('1. Create user', async () => {
    // POST /users
    userId = response.UserID;
  });
  
  test('2. Get user by ID', async () => {
    // GET /users/{userId}
  });
  
  test('3. List all users', async () => {
    // GET /users
  });
  
  test('4. Update user', async () => {
    // PUT /users/{userId}
  });
  
  test('5. Delete user', async () => {
    // DELETE /users/{userId}
  });
});
```

---

## 🌐 API Testing (Manual)

### Using cURL

**1. Create User**
```bash
curl -X POST https://xxxxx.execute-api.us-east-1.amazonaws.com/dev/users \
  -H "Content-Type: application/json" \
  -d '{
    "Name": "John Doe",
    "Email": "john@example.com",
    "DOB": "1990-01-01",
    "Phone": "+1234567890",
    "Address": "123 Main St"
  }'
```

**Expected Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "UserID": "abc-123-def",
      "Name": "John Doe",
      "Email": "john@example.com",
      "DOB": "1990-01-01",
      "Phone": "+1234567890",
      "Address": "123 Main St",
      "CreatedAt": "2024-01-15T10:30:00.000Z",
      "UpdatedAt": "2024-01-15T10:30:00.000Z"
    }
  },
  "message": "User created successfully"
}
```

**2. List All Users**
```bash
curl -X GET https://xxxxx.execute-api.us-east-1.amazonaws.com/dev/users
```

**3. Get User by ID**
```bash
curl -X GET https://xxxxx.execute-api.us-east-1.amazonaws.com/dev/users/abc-123-def
```

**4. Update User**
```bash
curl -X PUT https://xxxxx.execute-api.us-east-1.amazonaws.com/dev/users/abc-123-def \
  -H "Content-Type: application/json" \
  -d '{
    "Name": "Jane Doe",
    "Email": "jane@example.com"
  }'
```

**5. Delete User**
```bash
curl -X DELETE https://xxxxx.execute-api.us-east-1.amazonaws.com/dev/users/abc-123-def
```

### Using Postman

**Setup:**
1. Download Postman: https://www.postman.com/downloads/
2. Create new Collection: "User CRUD API"
3. Set Collection Variable:
   - Variable: `baseUrl`
   - Value: `https://xxxxx.execute-api.us-east-1.amazonaws.com/dev`

**Create Requests:**

**1. Create User**
- Method: `POST`
- URL: `{{baseUrl}}/users`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "Name": "John Doe",
  "Email": "john@example.com",
  "DOB": "1990-01-01"
}
```

**2. List Users**
- Method: `GET`
- URL: `{{baseUrl}}/users`

**3. Get User**
- Method: `GET`
- URL: `{{baseUrl}}/users/{{userId}}`
- Note: Set `userId` variable from Create response

**4. Update User**
- Method: `PUT`
- URL: `{{baseUrl}}/users/{{userId}}`
- Body:
```json
{
  "Name": "Jane Doe"
}
```

**5. Delete User**
- Method: `DELETE`
- URL: `{{baseUrl}}/users/{{userId}}`

**Postman Tests (Add to each request):**

```javascript
// Test status code
pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
});

// Test response structure
pm.test("Response has success field", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('success');
    pm.expect(jsonData.success).to.be.true;
});

// Save UserID for next requests
if (pm.response.code === 201) {
    var jsonData = pm.response.json();
    pm.collectionVariables.set("userId", jsonData.data.user.UserID);
}
```

---

## ⚛️ Frontend Testing

### Prerequisites

```bash
cd frontend
npm install
```

### Running Frontend Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test UserForm.test.jsx
```

### Test Files

```
frontend/src/
├── components/
│   ├── __tests__/
│   │   ├── UserForm.test.jsx
│   │   ├── UserCard.test.jsx
│   │   ├── UserList.test.jsx
│   │   └── DeleteConfirmModal.test.jsx
│   └── ...
└── services/
    └── __tests__/
        ├── api.test.js
        └── validation.test.js
```

### Example Frontend Test

```jsx
import { render, screen, fireEvent } from '@testing-library/react';
import UserForm from '../UserForm';

test('should submit form with valid data', async () => {
  const onSubmit = jest.fn();
  render(<UserForm onSubmit={onSubmit} />);
  
  // Fill form
  fireEvent.change(screen.getByLabelText(/name/i), {
    target: { value: 'John Doe' }
  });
  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: 'john@example.com' }
  });
  fireEvent.change(screen.getByLabelText(/dob/i), {
    target: { value: '1990-01-01' }
  });
  
  // Submit
  fireEvent.click(screen.getByText(/submit/i));
  
  // Assert
  expect(onSubmit).toHaveBeenCalledWith({
    Name: 'John Doe',
    Email: 'john@example.com',
    DOB: '1990-01-01'
  });
});
```

---

## 🔄 End-to-End Testing

### Using Cypress

**Setup:**
```bash
cd frontend
npm install --save-dev cypress
npx cypress open
```

**Create test:** `cypress/e2e/user-crud.cy.js`

```javascript
describe('User CRUD E2E', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173');
  });

  it('should create, edit, and delete user', () => {
    // Create user
    cy.contains('Add User').click();
    cy.get('input[name="Name"]').type('John Doe');
    cy.get('input[name="Email"]').type('john@example.com');
    cy.get('input[name="DOB"]').type('1990-01-01');
    cy.contains('Submit').click();
    
    // Verify user appears
    cy.contains('John Doe').should('be.visible');
    
    // Edit user
    cy.contains('John Doe').parent().find('[aria-label="Edit"]').click();
    cy.get('input[name="Name"]').clear().type('Jane Doe');
    cy.contains('Submit').click();
    cy.contains('Jane Doe').should('be.visible');
    
    // Delete user
    cy.contains('Jane Doe').parent().find('[aria-label="Delete"]').click();
    cy.contains('Confirm').click();
    cy.contains('Jane Doe').should('not.exist');
  });
});
```

**Run Cypress:**
```bash
# Open Cypress UI
npx cypress open

# Run headless
npx cypress run
```

---

## 📊 Test Coverage Goals

### Backend Coverage Targets

```
Statements   : 85% minimum
Branches     : 80% minimum
Functions    : 85% minimum
Lines        : 85% minimum
```

### What to Test

**✅ Must Test:**
- ✅ All CRUD operations (Create, Read, Update, Delete)
- ✅ Input validation (missing fields, invalid formats)
- ✅ Error handling (404, 409, 500)
- ✅ Edge cases (empty strings, special characters, long inputs)
- ✅ Database operations (mocked)

**⚠️ Nice to Have:**
- Response format consistency
- Timestamp generation
- UUID generation
- CORS headers
- Pagination logic

---

## 🐛 Debugging Failed Tests

### Common Issues

**1. Test Timeout**
```
Timeout - Async callback was not invoked within the 5000 ms timeout
```

**Solution:**
```javascript
// Increase timeout
jest.setTimeout(10000);

// Or per test
test('should create user', async () => {
  // test code
}, 10000); // 10 second timeout
```

**2. Mock Not Working**
```
Cannot read property 'promise' of undefined
```

**Solution:**
```javascript
// Ensure mock is setup before test
beforeEach(() => {
  AWSMock.restore('DynamoDB.DocumentClient');
  AWSMock.mock('DynamoDB.DocumentClient', 'put', (params, callback) => {
    callback(null, {});
  });
});
```

**3. Assertion Failed**
```
Expected: 201
Received: 400
```

**Solution:**
- Check validation logic
- Verify test input data
- Console.log response to see actual error

---

## 📋 Test Checklist

Before considering testing complete:

```
Backend:
□ All handler tests pass
□ Validation tests pass
□ Error handling tests pass
□ Coverage > 85%
□ No console errors during tests

Frontend:
□ Component tests pass
□ API service tests pass
□ Form validation tests pass
□ Coverage > 70%

Integration:
□ Full CRUD workflow works
□ Error scenarios handled
□ Edge cases covered

Manual:
□ Tested all endpoints with Postman/curl
□ Verified responses are correct
□ Checked error messages are user-friendly
```

---

## 🚀 Quick Reference

```bash
# Backend
cd backend
npm test                    # Run all tests
npm run test:coverage       # With coverage
npm test -- --watch         # Watch mode
serverless offline start    # Local API for testing

# Frontend
cd frontend
npm test                    # Run all tests
npm run test:coverage       # With coverage
npm test -- --watch         # Watch mode

# E2E
cd frontend
npx cypress open            # Open Cypress
npx cypress run             # Run headless

# Manual API Testing
curl -X POST https://xxx.amazonaws.com/dev/users \
  -H "Content-Type: application/json" \
  -d '{"Name":"Test","Email":"test@test.com","DOB":"1990-01-01"}'
```

---

## 📚 Additional Resources

- **Jest Documentation:** https://jestjs.io/docs/getting-started
- **AWS SDK Mock:** https://github.com/dwyl/aws-sdk-mock
- **React Testing Library:** https://testing-library.com/docs/react-testing-library/intro
- **Cypress Documentation:** https://docs.cypress.io/

---

**✅ Testing Complete!** Your application is now thoroughly tested and ready for production.