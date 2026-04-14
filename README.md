# CFC FarWest — Team Activity & Event Portal

**Code For Change Nepal — FarWest Region**
Full-stack web application built with **React** (frontend) + **Spring Boot** (backend) + **PostgreSQL** (database).

---

## Features

### Public (no login required)
- 🏠 **Home page** — hero, team stats, upcoming events preview
- 📅 **Events page** — filter by type (Workshop, Webinar, Hackathon, Competition, Mentorship) and status
- 🔍 **Event detail page** — date, time, venue, registration link, mentor info
- 📁 **Activities page** — all past events grouped by year
- 👥 **Team page** — all members grouped by type (Executives, College Reps, General)

### Admin Dashboard (login required)
- 📊 **Dashboard** — stats overview, upcoming events, recent activities, quick actions
- ➕ **Event Management** — create, edit, delete events with full details (title, type, date, venue, link, mentor, max participants)
- 👤 **Member Management** — add/edit/remove members; filter by type
- ✅ **Attendance Tracker** — select any event, mark each member Present / Absent / Excused, bulk save, view attendance % summary
- 📋 **RSVP Management** — track member RSVPs per event; gate check: shows when all members have confirmed so outer students can join

---

## Project Structure

```
cfc-farwest/
├── backend/          ← Spring Boot API
│   ├── pom.xml
│   └── src/main/java/com/cfcfarwest/
│       ├── entity/       Member, Event, Attendance, Rsvp, Admin
│       ├── repository/   JPA repositories
│       ├── service/      Business logic
│       ├── controller/   REST endpoints
│       ├── security/     JWT auth filter + util
│       └── config/       SecurityConfig (CORS, routes)
│
└── frontend/         ← React app
    ├── package.json
    ├── tailwind.config.js
    └── src/
        ├── App.jsx           All routes
        ├── context/          AuthContext (JWT state)
        ├── services/         api.js (all axios calls)
        ├── components/       Navbar, Footer, EventCard, ProtectedRoute
        └── pages/
            ├── HomePage.jsx
            ├── EventsPage.jsx
            ├── EventDetailPage.jsx
            ├── ActivitiesPage.jsx
            ├── TeamPage.jsx
            ├── AdminLoginPage.jsx
            ├── AdminLayout.jsx       (sidebar)
            ├── AdminDashboard.jsx
            ├── AdminEventsPage.jsx
            ├── AdminMembersPage.jsx
            ├── AdminAttendancePage.jsx
            └── AdminRsvpPage.jsx
```

---

## Setup Instructions

### 1. PostgreSQL Database

```sql
-- Create database
CREATE DATABASE cfc_farwest;
```

### 2. Backend (Spring Boot)

**Edit** `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/cfc_farwest
spring.datasource.username=postgres
spring.datasource.password=YOUR_PASSWORD_HERE

jwt.secret=change_this_to_a_long_random_string_in_production
```

**Run:**
```bash
cd backend
./mvnw spring-boot:run
# API will start on http://localhost:8080
```

**Create your first admin account** (one-time only):
```bash
curl -X POST http://localhost:8080/api/auth/setup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "your_secure_password",
    "fullName": "Your Name",
    "email": "you@example.com"
  }'
```
> ⚠️ This endpoint is disabled once an admin exists. Do this first before anything else.

### 3. Frontend (React)

```bash
cd frontend
npm install
npm start
# App will open at http://localhost:3000
```

---

## API Endpoints

### Public (no auth)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/events` | All events |
| GET | `/api/events/upcoming` | Upcoming events |
| GET | `/api/events/past` | Past/completed events |
| GET | `/api/events/{id}` | Single event detail |

### Admin (JWT required — `Authorization: Bearer <token>`)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/login` | Admin login |
| POST/PUT/DELETE | `/api/events/**` | Manage events |
| GET/POST/PUT/DELETE | `/api/members/**` | Manage members |
| GET/POST | `/api/attendance/**` | Attendance tracking |
| GET/POST | `/api/rsvp/**` | RSVP management |

---

## Member Types

| Type | Count | Description |
|------|-------|-------------|
| `EXECUTIVE` | 13 | Executive team members |
| `COLLEGE_REP` | 8 | College representatives |
| `GENERAL` | 50 | General members |

---

## Event Types

- `WORKSHOP` — Hands-on sessions
- `WEBINAR` — Online presentations
- `HACKATHON` — Coding competitions
- `COMPETITION` — Other competitions
- `MENTORSHIP_SESSION` — 1:1 or group mentorship

---

## Participation Gate Logic

1. Admin creates an event
2. Admin tracks RSVPs for each member (Confirmed / Declined / Maybe)
3. RSVP page shows a banner: **"X / 71 members confirmed. Waiting for Y more before opening to outside students"**
4. Once all members RSVP, the banner turns green: **"All members confirmed — outer students can now register!"**
5. After the event, admin marks attendance (Present / Absent / Excused) for each member
6. Attendance summary shows % rate per event

---

## Production Checklist

- [ ] Change `jwt.secret` to a long random string
- [ ] Set strong database password
- [ ] Change `spring.jpa.hibernate.ddl-auto` from `update` to `validate`
- [ ] Update CORS allowed origins from `localhost:3000` to your domain
- [ ] Build frontend: `npm run build` and serve via Nginx
- [ ] Run backend as a systemd service or Docker container
