# Tragres - Student ERP System

A modern student management and tracking system built with React, Vite, and Tailwind CSS. Track student profiles, attendance, assignments, and monitor individual student activities.

![Tragres ERP](https://img.shields.io/badge/Tragres-Student%20ERP-blue)
![React](https://img.shields.io/badge/React-18.3-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Component Guide](#-component-guide)
- [Data Storage](#-data-storage)
- [Backend Setup (Django)](#-backend-setup-django)
- [Database Setup (Neon DB)](#-database-setup-neon-db)
- [Deployment](#-deployment)
- [API Reference](#-api-reference)
- [Customization](#-customization)
- [Troubleshooting](#-troubleshooting)

---

## 🚀 Features

| Feature | Description |
|---------|-------------|
| **Student Profiles** | Name, phone, email, course, profile photos |
| **Attendance Tracking** | Individual daily marking with topic coverage |
| **Assignment Management** | Track assignments with completion status |
| **Student Monitoring** | Individual profile pages with activity history |
| **Responsive Design** | Mobile, tablet, and desktop support |
| **Data Persistence** | localStorage (frontend) or PostgreSQL (backend) |

---

## 🛠 Tech Stack

### Frontend (React)
- **Framework**: React 18 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Routing**: React Router DOM
- **State Management**: React Query (TanStack)
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React

### Backend (Django)
- **Framework**: Django 4.2 + Django REST Framework
- **Database**: PostgreSQL (Neon DB)
- **Deployment**: Fly.io
- **CORS**: django-cors-headers

---

## 📁 Project Structure

```
tragres/
├── src/                          # Frontend React Application
│   ├── components/               # Reusable UI components
│   │   ├── ui/                   # shadcn/ui base components
│   │   ├── Layout.tsx            # Main app layout (header, nav, footer)
│   │   ├── NavLink.tsx           # Navigation link component
│   │   ├── StudentCard.tsx       # Student preview card
│   │   └── StudentForm.tsx       # Add/Edit student form
│   │
│   ├── pages/                    # Route page components
│   │   ├── Dashboard.tsx         # Home page with stats
│   │   ├── Students.tsx          # Student list with search
│   │   ├── AddStudent.tsx        # Add new student
│   │   ├── StudentProfile.tsx    # Individual student view
│   │   ├── Attendance.tsx        # Mark daily attendance
│   │   └── NotFound.tsx          # 404 page
│   │
│   ├── lib/                      # Utility functions
│   │   ├── storage.ts            # localStorage data management
│   │   ├── api.ts                # Django API client
│   │   └── utils.ts              # General utilities
│   │
│   ├── types/                    # TypeScript definitions
│   │   └── student.ts            # Student, Attendance, Assignment types
│   │
│   ├── hooks/                    # Custom React hooks
│   ├── App.tsx                   # Main app with routing
│   ├── main.tsx                  # Entry point
│   └── index.css                 # Global styles
│
├── backend-django/               # Django Backend API
│   ├── tragres_api/              # Django project settings
│   │   ├── settings.py           # Configuration
│   │   ├── urls.py               # URL routing
│   │   └── wsgi.py               # WSGI application
│   │
│   ├── students/                 # Students app
│   │   ├── models.py             # Database models
│   │   ├── serializers.py        # API serializers
│   │   ├── views.py              # API viewsets
│   │   ├── urls.py               # API routes
│   │   └── admin.py              # Admin configuration
│   │
│   ├── requirements.txt          # Python dependencies
│   ├── manage.py                 # Django CLI
│   ├── Dockerfile                # Container configuration
│   ├── fly.toml                  # Fly.io deployment
│   └── .env.example              # Environment template
│
├── public/                       # Static assets
├── index.html                    # HTML entry point
├── vite.config.ts                # Vite configuration
├── tailwind.config.ts            # Tailwind configuration
└── package.json                  # Node dependencies
```

---

## 📦 Installation

### Prerequisites

- **Node.js** v18+ ([Download](https://nodejs.org/))
- **Python** 3.10+ (for backend)
- **PostgreSQL** or Neon DB account (for production)

### Frontend Setup

```bash
# 1. Clone the repository
git clone <YOUR_GIT_URL>
cd tragres

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# App runs at http://localhost:5173
```

### Build for Production

```bash
npm run build
# Output in 'dist' folder
```

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# API URL (only needed when using Django backend)
VITE_API_URL=http://localhost:8000/api

# For production
# VITE_API_URL=https://your-api.fly.dev/api
```

### Switching Between Storage Modes

Edit `src/lib/storage.ts`:

```typescript
// Set to true to use Django API
const USE_API = false;  // Change to true for backend mode
```

When `USE_API = true`, import functions from `src/lib/api.ts` in your components.

---

## 🧩 Component Guide

### Layout Components

| Component | File | Purpose |
|-----------|------|---------|
| `Layout` | `src/components/Layout.tsx` | Main wrapper with header, navigation sidebar, and footer. Contains the \"Developed by Saheer\" credit. |
| `NavLink` | `src/components/NavLink.tsx` | Navigation link with active state styling |

**To modify navigation:**
```tsx
// In Layout.tsx, find the nav section:
<NavLink to="/" icon={<LayoutDashboard />}>Dashboard</NavLink>
<NavLink to="/students" icon={<Users />}>Students</NavLink>
// Add new links here
```

### Feature Components

| Component | File | Purpose |
|-----------|------|---------|
| `StudentCard` | `src/components/StudentCard.tsx` | Displays student summary card in list views. Shows name, course, photo, and attendance stats. |
| `StudentForm` | `src/components/StudentForm.tsx` | Reusable form for creating/editing students. Handles profile photo upload, validation. |

**To add new form fields:**
```tsx
// In StudentForm.tsx, add to the form schema and JSX:
const formSchema = z.object({
  // ... existing fields
  newField: z.string().min(1),
});

// Add input in the return JSX
<FormField name="newField" ... />
```

### Page Components

| Page | Route | File | Purpose |
|------|-------|------|---------|
| Dashboard | `/` | `Dashboard.tsx` | Overview with stats cards, recent students list |
| Students | `/students` | `Students.tsx` | Full student list with search functionality |
| Add Student | `/add-student` | `AddStudent.tsx` | New student registration form |
| Profile | `/student/:id` | `StudentProfile.tsx` | Individual student view with edit, attendance history, assignments |
| Attendance | `/attendance` | `Attendance.tsx` | Daily attendance marking for all students |
| 404 | `*` | `NotFound.tsx` | Not found error page |

**To add a new page:**

1. Create component in `src/pages/NewPage.tsx`
2. Add route in `src/App.tsx`:
```tsx
<Route path="/new-page" element={<NewPage />} />
```
3. Add navigation link in `Layout.tsx`

---

## 💾 Data Storage

### Current Mode: localStorage

Data is stored in the browser's localStorage under the key `tragres_students`.

**Pros:**
- ✅ No backend required
- ✅ Instant data persistence
- ✅ Works offline

**Cons:**
- ❌ Device-specific (no sync)
- ❌ Can be lost if browser data is cleared
- ❌ Limited storage (~5MB)

### Storage Functions (`src/lib/storage.ts`)

| Function | Description |
|----------|-------------|
| `getStudents()` | Get all students |
| `saveStudents(students)` | Save all students |
| `addStudent(student)` | Add new student, returns created student |
| `updateStudent(id, updates)` | Update student by ID |
| `deleteStudent(id)` | Delete student by ID |
| `getStudentById(id)` | Get single student |
| `addAttendance(studentId, record)` | Add attendance record |
| `addAssignment(studentId, assignment)` | Add assignment |
| `toggleAssignment(studentId, assignmentId)` | Toggle completion |
| `deleteAssignment(studentId, assignmentId)` | Delete assignment |

---

## 🐍 Backend Setup (Django)

The Django backend is in the `backend-django/` folder.

### Local Development

```bash
# Navigate to backend folder
cd backend-django

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or: venv\\Scripts\\activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env
# Edit .env with your settings

# Run migrations
python manage.py migrate

# Create admin user (optional)
python manage.py createsuperuser

# Start development server
python manage.py runserver

# API runs at http://localhost:8000/api
```

### Django Project Structure

```
backend-django/
├── tragres_api/           # Project configuration
│   ├── settings.py        # Database, CORS, installed apps
│   ├── urls.py            # Root URL routing
│   └── wsgi.py            # WSGI entry point
│
└── students/              # Students app
    ├── models.py          # Student, Attendance, Assignment models
    ├── serializers.py     # JSON serializers
    ├── views.py           # API viewsets and actions
    ├── urls.py            # API URL patterns
    └── admin.py           # Admin panel configuration
```

### Modifying the API

**To add a new field to Student model:**

1. Edit `students/models.py`:
```python
class Student(models.Model):
    # ... existing fields
    new_field = models.CharField(max_length=200, blank=True)
```

2. Update serializers in `students/serializers.py`:
```python
class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        fields = [..., 'new_field']
```

3. Run migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

---

## 🗄️ Database Setup (Neon DB)

### Creating a Neon Database

1. Sign up at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string

### Connecting Django to Neon

Edit `backend-django/.env`:

```env
DATABASE_URL=postgresql://username:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
```

The connection is automatically configured in `settings.py` using `dj-database-url`.

### Database Schema

```
┌─────────────────────────────────────────────────────────────┐
│                         STUDENT                              │
├─────────────────────────────────────────────────────────────┤
│ id (UUID, PK)                                               │
│ name (VARCHAR 200)                                          │
│ phone (VARCHAR 20)                                          │
│ email (VARCHAR 254)                                         │
│ course (VARCHAR 200)                                        │
│ profile_photo (TEXT)                                        │
│ created_at (DATETIME)                                       │
│ updated_at (DATETIME)                                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ 1:N
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    ATTENDANCE_RECORD                         │
├─────────────────────────────────────────────────────────────┤
│ id (UUID, PK)                                               │
│ student_id (FK → Student)                                   │
│ date (DATE)                                                 │
│ present (BOOLEAN)                                           │
│ topic (TEXT)                                                │
│ created_at (DATETIME)                                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ 1:N
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       ASSIGNMENT                             │
├─────────────────────────────────────────────────────────────┤
│ id (UUID, PK)                                               │
│ student_id (FK → Student)                                   │
│ title (VARCHAR 500)                                         │
│ completed (BOOLEAN)                                         │
│ assigned_date (DATE)                                        │
│ completed_date (DATE, nullable)                             │
│ created_at (DATETIME)                                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Deployment

### Frontend → Netlify

1. **Connect Repository**
   - Go to [netlify.com](https://netlify.com)
   - Click \"Add new site\" → \"Import an existing project\"
   - Connect your GitHub repository

2. **Configure Build**
   ```
   Build command: npm run build
   Publish directory: dist
   ```

3. **Environment Variables**
   - Add `VITE_API_URL` pointing to your Fly.io API

4. **Deploy**
   - Click \"Deploy site\"

### Backend → Fly.io

1. **Install Fly CLI**
   ```bash
   # macOS/Linux
   curl -L https://fly.io/install.sh | sh

   # Windows (PowerShell)
   iwr https://fly.io/install.ps1 -useb | iex
   ```

2. **Login and Deploy**
   ```bash
   cd backend-django

   # Login to Fly
   fly auth login

   # Launch app (first time)
   fly launch

   # Set secrets
   fly secrets set SECRET_KEY=\"your-secret-key\"
   fly secrets set DATABASE_URL=\"your-neon-connection-string\"

   # Deploy
   fly deploy
   ```

3. **Update CORS**
   
   Edit `tragres_api/settings.py`:
   ```python
   CORS_ALLOWED_ORIGINS = [
       \"https://your-app.netlify.app\",
   ]
   ```

---

## 📡 API Reference

Base URL: `http://localhost:8000/api` (dev) or `https://your-app.fly.dev/api` (prod)

### Students

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/students/` | List all students |
| `POST` | `/students/` | Create new student |
| `GET` | `/students/{id}/` | Get single student |
| `PUT` | `/students/{id}/` | Update student |
| `DELETE` | `/students/{id}/` | Delete student |

### Attendance

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/students/{id}/attendance/` | Add/update attendance |

### Assignments

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/students/{id}/assignments/` | Add assignment |
| `PUT` | `/students/{id}/assignments/{aid}/toggle/` | Toggle completion |
| `DELETE` | `/students/{id}/assignments/{aid}/` | Delete assignment |

### Example Requests

```bash
# Get all students
curl http://localhost:8000/api/students/

# Create student
curl -X POST http://localhost:8000/api/students/ \
  -H \"Content-Type: application/json\" \
  -d '{\"name\": \"John Doe\", \"phone\": \"1234567890\", \"course\": \"Computer Science\"}'

# Add attendance
curl -X POST http://localhost:8000/api/students/{id}/attendance/ \
  -H \"Content-Type: application/json\" \
  -d '{\"date\": \"2024-01-15\", \"present\": true, \"topic\": \"React Hooks\"}'
```

---

## 🎨 Customization

### Changing Colors/Theme

Edit `src/index.css`:
```css
:root {
  --primary: 210 100% 50%;     /* Main brand color */
  --secondary: 210 40% 96%;    /* Secondary backgrounds */
  --accent: 210 100% 60%;      /* Accent highlights */
}
```

### Adding New Routes

1. Create page in `src/pages/`
2. Add route in `src/App.tsx`
3. Add nav link in `src/components/Layout.tsx`

### Adding New Data Fields

1. Update `src/types/student.ts`
2. Update `src/lib/storage.ts` functions
3. Update `src/components/StudentForm.tsx`
4. (If using API) Update Django models and serializers

---

## 🔧 Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| CORS errors | Add frontend URL to Django `CORS_ALLOWED_ORIGINS` |
| API not connecting | Check `VITE_API_URL` matches your backend URL |
| Database errors | Verify `DATABASE_URL` in `.env` |
| Migrations fail | Run `python manage.py migrate --run-syncdb` |

### Debug Mode

Enable Django debug mode for development:
```env
DEBUG=True
```

### Logs (Fly.io)

```bash
fly logs
```

---

## 👨‍💻 Developer

**Developed by Saheer**

📧 Contact: [mailsaheermk@gmail.com](mailto:mailsaheermk@gmail.com)

---

## 📄 License

This project is open source and available under the MIT License.

---

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Django REST Framework](https://www.django-rest-framework.org/) - API toolkit
- [Neon](https://neon.tech/) - Serverless PostgreSQL
- [Fly.io](https://fly.io/) - Application deployment
