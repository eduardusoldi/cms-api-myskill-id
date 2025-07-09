# CMS MySkill.ID API Documentation

## 📚 List of Available Endpoints

### 🔐 Authentication Endpoints

| Method | Endpoint         | Description         | Access |
|--------|------------------|---------------------|--------|
| POST   | `/api/login`     | User login, returns a JWT token | Public |
| POST   | `/api/logout`  | User logout | Auth Required |

---

### 🧑‍💼 User Endpoints

| Method | Endpoint             | Description             | Access          |
|--------|----------------------|-------------------------|------------------|
| GET    | `/api/users`         | Get all users           | Public            |
| GET    | `/api/users/:id`     | Get user by ID          | Public          |
| POST   | `/api/users`         | Create new user         | Auth required    |
| PUT    | `/api/users/:id`     | Update user             | Auth required    |
| DELETE | `/api/users/:id`     | Delete user             | Auth required    |

---

### 📝 Article Endpoints

| Method | Endpoint                | Description                        | Access                     |
|--------|-------------------------|------------------------------------|-----------------------------|
| GET    | `/api/articles`         | List articles                      | Public / Auth filtered     |
| GET    | `/api/articles/:id`     | Get article by ID                  | Public / Owner only (draft)|
| POST   | `/api/articles`         | Create new article                 | Auth required              |
| PUT    | `/api/articles/:id`     | Update article                     | Auth required (owner only) |
| DELETE | `/api/articles/:id`     | Delete article                     | Auth required (owner only) |

---

### 📈 Page View Endpoints

| Method | Endpoint                          | Description                                           | Access        |
|--------|-----------------------------------|-------------------------------------------------------|----------------|
| POST   | `/api/page-view`                  | Track page view                                       | Public         |
| GET    | `/api/page-view/count`            | Get total page views, with optional filters           | Auth required  |
| GET    | `/api/page-view/aggregate-date`   | Get aggregated page views (hourly/daily/monthly)     | Auth required  |

---

### 🛡️ Authorization

- All protected routes require a Bearer token in the request header:
```md
Authorization: Bearer <your_token_here>
```
- Use the `/api/login` endpoint to retrieve a valid token.

---

## 🔐 Authentication Endpoints

### POST `/api/login`

**Description**: User login, returns a JWT token  
**Access:** Public

**Request Body:**

```json
{
  "username": "johndoe",
  "password": "your_password"
}
```

#### ✅ Success Response:

* **Status Code:** `200 OK`

```json
{
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5..."
}
```

### POST `/api/logout`

**Description**: User logout  
**Access:** Auth required

#### ✅ Success Response:

* **Status Code:** `200 OK`

```json
{
    "message": "Logout successful. Please clear the access_token on the client side (e.g. localStorage)."
}
```

## 🧑‍💼 User Endpoints


### POST `/api/users`

**Description:** Register a new user with name, username, and password.  
**Access:** Private (Requires authentication)

**Request Body:**

```json
{
  "name": "John Doe",
  "username": "johndoe",
  "password": "your_password"
}
```


#### ✅ Success Response:

* **Status Code:** `201 Created`

```json
{
  "message": "User created successfully",
  "user": {
    "_id": "60e64d9988b8e621344e38cd",
    "name": "John Doe",
    "username": "johndoe"
  }
}
```

#### ❌ Error Responses:

* **400 Bad Request**

```json
{
  "message": "Name is required; Username is required; Password is required",
  "errorCode": "VALIDATION_ERROR"
}
```

* **400 Bad Request**

```json
{
  "message": "Username is already taken",
  "errorCode": "USERNAME_TAKEN"
}
```

---

### GET `/api/users`

**Description:** Retrieve all registered users.  
**Access:** Public




#### ✅ Success Response:

* **Status Code:** `200 OK`

```json
[
  {
    "_id": "60e64d9988b8e621344e38cd",
    "name": "John Doe",
    "username": "johndoe"
  }
]
```

#### ❌ Error Response:

* **404 Not Found**

```json
{
  "message": "No users found",
  "errorCode": "NO_USERS_FOUND"
}
```

---

### GET `/api/users/:id`

**Description:** Retrieve a specific user by their ID.  
**Access:** Public

**Request Param:**

```json
{
    "id": "60e64d9988b8e621344e38cd"
}
```

#### ✅ Success Response:

* **Status Code:** `200 OK`

```json
{
  "_id": "60e64d9988b8e621344e38cd",
  "name": "John Doe",
  "username": "johndoe"
}
```

#### ❌ Error Responses:

* **400 Bad Request**

```json
{
  "message": "Invalid ID format",
  "errorCode": "INVALID_ID_FORMAT"
}
```

* **404 Not Found**

