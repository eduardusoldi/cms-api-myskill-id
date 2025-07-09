# MySkill.ID CMS Backend API

A simple CMS backend built with Express.js, TypeScript, and MongoDB for managing a blog system with user authentication, article management, and page view tracking.

## Features

  **User & Auth System**
  * Public user listing and detail view
  * Authenticated user registration
  * JWT-based login/logout
  * Users can only update/delete their own account

 **Article Management**

  * Publicly accessible published articles
  * Authenticated users can create articles
  * Draft articles are only visible to their authors
  * Authors can update/delete their own articles

 **Page View Tracker**

  * Track article visits
  * Filtered and aggregated view counts
  * Daily, hourly, and monthly aggregation supported



## Tech Stack

* **Backend**: Express.js, TypeScript
* **Database**: MongoDB (Mongoose)
* **Auth**: JWT
* **Other**: Docker, RESTful architecture



##  Running Locally

### 1. Clone the Repository

```bash
git clone https://github.com/eduardusoldi/cms-api-myskill-id.git
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/myskill-cms
JWT_SECRET=your_jwt_secret
```

### 4. Run the Application

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

---

##  Running with Docker 

```bash
docker compose up -d
```


## API Documentation

### Local API Documentation
For detailed information on available endpoints, request formats, and responses, check out the [API Documentation](./API_DOCS.md).

### Postman Collection

📁 [Download Postman Collection](https://www.postman.com/your-collection-link)
Or import the provided `.postman_collection.json` file in the repository.

### Base URL (Local)

```
http://localhost:5000
```

---

##  Authentication

* Login via `POST /auth/login` with `username` and `password`
* Pass JWT via `Authorization: Bearer <token>` for protected routes

---

##  Database Seeding

If not using docker, you can seed the database locally using:

```bash
npm run seed
```

If running inside Docker, use:

```bash
docker exec -it myskill-id-cms-api npm run seed
```

It wil create this user:
```json
{
    "name": "Admin User",
    "username": "admin",
}
```
---



##  Author

Eduardus Oldi
[LinkedIn](https://www.linkedin.com/in/eduardusoldi/) • [GitHub](https://github.com/eduardusoldi)
