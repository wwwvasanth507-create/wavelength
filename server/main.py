import os
import shutil
import uuid
import json
from typing import Optional, List
from fastapi import FastAPI, HTTPException, Depends, Header, File, UploadFile, Form, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel
import jwt
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
try:
    from server.database import get_db, init_db, hash_password, verify_password, UPLOADS_DIR
except ModuleNotFoundError:
    from database import get_db, init_db, hash_password, verify_password, UPLOADS_DIR

SECRET_KEY = os.getenv("JWT_SECRET", "wavelength_jwt_secret_key_2026_super_secure")
ALGORITHM = "HS256"

# Initialize database tables & seed data
init_db()

app = FastAPI(title="Wavelength Audio Backend", version="1.0.0")

# Enable CORS for local development & cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure upload directories exist
os.makedirs(os.path.join(UPLOADS_DIR, "audio"), exist_ok=True)
os.makedirs(os.path.join(UPLOADS_DIR, "covers"), exist_ok=True)

# Mount uploaded media static files
app.mount("/uploads", StaticFiles(directory=UPLOADS_DIR), name="uploads")


# Pydantic Schemas
class RegisterSchema(BaseModel):
    username: str
    password: str

class LoginSchema(BaseModel):
    username: str
    password: str

class SongCreateURLSchema(BaseModel):
    title: str
    artist: str
    album: Optional[str] = None
    genre: Optional[str] = None
    duration: Optional[str] = "3:30"
    coverUrl: str
    audioUrl: str
    color: Optional[str] = "#18E29A"
    lyrics: Optional[str] = None
    year: Optional[int] = 2026


