# Progressive Pomodoro Timer

A modern, feature-rich Pomodoro timer application built with React, Vite, and MongoDB. Track your focus sessions, visualize productivity analytics, and optimize your workflow with real-time data persistence.

## Features

✅ **Focus Timer** - 25-minute focus sessions (customizable, minimum 1 minute)  
✅ **Stopwatch Mode** - Continue tracking extra focus time after the timer ends  
✅ **Break Timer** - 5-minute breaks (customizable, minimum 1 minute)  
✅ **No Pause During Sessions** - Stay focused without interruptions  
✅ **Auto-start Break** - Automatically starts when focus session ends  
✅ **Session History** - All sessions saved with timestamps  
✅ **Analytics Dashboard** - Daily and monthly focus time visualization using Chart.js  
✅ **Data Persistence** - Sessions stored in both localStorage and MongoDB  
✅ **Circular Progress Ring** - Beautiful SVG animation showing time remaining  
✅ **Responsive Design** - Works seamlessly on desktop, tablet, and mobile  

## Tech Stack

**Frontend:**
- React 19.2.0 with Hooks
- Vite (lightning-fast build tool)
- Chart.js + react-chartjs-2 (analytics visualization)
- CSS3 with gradients and animations

**Backend:**
- Node.js + Express
- MongoDB (via MongoDB Atlas)
- CORS enabled for cross-origin requests

## Quick Start

### Prerequisites
- Node.js 16+ installed
- MongoDB Atlas account (free tier available at https://www.mongodb.com/cloud/atlas)

### 1. Frontend Setup

```bash
# Install dependencies
npm install

# Create environment file
echo "VITE_API_URL=http://localhost:5000/api" > .env.local

# Start development server
npm run dev
```

Frontend runs on `http://localhost:5173`

### 2. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Configure MongoDB connection in .env
# Replace MONGODB_URI with your MongoDB Atlas connection string
nano .env
```

**Getting MongoDB Atlas Connection String:**
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up (free)
3. Create a cluster
4. Create database user (Database Access → Add Database User)
5. Allow access from your IP (Network Access → Add IP Address)
6. Get connection string (Clusters → Connect → Drivers)
7. Update in `server/.env`

```bash
# Start backend server
npm start
# Or for development:
npm run dev
```

Backend runs on `http://localhost:5000`

## Usage

1. **Start a Focus Session**
   - Click "Start Focus"
   - Timer counts down from 25:00
   - Cannot pause - focused work only

2. **Continue with Stopwatch**
   - When focus timer reaches 0, stopwatch starts
   - Shows "+00:XX" for extra focus time tracked
   - Click "Stop & Start Break" when ready

3. **Take a Break**
   - Break timer auto-starts for 5 minutes
   - Timer runs without pause option
   - When complete, click "Start Next Session"

4. **View Analytics**
   - Click "View Analytics" button
   - See daily focus time (last 7 days)
   - See monthly focus time (last 12 months)
   - View total stats: total focus, today's focus, session count, average

5. **Customize Duration**
   - Click settings to adjust focus/break minutes
   - Minimum: 1 minute
   - Maximum: no limit
   - Only changeable when timer is stopped

6. **Reset Sessions**
   - Click "Reset All" to clear all session data
   - Cannot reset during break sessions

## Project Structure

```
progressive-pomodoro/
├── src/
│   ├── App.jsx              # Main timer component & state
│   ├── App.css              # Styling & animations
│   ├── main.jsx             # React entry point
│   ├── api.js               # Database API calls
│   └── components/
│       └── Analytics.jsx    # Analytics dashboard & charts
├── server/
│   ├── server.js            # Express server setup
│   ├── routes/
│   │   └── sessions.js      # Session API endpoints
│   ├── models/
│   │   └── Session.js       # MongoDB schema
│   ├── package.json
│   └── .env                 # MongoDB configuration
├── package.json
├── vite.config.js
└── README.md
```

## API Endpoints

### POST /api/sessions
Save a new session
```json
{
  "focusDuration": 1500,
  "breakDuration": 300,
  "date": "2026-02-15"
}
```

### GET /api/sessions
Get all sessions

### GET /api/sessions/range
Get sessions within date range
```
?startDate=2026-02-01&endDate=2026-02-15
```

### DELETE /api/sessions
Delete all sessions

## Features in Detail

### Timer States
- **focus-stopped**: Ready to start focus session
- **focus-running**: Actively in focus session
- **stopwatch**: Extra time tracking after focus
- **break-stopped**: Ready to start break
- **break-running**: Actively in break

### Storage Strategy
- **localStorage**: Immediate access, works offline
- **MongoDB**: Persistent cloud storage, analytics across devices

### Circular Progress Ring
- SVG-based animation
- Smooth stroke-dashoffset transitions
- Starts from top (12 o'clock position)
- Rotates clockwise with time

## Customization

### Change Default Durations
Edit in `src/App.jsx`:
```jsx
const [focusMinutes, setFocusMinutes] = useState(25);  // Change 25 to desired value
const [breakMinutes, setBreakMinutes] = useState(5);   // Change 5 to desired value
```

### Modify Colors
Edit gradient colors in `src/App.css`:
```css
.timer.focus {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);  /* Purple */
}
.timer.break {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);  /* Pink */
}
.timer.stopwatch {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);  /* Green */
}
```

## Troubleshooting

### Backend won't connect
- Ensure backend is running on port 5000
- Check MongoDB URI in `server/.env`
- Verify MongoDB Atlas network access settings

### Analytics show no data
- Complete at least one focus session
- Wait a few seconds for data to sync
- Check browser console for API errors
- Verify MongoDB connection string

### CORS errors
- Ensure backend is running before starting frontend
- Check `VITE_API_URL` in `.env.local`
- Backend CORS is configured for localhost:5173

### Timer not updating
- Refresh the page
- Check browser console for errors
- Ensure system clock is accurate

## Performance Features

- **Timestamp-based timing** - Prevents double-counting from React Strict Mode
- **100ms polling interval** - More accurate than 1-second intervals
- **SVG animations** - Hardware-accelerated, smooth performance
- **Lazy data loading** - Analytics fetch only when needed
- **Efficient state management** - Only essential state tracked

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements

- [ ] Notifications when sessions complete
- [ ] Keyboard shortcuts (Space to start, Esc to stop)
- [ ] Dark mode toggle
- [ ] Export analytics to CSV
- [ ] Weekly/yearly reports
- [ ] Goals and targets
- [ ] Session notes/tags

## License

MIT License - feel free to use and modify!

## Support

For issues or questions, check the browser console for error messages and ensure both frontend and backend are running correctly.

---

**Built with ❤️ for productive focus sessions**

