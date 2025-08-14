# Blog API (Beginner-friendly)

This project is a simple Express + MongoDB API for a blog with user auth, posts and comments.

Quick start (Windows PowerShell):

1. Copy `.env.example` to `.env` and fill values (add your MongoDB URI and a JWT secret):

```powershell
cp .env.example .env
# then edit .env in your editor and add MONGODB_URI and JWT_SECRET
```

2. Install dependencies:

```powershell
npm install
```

3. Run in development (uses `nodemon`):

```powershell
npm run dev
```

API endpoints (basic):

- POST /api/auth/signup  { name, email, password }
- POST /api/auth/login   { email, password } -> returns token
- GET  /api/posts
- POST /api/posts        (authenticated, Bearer token)
- POST /api/posts/:postId/comments  (authenticated)

Notes for beginners:

- After login you receive a JWT. Send it in the `Authorization` header as `Bearer <token>`.
- Passwords are hashed with bcrypt before saving.
- Use try/catch in async controllers to return friendly errors (already applied in controllers).
- If you don't provide `MONGODB_URI`, the server will start but won't connect to a database. Add your DB URI to `.env` when ready.

Files of interest:

- `app.js` - Express app and routes wiring
- `server.js` - starts the server and connects to MongoDB
- `models/` - Mongoose models: `User`, `Post`
- `controllers/` - `authController`, `postController`
- `routes/` - route files: `auth.js`, `posts.js`
- `middleware/auth.js` - protects routes using JWT

Happy hacking — add validation, tests, and more routes as you learn.


