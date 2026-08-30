College Complaint Management System — Complete Project Specification

Project Overview & Tech Stack

Project Overview

Build a full-stack web-based College Complaint Management System that allows students to digitally report campus problems, track complaint progress, receive status updates, and view resolutions.

The platform connects students with college administrators and departments through a centralized complaint management system.

Students can report issues involving:

- Classrooms
- Laboratories
- Hostels
- Wi-Fi / Internet
- Infrastructure
- Transportation
- Cleanliness
- Other campus facilities

The system must support the complete complaint lifecycle:

Student → Submit Complaint → Admin Reviews → Assign Department/Staff → Complaint In Progress → Issue Resolved → Student Views Resolution → Student Provides Feedback

The application must include the required core features and lightweight implementations of all specified bonus features.

Tech Stack

- Frontend: React, Vite, Tailwind CSS, React Router, Axios, Socket.IO Client, Lucide React
- Backend: Node.js, Express.js, Mongoose, JWT, bcryptjs, Socket.IO
- Database: MongoDB Atlas
- Frontend Deployment: Vercel
- Backend Deployment: Render
- Authentication: JWT-based authentication
- Password Hashing: bcryptjs
- Real-Time Communication: Socket.IO
- File/Image Storage: Cloudinary or equivalent image-storage service
- Email: Nodemailer with SMTP configuration
- AI: Optional OpenRouter/Gemini API with deterministic fallback
- Development Environment: Google Antigravity

The application must work without optional external API keys wherever possible through sensible fallback implementations.

---

Authentication & User Roles

Authentication

The authentication system must support:

- Student registration
- Student login
- Admin login
- JWT-based authentication
- Protected routes
- Persistent login state
- Logout
- "/api/auth/me" profile endpoint
- Password hashing using bcrypt
- Role-based authorization

User roles:

student
admin

Students must only be able to access their own complaints.

Admins can access and manage all complaints.

Registration Fields

name
email
password
studentId
department
year

Login

email
password

The backend must return a JWT after successful authentication.

---

Complaint Management

Complaint Submission

Students must be able to submit a complaint containing:

title
category
description
location
image

The system automatically creates:

complaintId
studentId
status
priority
createdAt
updatedAt

Default values:

status = Submitted
priority = Low

Complaint Categories

The category list must include:

Classroom
Laboratory
Hostel
Wi-Fi / Internet
Infrastructure
Transportation
Cleanliness
Other

Location

Students must specify where the issue occurred.

Example:

Main Block - Room 204
Hostel Block A
Computer Lab 2
College Bus
Library

Image/File Attachment

Students should be able to attach an image of the issue.

For the 2-hour implementation:

- Support image uploads.
- Store the resulting URL in MongoDB.
- Use Cloudinary or another simple cloud-storage provider.
- If image storage configuration is unavailable, allow an image URL as a fallback.

---

Complaint Status Tracking

Every complaint must use the following lifecycle:

Submitted
    ↓
Under Review
    ↓
Assigned
    ↓
In Progress
    ↓
Resolved
    ↓
Closed

Admins can update the status.

Students can view the current status through a visual timeline.

Example:

✓ Submitted
✓ Under Review
✓ Assigned
● In Progress
○ Resolved
○ Closed

The current status must be clearly visible using a status badge.

---

Complaint Priority

Each complaint must have one of:

Low
Medium
High
Critical

The admin can change the priority.

Critical complaints should be visually highlighted.

---

Complaint History

Students must have a My Complaints page showing all complaints submitted by the logged-in student.

Display:

Complaint ID
Title
Category
Priority
Status
Created Date
Last Updated

Students must be able to open any complaint to view its complete details.

---

Complaint Details

The complaint details page must display:

Complaint ID
Title
Category
Description
Location
Attached Image
Priority
Status
Assigned Department
Assigned Staff
Created Date
Updated Date
Admin Updates
Resolution Details
Resolution Date
Student Feedback

The page must also contain a visual status timeline.

---

Admin Dashboard

The administrator dashboard must provide an overview of the complaint system.

Statistics

Display:

Total Complaints
Submitted
Under Review
In Progress
Resolved
Closed
Critical Complaints

Example:

TOTAL     PENDING     IN PROGRESS     RESOLVED     CLOSED
  48         10            8             20          10

Statistics should be calculated from actual MongoDB complaint data.

---

Admin Complaint Management

Admins must be able to:

- View all complaints
- Open complaint details
- Search complaints
- Filter complaints
- Change status
- Change priority
- Assign department
- Assign responsible staff
- Add comments/updates
- Add resolution details
- Close complaints

