# Netflix Clone Backend - Setup Guide

## Quick Start Windows Setup

### 1. Install PostgreSQL
```powershell
# If you have Chocolatey installed
choco install postgresql

# Or download from https://www.postgresql.org/download/windows/
```

### 2. Create Database
```powershell
# Open PowerShell as Administrator
psql -U postgres

# Then in psql console:
CREATE DATABASE netflix_clone;
\q
```

### 3. Build and Run Backend
```powershell
cd backend

# Clean install dependencies
mvn clean install

# Start the application
mvn spring-boot:run
```

The backend API will be available at: **http://localhost:8080/api**

### 4. Test the API
```powershell
# Get all movies
curl http://localhost:8080/api/movies

# Test signup
curl -X POST http://localhost:8080/api/auth/signup `
  -H "Content-Type: application/json" `
  -d '{
    "email": "test@example.com",
    "fullName": "Test User",
    "password": "password123"
  }'
```

## Environment Setup

### Java Check
```powershell
java -version
# Should show Java 17 or higher
```

### Maven Check
```powershell
mvn -version
# Should show Maven 3.8.0 or higher
```

### PostgreSQL Check
```powershell
psql --version
```

## Database Default Credentials

```
Host: localhost
Port: 5432
Database: netflix_clone
Username: postgres
Password: postgres
```

⚠️ **Important**: Change these credentials in production!

## Integration with Frontend

After the backend is running, update your React frontend API calls:

```javascript
// .env or config file
VITE_API_URL=http://localhost:8080/api

// API calls
fetch(`${import.meta.env.VITE_API_URL}/movies`)
fetch(`${import.meta.env.VITE_API_URL}/auth/login`, { method: 'POST', body: JSON.stringify(credentials) })
```

## Useful Commands

```powershell
# View all movies (should return empty array initially)
curl http://localhost:8080/api/movies

# Create a new movie (after database is set up)
curl -X POST http://localhost:8080/api/movies `
  -H "Content-Type: application/json" `
  -d @movies.json
```

## Next Steps

1. ✅ Backend running on port 8080
2. ✅ PostgreSQL database connected
3. 🔄 Update frontend to call backend API
4. 🔄 Populate initial movie data
5. 🔄 Test authentication flow

## Common Issues

| Issue | Solution |
|-------|----------|
| Port 8080 already in use | Change `server.port` in `application.properties` |
| Database connection refused | Start PostgreSQL service: `net start postgresql-x64-15` |
| CORS errors | Ensure frontend origin is in `cors.allowed-origins` |
| JWT token expired | Token valid for 24 hours, user needs to login again |

---

**Frontend URL**: http://localhost:5173 (Vite default)  
**Backend URL**: http://localhost:8080/api  
**Database**: PostgreSQL on localhost:5432
