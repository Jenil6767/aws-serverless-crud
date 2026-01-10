# AWS Deployment Guide - Step by Step

Complete guide to deploy your serverless User CRUD API to AWS.

## Prerequisites

Before starting, ensure you have:

1. ✅ **AWS Account** - Sign up at https://aws.amazon.com
2. ✅ **AWS CLI** installed - Download from https://aws.amazon.com/cli/
3. ✅ **Node.js 18+** installed
4. ✅ **Serverless Framework** installed globally

## Step 1: Install Prerequisites

### 1.1 Install AWS CLI

**Windows:**
```bash
# Download and run the AWS CLI MSI installer from:
# https://awscli.amazonaws.com/AWSCLIV2.msi
```

**Verify installation:**
```bash
aws --version
```

### 1.2 Install Serverless Framework Globally

```bash
npm install -g serverless
```

**Verify installation:**
```bash
serverless --version
```

## Step 2: Configure AWS Credentials

### 2.1 Create IAM User in AWS Console

1. **Go to AWS Console:** https://console.aws.amazon.com
2. **Navigate to IAM:** Search for "IAM" in the top search bar
3. **Go to Users:** Click "Users" in the left sidebar
4. **Create User:**
   - Click "Add users"
   - Username: `serverless-deploy` (or any name)
   - Click "Next"

5. **Set Permissions:**
   - Select "Attach policies directly"
   - Search and select these policies:
     - ✅ `AdministratorAccess` (for full deployment - or use specific policies for production)
   - Click "Next"

6. **Review and Create:**
   - Review settings
   - Click "Create user"

7. **Create Access Key:**
   - Click on the newly created user
   - Go to "Security credentials" tab
   - Click "Create access key"
   - Select "Command Line Interface (CLI)"
   - Click "Next"
   - Click "Create access key"
   - **IMPORTANT:** Copy both:
     - Access key ID
     - Secret access key
   - Click "Done"

### 2.2 Configure AWS CLI

Open terminal/PowerShell and run:

```bash
aws configure
```

Enter the following when prompted:

```
AWS Access Key ID: [Paste your Access Key ID]
AWS Secret Access Key: [Paste your Secret Access Key]
Default region name: us-east-1
Default output format: json
```

**Verify configuration:**
```bash
aws sts get-caller-identity
```

You should see your AWS account details.

## Step 3: Prepare Backend for Deployment

### 3.1 Navigate to Backend Directory

```bash
cd "C:\Users\ADMIN\Documents\mern stack\backend"
```

### 3.2 Install Dependencies

```bash
npm install
```

### 3.3 Verify serverless.yml

Make sure your `serverless.yml` is correct. Key things to check:

- ✅ Service name
- ✅ Region: `us-east-1` (or your preferred region)
- ✅ Runtime: `nodejs18.x`
- ✅ All functions are defined
- ✅ DynamoDB table configuration

## Step 4: Deploy Backend to AWS

### 4.1 Deploy to AWS

**IMPORTANT:** Run this command in the **backend folder** (where `serverless.yml` is located):

```bash
# Make sure you're in the backend directory
cd "C:\Users\ADMIN\Documents\mern stack\backend"

# Then run deploy command
serverless deploy
```

**Note:** If you see a license prompt:
- Serverless Framework is **FREE** - you can skip it or create a free account
- Select "Explain Licensing Basics" or press Ctrl+C and try again
- You don't need a paid license for deployment


**OR deploy to a specific stage:**

```bash
cd "C:\Users\ADMIN\Documents\mern stack\backend"
serverless deploy --stage dev
```

**Note:** 
- ✅ `serverless` command is installed **globally** (via `npm install -g serverless`)
- ✅ But `serverless deploy` must be run **in the backend folder** (where `serverless.yml` exists)
- ❌ Don't run it from the root folder or frontend folder

### 4.2 Wait for Deployment

This will take 2-5 minutes. You'll see output like:

```
Serverless: Packaging service...
Serverless: Excluding development dependencies...
Serverless: Creating Stack...
Serverless: Checking Stack create progress...
Serverless: Stack create finished...
Serverless: Uploading CloudFormation file...
Serverless: Uploading artifacts...
Serverless: Uploading service user-crud-api.zip file...
Serverless: Validating template...
Serverless: Updating Stack...
Serverless: Checking Stack update progress...
...
Serverless: Stack update finished...
Service Information
service: user-crud-api
stage: dev
region: us-east-1
stack: user-crud-api-dev
resources: 6
api keys:
  None
endpoints:
  POST - https://xxxxx.execute-api.us-east-1.amazonaws.com/dev/users
  GET - https://xxxxx.execute-api.us-east-1.amazonaws.com/dev/users
  GET - https://xxxxx.execute-api.us-east-1.amazonaws.com/dev/users/{UserID}
  PUT - https://xxxxx.execute-api.us-east-1.amazonaws.com/dev/users/{UserID}
  DELETE - https://xxxxx.execute-api.us-east-1.amazonaws.com/dev/users/{UserID}
functions:
  createUser: user-crud-api-dev-createUser
  getUser: user-crud-api-dev-getUser
  listUsers: user-crud-api-dev-listUsers
  updateUser: user-crud-api-dev-updateUser
  deleteUser: user-crud-api-dev-deleteUser
```

### 4.3 Copy Your API Gateway URL

**IMPORTANT:** Copy the base URL from the endpoints. It will look like:
```
https://xxxxx.execute-api.us-east-1.amazonaws.com/dev
```

This is your API base URL!

## Step 5: Update Frontend Configuration

### 5.1 Create .env File in Frontend

```bash
cd "C:\Users\ADMIN\Documents\mern stack\frontend"
```