Admin must not need separate accounts for every department or staff member.

Department and staff assignment can be represented using dropdowns.

Departments

Administration
IT Department
Maintenance
Hostel
Transportation
Housekeeping
Laboratory

Staff

Use a simple predefined list or text/dropdown field.

Example:

IT Department → IT Administrator
Maintenance → Maintenance Officer
Hostel → Hostel Warden

---

Admin Comments & Updates

Admins can add progress updates to complaints.

Example:

Update:
The issue has been forwarded to the maintenance department.

Updated:
30 Aug 2026, 04:30 PM

Updates must appear in chronological order on the complaint details page.

---

Resolution Management

When a complaint is resolved, the admin can provide:

Resolution Details
Resolution Date

Example:

The damaged network cable was replaced and Wi-Fi connectivity was restored.

The student must be able to see the resolution.

---

Search & Filtering

The admin complaint management page must provide:

Search

Search by:

Complaint ID
Title
Student Name

Filters

Filter by:

Status
Category
Priority
Department

Multiple filters may be combined.

---

Real-Time Status Notifications

The system must use Socket.IO for lightweight real-time updates.

When an admin changes a complaint's:

- Status
- Priority
- Assignment
- Resolution

the connected student's dashboard should receive a real-time notification.

Example:

🔔 Complaint CMP-102 status changed to In Progress.

If Socket.IO is unavailable, the application must still function normally using normal API refreshes.

---

Notifications

Notifications must be generated for important complaint events.

Examples:

Complaint Submitted
Complaint Assigned
Status Changed
Admin Comment Added
Complaint Resolved
Complaint Closed

Notifications should be stored in MongoDB.

The frontend should provide a notification bell/drawer.

Each notification contains:

title
message
complaintId
type
isRead
createdAt

Students can mark notifications as read.

---

Email Notifications

The system should support email notifications using Nodemailer.

Emails should be generated for:

Complaint Submitted
Complaint Assigned
Status Changed
Complaint Resolved

Email configuration must use environment variables.

Example:

SMTP_HOST
SMTP_PORT
SMTP_USER
SMTP_PASSWORD

If SMTP credentials are not configured, the system must not crash.

Instead:

- Log that email configuration is unavailable.
- Continue normal application operation.

Email is therefore a supported feature without making deployment dependent on an email provider.

---

Admin Analytics Dashboard

The admin dashboard must include lightweight analytics.

Display:

Complaint Status Distribution

Submitted
Under Review
Assigned
In Progress
Resolved
Closed

Category Distribution

Classroom
Laboratory
Hostel
Wi-Fi
Infrastructure
Transportation
Cleanliness
Other

Priority Distribution

Low
Medium
High
Critical

Use simple charts or visual progress bars.

Do not build a complex analytics engine.

---

Department-Wise Statistics

The admin dashboard should provide department-level statistics.

Example:

Department| Total| Pending| Resolved
IT| 12| 3| 9
Maintenance| 15| 5| 10
Hostel| 8| 2| 6

These values must be calculated from complaint data.

---

Complaint Resolution Time Tracking

The system must calculate the time taken to resolve a complaint.

When status changes to "Resolved":

resolutionTime =
resolvedAt - createdAt

Display:

Resolution Time: 2 days 4 hours

The admin analytics section can display:

Average Resolution Time
Fastest Resolution
Longest Resolution

Keep calculations simple.

---

Student Feedback & Resolution Rating

After a complaint becomes "Resolved", the student should be able to provide feedback.

Fields:

Rating: 1–5 stars
Feedback: optional text

The student can submit feedback only once.

Example:

⭐⭐⭐⭐⭐

Issue was resolved quickly.

Admins can view the rating and feedback on the complaint details page.

---

Duplicate Complaint Detection

Before submitting a complaint, the backend should perform a lightweight duplicate check.

Compare the new complaint against recent complaints using:

category
location
title/description similarity

If a likely duplicate exists, display:

A similar complaint already exists.

Complaint ID: CMP-098
Status: In Progress

Do you still want to submit this complaint?

The student can continue if the issue is genuinely different.

Do not implement complex machine-learning duplicate detection.

A simple keyword/token similarity or normalized text comparison is sufficient.

---

AI-Based Complaint Categorization

When a student enters a complaint, the system should attempt to automatically suggest a category.

Example:

"Wi-Fi is not working in the second floor laboratory."

Suggested Category:
Wi-Fi / Internet

