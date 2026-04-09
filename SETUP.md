# Netflix Clone - Full Setup Guide

Complete guide to set up and run the Netflix Clone application (Frontend + Backend + Database).

## Project Structure

```
Netflix/
├── frontend/                  # React + Vite frontend
│   ├── src/
│   ├── package.json
│   ├── vite.config.js
│   └── .env                   # API configuration
└── backend/                   # Spring Boot backend
    ├── src/
    ├── pom.xml
    ├── application.properties  # Database configuration
    └── SETUP.md               # Backend setup details
```

## Prerequisites

- **Node.js**: v16+ ([Download](https://nodejs.org/))
- **Java**: 17+ ([Download](https://www.oracle.com/java/technologies/downloads/#java17))
- **Maven**: 3.8.0+ ([Download](https://maven.apache.org/))
- **PostgreSQL**: 12+ ([Download](https://www.postgresql.org/download/))
- **Git** ([Download](https://git-scm.com/))

### Verify Installations

```bash
node --version        # v16.0.0 or higher
npm --version         # 7.0.0 or higher
java -version         # 17 or higher
mvn -version          # 3.8.0 or higher
psql --version        # 12 or higher
```

## Step 1: PostgreSQL Setup

### Windows

1. **Install PostgreSQL**
   - Download from https://www.postgresql.org/download/windows/
   - During installation, note the password you set for `postgres` user
   - Default port: 5432

2. **Create Database**
   ```powershell
   # Open PowerShell and connect to PostgreSQL
   psql -U postgres
   
   # In psql console:
   CREATE DATABASE netflix_clone;
   \q
   ```

3. **Verify Connection**
   ```powershell
   psql -U postgres -d netflix_clone -c "SELECT 1;"
   ```

### Mac

```bash
# Using Homebrew
brew install postgresql@15

# Start PostgreSQL service
brew services start postgresql@15

# Create database
createdb netflix_clone
```

### Linux (Ubuntu/Debian)

```bash
# Install PostgreSQL
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib

# Start service
sudo systemctl start postgresql

# Create database
sudo -u postgres createdb netflix_clone
```

---

## Step 2: Backend Setup & Run

### 1. Navigate to Backend

```bash
cd backend
```

### 2. Configure Database (if needed)

Edit `src/main/resources/application.properties`:

```properties
# PostgreSQL Connection
spring.datasource.url=jdbc:postgresql://localhost:5432/netflix_clone
spring.datasource.username=postgres
spring.datasource.password=postgres  # Change to your password
```

### 3. Build Backend

```bash
mvn clean install
```

**First-time build takes 2-3 minutes** (downloading dependencies)

### 4. Seed Sample Data (Optional)

```bash
# Connect to database and import sample data
psql -U postgres -d netflix_clone -f data.sql
```

### 5. Start Backend Server

```bash
mvn spring-boot:run
```

**Output will show:**
```
Started NetflixCloneApplication in X.XXX seconds
```

✅ Backend is now running on: **http://localhost:8080/api**

### Test Backend

```powershell
# Test in new terminal/PowerShell
curl http://localhost:8080/api/movies

# Should return: []  (empty array if no data inserted)
```

---

## Step 3: Frontend Setup & Run

### 1. Navigate to Frontend

```bash
cd ../frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure API URL

The `.env` file should already have:
```
VITE_API_URL=http://localhost:8080/api
```

If not, update or create `.env`:
```bash
echo "VITE_API_URL=http://localhost:8080/api" > .env
```

### 4. Start Development Server

```bash
npm run dev
```

**Output will show:**
```
VITE v4.x.x ready in XXX ms

-> Local: http://localhost:5173/
```

✅ Frontend is now running on: **http://localhost:5173**

---

## Step 4: Test the Application

### Open Frontend

1. Open browser: **http://localhost:5173**
2. You should see the Netflix Clone interface

### Test Features

#### 1. View Movies
- Home page should display movies
- If movies don't appear, seed data with: `psql -U postgres -d netflix_clone -f backend/data.sql`

#### 2. Create Account
- Click "Sign Up" 
- Enter email, name, password
- Account created and auto-logged in

#### 3. Login
- Click "Sign In"
- Use credentials from signup
- Token stored in localStorage

#### 4. Add to Watchlist
- Click **+** on any movie card
- Should be added to "My List"

#### 5. View Watchlist
- Navigate to "My List"
- See your saved movies

---

## Complete Workflow Summary

### Terminal 1: PostgreSQL (already running in background)
```bash
# Already running on localhost:5432
# Verify with:
psql -U postgres -d netflix_clone -c "SELECT COUNT(*) FROM movies;"
```

### Terminal 2: Backend
```bash
cd backend
mvn spring-boot:run
# Running on http://localhost:8080/api
```

### Terminal 3: Frontend
```bash
cd frontend
npm run dev
# Running on http://localhost:5173
```

### Terminal 4: Testing
```bash
# Get all movies
curl http://localhost:8080/api/movies

# Create user
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "fullName": "John Doe",
    "password": "password123"
  }'
```

---

## File Structure Reference

### Frontend
```
frontend/
├── src/
│   ├── api/
│   │   └── apiClient.js          # API calls to backend
│   ├── services/
│   │   └── userService.js        # User auth management
│   ├── components/               # Reusable components
│   ├── pages/                    # Page components
│   ├── App.jsx                   # Main app
│   └── main.jsx                  # Entry point
├── package.json
├── vite.config.js
└── .env                          # API configuration
```

### Backend
```
backend/
├── src/main/java/com/netflix/clone/
│   ├── entity/                   # Database models
│   ├── repository/               # Data access
│   ├── service/                  # Business logic
│   ├── controller/               # REST APIs
│   ├── dto/                      # Data objects
│   ├── config/                   # App configuration
│   └── security/                 # JWT & Auth
├── src/main/resources/
│   └── application.properties    # DB config
├── pom.xml                       # Dependencies
└── data.sql                      # Sample data
```

---

## API Endpoints

### Authentication
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/auth/login` | User login |
| POST | `/auth/signup` | User registration |

### Movies
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/movies` | Get all movies |
| GET | `/movies/{id}` | Get single movie |
| GET | `/movies/trending/all` | Get trending movies |
| GET | `/movies/genre/{genre}` | Filter by genre |
| POST | `/movies` | Create movie (Admin) |
| PUT | `/movies/{id}` | Update movie (Admin) |
| DELETE | `/movies/{id}` | Delete movie (Admin) |

### Watchlist
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/watchlist/{userId}` | Get user watchlist |
| POST | `/watchlist/{userId}/add/{movieId}` | Add movie |
| DELETE | `/watchlist/{userId}/remove/{movieId}` | Remove movie |

---

## Troubleshooting

### PostgreSQL Issues

```bash
# Check if PostgreSQL is running
# Windows
tasklist | findstr postgres

# Mac/Linux
ps aux | grep postgres

# Connection refused
# Windows: net start postgresql-x64-15
# Mac: brew services start postgresql@15
# Linux: sudo systemctl start postgresql
```

### Backend Issues

```bash
# Port 8080 already in use
# Kill process:
# Windows: taskkill /PID <process_id> /F
# Mac/Linux: kill -9 <process_id>

# Or change port in application.properties:
# server.port=8081
```

### Frontend Issues

```bash
# Port 5173 already in use
# Kill Vite process or change port:
# npm run dev -- --port 3000

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### CORS Errors

If you see CORS errors in browser console:
- Backend CORS is configured for `http://localhost:5173`
- If using different port, update in:
  - Backend: `src/main/resources/application.properties`
  - Backend: `src/main/java/com/netflix/clone/config/AppConfig.java`

### API Not Connecting

1. Ensure backend is running: `http://localhost:8080/api/movies`
2. Check `.env` has correct `VITE_API_URL`
3. Clear browser cache and reload
4. Check browser network tab for actual requests

---

## Database Backup & Restore

### Backup
```bash
pg_dump -U postgres netflix_clone > backup.sql
```

### Restore
```bash
psql -U postgres netflix_clone < backup.sql
```

---

## Production Deployment

### Backend (Docker)
```dockerfile
# Dockerfile
FROM openjdk:17-slim
COPY target/netflix-clone-backend-1.0.0.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### Frontend (Docker)
```dockerfile
# Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

### Environment Variables (Production)
```bash
# Backend
JWT_SECRET=your_production_secret
DB_URL=your_production_db_url
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# Frontend
VITE_API_URL=https://api.yourdomain.com
```

---

## Performance Tips

1. **Database Indexing**: Add indexes on frequently queried columns
2. **Caching**: Implement Redis for movie data caching
3. **Pagination**: Limit results per page
4. **Image Optimization**: Use CDN for posters/backdrops
5. **Lazy Loading**: Load movies on scroll

---

## Support & Help

- Backend README: `backend/README.md`
- Backend Setup: `backend/SETUP.md`
- Check logs in console for detailed error messages
- Enable debug logging in `application.properties`

---

## License

This project is part of Netflix Clone demonstration.

---

**Happy Streaming! 🎬**
