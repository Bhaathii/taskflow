# Google OAuth Setup Guide for TaskFlow

## Getting Your Google Client ID

Follow these steps to set up Google OAuth for TaskFlow:

### 1. Go to Google Cloud Console
- Visit: https://console.cloud.google.com/
- Sign in with your Google account

### 2. Create a New Project
- Click on the project dropdown at the top
- Click "NEW PROJECT"
- Enter project name: "TaskFlow"
- Click "CREATE"

### 3. Enable Google+ API
- In the search bar, search for "Google+ API"
- Click on "Google+ API" from the results
- Click "ENABLE"

### 4. Create OAuth 2.0 Credentials
- Go to "Credentials" in the left sidebar
- Click "CREATE CREDENTIALS" → "OAuth client ID"
- If prompted, configure the OAuth consent screen first:
  - User Type: External
  - Click "CREATE"
  - Fill in the required fields
  - Add yourself as a test user
  - Click "SAVE AND CONTINUE"
  
### 5. Create OAuth Client ID
- Application Type: Web application
- Name: TaskFlow Frontend
- Authorized JavaScript origins: Add these:
  - http://localhost:3000
  - http://localhost:3001
  - http://192.168.56.1:3000
  - http://192.168.56.1:3001
- Authorized redirect URIs: Add these:
  - http://localhost:3000
  - http://localhost:3001
  - http://192.168.56.1:3000
  - http://192.168.56.1:3001
- Click "CREATE"

### 6. Copy Your Client ID
- You'll see your Client ID on the next screen
- Copy it

### 7. Add Client ID to Your App
- Open `frontend/src/App.js`
- Find this line: `const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID_HERE';`
- Replace `'YOUR_GOOGLE_CLIENT_ID_HERE'` with your actual Client ID
- Save the file

### 8. Test the App
- The frontend should automatically refresh
- You should now see the Google Sign-In button on the login page

## Environment Variables (Optional but Recommended)

For production, use environment variables instead:

1. Create `.env` file in the frontend directory:
```
REACT_APP_GOOGLE_CLIENT_ID=your_client_id_here
```

2. Update `App.js`:
```javascript
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
```

## Testing Google Login

1. Open http://localhost:3001 in your browser
2. Click the Google Sign-In button
3. Select your Google account
4. You should be logged in and see your tasks dashboard
5. Your user profile will be displayed at the top

## Troubleshooting

**Issue: "INVALID_CLIENT_ID" error**
- Make sure you copied the Client ID correctly
- Check that your authorized origins/URIs are correct in Google Console

**Issue: Sign-in button not appearing**
- Make sure @react-oauth/google is installed
- Check browser console for errors (F12)

**Issue: Tasks not loading after login**
- Make sure the backend server is running on port 5000
- Check that MongoDB connection is successful