AI behavior:

1. Use OpenRouter/Gemini if an API key exists.
2. Otherwise use a deterministic keyword-based classifier.

Keyword fallback examples:

wifi, internet, network → Wi-Fi / Internet

hostel, room, warden → Hostel

bus, transport, vehicle → Transportation

fan, light, building, door → Infrastructure

dust, garbage, waste → Cleanliness

computer, practical, lab → Laboratory

The student must be able to change the suggested category before submitting.

---

AI-Generated Complaint Summary

The system should generate a short summary of long complaint descriptions.

Example:

Original:
The Wi-Fi connection has been unstable for the past three days...

Summary:
Unstable Wi-Fi connection reported in Block A for three days.

Use:

OpenRouter → Gemini → deterministic summary fallback

The summary should be stored with the complaint.

If AI configuration is unavailable, use the first meaningful portion of the description as the fallback summary.

---

Image-Based Issue Classification

When an image is uploaded, the system may attempt basic issue classification.

Example:

Uploaded Image
      ↓
Image Analysis
      ↓
Possible Issue:
Damaged Infrastructure

For the 2-hour version, this must remain lightweight.

If an image-analysis API is unavailable:

Image Classification:
Pending Manual Review

The complaint remains fully functional.

Do not build or train a custom computer-vision model.

---

Automatic Escalation

The system should automatically identify complaints that remain unresolved for too long.

For example:

Critical → 24 hours
High → 48 hours
Medium → 72 hours
Low → 7 days

If the threshold is exceeded:

Complaint → Escalated

The admin receives a notification:

⚠ Complaint CMP-103 requires attention.
This complaint has exceeded its resolution threshold.

Add an "isEscalated" field to the complaint.

For a lightweight implementation, escalation can be checked when:

- Admin dashboard loads
- Complaint list loads
- A complaint is opened

A continuously running background worker is not required for the MVP.

---

Mobile Responsive / PWA Interface

The frontend must be responsive for:

- Desktop
- Tablet
- Mobile

The navigation should collapse appropriately on smaller screens.

The application should include basic PWA support where practical:

manifest
app icons
responsive viewport

Do not spend significant development time on advanced offline functionality.

---

Frontend Pages

The application should contain the following pages:

/
 /login
 /register

 /student/dashboard
 /student/complaints
 /student/complaints/new
 /student/complaints/:id

 /admin/dashboard
 /admin/complaints
 /admin/complaints/:id

 /notifications
 /profile

---

Page Requirements

"/"

Landing page containing:

- College Complaint Management System title
- Short description
- Student Login button
- Student Registration button
- Admin Login button
- Feature highlights

---

"/login"

Fields:

Email
Password

Include:

- Validation
- Loading state
- Error messages
- Role-based redirection

---

"/register"

Fields:

Name
Email
Password
Student ID
Department
Year

Include:

- Password validation
- Form validation
- Loading state
- Error handling

---

"/student/dashboard"

Display:

Welcome, [Student]

Total Complaints
Pending
In Progress
Resolved
Closed

Also display:

- Recent complaints
- Notification preview
- Quick Submit Complaint button

---

"/student/complaints"

Display all complaints belonging to the logged-in student.

Include:

- Search
- Status filter
- Category filter
- Complaint cards/table
- Status badges
- Pagination if required

---

"/student/complaints/new"

Complaint submission form containing:

Title
Category
Description
Location
Image

Features:

- AI category suggestion
- Duplicate detection
- AI summary
- Image upload
- Form validation
- Submission loading state

---

"/student/complaints/:id"

Display:

- Complete complaint information
- Status timeline
- Admin updates
- Assignment
- Resolution
- Notifications
- Student feedback/rating after resolution

---

"/admin/dashboard"

Display:

Total Complaints
Pending
In Progress
Resolved
Critical
Average Resolution Time

Also display:

- Status chart
- Category chart
- Department statistics
- Recent complaints
- Escalated complaints

---

"/admin/complaints"

Admin complaint management table.

Features:

- Search
- Filter
- Sort
- Status badges
- Priority badges
- Department
- Student
- Date
- View button

---

"/admin/complaints/:id"

Admin management interface.

Admin can modify:

Status
Priority
Department
Assigned Staff
Admin Comment
Resolution Details

Admin can also:

- View attached image
- View AI summary
- View duplicate warnings
- View resolution time
- View feedback
- Manually escalate/de-escalate

---

Backend Architecture

Use a simple layered Express architecture.

Routes
   ↓
Controllers
   ↓
