# CampusVoice — College Complaint Management System

CampusVoice is a web-based portal that bridges the communication gap between college students and administrators. Students can digitally report facilities, infrastructure, IT, or hostel issues, view live progression timelines, and offer feedback. Administrators can prioritize tickets, assign them to departments and staff, post updates, and analyze overall metrics.

---

## 🛠 Technology Stack

- **Frontend**: React (Vite), Tailwind CSS (v4), Axios, React Router, Socket.IO Client, Lucide Icons
- **Backend**: Node.js, Express.js, Mongoose, JWT, bcryptjs, Socket.IO
- **Database**: MongoDB (Local or Atlas)
- **Email (Fallback)**: Nodemailer (SMTP)
- **AI Classifier (Fallback)**: Gemini API

---

## 📂 Project Directory Structure

```
automation/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Navbar, Sidebar, Badges, Timelines, Forms, Charts
│   │   ├── pages/          # Auth, Student dashboards, Admin dashboards
│   │   ├── services/       # Axios API client, Socket connections
│   │   ├── store/          # AuthContext session management
│   │   └── App.jsx         # Routes
│   └── package.json
│
├── server/                 # Express Backend API
│   ├── src/
│   │   ├── config/         # db, env setups
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # JWT Protection, Role RBAC, Global Error
│   │   ├── models/         # User, Complaint, Timeline Updates, Notifications
│   │   ├── services/       # AI, Duplicates, Emails, Escalation workers
│   │   └── server.js       # App entry point
│   ├── .env.example
│   └── package.json
│
├── package.json            # Root running concurrently
└── README.md
```

---

## ⚙ Prerequisites & Local Installation

Make sure you have [Node.js (v18+)](https://nodejs.org/) installed. You will also need a running MongoDB instance (locally or via MongoDB Atlas).

### 1. Install All Dependencies
From the root workspace directory, run:
```bash
npm run install-all
```
This will automatically execute `npm install` in the root, `server/` and `client/` folders.

### 2. Configure Environment Variables
Create a `.env` file in the `server/` directory:
```bash
cp server/.env.example server/.env
```
Open `server/.env` and verify the values:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/complaint-system
JWT_SECRET=yoursecretkey
CLIENT_URL=http://localhost:5173

# (Optional) Nodemailer Config
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=

# (Optional) Gemini AI Suggestion Config
GEMINI_API_KEY=
```

---

## 🚀 Running the Project Locally

Run the following command from the **root directory** to spin up both the backend API server and frontend dev server concurrently:

```bash
npm run dev
```

- **Frontend client** will run at: [http://localhost:5173](http://localhost:5173)
- **Backend server** will run at: [http://localhost:5000](http://localhost:5000)

### Alternative Commands
- To start only the **Backend API**: `npm run server`
- To start only the **Frontend Dev Client**: `npm run client`

---

## 🧪 Testing the Workflows

### 1. Register & Login Accounts
- Visit [http://localhost:5173/register](http://localhost:5173/register)
- To create a **Student** account, choose "Student", fill in your name, email, password, and student details.
- To create an **Administrator** account, choose "Administrator (Dev Mode)" and register.
- Use your registered credentials at [http://localhost:5173/login](http://localhost:5173/login) to access your portals.

### 2. Submit a Complaint (Student Flow)
- Log in as a Student and click **Submit Complaint**.
- Type a description (e.g. *"The WiFi in hostel block A is not connecting and has weak signal"*).
- Notice that when you click out of the Description box, the **AI automatically suggests "Wi-Fi / Internet"** as the category!
- Submit a mock reference image link if desired.
- Try submitting a similar issue in the same room. The system will alert you with a **Duplicate Warning**, allowing you to cancel or submit anyway.

### 3. Manage & Resolve (Admin Flow)
- Log in as an Administrator.
- Open the dashboard to see statistics, average resolution times, and charts.
- Go to **Manage Complaints**, filter by category/priority, and select the ticket you submitted.
- Modify the priority to "High" or "Critical".
- Select a Department (e.g. "IT Department") to assign it.
- Change the status to "In Progress".
- Check the student portal or bell icon: a **real-time notification** will show the status change!
- Change the status to "Resolved" and type your **Resolution Message**.

### 4. Close & Satisfaction Review (Student Validation)
- Return to the Student portal and open the ticket details.
- Review the resolution details and select a star rating (1 to 5) and feedback comments.
- Submit the feedback. The complaint will automatically transition to **Closed** with your reviews logged.
