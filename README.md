# MERN Admin Dashboard

A full-stack admin dashboard application built with MongoDB, Express, React, Node.js, and TypeScript.

## Features

- 🔐 User Authentication (Local & Google OAuth)
- 👥 User Management (CRUD operations)
- 🔒 Role-based Access Control (Admin/User)
- 📧 Email Notifications
- 🎨 Modern UI with Material-UI
- ✅ Comprehensive Test Coverage
- 🔄 Real-time Updates
- 📱 Responsive Design

## Tech Stack

### Backend
- Node.js
- Express.js
- TypeScript
- MongoDB with Mongoose
- JWT Authentication
- Passport.js (Google OAuth)
- Nodemailer
- Jest for Testing

### Frontend
- React 18
- Vite
- TypeScript
- Material-UI (MUI)
- React Router v6
- Axios
- React Context API

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local or Atlas account)
- Git

## Installation

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd mern-admin
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3000

# MongoDB
MONGO_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Email Configuration (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password
FROM_EMAIL=your_email@gmail.com
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

## Configuration Guide

### MongoDB Setup

**Option 1: MongoDB Atlas (Recommended)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist your IP address
5. Get your connection string and add it to `MONGO_URI`

**Option 2: Local MongoDB**
```bash
# Install MongoDB locally
# Ubuntu/Debian
sudo apt-get install mongodb

# macOS
brew install mongodb-community

# Start MongoDB
mongod
```

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:5000/api/auth/google/callback`
   - `http://localhost:3000` (frontend)
6. Copy Client ID and Client Secret to `.env` files

### Email Configuration (Gmail)

1. Enable 2-Factor Authentication on your Google account
2. Generate an App Password:
   - Go to Google Account Settings
   - Security > 2-Step Verification > App passwords
   - Generate a new app password
3. Use this password in `EMAIL_PASS`

## Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend runs on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs on `http://localhost:3000`

### Production Mode

**Backend:**
```bash
cd backend
npm run build
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

## Testing

### Backend Tests
```bash
cd backend
npm test                 # Run all tests
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Generate coverage report
```

### Frontend Tests
```bash
cd frontend
npm test
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/google` - Google OAuth login
- `GET /api/auth/google/callback` - Google OAuth callback
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Users (Protected Routes)
- `GET /api/users` - Get all users (with pagination & search)
- `POST /api/users` - Create user (Admin only)
- `PUT /api/users/:id` - Update user (Admin only)
- `DELETE /api/users/:id` - Delete user (Admin only)

## Project Structure

```
mern-admin/
├── backend/
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Custom middleware
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Utility functions
│   │   └── index.ts        # App entry point
│   ├── tests/              # Test files
│   ├── .env                # Environment variables
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── context/        # React Context
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── types/          # TypeScript types
│   │   └── App.tsx         # App component
│   ├── .env                # Environment variables
│   └── package.json
│
└── README.md
```

## Default Users

After seeding the database, you can use these credentials:

**Admin User:**
- Email: `admin@example.com`
- Password: `admin123`

**Regular User:**
- Email: `user@example.com`
- Password: `user123`

## Troubleshooting

### Port Already in Use
```bash
# Find and kill process using port 5000 (backend)
lsof -ti:5000 | xargs kill -9

# Find and kill process using port 3000 (frontend)
lsof -ti:3000 | xargs kill -9
```

### MongoDB Connection Issues
- Check if MongoDB is running
- Verify connection string in `.env`
- Check network access in MongoDB Atlas

### Google OAuth Not Working
- Verify Client ID and Secret
- Check authorized redirect URIs
- Ensure cookies are enabled in browser

### Email Not Sending
- Check Gmail app password
- Verify EMAIL_USER and EMAIL_PASS
- Check if 2FA is enabled on Google account

## Deployment

### Backend (Heroku/Railway/Render)
1. Set environment variables in hosting platform
2. Update `MONGO_URI` to production database
3. Update `CLIENT_URL` to production frontend URL
4. Deploy using platform's CLI or Git integration

### Frontend (Vercel/Netlify)
1. Set `VITE_API_URL` to production backend URL
2. Set `VITE_GOOGLE_CLIENT_ID`
3. Build and deploy

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Contact

Your Name - your.email@example.com

Project Link: [https://github.com/yourusername/mern-admin](https://github.com/yourusername/mern-admin)
```