Services
   ↓
Models
   ↓
MongoDB Atlas

Routes

Handle:

- HTTP endpoints
- Authentication middleware
- Role authorization
- Request validation

Controllers

Controllers should:

- Receive requests
- Call services
- Return responses

Business logic should remain inside services.

Services

Services handle:

- Authentication
- Complaint creation
- Complaint updates
- Complaint assignment
- Notifications
- Email
- AI categorization
- AI summaries
- Duplicate detection
- Escalation
- Analytics

---

MongoDB Collections

Users

Users

Fields:

_id
name
email
password
studentId
department
year
role
createdAt
updatedAt

"role":

student
admin

---

Complaints

Complaints

Fields:

_id
complaintId
studentId
title
category
description
summary
location
imageUrl
priority
status
department
assignedStaff
adminComment
resolutionDetails
resolvedAt
isEscalated
escalatedAt
feedback
rating
createdAt
updatedAt

---

Complaint Updates

ComplaintUpdates

Fields:

_id
complaintId
adminId
message
status
createdAt

This provides a proper complaint timeline.

---

Notifications

Notifications

Fields:

_id
userId
complaintId
type
title
message
isRead
createdAt

---

API Endpoints

Health

GET /api/health

Returns backend/database status.

---

Authentication

POST /api/auth/register
POST /api/auth/login
GET /api/auth/me
POST /api/auth/logout

---

Student Complaint APIs

POST /api/complaints
GET /api/complaints/my
GET /api/complaints/:id
PUT /api/complaints/:id

Students must only be able to access their own complaints.

---

Admin Complaint APIs

GET /api/admin/complaints
GET /api/admin/complaints/:id
PUT /api/admin/complaints/:id
POST /api/admin/complaints/:id/update
POST /api/admin/complaints/:id/resolve
POST /api/admin/complaints/:id/escalate

---

Analytics APIs

GET /api/admin/statistics
GET /api/admin/statistics/departments
GET /api/admin/statistics/categories
GET /api/admin/statistics/status

---

Notification APIs

GET /api/notifications
PUT /api/notifications/:id/read
PUT /api/notifications/read-all

---

Feedback APIs

POST /api/complaints/:id/feedback

Students can submit feedback only after the complaint is resolved.

---

AI APIs

POST /api/ai/categorize
POST /api/ai/summarize
POST /api/ai/image-classify

All AI endpoints must have deterministic fallbacks.

---

Real-Time Socket Events

Use Socket.IO.

Events:

complaint:created
complaint:updated
complaint:statusChanged
complaint:assigned
complaint:resolved
notification:new
complaint:escalated

The student client should subscribe only to events relevant to the logged-in student.

---

Folder Structure

Frontend

client/
└── src/
    ├── components/
    │   ├── Navbar/
    │   ├── Sidebar/
    │   ├── ProtectedRoute/
    │   ├── ComplaintCard/
    │   ├── ComplaintForm/
    │   ├── ComplaintTimeline/
    │   ├── StatusBadge/
    │   ├── PriorityBadge/
    │   ├── NotificationDrawer/
    │   ├── StatisticsCards/
    │   └── AnalyticsCharts/
    │
    ├── pages/
    │   ├── Login.jsx
    │   ├── Register.jsx
    │   ├── Landing.jsx
    │   ├── student/
    │   │   ├── Dashboard.jsx
    │   │   ├── Complaints.jsx
    │   │   ├── NewComplaint.jsx
    │   │   └── ComplaintDetails.jsx
    │   │
    │   └── admin/
    │       ├── Dashboard.jsx
    │       ├── Complaints.jsx
    │       └── ComplaintDetails.jsx
    │
    ├── services/
    │   ├── api.js
    │   └── socket.js
    │
    ├── store/
    │   └── authStore.js
    │
    ├── App.jsx
    └── main.jsx

Backend

server/
└── src/
    ├── config/
    │   ├── db.js
    │   └── env.js
    │
    ├── models/
    │   ├── User.js
    │   ├── Complaint.js
    │   ├── ComplaintUpdate.js
    │   └── Notification.js
    │
    ├── routes/
    │   ├── authRoutes.js
    │   ├── complaintRoutes.js
    │   ├── adminRoutes.js
    │   ├── notificationRoutes.js
    │   └── aiRoutes.js
    │
    ├── controllers/
    │   ├── authController.js
    │   ├── complaintController.js
    │   ├── adminController.js
    │   └── notificationController.js
    │
    ├── services/
    │   ├── authService.js
    │   ├── complaintService.js
    │   ├── notificationService.js
    │   ├── emailService.js
    │   ├── aiService.js
    │   ├── duplicateService.js
    │   └── escalationService.js
    │
    ├── middleware/
    │   ├── authMiddleware.js
    │   ├── roleMiddleware.js
    │   └── errorMiddleware.js
    │
    ├── sockets/
    │   └── socketHandler.js
    │
    └── server.js

