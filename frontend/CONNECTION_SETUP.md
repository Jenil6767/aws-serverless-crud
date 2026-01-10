# Frontend-Backend Connection Setup Guide

## Current Status

✅ **Backend**: Configured to run on `http://localhost:3000` (serverless-offline)  
✅ **Frontend**: Defaults to `http://localhost:3000` if no `.env` file exists  
✅ **CORS**: Enabled in backend for cross-origin requests

## Quick Setup (Local Development)

### Option 1: Use Default Configuration (Easiest)

The frontend is already configured to connect to `http://localhost:3000` by default, which matches the backend's serverless-offline port.

**Steps:**

1. **Start the Backend:**
   ```bash
   cd backend
   npm install
   npm run offline
   ```
   Backend will be available at: `http://localhost:3000`

2. **Start the Frontend (in a new terminal):**
   ```bash
   cd frontend
   npm install
   npm start
   ```
   Frontend will be available at: `http://localhost:5173` (Vite default)

3. **Test the Connection:**
   - Open `http://localhost:5173` in your browser
   - The frontend should automatically connect to the backend at `http://localhost:3000`
   - Try creating a user to verify the connection

### Option 2: Use Environment Variable (Recommended for Production)

1. **Create `.env` file in the `frontend` folder:**
   ```bash
   cd frontend
   # Create .env file
   ```

2. **Add the API URL:**
   ```
   VITE_API_BASE_URL=http://localhost:3000
   ```

   For production (after deploying backend):
   ```
   VITE_API_BASE_URL=https://your-api-id.execute-api.us-east-1.amazonaws.com/dev
   ```
   
   **Important:** Vite uses `VITE_` prefix (not `REACT_APP_`) and accesses via `import.meta.env`.

3. **Restart the frontend dev server** after creating/modifying `.env`

## Connection Details

### Backend API Endpoints

When backend is running locally with `serverless offline`:
- Base URL: `http://localhost:3000`
- Endpoints:
  - `POST http://localhost:3000/users` - Create user
  - `GET http://localhost:3000/users` - List users
  - `GET http://localhost:3000/users/{UserID}` - Get user
  - `PUT http://localhost:3000/users/{UserID}` - Update user
  - `DELETE http://localhost:3000/users/{UserID}` - Delete user

### Frontend API Configuration

The frontend API service (`src/services/api.js`) uses:
- Default: `http://localhost:3000` (if `VITE_API_BASE_URL` is not set)
- Environment variable: `import.meta.env.VITE_API_BASE_URL` (if set)
- **Note:** Vite uses `VITE_` prefix and `import.meta.env` (not `REACT_APP_` and `process.env`)

## Troubleshooting

### Issue: CORS Error

**Symptoms:** Browser console shows CORS error when making API calls

**Solution:** 
- Backend CORS is already enabled in `serverless.yml`
- Make sure backend is running: `cd backend && npm run offline`
- Check that the backend is accessible at `http://localhost:3000`

### Issue: Network Error / Connection Refused

**Symptoms:** Frontend shows "Network error" or "Connection refused"

**Solutions:**
1. **Backend not running:**
   ```bash
   cd backend
   npm run offline
   ```

2. **Wrong port:**
   - Backend should be on port 3000
   - Check terminal output when starting backend
   - Verify in `serverless.yml` the `httpPort: 3000` setting

3. **Frontend using wrong URL:**
   - Check `.env` file in frontend folder
   - Verify `VITE_API_BASE_URL` is correct (Vite uses `VITE_` prefix, not `REACT_APP_`)
   - Restart frontend dev server after changing `.env`

### Issue: 404 Not Found

**Symptoms:** API calls return 404

**Solutions:**
1. **Check endpoint paths:**
   - Backend paths: `/users`, `/users/{UserID}`
   - Frontend should call: `http://localhost:3000/users`

2. **Verify serverless-offline is running:**
   - Check terminal for "Offline listening on http://localhost:3000"
   - Try accessing `http://localhost:3000/users` directly in browser

### Issue: Environment Variable Not Working

**Symptoms:** Frontend still uses default URL even after setting `.env`

**Solutions:**
1. **Restart dev server:** Vite needs restart to pick up new env variables
2. **Variable naming:** Must start with `VITE_` prefix (not `REACT_APP_`)
3. **File location:** `.env` must be in the `frontend` root folder
4. **No spaces:** `VITE_API_BASE_URL=http://localhost:3000` (no spaces around `=`)
5. **Access in code:** Use `import.meta.env.VITE_API_BASE_URL` (not `process.env`)

## Testing the Connection

### Manual Test

1. **Start backend:**
   ```bash
   cd backend
   npm run offline
   ```

2. **Test with curl:**
   ```bash
   curl http://localhost:3000/users
   ```
   Should return: `{"success":true,"data":{"users":[],"pagination":{...}},"message":"Users retrieved successfully"}`

3. **Start frontend:**
   ```bash
   cd frontend
   npm start
   ```

4. **Open browser:** `http://localhost:5173`
   - Should load without errors
   - Try creating a user
   - Check browser DevTools Network tab to see API calls

### Browser DevTools Check

1. Open browser DevTools (F12)
2. Go to **Network** tab
3. Try creating a user in the frontend
4. Look for requests to `http://localhost:3000/users`
5. Check response status (should be 201 for create, 200 for others)

## Production Deployment

After deploying backend to AWS:

1. **Get your API Gateway URL:**
   ```bash
   cd backend
   serverless deploy
   ```
   Output will show: `endpoints: POST - https://xxxxx.execute-api.us-east-1.amazonaws.com/dev/users`

2. **Update frontend `.env`:**
   ```
   REACT_APP_API_BASE_URL=https://xxxxx.execute-api.us-east-1.amazonaws.com/dev
   ```

3. **Rebuild frontend:**
   ```bash
   cd frontend
   npm run build
   ```

## Summary

✅ **Local Development:** Works out of the box - just start both servers  
✅ **CORS:** Already configured in backend  
✅ **Default Ports:** Both use port 3000 (backend) and 5173 (frontend)  
✅ **Environment Variables:** Optional but recommended for production

The frontend and backend are **ready to connect** - just start both servers!

