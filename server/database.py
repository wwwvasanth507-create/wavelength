import os
import hashlib
import json
import uuid

DATABASE_URL = os.getenv("DATABASE_URL", "")
DATABASE_PATH = os.getenv("DATABASE_PATH", os.path.join(os.path.dirname(__file__), "..", "wavelength.db"))
UPLOADS_DIR = os.getenv("UPLOADS_PATH", os.path.join(os.path.dirname(__file__), "..", "uploads"))

IS_POSTGRES = DATABASE_URL.startswith("postgres://") or DATABASE_URL.startswith("postgresql://")

if IS_POSTGRES:
    import psycopg2
    from psycopg2.extras import RealDictCursor
else:
    import sqlite3

def get_db():
    if IS_POSTGRES:
        # Fix Render postgres:// URL format for psycopg2 if needed
        url = DATABASE_URL.replace("postgres://", "postgresql://", 1)
        conn = psycopg2.connect(url, cursor_factory=RealDictCursor)
        return conn
    else:
        conn = sqlite3.connect(DATABASE_PATH)
        conn.row_factory = sqlite3.Row
        return conn

def execute_query(cursor, sql: str, params: tuple = ()):
    if IS_POSTGRES:
        # Convert SQLite ? placeholders to PostgreSQL %s
        sql = sql.replace("?", "%s")
        cursor.execute(sql, params)
    else:
        cursor.execute(sql, params)

def hash_password(password: str) -> str:
    salt = "wavelength_secure_salt_2026"
    return hashlib.sha256((password + salt).encode("utf-8")).hexdigest()

def verify_password(password: str, password_hash: str) -> bool:
    return hash_password(password) == password_hash