---

Environment Variables

Backend

PORT
MONGODB_URI
JWT_SECRET
CLIENT_URL

SMTP_HOST
SMTP_PORT
SMTP_USER
SMTP_PASSWORD

OPENROUTER_API_KEY
GEMINI_API_KEY

CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET

Optional services must not prevent the core application from running.

---

Development Phases

Phase 1 — Project Setup & Authentication

Implement:

- React/Vite frontend
- Express backend
- MongoDB Atlas connection
- User model
- Registration
- Login
- JWT authentication
- Role-based routes
- Vercel/Render environment configuration

---

Phase 2 — Core Complaint System

Implement:

- Complaint model
- Complaint submission
- Complaint history
- Complaint details
- Status tracking
- Priority
- Categories
- Location
- Image upload
- Admin complaint list

This is the most important phase.

---

Phase 3 — Admin Management

Implement:

- Admin dashboard
- Statistics
- Search
- Filters
- Department assignment
- Staff assignment
- Admin comments
- Status updates
- Resolution details

---

Phase 4 — Bonus Features

Implement lightweight versions of:

- Notifications
- Socket.IO updates
- Email notifications
- Analytics
- Department statistics
- Resolution time
- Student rating
- Duplicate detection
- AI categorization
- AI summaries
- Image classification
- Automatic escalation
- Mobile responsiveness
- PWA manifest

---

Phase 5 — Deployment & Testing

Deploy:

Frontend → Vercel
Backend → Render
Database → MongoDB Atlas

Verify:

Registration
Login
Student complaint submission
Image upload
Complaint persistence
Admin login
Admin management
Status updates
Real-time notification
Search/filter
Resolution
Feedback
Analytics

---

UI / UX Requirements

The UI should have a clean modern college-management dashboard aesthetic.

Requirements:

- Fully responsive
- Mobile-friendly
- Clear navigation
- Dashboard cards
- Status badges
- Priority badges
- Complaint timeline
- Toast notifications
- Loading states
- Empty states
- Error states
- Confirmation dialogs for destructive actions
- Accessible forms
- Consistent spacing
- Lucide icons
- Clean Tailwind styling

Student Experience

The student should immediately understand:

What complaints have I submitted?
What is their current status?
Has the administrator responded?
Has my complaint been resolved?

Admin Experience

The administrator should immediately understand:

How many complaints exist?
Which complaints need attention?
Which complaints are critical?
Which complaints are unresolved?
Which departments have pending complaints?
Which complaints have been escalated?

---

Security Requirements

The application must:

- Hash passwords with bcrypt
- Never store plaintext passwords
- Sign JWTs using "JWT_SECRET"
- Protect authenticated routes
- Enforce student/admin roles
- Prevent students from accessing other students' complaints
- Validate request data
- Configure CORS using "CLIENT_URL"
- Use Helmet
- Never expose MongoDB credentials to frontend
- Never expose JWT secrets to frontend
- Keep all API secrets in environment variables
- Sanitize user-controlled data where appropriate
- Return safe error messages
- Never expose sensitive backend configuration

---

Deployment Requirements

Frontend — Vercel

The frontend must use:

VITE_API_URL

Example:

VITE_API_URL=https://your-render-backend.onrender.com/api

The frontend must never make production API calls to "localhost".

Backend — Render

Render must contain:

MONGODB_URI
JWT_SECRET
CLIENT_URL

and optional service credentials.

The backend must listen on the Render-provided "PORT".

MongoDB Atlas

Configure:

- Database user
- Database password
- Connection string
- Network access
- Production database

The MongoDB connection string must exist only in Render environment variables.

---

Final Expected Outcome

The completed application must provide the following complete workflow:

STUDENT
   ↓
Register / Login
   ↓
Student Dashboard
   ↓
Submit Complaint
   ↓
AI Suggests Category
   ↓
Duplicate Check
   ↓
Complaint Stored in MongoDB
   ↓
Admin Notification
   ↓
ADMIN
   ↓
Review Complaint
   ↓
Assign Department / Staff
   ↓
Set Priority
   ↓
Under Review
   ↓
