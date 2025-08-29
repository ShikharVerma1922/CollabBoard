# 📌 CollabBoard

CollabBoard is a **real-time team collaboration tool** built using the **MERN stack (MongoDB, Express.js, React, Node.js)** along with **Socket.IO** for real-time communication. It provides features like Kanban-style boards for task management, activity tracking, and team chat — all in a clean, minimal, and modern interface.

---

## 🚀 Features

### 🔑 Authentication & Security

- User registration and login (with token & cookies).
- Secure password hashing.
- User-specific data isolation (each user sees only their own workspaces, boards, and activities).

### 📂 Workspaces & Boards

- Create and manage **Workspaces** for teams or projects.
- Inside a workspace, create **Boards** to organize tasks.
- Add **Columns** and **Tasks** to structure work in a Kanban board layout.
- **Drag-and-drop** for tasks between columns.

### 📝 Activities & History

- Every action (task creation, update, deletion, etc.) is logged as an **Activity**.
- Activities are grouped by **date** in the UI.
- Filter activities by **type** or by a **date range (from–to)**.

### 💬 Team Chat

- Real-time **chat feature** integrated per workspace.
- Supports channel-like communication and direct messages.
- Built with **Socket.IO** for instant updates.

### 📦 File Uploads

- Users can upload avatar images.
- File handling is done via **Multer** + integration with **Cloudinary**.

---

## 🛠️ Tech Stack

- **Frontend:** React, Vite, TailwindCSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB 
- **Real-time communication:** Socket.IO
- **Authentication:** Token based auth with jwt
- **File Uploads:** Cloudinary

---

## ⚡ Getting Started

### 1️⃣ Clone the repository

```bash
git clone https://github.com/ShikharVerma1922/CollabBoard.git
```

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/` with the following:

```env
PORT=3000
MONGO_URI=xxxx
NODE_ENV=development
CLOUDINARY_CLOUD_NAME=xxxx
CLOUDINARY_API_KEY=xxxx
CLOUDINARY_API_SECRET=xxxx
CORS_ORIGIN=http://localhost:5173
ACCESS_TOKEN_SECRET=xxxx
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=xxxx
REFRESH_TOKEN_EXPIRY=10d
```

Run the backend:

```bash
npm run dev
```

### 3️⃣ Frontend Setup

```bash
cd ../client
npm install
```

Create a `.env` file in `client/` with the following:

```env
VITE_SERVER=VITE_SERVER=http://localhost:3000/api/v1
```

Run the frontend:

```bash
npm run dev 
```

The app will be available at: `http://localhost:5173`

---

## 🔌 API Endpoints

[To be added]

### Chat Routes (via Socket.IO)

[To be added]

---

## 🧪 Testing File Uploads

Use **Postman** with `form-data`:

- Key: `avatar` (type: File)
- Key: `username`, `email`, etc. (type: Text)

Make sure the field name matches `upload.single("avatar")` in your route.

---

## 🎯 Future Improvements

- Add video/audio calls in chat.
- Role-based access control (admin, member, guest).
- Push notifications for task updates.
- Better offline support (service workers).

---

## 👨‍💻 Author

Developed by **Shikhar Verma** 