def init_db():
    os.makedirs(os.path.dirname(os.path.abspath(DATABASE_PATH)), exist_ok=True)
    os.makedirs(os.path.join(UPLOADS_DIR, "audio"), exist_ok=True)
    os.makedirs(os.path.join(UPLOADS_DIR, "covers"), exist_ok=True)

    conn = get_db()
    cursor = conn.cursor()

    # Create Users table
    execute_query(cursor, """
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # Create Songs table
    execute_query(cursor, """
    CREATE TABLE IF NOT EXISTS songs (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        artist TEXT NOT NULL,
        album TEXT,
        genre TEXT,
        duration TEXT,
        cover_url TEXT NOT NULL,
        audio_url TEXT NOT NULL,
        color TEXT DEFAULT '#18E29A',
        lyrics TEXT,
        year INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # Create Playlists table
    execute_query(cursor, """
    CREATE TABLE IF NOT EXISTS playlists (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        cover_url TEXT,
        is_private INTEGER DEFAULT 0,
        is_collab INTEGER DEFAULT 0,
        user_id TEXT,
        song_ids TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)
    conn.commit()

    # Seed Default Admin Account
    execute_query(cursor, "SELECT * FROM users WHERE username = ?", ("admin",))
    admin_user = cursor.fetchone()
    if not admin_user:
        admin_id = "user-admin-default"
        admin_pass_hash = hash_password("admin123")
        execute_query(
            cursor,
            "INSERT INTO users (id, username, password_hash, role) VALUES (?, ?, ?, ?)",
            (admin_id, "admin", admin_pass_hash, "admin")
        )
        conn.commit()

    # Seed Default Catalog Songs if table is empty
    execute_query(cursor, "SELECT COUNT(*) as cnt FROM songs")
    count_row = cursor.fetchone()
    count = count_row["cnt"] if count_row else 0
    if count == 0:
        seed_songs = [
            {
                "id": "s45",
                "title": "The Life Of Ram",
                "artist": "Govind Vasantha, Pradeep Kumar",
                "album": "96 Tamil",
                "duration": "05:54",
                "audio_url": "https://www.masstamilan.dev/downloader/c3CUSsgzHltwU3BE_Uv4YA/1785524206/d128_cdn/16960/MjQwMTo0OTAwOjYzMzU6MTdiZTo0NWRiOjQ4MzE6NDdjNjo0NDk=",
                "cover_url": "https://imgs.search.brave.com/nPOjDpLAi7ThZ8-QVhDA0Rk3PEu6DtmqmODmhlBPuL0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzL2NlLzE3/L2QwL2NlMTdkMGM5/Y2E0MmMzZGQ2YzJl/MmRiZDdlNDcwNGIw/LmpwZw",
                "genre": "Melody",
                "year": 2018,
                "color": "#5b5058"
            },
            {
                "id": "s46",
                "title": "Vasantha Kaalangal",
                "artist": "Chinmayi Sripaada, Govind Vasantha",
                "album": "96 Tamil",
                "duration": "04:56",
                "audio_url": "https://www.masstamilan.dev/downloader/c3CUSsgzHltwU3BE_Uv4YA/1785524206/d128_cdn/16961/MjQwMTo0OTAwOjYzMzU6MTdiZTo0NWRiOjQ4MzE6NDdjNjo0NDk=",
                "cover_url": "https://imgs.search.brave.com/kUyN0iXAr6Plk_qixox7jJxZZ5U3Qa228WeaMt_-p3Q/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJjYXZlLmNv/bS93cC93cDQ1MDAz/OTcuanBn",
                "genre": "Melody",
                "year": 2018,
                "color": "#5b5058"
            },
            {
                "id": "s47",
                "title": "Yean",
                "artist": "Govind Vasantha, Gowri TP",
                "album": "96 Tamil",
                "duration": "02:24",
                "audio_url": "https://www.masstamilan.dev/downloader/c3CUSsgzHltwU3BE_Uv4YA/1785524206/d128_cdn/16962/MjQwMTo0OTAwOjYzMzU6MTdiZTo0NWRiOjQ4MzE6NDdjNjo0NDk=",
                "cover_url": "https://imgs.search.brave.com/nPOjDpLAi7ThZ8-QVhDA0Rk3PEu6DtmqmODmhlBPuL0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzL2NlLzE3/L2QwL2NlMTdkMGM5/Y2E0MmMzZGQ2YzJl/MmRiZDdlNDcwNGIw/LmpwZw",
                "genre": "Melody",
                "year": 2018,
                "color": "#5b5058"
            },
            {
                "id": "s18",
                "title": "Kadhal Oru Aagayam",
                "artist": "Teejay, Al Rufian",
                "album": "Imaikkaa Nodigal Tamil",
                "duration": "02:41",
                "audio_url": "https://www.masstamilan.dev/downloader/DqVdU7XshJlFZwyx_CHZCw/1785523392/d128_cdn/16758/MjQwMTo0OTAwOjYzMzU6MTdiZTo0NWRiOjQ4MzE6NDdjNjo0NDk=",
                "cover_url": "https://imgs.search.brave.com/rpQUKP8QCO4xaulWOLDW6ZlxZO6C7Tyed0tEvam-PnU/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuZmlsbWliZWF0/LmNvbS9pbWcvcG9w/Y29ybi9mYW5faW1h/Z2VzL21vdmllLzE1/NDUxL2ltYWlra2Fh/LW5vZGlnYWwtcGhv/dG9zLWltYWdlcy02/MTk4NS5qcGc",
                "genre": "Romance",
                "year": 2018,
                "color": "#8b5cf6"
            },
            {
                "id": "s19",
                "title": "Kadhalikathey",
                "artist": "Hiphop Tamizha, Kaushik Krish",
                "album": "Imaikkaa Nodigal Tamil",
                "duration": "03:22",
                "audio_url": "https://www.masstamilan.dev/downloader/DqVdU7XshJlFZwyx_CHZCw/1785523392/d128_cdn/16762/MjQwMTo0OTAwOjYzMzU6MTdiZTo0NWRiOjQ4MzE6NDdjNjo0NDk=",
                "cover_url": "https://imgs.search.brave.com/rpQUKP8QCO4xaulWOLDW6ZlxZO6C7Tyed0tEvam-PnU/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuZmlsbWliZWF0/LmNvbS9pbWcvcG9w/Y29ybi9mYW5faW1h/Z2VzL21vdmllLzE1/NDUxL2ltYWlra2Fh/LW5vZGlnYWwtcGhv/dG9zLWltYWdlcy02/MTk4NS5qcGc",
                "genre": "Pop",
                "year": 2018,
                "color": "#8b5cf6"
            },
            {
                "id": "s1",
                "title": "Raavana Mavandaa song tamil",
                "artist": "Anirudh Ravichander",
                "album": "Jana Nayagan Tamil",
                "duration": "01:47",
                "audio_url": "https://www.masstamilan.dev/downloader/Ed4Kr5baKkPOskZC1LPnUA/1785521417/d320_cdn/42769/MjAwMTo0ODYwOjc6NTA1OjpkOA==",
                "cover_url": "https://cdn.phototourl.com/free/2026-07-27-561cfcff-d7b7-4f0c-af83-ab164dd93037.jpg",
                "genre": "Folk Beat",
                "year": 2026,
                "color": "#8b5cf6"
            }
        ]

        for s in seed_songs:
            execute_query(
                cursor,
                """INSERT INTO songs (id, title, artist, album, genre, duration, cover_url, audio_url, color, year)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                (s["id"], s["title"], s["artist"], s.get("album"), s.get("genre"), s.get("duration"), s["cover_url"], s["audio_url"], s.get("color", "#18E29A"), s.get("year", 2026))
            )
        conn.commit()

    conn.close()
