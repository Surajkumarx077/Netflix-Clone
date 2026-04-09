# Quick Reference Guide - Netflix Clone

## 🚀 Quick Start (5 minutes)

### Prerequisites Check
```powershell
node --version     # v16+
npm --version      # 7+
java -version      # 17+
mvn -version       # 3.8+
psql --version     # 12+
```

### 1️⃣ Start PostgreSQL
```bash
# Windows (if installed)
net start postgresql-x64-15

# Mac
brew services start postgresql@15

# Linux
sudo systemctl start postgresql

# Verify
psql -U postgres -d netflix_clone -c "SELECT 1;"
```

### 2️⃣ Start Backend (Terminal 1)
```bash
cd backend
mvn clean install          # First time only (takes 2-3 min)
mvn spring-boot:run        # Runs on http://localhost:8080/api
```

### 3️⃣ Start Frontend (Terminal 2)
```bash
cd frontend
npm install                # First time only
npm run dev               # Runs on http://localhost:5173
```

### 4️⃣ Open in Browser
- Opens automatically or visit: **http://localhost:5173**

---

## 📁 Project Structure

```
Netflix/
├── frontend/              # React Vite app
│   ├── src/
│   │   ├── pages/        # Home, Login, Watchlist, etc
│   │   ├── components/   # MovieCard, Navbar, etc
│   │   ├── api/          # apiClient.js (backend calls)
│   │   └── services/     # userService.js (auth state)
│   ├── .env              # API config
│   └── package.json
└── backend/              # Spring Boot app
    ├── src/main/java/com/netflix/clone/
    │   ├── entity/       # User, Movie, Watchlist
    │   ├── repository/   # Database queries
    │   ├── service/      # Business logic
    │   ├── controller/   # REST endpoints
    │   └── config/       # Security, CORS, etc
    ├── application.properties  # DB settings
    └── pom.xml
```

---

## 🔌 API Endpoints

### Movies
```
GET    /api/movies                  # All movies
GET    /api/movies/{id}             # Single movie
GET    /api/movies/trending/all     # Trending
GET    /api/movies/genre/{genre}    # By genre
POST   /api/movies                  # Create (auth required)
PUT    /api/movies/{id}             # Update (auth required)
DELETE /api/movies/{id}             # Delete (auth required)
```

### Authentication
```
POST   /api/auth/signup             # Register
POST   /api/auth/login              # Login
```

### Watchlist
```
GET    /api/watchlist/{userId}      # Get watchlist
POST   /api/watchlist/{userId}/add/{movieId}       # Add movie
DELETE /api/watchlist/{userId}/remove/{movieId}    # Remove movie
```

---

## 🗄️ Database Credentials

```
Host:     localhost
Port:     5432
Database: netflix_clone
User:     postgres
Password: postgres
```

⚠️ Change in production!

---

## 🔐 Authentication Flow

```
1. User Signup/Login → /auth/endpoint
2. Backend returns JWT Token + User Data
3. Frontend stores in localStorage
4. All requests include: Authorization: Bearer {token}
5. Backend validates token in JwtAuthenticationFilter
```

---

## 🐛 Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| **psql: command not found** | PostgreSQL not installed or not in PATH |
| **FATAL: database "netflix_clone" does not exist** | Run: `psql -U postgres -c "CREATE DATABASE netflix_clone;"` |
| **Port 8080 already in use** | Change `server.port` in `application.properties` or kill process |
| **Port 5173 already in use** | Run: `npm run dev -- --port 3000` |
| **API returns 401 Unauthorized** | Token expired → need to login again |
| **404 Not Found on movies** | Backend not running or database empty |
| **CORS errors in console** | Check `cors.allowed-origins` in `application.properties` |

---

## 📝 Sample Data

Insert sample movies into database:

```bash
# Option 1: Using SQL file
psql -U postgres -d netflix_clone -f backend/data.sql

# Option 2: Using API (if backend running)
curl -X POST http://localhost:8080/api/movies \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Movie Title",
    "description": "Description",
    "posterPath": "https://...",
    "backdropPath": "https://...",
    "videoUrl": "https://...",
    "rating": 8.5,
    "isTrending": true,
    "genres": ["Action", "Sci-Fi"]
  }'
```

---

## 🔍 Testing APIs

### Using curl (PowerShell)

```powershell
# Get all movies
curl http://localhost:8080/api/movies

# Signup
curl -X POST http://localhost:8080/api/auth/signup `
  -H "Content-Type: application/json" `
  -d '{
    "email": "test@example.com",
    "fullName": "Test User",
    "password": "password123"
  }'

# Login
curl -X POST http://localhost:8080/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

---

## 🚢 Build for Production

### Backend JAR
```bash
cd backend
mvn clean package

# Run JAR
java -jar target/netflix-clone-backend-1.0.0.jar
```

### Frontend Build
```bash
cd frontend
npm run build

# dist/ folder ready for deployment
```

---

## 📚 File Reference

| File | Purpose |
|------|---------|
| `frontend/src/api/apiClient.js` | All API calls to backend |
| `frontend/src/services/userService.js` | Auth state management |
| `frontend/.env` | API configuration |
| `backend/application.properties` | Database & JWT config |
| `backend/src/main/java/.../entity/` | Database models |
| `backend/src/main/java/.../controller/` | REST API endpoints |
| `backend/data.sql` | Sample data |

---

## 🔧 Configuration

### Backend Database (application.properties)
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/netflix_clone
spring.datasource.username=postgres
spring.datasource.password=postgres
jwt.secret=your_secret_key
jwt.expiration=86400000
```

### Frontend API (.env)
```
VITE_API_URL=http://localhost:8080/api
```

---

## ✅ Checklist

- [ ] PostgreSQL installed and running
- [ ] Backend builds successfully (`mvn clean install`)
- [ ] Backend starts (`mvn spring-boot:run`)
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Frontend starts (`npm run dev`)
- [ ] Can access http://localhost:5173
- [ ] API call works: `curl http://localhost:8080/api/movies`
- [ ] Can signup/login in frontend
- [ ] Can view/add movies to watchlist

---

## 🆘 Help

1. Check console logs for errors
2. See `SETUP.md` for detailed setup
3. See `backend/README.md` for backend details
4. Check `backend/SETUP.md` for backend-specific setup
5. Enable debug logging in `application.properties`

---

## 📞 Stack Overview

- **Frontend**: React 19 + Vite + React Router
- **Backend**: Spring Boot 3.2 + Spring Data JPA
- **Database**: PostgreSQL 15
- **Security**: JWT + BCrypt
- **API Style**: REST with CORS enabled
- **Data Format**: JSON

---

**Version**: 1.0.0  
**Last Updated**: April 2026  
**Status**: Ready for Development