In Progress
   ↓
Student Receives Real-Time Update
   ↓
Admin Adds Resolution
   ↓
Resolved
   ↓
Student Views Resolution
   ↓
Student Gives Rating / Feedback
   ↓
Closed

The system should additionally provide:

✓ Email notifications
✓ Real-time notifications
✓ Admin analytics
✓ Department statistics
✓ Resolution-time tracking
✓ Student feedback
✓ Complaint ratings
✓ Duplicate detection
✓ AI category suggestions
✓ AI complaint summaries
✓ Image classification fallback
✓ Automatic escalation
✓ Responsive mobile UI
✓ Basic PWA support
✓ MongoDB persistence
✓ REST API
✓ Vercel deployment
✓ Render deployment

---

2-Hour Build Priority

Because all bonus features are required, the AI coding agent must follow this priority order:

Priority 1 — Must Never Be Skipped

Authentication
MongoDB
Complaint submission
Complaint storage
Student dashboard
Admin dashboard
Complaint management
Status updates
Assignment
Resolution
Deployment

Priority 2 — Required Enhancements

Search/filter
Statistics
Notifications
Resolution time
Feedback/rating
Responsive UI

Priority 3 — Lightweight Bonus Implementations

Socket.IO
Email
AI categorization
AI summary
Duplicate detection
Escalation
Image classification
PWA

If time becomes limited, Priority 3 features must use simple fallback implementations rather than blocking the core application.

---

Codex / Google Antigravity Implementation Instructions

The AI coding agent must:

1. Build the application in phases.
2. Prioritize working end-to-end functionality over visual complexity.
3. Use React/Vite for the frontend.
4. Use Node.js/Express for the backend.
5. Use MongoDB Atlas through Mongoose.
6. Keep frontend and backend completely separated.
7. Use Axios for API communication.
8. Use JWT authentication.
9. Hash passwords using bcrypt.
10. Implement student/admin role authorization.
11. Never expose backend secrets in the frontend.
12. Use environment variables for all credentials.
13. Keep MongoDB operations in services/models rather than directly inside route definitions.
14. Keep controllers thin.
15. Implement all complaint CRUD functionality.
16. Ensure students can only access their own complaints.
17. Ensure admins can access all complaints.
18. Generate unique human-readable complaint IDs such as "CMP-001".
19. Implement the complete status lifecycle.
20. Implement department and staff assignment.
21. Persist every important complaint update.
22. Generate notifications for important events.
23. Use Socket.IO for real-time updates.
24. Use graceful fallbacks when optional services are unavailable.
25. AI features must never prevent complaint submission.
26. Email failures must never crash the application.
27. Image-classification failures must never prevent complaint creation.
28. Duplicate detection should warn rather than block submission.
29. Escalation should be lightweight and deterministic.
30. Ensure the application works even when optional API keys are absent.
31. Make the interface responsive.
32. Test all major student and admin workflows.
33. Configure the project for Vercel frontend deployment.
34. Configure the backend for Render deployment.
35. Verify MongoDB Atlas connectivity in production.
36. Fix all CORS/API URL issues before deployment.
37. Do not leave placeholder buttons for core functionality.
38. Every visible core action must perform a real operation.
39. At the end of each implementation phase, report:

- Files created
- Files modified
- Features completed
- Remaining work
- Any required environment variables

The final application must prioritize a working complete complaint lifecycle over unnecessary architectural complexity.

---

Definition of Done

The project is complete when the following test can be performed successfully:

Student

Register
→ Login
→ Submit complaint
→ Attach image
→ Receive category suggestion
→ Submit
→ View complaint
→ Receive status notification
→ See admin update
→ See assignment
→ See resolution
→ Submit rating/feedback

Admin

Login
→ View dashboard
→ See complaint
→ Search/filter complaint
→ Open complaint
→ Assign department
→ Assign staff
→ Set priority
→ Change status
→ Add update
→ Resolve complaint
→ View feedback
→ View analytics

System

MongoDB persistence ✓
REST APIs ✓
JWT authentication ✓
Role authorization ✓
Real-time updates ✓
Notifications ✓
Email fallback ✓
AI fallback ✓
Duplicate detection ✓
Escalation ✓
Responsive UI ✓
Vercel deployment ✓
Render deployment ✓
MongoDB Atlas ✓

Final goal: deliver a polished, functional College Complaint Management System that feels like a real college product rather than a static CRUD demonstration, while keeping every advanced feature deliberately lightweight enough to remain implementable within the available development time.