Create a file named `.env` (no extension) with:

```
VITE_API_BASE_URL=https://xxxxx.execute-api.us-east-1.amazonaws.com/dev
```

**Replace `xxxxx` with your actual API Gateway ID from Step 4.3**

### 5.2 Restart Frontend Dev Server

```bash
# Stop current server (Ctrl+C)
npm start
```

## Step 6: Test Deployment

### 6.1 Test Backend API

Open browser or use curl:

```bash
# Test list users endpoint
curl https://xxxxx.execute-api.us-east-1.amazonaws.com/dev/users
```

Should return:
```json
{"success":true,"data":{"users":[],"pagination":{...}},"message":"Users retrieved successfully"}
```

### 6.2 Test Frontend

1. Open `http://localhost:5173` in browser
2. Try creating a user
3. Check if it works with the deployed backend

## Step 7: Deploy Frontend (Optional - Static Hosting)

### Option A: Deploy to Vercel (Recommended - Free)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Navigate to frontend:**
   ```bash
   cd frontend
   ```

3. **Deploy:**
   ```bash
   vercel
   ```
   - Follow prompts
   - It will ask for environment variables - add `VITE_API_BASE_URL`

4. **Your app will be live at:** `https://your-app.vercel.app`

### Option B: Deploy to AWS S3 + CloudFront

1. **Build frontend:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Create S3 bucket:**
   ```bash
   aws s3 mb s3://your-app-name-frontend
   ```

3. **Upload files:**
   ```bash
   aws s3 sync dist/ s3://your-app-name-frontend --delete
   ```

4. **Enable static website hosting:**
   ```bash
   aws s3 website s3://your-app-name-frontend --index-document index.html
   ```

5. **Set bucket policy for public access** (or use CloudFront)

## Step 8: View Resources in AWS Console

### 8.1 Check Lambda Functions

1. Go to AWS Console → Lambda
2. You should see 5 functions:
   - `user-crud-api-dev-createUser`
   - `user-crud-api-dev-getUser`
   - `user-crud-api-dev-listUsers`
   - `user-crud-api-dev-updateUser`
   - `user-crud-api-dev-deleteUser`

### 8.2 Check DynamoDB Table

1. Go to AWS Console → DynamoDB
2. Click "Tables" in left sidebar
3. You should see: `user-crud-api-dev-users`

**To View Your Data:**
1. Click on the table name: `user-crud-api-dev-users`
2. Click on **"Explore table items"** tab
3. You'll see all your user records stored in the database
4. Each row shows one user with all their information (UserID, Name, Email, DOB, Phone, Address, etc.)

📖 **For detailed instructions, see [VIEW_DATA_IN_AWS.md](./VIEW_DATA_IN_AWS.md)**

### 8.3 Check API Gateway

1. Go to AWS Console → API Gateway
2. You should see your API: `user-crud-api-dev`

## Step 9: Monitor and Debug

### 9.1 View Logs

```bash
# View logs for a specific function
serverless logs -f createUser --tail

# View all logs
serverless logs --tail
```

### 9.2 Check CloudWatch Logs

1. Go to AWS Console → CloudWatch
2. Click "Log groups"
3. Find your function logs

## Step 10: Update/Remove Deployment

### Update Deployment

After making changes:

```bash
cd backend
serverless deploy
```

### Remove Deployment (Delete All Resources)

**⚠️ WARNING: This will delete everything!**

```bash
cd backend
serverless remove
```

## Troubleshooting

### Issue: "Access Denied" during deployment

**Solution:**
- Check IAM user has correct permissions
- Verify AWS credentials: `aws sts get-caller-identity`

### Issue: "Stack already exists"

**Solution:**
- This is normal for updates
- Just run `serverless deploy` again

### Issue: DynamoDB table not created

**Solution:**
- Check CloudFormation stack in AWS Console
- Look for errors in stack events

### Issue: API Gateway returns 500

**Solution:**
- Check Lambda function logs: `serverless logs -f functionName --tail`
- Verify DynamoDB table exists
- Check IAM permissions for Lambda

### Issue: CORS errors in browser

**Solution:**
- CORS is already enabled in `serverless.yml`
- If still having issues, check API Gateway CORS settings in AWS Console

## Cost Estimation

**Free Tier (First 12 months):**
- ✅ Lambda: 1M free requests/month
- ✅ API Gateway: 1M requests/month
- ✅ DynamoDB: 25GB storage, 25 read/write units

**After Free Tier:**
- Lambda: ~$0.20 per 1M requests
- API Gateway: ~$3.50 per 1M requests
- DynamoDB: Pay per request (very cheap for small apps)

**Estimated monthly cost for small app:** $5-10/month

## Security Best Practices

1. **Don't use AdministratorAccess in production**
   - Create specific IAM policies for your functions
   - Use least privilege principle

2. **Enable API Gateway throttling**
   - Prevent abuse
   - Set rate limits

3. **Use environment variables for secrets**
   - Never hardcode API keys
   - Use AWS Secrets Manager for sensitive data

4. **Enable CloudWatch alarms**
   - Monitor errors
   - Set up notifications

## Next Steps

1. ✅ Backend deployed to AWS
2. ✅ Frontend connected to AWS backend
3. ✅ Test all CRUD operations
4. ✅ Monitor CloudWatch logs
5. ✅ Set up custom domain (optional)
6. ✅ Configure production stage

## Quick Reference Commands

```bash
# Deploy
cd backend
serverless deploy

# Deploy to production stage
serverless deploy --stage production

# View logs
serverless logs -f createUser --tail

# Remove deployment
serverless remove

# Check status
serverless info
```

---

**🎉 Congratulations! Your serverless API is now live on AWS!**

