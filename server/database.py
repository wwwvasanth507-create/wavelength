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

    # Seed Default Catalog Songs if table is empty (0 default songs)
    conn.close()

