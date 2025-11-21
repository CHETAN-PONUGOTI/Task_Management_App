# 🛡️ Task Manager RBAC (Role-Based Access Control)

This is a full-stack application for managing tasks, designed to demonstrate secure authentication, authorization, and basic Role-Based Access Control (RBAC).

---

## ✨ Features

* **Role-Based Access Control (RBAC):**
    * **Normal Users:** Can only create, view, edit, and delete their **own** tasks.
    * **Admin Users:** Can view **all** tasks in the system and delete **any** task.
* **Secure Authentication:** User registration and login secured with **JWT** (JSON Web Tokens) for sessions and **bcryptjs** for password hashing.
* **RESTful API:** Built with Node.js and Express.js.
* **Database:** Simple, file-based persistence using **SQLite**.
* **Modern Frontend:** Built with **React** (Vite) and styled using **Tailwind CSS**.

---

## 🚀 Project Structure

task-manager-rbac/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── taskController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   └── index.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── tasks.js
│   ├── .env
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── TaskCard.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── ProtectedRoute.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── README.md
└── .gitignore


---

## ⚙️ Setup and Installation

Follow these steps to get the project running locally.

### Prerequisites

* Node.js (LTS version 20+ recommended)
* npm (or yarn/pnpm)

### Phase 1: Backend Setup

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  **Create `.env` file:** Create a file named `.env` in the `backend` directory and add your secret key and port.

    ```env
    # backend/.env
    JWT_SECRET=your_very_long_random_secret_key_here_for_security
    PORT=5000
    ```
    *(Tip: You can generate a random key using `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)*

4.  **Start the Backend API:**
    ```bash
    npm start
    # or for development with automatic restart:
    # npm run dev
    ```

    The API will run on `http://localhost:5000`. The SQLite file (`database.sqlite`) will be created automatically on the first run.

---

### Phase 2: Frontend Setup

1.  Navigate to the `frontend` directory:
    ```bash
    cd ../frontend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  **Start the Frontend Application:**
    ```bash
    npm run dev
    ```

    The application will open in your browser, typically at `http://localhost:5173/`.

---

## 🔑 Initial User and Admin Access

By default, every user registered through the application is assigned the role **`user`**.

### Creating an Admin User

To enable the RBAC features, you must manually promote a user to `admin` role in the database:

1.  **Register a User:** Navigate to `/register` and create an account (e.g., username: `admin`, password: `password`).
2.  **Stop the Backend Server.**
3.  **Promote the User:** Use a SQLite tool (like [DB Browser for SQLite](https://sqlitebrowser.org/)) to open `backend/database.sqlite` and run the following SQL command:

    ```sql
    UPDATE users SET role = 'admin' WHERE id = 1;
    ```
    (Assuming the user you registered has the ID of 1).
4.  **Restart the Backend Server.**

Now, when you log in with those credentials, you will have admin privileges.

---

## 📌 Key API Endpoints

The API is mounted under `http://localhost:5000/api`.

| Method | Endpoint | Description | Access Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user (`username`, `password`) | Public |
| `POST` | `/api/auth/login` | Log in and receive JWT and user info | Public |
| `GET` | `/api/tasks` | Fetch all tasks (Admin) or only own tasks (User) | Protected (JWT) |
| `POST` | `/api/tasks` | Create a new task | Protected (JWT) |
| `PUT` | `/api/tasks/:id` | Update an existing task | Protected (JWT) - Owner only |
| `DELETE`| `/api/tasks/:id` | Delete a task | Protected (JWT) - Admin or Owner |

---

## 🧑‍💻 Core Concepts Demonstrated

* **Authentication Flow:** Handling token creation, storage (localStorage), and attaching the token to requests (`services/api.js`).
* **Authorization (RBAC):** Implementing `middleware/auth.js` for JWT verification and `middleware/admin.js` for role checking (`req.user.role`).
* **Protected Routes:** Using the `<ProtectedRoute>` component on the frontend to restrict page access based on JWT presence.
* **Database Queries:** Using conditional logic in `taskController.js` to filter tasks based on the user's role (Admin sees all, User sees only `createdBy` ID).


**Project Live Link**: [https://task-management-app-omega-olive.vercel.app/login]
