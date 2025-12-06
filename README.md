# TaskFlow - Task Management Application

A modern, full-stack task management application with Google OAuth authentication, built with React and Node.js/Express.

## Features

✨ **Modern UI/UX**
- Beautiful gradient design with smooth animations
- Responsive layout (mobile-friendly)
- Professional component styling
- Real-time task updates

🔐 **Google OAuth Authentication**
- Secure login with Google
- User profile management
- Session persistence

📋 **Task Management**
- Create, read, update, and delete tasks
- Mark tasks as complete/incomplete
- Real-time task counter
- Task creation date tracking

💾 **Cloud Storage**
- MongoDB Atlas integration
- All data persisted in the cloud
- Secure API endpoints

## Tech Stack

**Frontend:**
- React 19.2
- Axios for API calls
- Lucide React for icons
- @react-oauth/google for authentication
- Custom CSS with gradients and animations

**Backend:**
- Node.js with Express
- MongoDB with Mongoose
- CORS enabled for frontend communication
- Environment variables for configuration

## Project Structure

```
taskflow/
├── backend/
│   ├── models/
│   │   └── Task.js          # MongoDB Task schema
│   ├── routes/
│   │   └── taskRoutes.js    # API endpoints
│   ├── server.js            # Express server
│   ├── .env                 # Environment variables
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.js           # Google OAuth login
│   │   │   ├── UserProfile.js     # User profile display
│   │   │   ├── TaskForm.js        # Create task form
│   │   │   ├── TaskList.js        # Task list container
│   │   │   └── TaskItem.js        # Individual task
│   │   ├── App.js           # Main app component
│   │   ├── App.css          # Global styles
│   │   └── index.js         # Entry point
│   └── package.json
└── GOOGLE_AUTH_SETUP.md     # OAuth setup guide
```

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account (free tier available)
- Google Cloud project with OAuth credentials

## Installation

### 1. Clone the Repository
```bash
cd taskflow
```

### 2. Install Backend Dependencies
```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

### 4. Setup MongoDB Atlas
- Create a MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
- Create a free cluster
- Get your connection string
- Add it to `backend/.env`

### 5. Configure Environment Variables

**Backend (.env)**
```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskflow?retryWrites=true&w=majority
```

**Frontend - Google OAuth**
- Follow the guide in `GOOGLE_AUTH_SETUP.md`
- Get your Google Client ID
- Add it to `src/App.js` line: `const GOOGLE_CLIENT_ID = 'YOUR_CLIENT_ID_HERE';`

## Running the Application

### Terminal 1: Start Backend Server
```bash
cd backend
node server.js
# or for development with auto-reload
npm run dev
```

Backend will run on: **http://localhost:5000**

### Terminal 2: Start Frontend Development Server
```bash
cd frontend
npm start
```

Frontend will run on: **http://localhost:3000** (or 3001 if 3000 is in use)

## API Endpoints

### Tasks API (`/api/tasks`)

**GET** `/api/tasks`
- Get all tasks
- Returns: Array of task objects

**GET** `/api/tasks/:id`
- Get a single task by ID
- Returns: Single task object

**POST** `/api/tasks`
- Create a new task
- Body: `{ title: string, description?: string, completed?: boolean }`
- Returns: Created task object

**PUT** `/api/tasks/:id`
- Update a task
- Body: `{ title?: string, description?: string, completed?: boolean }`
- Returns: Updated task object

**DELETE** `/api/tasks/:id`
- Delete a task
- Returns: Success message

## Database Schema

### Task Model
```javascript
{
  title: String (required),
  description: String (optional),
  completed: Boolean (default: false),
  createdAt: Date (default: now)
}
```

## Features in Detail

### Google Authentication
- Click "Sign in with Google" on login page
- Select your Google account
- Your profile picture and name display at the top
- Click "Logout" to sign out
- Session persists on page refresh

### Task Management
- **Create**: Fill the task form and click "Add Task"
- **Read**: View all tasks in the list
- **Update**: Click "Edit" on a task to modify it
- **Delete**: Click "Delete" to remove a task
- **Complete**: Check the checkbox to mark as done

### Task Progress
- Counter shows completed tasks (e.g., "3/5 completed")
- Completed tasks appear grayed out with strikethrough
- Real-time updates across the interface

## Styling

The app uses:
- **Color Scheme**: Purple gradient (#667eea to #764ba2)
- **Spacing**: Consistent padding and margins
- **Typography**: Modern sans-serif font (Segoe UI)
- **Effects**: Smooth transitions, hover states, animations
- **Icons**: Lucide React icons for professional look

## Browser Support

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### Backend Issues

**"EADDRINUSE: address already in use :::5000"**
- Another app is using port 5000
- Kill the process: `netstat -ano | findstr :5000` → `taskkill /PID <PID> /F`

**"Cannot find module..."**
- Run `npm install` in the backend directory

**"MongoDB Connection Error"**
- Check your MONGODB_URI in .env
- Make sure IP is whitelisted in MongoDB Atlas

### Frontend Issues

**"Failed to login with Google"**
- Check Google Client ID is correct
- Verify authorized origins in Google Cloud Console

**"API connection refused"**
- Make sure backend is running on port 5000
- Check CORS settings in backend

**Port 3000 already in use**
- The app will automatically try port 3001
- Or kill the process: `netstat -ano | findstr :3000`

## Development

### Adding New Features

1. **New Component**: Create in `frontend/src/components/`
2. **New Route**: Add to `backend/routes/taskRoutes.js`
3. **New Model**: Create in `backend/models/`
4. **Styling**: Add to `frontend/src/App.css`

### Testing

- Frontend: Open browser DevTools (F12) to check console
- Backend: Check terminal output for errors
- MongoDB: Use MongoDB Atlas Dashboard to view collections

## Deployment

### Frontend (Vercel/Netlify)
1. Build: `npm run build`
2. Deploy the `build` folder
3. Update `REACT_APP_GOOGLE_CLIENT_ID` in environment variables

### Backend (Heroku/Railway)
1. Add `Procfile`: `web: node server.js`
2. Push to Git
3. Set environment variables in the platform
4. Deploy

## Performance

- Lazy loading of tasks
- Debounced API calls
- Optimized re-renders with React
- Efficient MongoDB queries

## Security Notes

- Google OAuth tokens are validated
- API endpoints use proper error handling
- Environment variables protect sensitive data
- CORS is configured for allowed origins
- No sensitive data stored in localStorage

## License

MIT License - Feel free to use and modify

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the GOOGLE_AUTH_SETUP.md
3. Check browser console for errors (F12)
4. Review backend logs in terminal

## Future Enhancements

- Task categories and tags
- Due dates and reminders
- Collaborative task sharing
- Dark mode
- Mobile app version
- Task priority levels
- Recurring tasks
- Notifications

---

**Created**: December 2025
**Version**: 1.0.0