# Auth Helper Functions
def create_token(user_id: str, username: str, role: str) -> str:
    payload = {"sub": user_id, "username": username, "role": role}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authentication token missing")
    token = authorization.split(" ")[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

def require_admin(current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin privileges required")
    return current_user


# Authentication API Routes
@app.post("/api/auth/register")
def register(data: RegisterSchema):
    username = data.username.strip()
    password = data.password.strip()
    if not username or not password:
        raise HTTPException(status_code=400, detail="Username and password are required")

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE username = ?", (username,))
    if cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=400, detail="Username already exists")

    user_id = f"user-{uuid.uuid4().hex[:8]}"
    pass_hash = hash_password(password)
    role = "user"

    cursor.execute(
        "INSERT INTO users (id, username, password_hash, role) VALUES (?, ?, ?, ?)",
        (user_id, username, pass_hash, role)
    )
    conn.commit()
    conn.close()

    token = create_token(user_id, username, role)
    return {"token": token, "user": {"id": user_id, "username": username, "role": role}}


@app.post("/api/auth/login")
def login(data: LoginSchema):
    username = data.username.strip()
    password = data.password.strip()
    
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE username = ?", (username,))
    user = cursor.fetchone()
    conn.close()

    if not user or not verify_password(password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    token = create_token(user["id"], user["username"], user["role"])
    return {"token": token, "user": {"id": user["id"], "username": user["username"], "role": user["role"]}}


@app.get("/api/auth/me")
def get_me(user: dict = Depends(get_current_user)):
    return {"user": user}


# Songs API Routes
@app.get("/api/songs")
def list_songs():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM songs ORDER BY created_at DESC")
    rows = cursor.fetchall()
    conn.close()

    songs = []
    for r in rows:
        songs.append({
            "id": r["id"],
            "title": r["title"],
            "artist": r["artist"],
            "album": r["album"],
            "genre": r["genre"],
            "duration": r["duration"],
            "coverUrl": r["cover_url"],
            "audioUrl": r["audio_url"],
            "color": r["color"],
            "lyrics": r["lyrics"],
            "year": r["year"],
        })
    return {"songs": songs}


@app.post("/api/admin/songs")
async def create_song(
    request: Request,
    title: Optional[str] = Form(None),
    artist: Optional[str] = Form(None),
    album: Optional[str] = Form(None),
    genre: Optional[str] = Form(None),
    duration: Optional[str] = Form("3:30"),
    color: Optional[str] = Form("#18E29A"),
    lyrics: Optional[str] = Form(None),
    year: Optional[int] = Form(2026),
    audio_file: Optional[UploadFile] = File(None),
    cover_file: Optional[UploadFile] = File(None),
    audio_url: Optional[str] = Form(None),
    cover_url: Optional[str] = Form(None),
    admin: dict = Depends(require_admin)
):
    # Check if request is JSON body instead of multipart form
    if request.headers.get("content-type", "").startswith("application/json"):
        body = await request.json()
        title = body.get("title")
        artist = body.get("artist")
        album = body.get("album")
        genre = body.get("genre")
        duration = body.get("duration", "3:30")
        color = body.get("color", "#18E29A")
        lyrics = body.get("lyrics")
        year = body.get("year", 2026)
        audio_url = body.get("audioUrl")
        cover_url = body.get("coverUrl")

    if not title or not artist:
        raise HTTPException(status_code=400, detail="Song title and artist are required")

    song_id = f"song-{uuid.uuid4().hex[:8]}"

    # Handle Audio: File Upload or Direct URL
    final_audio_url = ""
    if audio_file and audio_file.filename:
        ext = os.path.splitext(audio_file.filename)[1] or ".mp3"
        filename = f"{song_id}{ext}"
        filepath = os.path.join(UPLOADS_DIR, "audio", filename)
        with open(filepath, "wb") as f:
            shutil.copyfileobj(audio_file.file, f)
        final_audio_url = f"/uploads/audio/{filename}"
    elif audio_url and audio_url.strip():
        final_audio_url = audio_url.strip()
    else:
        raise HTTPException(status_code=400, detail="Audio file or Audio URL is required")

    # Handle Cover Art: File Upload or Direct URL
    final_cover_url = ""
    if cover_file and cover_file.filename:
        ext = os.path.splitext(cover_file.filename)[1] or ".jpg"
        filename = f"{song_id}{ext}"
        filepath = os.path.join(UPLOADS_DIR, "covers", filename)
        with open(filepath, "wb") as f:
            shutil.copyfileobj(cover_file.file, f)
        final_cover_url = f"/uploads/covers/{filename}"
    elif cover_url and cover_url.strip():
        final_cover_url = cover_url.strip()
    else:
        # Default placeholder cover if none provided
        final_cover_url = "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80"

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        """INSERT INTO songs (id, title, artist, album, genre, duration, cover_url, audio_url, color, lyrics, year)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
        (song_id, title, artist, album, genre, duration, final_cover_url, final_audio_url, color, lyrics, year)
    )
    conn.commit()
    conn.close()

    return {
        "message": "Song uploaded successfully",
        "song": {
            "id": song_id,
            "title": title,
            "artist": artist,
            "album": album,
            "genre": genre,
            "duration": duration,
            "coverUrl": final_cover_url,
            "audioUrl": final_audio_url,
            "color": color,
            "lyrics": lyrics,
            "year": year,
        }
    }


@app.delete("/api/admin/songs/{song_id}")
def delete_song(song_id: str, admin: dict = Depends(require_admin)):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM songs WHERE id = ?", (song_id,))
    song = cursor.fetchone()
    if not song:
        conn.close()
        raise HTTPException(status_code=404, detail="Song not found")

    # If audio or cover were locally uploaded files, optionally delete them
    if song["audio_url"].startswith("/uploads/"):
        rel_path = song["audio_url"].replace("/uploads/", "")
        local_file = os.path.join(UPLOADS_DIR, rel_path)
        if os.path.exists(local_file):
            try: os.remove(local_file)
            except Exception: pass

    if song["cover_url"].startswith("/uploads/"):
        rel_path = song["cover_url"].replace("/uploads/", "")
        local_file = os.path.join(UPLOADS_DIR, rel_path)
        if os.path.exists(local_file):
            try: os.remove(local_file)
            except Exception: pass

    cursor.execute("DELETE FROM songs WHERE id = ?", (song_id,))
    conn.commit()
    conn.close()

    return {"message": "Song deleted successfully"}


# Playlists API Routes
@app.get("/api/playlists")
def list_playlists():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM playlists ORDER BY created_at DESC")
    rows = cursor.fetchall()
    conn.close()

    playlists = []
    for r in rows:
        song_ids_raw = r["song_ids"]
        song_ids = []
        if song_ids_raw:
            try:
                song_ids = json.loads(song_ids_raw)
            except Exception:
                song_ids = [s.strip() for s in song_ids_raw.split(",") if s.strip()]

        playlists.append({
            "id": r["id"],
            "name": r["name"],
            "description": r["description"] or "",
            "coverUrl": r["cover_url"] or "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80",
            "isPrivate": bool(r["is_private"]),
            "isCollaborative": bool(r["is_collab"]),
            "userId": r["user_id"] or "admin",
            "songIds": song_ids,
        })
    return {"playlists": playlists}


@app.post("/api/admin/playlists")
async def create_global_playlist(
    request: Request,
    name: Optional[str] = Form(None),
    description: Optional[str] = Form(""),
    cover_file: Optional[UploadFile] = File(None),
    cover_url: Optional[str] = Form(None),
    song_ids: Optional[str] = Form("[]"),
    is_private: Optional[int] = Form(0),
    is_collab: Optional[int] = Form(0),
    admin: dict = Depends(require_admin)
):
    if request.headers.get("content-type", "").startswith("application/json"):
        body = await request.json()
        name = body.get("name")
        description = body.get("description", "")
        cover_url = body.get("coverUrl")
        song_ids_val = body.get("songIds", [])
        song_ids = json.dumps(song_ids_val) if isinstance(song_ids_val, list) else str(song_ids_val)
        is_private = 1 if body.get("isPrivate") else 0
        is_collab = 1 if body.get("isCollaborative") else 0

    if not name or not name.strip():
        raise HTTPException(status_code=400, detail="Playlist name is required")

    playlist_id = f"playlist-{uuid.uuid4().hex[:8]}"

    final_cover_url = ""
    if cover_file and cover_file.filename:
        ext = os.path.splitext(cover_file.filename)[1] or ".jpg"
        filename = f"{playlist_id}{ext}"
        filepath = os.path.join(UPLOADS_DIR, "covers", filename)
        with open(filepath, "wb") as f:
            shutil.copyfileobj(cover_file.file, f)
        final_cover_url = f"/uploads/covers/{filename}"
    elif cover_url and cover_url.strip():
        final_cover_url = cover_url.strip()
    else:
        final_cover_url = "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80"

    parsed_song_ids = []
    if isinstance(song_ids, str):
        try:
            parsed_song_ids = json.loads(song_ids)
        except Exception:
            parsed_song_ids = [s.strip() for s in song_ids.split(",") if s.strip()]
    elif isinstance(song_ids, list):
        parsed_song_ids = song_ids

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        """INSERT INTO playlists (id, name, description, cover_url, is_private, is_collab, user_id, song_ids)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
        (playlist_id, name.strip(), description.strip(), final_cover_url, is_private, is_collab, "admin", json.dumps(parsed_song_ids))
    )
    conn.commit()
    conn.close()

    return {
        "message": "Global playlist created successfully",
        "playlist": {
            "id": playlist_id,
            "name": name.strip(),
            "description": description.strip(),
            "coverUrl": final_cover_url,
            "isPrivate": bool(is_private),
            "isCollaborative": bool(is_collab),
            "userId": "admin",
            "songIds": parsed_song_ids,
        }
    }


@app.put("/api/admin/playlists/{playlist_id}")
async def update_global_playlist(
    playlist_id: str,
    request: Request,
    name: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    cover_file: Optional[UploadFile] = File(None),
    cover_url: Optional[str] = Form(None),
    song_ids: Optional[str] = Form(None),
    is_private: Optional[int] = Form(None),
    is_collab: Optional[int] = Form(None),
    admin: dict = Depends(require_admin)
):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM playlists WHERE id = ?", (playlist_id,))
    existing = cursor.fetchone()
    if not existing:
        conn.close()
        raise HTTPException(status_code=404, detail="Playlist not found")

    cur_name = existing["name"]
    cur_desc = existing["description"] or ""
    cur_cover = existing["cover_url"]
    cur_private = existing["is_private"]
    cur_collab = existing["is_collab"]
    cur_song_ids = existing["song_ids"] or "[]"

    if request.headers.get("content-type", "").startswith("application/json"):
        body = await request.json()
        if "name" in body: cur_name = body["name"]
        if "description" in body: cur_desc = body["description"]
        if "coverUrl" in body and body["coverUrl"]: cur_cover = body["coverUrl"]
        if "isPrivate" in body: cur_private = 1 if body["isPrivate"] else 0
        if "isCollaborative" in body: cur_collab = 1 if body["isCollaborative"] else 0
        if "songIds" in body:
            cur_song_ids = json.dumps(body["songIds"])
    else:
        if name and name.strip(): cur_name = name.strip()
        if description is not None: cur_desc = description.strip()
        if is_private is not None: cur_private = is_private
        if is_collab is not None: cur_collab = is_collab
        if song_ids is not None:
            try:
                parsed = json.loads(song_ids)
                cur_song_ids = json.dumps(parsed)
            except Exception:
                cur_song_ids = json.dumps([s.strip() for s in song_ids.split(",") if s.strip()])

        if cover_file and cover_file.filename:
            ext = os.path.splitext(cover_file.filename)[1] or ".jpg"
            filename = f"{playlist_id}_{uuid.uuid4().hex[:4]}{ext}"
            filepath = os.path.join(UPLOADS_DIR, "covers", filename)
            with open(filepath, "wb") as f:
                shutil.copyfileobj(cover_file.file, f)
            cur_cover = f"/uploads/covers/{filename}"
        elif cover_url and cover_url.strip():
            cur_cover = cover_url.strip()

    cursor.execute(
        """UPDATE playlists SET name = ?, description = ?, cover_url = ?, is_private = ?, is_collab = ?, song_ids = ?
           WHERE id = ?""",
        (cur_name, cur_desc, cur_cover, cur_private, cur_collab, cur_song_ids, playlist_id)
    )
    conn.commit()
    conn.close()

    try:
        final_song_ids = json.loads(cur_song_ids)
    except Exception:
        final_song_ids = []

    return {
        "message": "Playlist updated successfully",
        "playlist": {
            "id": playlist_id,
            "name": cur_name,
            "description": cur_desc,
            "coverUrl": cur_cover,
            "isPrivate": bool(cur_private),
            "isCollaborative": bool(cur_collab),
            "userId": existing["user_id"] or "admin",
            "songIds": final_song_ids,
        }
    }


@app.delete("/api/admin/playlists/{playlist_id}")
def delete_global_playlist(playlist_id: str, admin: dict = Depends(require_admin)):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM playlists WHERE id = ?", (playlist_id,))
    pl = cursor.fetchone()
    if not pl:
        conn.close()
        raise HTTPException(status_code=404, detail="Playlist not found")

    if pl["cover_url"] and pl["cover_url"].startswith("/uploads/"):
        rel_path = pl["cover_url"].replace("/uploads/", "")
        local_file = os.path.join(UPLOADS_DIR, rel_path)
        if os.path.exists(local_file):
            try: os.remove(local_file)
            except Exception: pass

    cursor.execute("DELETE FROM playlists WHERE id = ?", (playlist_id,))
    conn.commit()
    conn.close()

    return {"message": "Global playlist deleted successfully"}


# Serve built Frontend SPA Static Files (if dist exists)
DIST_DIR = os.path.join(os.path.dirname(__file__), "..", "dist")
assets_dir = os.path.join(DIST_DIR, "assets")

if os.path.exists(assets_dir):
    app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

if os.path.exists(DIST_DIR):
    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        file_path = os.path.join(DIST_DIR, full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        index_path = os.path.join(DIST_DIR, "index.html")
        if os.path.exists(index_path):
            return FileResponse(index_path)
        raise HTTPException(status_code=404, detail="Frontend index.html not found")


if __name__ == "__main__":
    import uvicorn
    # Target execution environment: Ubuntu 24.04 LTS at /opt/wave
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 7000))
    reload_flag = os.getenv("RELOAD", "false").lower() == "true"
    uvicorn.run("server.main:app", host=host, port=port, reload=reload_flag)


