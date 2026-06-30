<img width="951" height="447" alt="image" src="https://github.com/user-attachments/assets/999333bf-cf42-4354-9c3f-8dc398035775" />
<img width="948" height="442" alt="image" src="https://github.com/user-attachments/assets/820b30fb-89c6-4b11-9052-37a9e6b638c8" />
<img width="238" height="371" alt="image" src="https://github.com/user-attachments/assets/f82752b1-da84-4924-81bd-be1887164eaf" />




Markdown
# Full-Stack E-Commerce & Admin Dashboard

A full-stack e-commerce platform featuring an interactive storefront and a comprehensive administrative dashboard for managing products, users, analytics, and orders.

---

## 🚀 Tech Stack

### Frontend
* **Core:** React.js, Vite
* **Styling:** CSS Modules, Custom Component CSS
* **Routing:** React Router DOM
* **Deployment:** Vercel Configuration Ready (`vercel.json`)

### Backend
* **Environment:** Node.js, Express.js
* **Database:** Relational Database Integration (`db.js`, `initDB.js`)
* **Authentication:** JWT / Custom Middleware (`authMiddleware.js`, `adminMiddleware.js`)
* **File Uploads:** Multer / Custom Upload Middleware (`uploadMiddleware.js`)

---

## 🛠️ Getting Started

### Prerequisites
* Node.js (v18+ recommended)
* npm


##  Running the Application

To run this project locally, you will need to open two separate terminal windows: one for the backend server and one for the frontend UI.

### 1. Start the Backend
Navigate to the `backend` directory, install the required packages, and start the server:
```bash
cd backend
npm install
npm run dev
```
### 2.Start the Frontend

In a second terminal window, navigate to the frontend directory, install the dependencies, and launch the Vite development server:

```bash
cd frontend
npm install
npm run dev
```


### Environment Variables Setup

This project requires environment variables configured in both the frontend and backend directories. Create a `.env` file in each respective folder:

frontend
API_URL

backend


DB_HOST
DB_NAME
DB_USER
DB_PASS
DB_PORT
PORT
JWT_SECRET

CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
