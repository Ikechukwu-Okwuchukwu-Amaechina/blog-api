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

API endpoints (completed):

Auth:
- POST /api/auth/signup  { name, email, password }
- POST /api/auth/login   { email, password } -> returns token

Posts:
- GET  /api/posts                      -> list posts (supports ?page=&limit=&author=&tag=&from=&to=)
- GET  /api/posts/:id                  -> get single post (public)
- POST /api/posts                      -> create post (auth required)
- PUT  /api/posts/:id                  -> update post (owner or admin)
- DELETE /api/posts/:id                -> delete post (owner or admin)

Comments:
- GET  /api/posts/:postId/comments     -> list comments for a post (public)
- POST /api/posts/:postId/comments     -> add comment (auth required)
- DELETE /api/posts/:postId/comments/:commentId -> delete comment (owner or admin)

Security & middleware added:
- Helmet for secure HTTP headers
- Rate limiting to reduce abuse
- Input sanitization against NoSQL injection and XSS
- JWT-based protected routes (send token as `Authorization: Bearer <token>`)

Notes for beginners:
- After login you receive a JWT. Send it in the `Authorization` header as `Bearer <token>`.
- Passwords are hashed with bcrypt before saving.
- If you don't provide `MONGODB_URI`, the server will start but won't connect to a database.

Push changes to GitHub (example):

```powershell
git add .
git commit -m "Add posts, comments, auth, and security middlewares"
git push origin main
```

(You must have push access and be authenticated locally.)

Happy hacking — add validation, tests, and more routes as you learn.


