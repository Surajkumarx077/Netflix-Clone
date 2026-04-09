# Netflix Clone Backend

A Spring Boot backend service for the Netflix Clone application with PostgreSQL database integration.

## Prerequisites

- Java 17 or higher
- Maven 3.8.0 or higher
- PostgreSQL 12 or higher
- Git

## Database Setup

### 1. Install PostgreSQL
- Download and install PostgreSQL from [postgresql.org](https://www.postgresql.org/download/)

### 2. Create Database
```sql
-- Open PostgreSQL console (psql)
CREATE DATABASE netflix_clone;
```

### 3. Default Credentials (Update in production)
```
Database: netflix_clone
Username: postgres
Password: postgres
```

## Project Structure

```
backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/netflix/clone/
│   │   │       ├── NetflixCloneApplication.java    # Main application
│   │   │       ├── entity/                          # JPA entities
│   │   │       ├── repository/                      # Data access layer
│   │   │       ├── service/                         # Business logic
│   │   │       ├── controller/                      # REST endpoints
│   │   │       ├── dto/                             # Data transfer objects
│   │   │       ├── config/                          # Configuration classes
│   │   │       └── security/                        # Security classes
│   │   └── resources/
│   │       └── application.properties               # Configuration
│   └── test/
└── pom.xml                                          # Maven dependencies
```

## Installation & Running

### 1. Clone the Repository
```bash
cd backend
```

### 2. Build the Project
```bash
mvn clean install
```

### 3. Run the Application
```bash
mvn spring-boot:run
```

The backend will start on `http://localhost:8080/api`

## API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/signup` - User registration

### Movies
- `GET /movies` - Get all movies
- `GET /movies/{id}` - Get movie by ID
- `GET /movies/trending/all` - Get trending movies
- `GET /movies/genre/{genre}` - Get movies by genre
- `POST /movies` - Create new movie (Admin only)
- `PUT /movies/{id}` - Update movie (Admin only)
- `DELETE /movies/{id}` - Delete movie (Admin only)

### Watchlist
- `GET /watchlist/{userId}` - Get user watchlist
- `POST /watchlist/{userId}/add/{movieId}` - Add movie to watchlist
- `DELETE /watchlist/{userId}/remove/{movieId}` - Remove movie from watchlist

## Configuration

Edit `src/main/resources/application.properties` to customize:

```properties
# Server Port
server.port=8080

# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/netflix_clone
spring.datasource.username=postgres
spring.datasource.password=postgres

# JWT Configuration
jwt.secret=your_secret_key
jwt.expiration=86400000

# CORS Configuration
cors.allowed-origins=http://localhost:5173
```

## Frontend Integration

The frontend should connect to the backend API at `http://localhost:8080/api`

Example API call from React:
```javascript
// Login
const response = await fetch('http://localhost:8080/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'user@example.com', password: 'password' })
});

// Get all movies
const movies = await fetch('http://localhost:8080/api/movies');
```

## Database Schema

### Users Table
- id (Primary Key)
- email (Unique)
- fullName
- password (Hashed)
- role (USER/ADMIN)
- active (Boolean)
- createdAt
- updatedAt

### Movies Table
- id (Primary Key)
- title (Unique)
- description
- posterPath
- backdropPath
- videoUrl
- rating
- releaseDate
- isTrending (Boolean)
- genres (Collection)
- createdAt
- updatedAt

### Watchlist Table
- id (Primary Key)
- userId (Foreign Key)
- movieId (Foreign Key)
- addedAt

## Development

### Hot Reload
The project includes Spring Boot DevTools, so changes to source files will automatically reload.

### Testing
```bash
mvn test
```

## Production Deployment

Before deploying to production:

1. Change JWT secret in `application.properties`
2. Update database credentials
3. Set appropriate CORS origins
4. Enable HTTPS
5. Use environment variables for sensitive data

```bash
# Build JAR
mvn clean package

# Run JAR
java -jar target/netflix-clone-backend-1.0.0.jar
```

## Troubleshooting

### Database Connection Error
- Ensure PostgreSQL is running
- Check database credentials in `application.properties`
- Verify database exists: `CREATE DATABASE netflix_clone;`

### Port Already in Use
- Change `server.port` in `application.properties`

### CORS Issues
- Update `cors.allowed-origins` to include your frontend URL

## License

This project is part of the Netflix Clone demonstration.

## Support

For issues or questions, please contact the development team.
