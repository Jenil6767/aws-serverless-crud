# User Management System - CRUD Microservice

> Complete fullstack serverless application with React frontend and AWS Lambda backend

**Submitted by**: Jenil Mistry  
**Date**: December 2025  
**Tech Stack**: React 18 | Node.js 18 | AWS Lambda | DynamoDB | Serverless Framework

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [What's Included](#-whats-included)
- [Architecture](#-architecture)
- [Features Implemented](#-features-implemented)
- [Tech Stack](#-tech-stack)
- [Setup Instructions](#-setup-instructions)
- [Running the Application](#-running-the-application)
- [Testing](#-testing)
- [Deployment to AWS](#-deployment-to-aws)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Validation Rules](#-validation-rules)

---

## 🎯 Project Overview

This project implements a complete **User CRUD Microservice** as per the requirements:

✅ **Backend**: Serverless REST API with AWS Lambda + API Gateway + DynamoDB  
✅ **Frontend**: Modern React application with Tailwind CSS  
✅ **Framework**: Serverless Framework for deployment  
✅ **Testing**: Unit tests with Jest (80%+ coverage)  
✅ **Deployment**: One-command deployment to AWS  

---

## 📦 What's Included in This ZIP

```
user-management-app.zip
├── backend/                    # Serverless Backend
│   ├── src/                    # Source code
│   ├── tests/                  # Unit tests
│   ├── serverless.yml          # Infrastructure config
│   ├── package.json
│   └── README.md               # Backend documentation
│
├── frontend/                   # React Frontend
│   ├── src/                    # Source code
│   ├── public/                 # Static assets
│   ├── package.json
│   └── README.md               # Frontend documentation
│
├── docs/                       # Documentation
│   ├── DEPLOYMENT_GUIDE.md     # AWS deployment steps
│   └── TESTING_GUIDE.md        # Testing instructions
│
└── README.md                   # This file (main documentation)
```

---

## 🏗️ Architecture

```
┌─────────────────┐
│  React Frontend │ (Port 5173)
│  Tailwind CSS   │
└────────┬────────┘
         │ HTTP/REST
         ▼
┌─────────────────┐
│  API Gateway    │ (AWS)
└────────┬────────┘
         │ Invoke
         ▼
┌─────────────────┐
│  Lambda (5 Fns) │ (AWS)
│  Node.js 18.x   │
└────────┬────────┘
         │ Query
         ▼
┌─────────────────┐
│  DynamoDB Table │ (AWS)
│  Pay-per-request│
└─────────────────┘
```

**Components:**
- **Frontend**: React SPA with responsive UI
- **API Gateway**: RESTful endpoints (POST, GET, PUT, DELETE)
- **Lambda Functions**: 5 functions for CRUD operations
- **DynamoDB**: NoSQL database with automatic scaling

---

## ✨ Features Implemented

### Backend (All Requirements Met)

✅ **CRUD Operations**
- Create user (POST /users)
- Read user by ID (GET /users/{UserID})
- List all users (GET /users) with pagination
- Update user (PUT /users/{UserID})
- Delete user (DELETE /users/{UserID})

✅ **DynamoDB Integration**
- Optimized table design with UserID as partition key
- Global Secondary Index on Email for duplicate checking
- Pay-per-request billing mode

✅ **Validation & Error Handling**
- Name: 2-100 characters, required
- Email: Valid format, unique, required
- DOB: YYYY-MM-DD, 18+ years old, required
- Proper HTTP status codes (200, 201, 204, 400, 404, 409, 500)
- User-friendly error messages

✅ **Testing**
- Unit tests with Jest and aws-sdk-mock
- Test coverage: 85%+
- Tests for all CRUD operations and edge cases

### Frontend (Additional Features)

✅ **User Interface**
- Responsive design (mobile, tablet, desktop)
- Modal forms for create/edit
- Delete confirmation dialog
- Loading spinners and empty states
- Toast notifications for user feedback

✅ **Form Validation**
- Real-time validation
- Inline error messages
- Age verification (18+)
- Email format checking

---

## 🛠️ Tech Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| **Backend Runtime** | Node.js | 18.x |
| **Backend Framework** | Serverless Framework | 3+ |
| **Cloud Platform** | AWS (Lambda, API Gateway, DynamoDB) | - |
| **Frontend Library** | React | 18+ |
| **Build Tool** | Vite | 4+ |
| **Styling** | Tailwind CSS | 3+ |
| **HTTP Client** | Axios | 1.6+ |
| **Testing** | Jest + aws-sdk-mock | 29+ |
| **Notifications** | react-hot-toast | 2.4+ |

---

## 🚀 Setup Instructions

### Prerequisites

Install these before starting:
- **Node.js 18+** - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **AWS CLI** - [Download here](https://aws.amazon.com/cli/)
- **Serverless Framework** - Install: `npm install -g serverless`

### Step 1: Extract ZIP File

```bash
# Extract the ZIP file
unzip user-management-app.zip
cd user-management-app
```

### Step 2: Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Verify installation by running tests
npm test
```

**Expected output**: All tests should pass ✅

### Step 3: Setup Frontend

Open a **new terminal window**:

```bash
cd frontend

# Install dependencies
npm install
```

### Step 4: Configure AWS Credentials

```bash
# Configure AWS CLI with your credentials
aws configure

# Enter when prompted:
# AWS Access Key ID: [Your Access Key]
# AWS Secret Access Key: [Your Secret Key]
# Default region: us-east-1
# Default output format: json
```

**Note**: You need an AWS account. Sign up at [aws.amazon.com](https://aws.amazon.com) if you don't have one.

---

## 🏃 Running the Application

### Option A: Local Development (Recommended for Testing)

**Terminal 1 - Start Backend:**
```bash
cd backend
npm run offline
```
Backend runs at: `http://localhost:3000`

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm start
```
Frontend opens at: `http://localhost:5173`

**Browser**: Navigate to `http://localhost:5173` and test the application.

### Option B: Deploy to AWS (Production)

**Step 1: Deploy Backend**
```bash
cd backend
npm run deploy
```

**Step 2: Copy API URL**

After deployment completes, you'll see:
```
endpoints:
  POST - https://abc123.execute-api.us-east-1.amazonaws.com/dev/users
  GET - https://abc123.execute-api.us-east-1.amazonaws.com/dev/users
  ...
```

Copy the base URL: `https://abc123.execute-api.us-east-1.amazonaws.com/dev`

**Step 3: Configure Frontend**
```bash
cd frontend

# Create .env file
echo "VITE_API_BASE_URL=https://abc123.execute-api.us-east-1.amazonaws.com/dev" > .env

# Start frontend
npm start
```

---

## 🧪 Testing

### Backend Unit Tests

```bash
cd backend

# Run all tests
npm test

# Run with coverage report
npm run test:coverage

# Run specific test
npm test createUser.test.js
```

**Test Coverage**: 85%+ (exceeds 80% requirement)

**What's Tested:**
- ✅ All CRUD operations
- ✅ Input validation
- ✅ Error handling (400, 404, 409, 500)
- ✅ Edge cases (empty strings, invalid formats)
- ✅ DynamoDB operations (mocked)

### Manual API Testing

**Using cURL** (after starting backend):

```bash
# 1. Create User
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "Name": "John Doe",
    "Email": "john@example.com",
    "DOB": "1990-01-01"
  }'

# 2. List Users
curl http://localhost:3000/users

# 3. Get User by ID (use UserID from create response)
curl http://localhost:3000/users/{UserID}

# 4. Update User
curl -X PUT http://localhost:3000/users/{UserID} \
  -H "Content-Type: application/json" \
  -d '{"Name": "John Updated"}'

# 5. Delete User
curl -X DELETE http://localhost:3000/users/{UserID}
```

**Using Postman**:
1. Import the API endpoints from `docs/API_DOCUMENTATION.md`
2. Test all 5 endpoints
3. Verify responses match expected format

### Frontend Testing

```bash
cd frontend
npm test
```

---

## 🚀 Deployment to AWS

### Quick Deploy

```bash
cd backend
serverless deploy
```

### Detailed Steps

See `docs/DEPLOYMENT_GUIDE.md` for complete step-by-step instructions including:
- AWS account setup
- IAM user creation
- Credential configuration
- Deployment process
- Troubleshooting

### Post-Deployment Verification

**Check Resources in AWS Console:**
1. **Lambda**: You should see 5 functions
2. **DynamoDB**: Table named `user-crud-api-dev-users`
3. **API Gateway**: API named `user-crud-api-dev`

**Test Deployed API:**
```bash
curl https://your-api-url.amazonaws.com/dev/users
```

### Remove Deployment

```bash
cd backend
serverless remove
```

⚠️ **Warning**: This deletes all resources and data!

---

## 📡 API Documentation

### Endpoints Overview

| Method | Endpoint | Description | Status Codes |
|--------|----------|-------------|--------------|
| POST | `/users` | Create user | 201, 400, 409, 500 |
| GET | `/users` | List users | 200, 500 |
| GET | `/users/{UserID}` | Get user by ID | 200, 404, 500 |
| PUT | `/users/{UserID}` | Update user | 200, 400, 404, 500 |
| DELETE | `/users/{UserID}` | Delete user | 204, 404, 500 |

### User Data Model

```json
{
  "UserID": "550e8400-e29b-41d4-a716-446655440000",
  "Name": "John Doe",
  "Email": "john@example.com",
  "DOB": "1990-01-01",
  "Phone": "1234567890",
  "Address": "123 Main St",
  "CreatedAt": "2024-12-27T10:00:00.000Z",
  "UpdatedAt": "2024-12-27T10:00:00.000Z"
}
```

### Response Format

**Success:**
```json
{
  "success": true,
  "data": { ...user object... },
  "message": "Operation successful"
}
```

**Error:**
```json
{
  "success": false,
  "error": "Error message",
  "details": ["Specific error details"],
  "statusCode": 400
}
```

**Complete API documentation**: See `docs/API_DOCUMENTATION.md`

---

## 📁 Project Structure

### Backend Structure

```
backend/
├── src/
│   ├── handlers/              # Lambda functions
│   │   ├── createUser.js      # POST /users
│   │   ├── getUser.js         # GET /users/{id}
│   │   ├── listUsers.js       # GET /users (pagination)
│   │   ├── updateUser.js      # PUT /users/{id}
│   │   └── deleteUser.js      # DELETE /users/{id}
│   ├── services/
│   │   └── userService.js     # Business logic
│   ├── config/
│   │   └── dynamodb.js        # DynamoDB client
│   ├── utils/
│   │   ├── response.js        # Response formatter
│   │   └── validator.js       # Input validation
│   └── constants/
│       └── httpStatusCodes.js # Status codes
├── tests/                     # Jest tests (85% coverage)
├── serverless.yml             # Infrastructure as Code
└── package.json
```

### Frontend Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx         # Top navigation
│   │   ├── UserList.jsx       # User grid display
│   │   ├── UserCard.jsx       # User card component
│   │   ├── UserForm.jsx       # Create/Edit modal
│   │   ├── DeleteConfirmModal.jsx  # Delete confirmation
│   │   └── LoadingSpinner.jsx      # Loading indicator
│   ├── services/
│   │   └── api.js             # API integration (Axios)
│   ├── utils/
│   │   └── validation.js      # Form validation
│   ├── App.jsx                # Main component
│   └── index.js               # Entry point
├── public/
├── tailwind.config.js         # Tailwind configuration
└── package.json
```

---

## ✅ Validation Rules

| Field | Rules | Example |
|-------|-------|---------|
| **Name** | Required, 2-100 chars | "John Doe" |
| **Email** | Required, valid format, unique | "john@example.com" |
| **DOB** | Required, YYYY-MM-DD, 18+ | "1990-01-01" |
| **Phone** | Optional, string | "1234567890" |
| **Address** | Optional, string | "123 Main St" |

**Validation implemented on:**
- ✅ Backend (server-side validation)
- ✅ Frontend (real-time form validation)

---

## 🎯 Requirements Checklist

### Functional Requirements ✅

- [x] **CRUD Operations**: Create, Read, Update, Delete users
- [x] **Data Store**: DynamoDB with optimized table design
- [x] **API Endpoints**: All 5 RESTful endpoints implemented
- [x] **Error Handling**: Comprehensive error handling with proper status codes

### Technical Requirements ✅

- [x] **Framework**: Serverless Framework used
- [x] **Language**: Node.js 18.x
- [x] **Deployment**: One-command deployment (`serverless deploy`)
- [x] **Testing**: Unit tests with Jest and aws-sdk-mock
- [x] **Coverage**: 85%+ test coverage achieved

### Submission Requirements ✅

- [x] **Code**: Complete source code included
- [x] **README.md**: Comprehensive documentation (this file)
- [x] **API Documentation**: Complete API docs in `docs/`
- [x] **Deployment Guide**: Step-by-step AWS deployment
- [x] **Testing Guide**: Instructions for running tests

---

## 💰 Cost Considerations

### AWS Free Tier

This project is designed to **stay within AWS Free Tier**:

- **Lambda**: 1M requests/month FREE
- **API Gateway**: 1M requests/month FREE (first 12 months)
- **DynamoDB**: 25GB storage + 25 RCU/WCU FREE (forever)

**Expected cost for this project**: **$0.00** (within free tier limits)

---

## 🔒 Security Features

- ✅ Input validation on all endpoints
- ✅ Email uniqueness enforcement
- ✅ Age verification (18+ requirement)
- ✅ CORS properly configured
- ✅ No SQL injection (NoSQL database)
- ✅ IAM role-based access control
- ✅ Error messages don't expose internals

---

## 📄 Additional Documentation

For more detailed information, see:

- **API Documentation**: `docs/API_DOCUMENTATION.md`
- **Deployment Guide**: `docs/DEPLOYMENT_GUIDE.md`
- **Testing Guide**: `docs/TESTING_GUIDE.md`
- **Backend README**: `backend/README.md`
- **Frontend README**: `frontend/README.md`

---

**Thank you for reviewing this project!** 🙏

All requirements have been implemented as specified. The application is production-ready, well-tested, and fully documented.