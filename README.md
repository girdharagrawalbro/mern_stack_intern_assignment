# MiniSocial - Mini Social Media Platform

A full-stack MERN social media application with authentication, user profiles, and posts (text + image).

## Tech Stack

- **Frontend:** React.js, Axios, Tailwind CSS, React Router
- **Backend:** Node.js, Express.js, JWT, bcrypt
- **Database:** MongoDB (Mongoose)
- **Validation:** Zod

## Features

- User Registration & Login with JWT authentication
- Password hashing with bcrypt
- Protected routes (frontend + backend)
- View & Edit profile (Name, Email readonly, Bio, Profile Picture URL)
- Create posts with text & image URL
- View all posts (feed)
- View own posts
- Delete own posts only
- Zod schema validation (Name min 3 chars, valid email, password min 6 chars)

## Setup Steps

### Prerequisites

- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the repository

```bash
git clone <repo-url>
cd Mern_Project_girdhar
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/` with:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

Start the backend server:

```bash
node server.js
```

The backend runs on `http://localhost:5000`.

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` with a proxy to the backend.

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login user |

### Users (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/me` | Get current user profile |
| GET | `/api/users/profile/:id` | Get user profile by ID |
| PUT | `/api/users/profile` | Update own profile |

### Posts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/posts` | Get all posts (feed) |
| GET | `/api/posts/my` | Get current user's posts (protected) |
| POST | `/api/posts` | Create a post (protected) |
| DELETE | `/api/posts/:id` | Delete own post (protected) |

## Project Structure

```
├── backend/
│   ├── middleware/auth.js    # JWT auth middleware
│   ├── models/User.js        # User schema
│   ├── models/Post.js        # Post schema
│   ├── routes/auth.js         # Auth routes
│   ├── routes/user.js         # User routes
│   ├── routes/post.js         # Post routes
│   ├── utils/db.js            # MongoDB connection
│   ├── validators/schemas.js  # Zod validation schemas
│   └── server.js              # Express server
├── frontend/
│   └── src/
│       ├── api/axios.js       # Axios instance with auth
│       ├── pages/
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── Home.jsx       # Post feed
│       │   ├── CreatePost.jsx
│       │   ├── MyPosts.jsx
│       │   ├── ViewProfile.jsx
│       │   └── EditProfile.jsx
│       └── App.jsx            # Routing & layout
```