```json
{
  "message": "User not found",
  "errorCode": "USER_NOT_FOUND"
}
```

---

### PUT `/api/users/:id`

**Description:** Update a user's name, username, or password.  
**Access:** Private (Only the user can update their own information)


**Request Param:**

```json
{
    "id": "60e64d9988b8e621344e38cd"
}
```

**Request Body:**

```json
{
  "name": "Jane Doe",
  "username": "janedoe",
  "password": "new_password"
}
```


#### ✅ Success Response:

* **Status Code:** `200 OK`

```json
{
  "message": "User information updated successfully.",
  "user": {
    "_id": "60e64d9988b8e621344e38cd",
    "name": "Jane Doe",
    "username": "janedoe"
  }
}
```

#### ❌ Error Responses:

* **403 Forbidden**

```json
{
  "message": "You do not have permission to update this user.",
  "errorCode": "FORBIDDEN_UPDATE"
}
```

* **404 Not Found**

```json
{
  "message": "User not found or could not be updated.",
  "errorCode": "UPDATE_FAILED"
}
```

---

### DELETE `/api/users/:id`

**Description:** Delete the authenticated user's account.  
**Access:** Private (Only the user can delete their own account)


**Request Param:**

```json
{
    "id": "60e64d9988b8e621344e38cd"
}
```
#### ✅ Success Response:

* **Status Code:** `200 OK`

```json
{
  "message": "Your account has been successfully deleted."
}
```

#### ❌ Error Responses:

* **403 Forbidden**

```json
{
  "message": "You do not have permission to delete this user.",
  "errorCode": "FORBIDDEN_DELETE"
}
```

* **404 Not Found**

```json
{
  "message": "User not found or already deleted.",
  "errorCode": "DELETE_FAILED"
}
```


## 📝 Article Endpoints


### GET `api/articles`

**Description:** Fetch all articles.  
**Access:** Public (optional auth).

**Query Behavior:**
  * Unauthenticated: Only returns published articles.
  * Authenticated: Returns all published + draft articles created by the current user.

**✅ Success Response:**

* Status: `200 OK`

```json
[
  {
    "_id": "<articleId>",
    "title": "Article Title",
    "content": "Article body",
    "status": "published",
    "author": {
      "username": "john_doe"
    }
  }
]
```

**❌ Error Response:**

* Status: `404 Not Found`

```json
{
  "message": "No articles found",
  "errorCode": "ARTICLES_EMPTY"
}
```

---

### GET `api/articles/:id`

**Description:** Fetch a specific article by ID.  
**Access:** Public (only if `published`) or Author-only if `draft`.

**Request Param:**

```json
{
    "id": "60e64d9988b8e621344e38cd"
}
```
**✅ Success Response:**

* Status: `200 OK`

```json
{
  "_id": "60e64d9988b8e621344e38cd",
  "title": "Article Title",
  "content": "...",
  "status": "draft",
  "author": {
    "username": "john_doe"
  }
}
```

**❌ Error Responses:**

* Status: `404 Not Found`

```json
{
  "message": "Article not found",
  "errorCode": "ARTICLE_NOT_FOUND"
}
```

* Status: `403 Forbidden`

```json
{
  "message": "Forbidden: You are not allowed to access this article.",
  "errorCode": "FORBIDDEN_VIEW"
}
```

---

###  POST `/api/articles`

**Description:** Create a new article.  
**Access:** Protected

**Request Body:**

```json
{
  "title": "New Article",
  "content": "This is the content.",
  "status": "draft" // or "published"
}
```

**✅ Success Response:**

* Status: `201 Created`

```json
{
  "_id": "<articleId>",
  "title": "New Article",
  "content": "This is the content.",
  "status": "draft",
  "author": {
    "id": "<userId>",
    "username": "john_doe"
  }
}
```

**❌ Error Responses:**

* Status: `400 Bad Request`

```json
{
  "message": "Title is required; Content is required",
  "errorCode": "VALIDATION_ERROR"
}
```


---

### PUT `/articles/:id`

**Description:** Update an existing article.  
**Access:** Protected (Author-only)

**Request Param:**

```json
{
    "id": "60e64d9988b8e621344e38cd"
}
```

**Request Body (any of these fields):**

```json
{
  "title": "Updated Title",
  "content": "Updated content",
  "status": "published" // or "draft"
}
```

**✅ Success Response:**

* Status: `200 OK`

```json
{
  "_id": "60e64d9988b8e621344e38cd",
  "title": "Updated Title",
  "content": "Updated content",
  "status": "published",
  "author": {
    "username": "john_doe"
  }
}
```

**❌ Error Responses:**

* Status: `403 Forbidden`

```json
{
  "message": "You are not allowed to update this article.",
  "errorCode": "FORBIDDEN_UPDATE"
}
```

