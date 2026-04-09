-- Self-contained schema + seed data for containerized startup

-- Core tables expected by the Spring Boot app
CREATE TABLE IF NOT EXISTS users (
	id BIGSERIAL PRIMARY KEY,
	email VARCHAR(255) NOT NULL UNIQUE,
	full_name VARCHAR(255) NOT NULL,
	password VARCHAR(255) NOT NULL,
	role VARCHAR(50) NOT NULL,
	active BOOLEAN NOT NULL DEFAULT TRUE,
	created_at TIMESTAMP NOT NULL,
	updated_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS movies (
	id BIGSERIAL PRIMARY KEY,
	title VARCHAR(255) NOT NULL UNIQUE,
	description TEXT,
	poster_path VARCHAR(1000),
	backdrop_path VARCHAR(1000),
	video_url VARCHAR(1000),
	rating DOUBLE PRECISION NOT NULL DEFAULT 0.0,
	release_date VARCHAR(50),
	is_trending BOOLEAN DEFAULT FALSE,
	created_at TIMESTAMP NOT NULL,
	updated_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS movie_genres (
	movie_id BIGINT NOT NULL,
	genre VARCHAR(255),
	CONSTRAINT fk_movie_genres_movie FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS watchlist (
	id BIGSERIAL PRIMARY KEY,
	user_id BIGINT NOT NULL,
	movie_id BIGINT NOT NULL,
	added_at TIMESTAMP NOT NULL,
	CONSTRAINT fk_watchlist_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
	CONSTRAINT fk_watchlist_movie FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
	CONSTRAINT uq_watchlist_user_movie UNIQUE (user_id, movie_id)
);

-- Insert sample movies
INSERT INTO movies (title, description, poster_path, backdrop_path, video_url, rating, release_date, is_trending, created_at, updated_at)
VALUES 
('Cyberpunk 2077: Edgerunners', 'In a dystopia riddled with corruption and cybernetic implants, a talented but reckless street kid strives to become a mercenary outlaw.', 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=1000&auto=format&fit=crop', 'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=2070&auto=format&fit=crop', 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 8.4, '2022-09-13', true, NOW(), NOW()),
('The Outer Silence', 'A crew of astronauts exploring the edge of the solar system discover an anomaly that challenges their understanding of reality.', 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop', 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 7.8, '2023-02-10', true, NOW(), NOW()),
('Neon Nights', 'A detective with a dark past navigates the neon-soaked streets of a futuristic city trying to solve a high-profile murder.', 'https://images.unsplash.com/photo-1563240619-44ce02dbe500?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=2070&auto=format&fit=crop', 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 7.5, '2022-11-20', false, NOW(), NOW()),
('Wild Frontiers', 'A lone rider must protect a remote settlement from a ruthless gang of outlaws in the harsh desert.', 'https://images.unsplash.com/photo-1601675765793-68d76d498144?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1549479668-3e3e2b2fb41c?q=80&w=2070&auto=format&fit=crop', 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 8.1, '2023-05-15', true, NOW(), NOW()),
('Echoes of the Past', 'A historian discovers a hidden diary that holds the key to an ancient kingdom.', 'https://images.unsplash.com/photo-1505664125540-c3d59bc4c0ce?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=2074&auto=format&fit=crop', 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 7.2, '2023-03-22', false, NOW(), NOW()),
('Velocity', 'An underground street racer gets caught in a heist gone wrong.', 'https://images.unsplash.com/photo-1533090161392-a8ca1ffd48c4?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1489599849228-eb342a5e5524?q=80&w=2070&auto=format&fit=crop', 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 8.0, '2023-06-10', true, NOW(), NOW())
ON CONFLICT (title) DO NOTHING;

-- Insert genres for movies using title lookup (id-safe)
INSERT INTO movie_genres (movie_id, genre)
SELECT m.id, g.genre
FROM (
	VALUES
		('Cyberpunk 2077: Edgerunners', 'Action'),
		('Cyberpunk 2077: Edgerunners', 'Sci-Fi'),
		('Cyberpunk 2077: Edgerunners', 'Anime'),
		('The Outer Silence', 'Thriller'),
		('The Outer Silence', 'Sci-Fi'),
		('Neon Nights', 'Action'),
		('Neon Nights', 'Mystery'),
		('Wild Frontiers', 'Western'),
		('Wild Frontiers', 'Action'),
		('Echoes of the Past', 'Drama'),
		('Echoes of the Past', 'History'),
		('Velocity', 'Action'),
		('Velocity', 'Thriller')
) AS g(title, genre)
JOIN movies m ON m.title = g.title
WHERE NOT EXISTS (
	SELECT 1 FROM movie_genres mg WHERE mg.movie_id = m.id AND mg.genre = g.genre
);

-- Insert sample user (optional - can be created through API)
-- Password: password123 (hashed with BCrypt)
INSERT INTO users (email, full_name, password, role, active, created_at, updated_at)
VALUES ('admin@netflix.com', 'Admin User', '$2a$10$slYQmyNdGzin7olVN3yH2OPST9/PgBkqquzi.Ss7KIUgO2t0jWMUm', 'ADMIN', true, NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Note: Password above is BCrypt hash of "password123"
-- For new users, use the signup endpoint to create accounts
