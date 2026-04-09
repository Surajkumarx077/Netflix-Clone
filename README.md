# Netflix Clone

Full-stack Netflix-style application using React (frontend), Spring Boot (backend), and PostgreSQL (database).

## Homepage Screenshot

<p align="center">
  <img src="docs/images/homepage.png" alt="Netflix Clone Homepage" width="100%" />
</p>

## What Is Included

- Frontend: React + Vite
- Backend: Spring Boot 3
- Database: PostgreSQL 15
- DevOps: Docker Compose setup for full local run

## Recommended Way To Run (Docker)

This project is ready to run even if PostgreSQL and Maven are not installed on your machine.

### 1. Prerequisites

- Docker Desktop installed and running

### 2. Open project folder

```powershell
cd C:\Users\kumar\OneDrive\Desktop\Netflix
```

### 3. Build and start all services

```powershell
docker compose -f devops/docker-compose.yml up -d --build
```

### 4. Check service status

```powershell
docker compose -f devops/docker-compose.yml ps
```

You should see:
- `netflix_postgres` up and healthy
- `netflix_backend` up
- `netflix_frontend` up

### 5. Open the app

- Frontend: http://localhost
- Backend API: http://localhost:8080/api
- Sample API test: http://localhost:8080/api/movies

### 6. View logs when needed

```powershell
docker compose -f devops/docker-compose.yml logs --tail=200
docker compose -f devops/docker-compose.yml logs backend --tail=200
docker compose -f devops/docker-compose.yml logs frontend --tail=200
docker compose -f devops/docker-compose.yml logs postgres --tail=200
```

### 7. Stop services

```powershell
docker compose -f devops/docker-compose.yml down
```

### 8. Stop and remove DB volume (fresh reset)

```powershell
docker compose -f devops/docker-compose.yml down -v
```

## Local Run Without Docker (Optional)

Use this only if you have Java 17+, Maven, Node.js, and PostgreSQL installed locally.

### 1. Backend

```powershell
cd backend
mvn spring-boot:run
```

### 2. Frontend

Open a new terminal:

```powershell
cd frontend
npm install
npm run dev
```

### 3. Open frontend

- http://localhost:5173

## Project Structure

```text
Netflix/
  backend/
  frontend/
  devops/
  README.md
```

## Upload To GitHub (Step-by-Step)

Run these commands from the project root.

### 1. Initialize git (if not already initialized)

```powershell
git init
```

### 2. Add remote repository

```powershell
git remote add origin <your-github-repo-url>
```

### 3. Add files

```powershell
git add .
```

### 4. Commit

```powershell
git commit -m "Initial commit: Netflix clone full-stack project"
```

### 5. Push to GitHub

```powershell
git branch -M main
git push -u origin main
```

## Notes

- Generated/local files are excluded by `.gitignore`.
- This repository is now prepared for GitHub upload and Docker-first execution.