* Status: `400 Bad Request`

```json
{
  "message": "At least one of title, content, or status must be provided.",
  "errorCode": "VALIDATION_ERROR"
}
```

---

### DELETE `/articles/:id`

**Description:** Delete an article.  
**Access:** Protected (Author-only)

**Request Param:**

```json
{
    "id": "60e64d9988b8e621344e38cd"
}
```

**✅ Success Response:**

* Status: `200 OK`

```json
{
  "message": "Article deleted successfully"
}
```

**❌ Error Responses:**

* Status: `403 Forbidden`

```json
{
  "message": "You are not allowed to delete this article.",
  "errorCode": "FORBIDDEN_DELETE"
}
```

* Status: `404 Not Found`

```json
{
  "message": "Article not found",
  "errorCode": "ARTICLE_NOT_FOUND"
}
```

---

## 📈 Page View Endpoints


### POST `/api/page-view`

**Description:** Record a page view for a specific article.  
**Access:** Public

**Request Body:**

```json
{
  "article": "60f73c7e5b4c4c001c8b4567"
}
```

**✅ Success Response:**

* Status: `201 Created`

```json
{
  "message": "Page view recorded"
}
```

**❌ Error Responses:**

* Status: `400 Bad Request`

```json
{
  "message": "Request body cannot be empty.",
  "errorCode": "EMPTY_BODY"
}
```

* Status: `400 Bad Request`

```json
{
  "message": "Request body contains unexpected fields.",
  "errorCode": "INVALID_BODY"
}
```

* Status: `400 Bad Request`

```json
{
  "message": "Article ID is required.",
  "errorCode": "VALIDATION_ERROR"
}
```

* Status: `400 Bad Request`

```json
{
  "message": "Invalid article ID",
  "errorCode": "INVALID_ARTICLE_ID"
}
```

* Status: `404 Not Found`

```json
{
  "message": "Article not found",
  "errorCode": "ARTICLE_NOT_FOUND"
}
```

---

### GET `/api/page-view/count`

**Description:** Retrieve the total number of page views for a specific article, optionally filtered by date range.  
**Access:** Protected (requires authentication)

**Query Parameters:**

* `article` (string): Optional article ID
* `startAt` (date): Optional start date (ISO string)
* `endAt` (date): Optional end date (ISO string)

**✅ Success Response:**

* Status: `200 OK`

```json
{
  "totalPageViews": 127
}
```

---

### GET `/api/page-view/aggregate-date`

**Description:** Return aggregated page views grouped by time interval.  
**Access:** Protected (requires authentication)

**Query Parameters:**

* `interval` (string): Required. One of `hourly`, `daily`, or `monthly`
* `article` (string): Optional article ID
* `startAt` (date): Optional start date (ISO string)
* `endAt` (date): Optional end date (ISO string)

**✅ Success Response:**

* Status: `200 OK`

```json
[
  {
    "date": "2024-01-01",
    "totalPageViews": 10
  },
  {
    "date": "2024-01-02",
    "totalPageViews": 25
  }
]
```

**❌ Error Responses:**

* Status: `400 Bad Request`

```json
{
  "message": "Invalid or missing interval. Must be one of: hourly, daily, or monthly.",
  "errorCode": "INVALID_INTERVAL"
}
```

* Status: `400 Bad Request`

```json
{
  "message": "Invalid article ID format.",
  "errorCode": "INVALID_ARTICLE_ID"
}
```

---

## 🌐 Global Error Handler

**Description:**
Handles all unhandled errors or thrown `AppError` instances in the application. This middleware should be registered **after all routes**.

**Access:** Global middleware (automatically invoked on error)

---

### ✅ Known Error Responses

#### 🔴 Application Error (`AppError`)

* Status: `4xx` (customizable)

```json
{
  "message": "Custom error message from AppError",
  "errorCode": "APP_ERROR"
}
```

#### 🔴 Invalid ObjectId (Mongoose CastError)

* Status: `400 Bad Request`

```json
{
  "message": "Invalid ID format: 123",
  "errorCode": "INVALID_OBJECT_ID"
}
```

#### 🔴 Invalid JWT Token

* Status: `401 Unauthorized`

```json
{
  "message": "Invalid access token. Please log in again.",
  "errorCode": "INVALID_TOKEN"
}
```

#### 🔴 Expired JWT Token

* Status: `401 Unauthorized`

```json
{
  "message": "Your session has expired. Please log in again.",
  "errorCode": "TOKEN_EXPIRED"
}
```

---

### ❌ Unhandled/Internal Server Error

* Status: `500 Internal Server Error`

```json
{
  "message": "Something went wrong. Please try again later.",
  "errorCode": "INTERNAL_SERVER_ERROR"
}
```
