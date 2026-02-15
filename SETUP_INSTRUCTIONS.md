# Setup Instructions for Progressive Pomodoro Timer

## Backend Setup

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Set up MongoDB Atlas (Free)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster (free tier)
4. Go to "Database Access" → Create a user with password
5. Go to "Network Access" → Add your IP address (or 0.0.0.0 for development)
6. Go to "Clusters" → Click "Connect" → Copy the connection string

### 3. Update .env file
Replace the `MONGODB_URI` in `server/.env` with your connection string:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pomodoro?retryWrites=true&w=majority
```

### 4. Start the Backend
```bash
npm start
# or for development with auto-reload:
npm run dev
```

The backend will run on `http://localhost:5000`

## Frontend Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Create .env file in root (if not exists)
```
VITE_API_URL=http://localhost:5000/api
```

### 3. Start Frontend
```bash
npm run dev
```

## Testing the Integration

1. Start the backend server
2. Start the frontend
3. Create a focus session and complete it
4. Click "View Analytics" - it will now fetch data from MongoDB!

## Troubleshooting

- **Backend won't connect**: Check your MongoDB Atlas connection string in `.env`
- **CORS errors**: Make sure backend is running on port 5000
- **API errors**: Check browser console and server logs for details
