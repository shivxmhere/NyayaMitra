import sys
import os
import shutil

# Make Vercel filesystem writable for SQLite
src_db = os.path.join(os.path.dirname(__file__), '..', 'backend', 'nyayamitra.db')
dest_db = '/tmp/nyayamitra.db'

# If deployed on Vercel, copy the readonly db to /tmp so we can write to it
if not os.path.exists(dest_db) and os.path.exists(src_db):
    shutil.copy2(src_db, dest_db)

# Set the environment variable BEFORE importing config
if os.environ.get("VERCEL"):
    os.environ["DATABASE_URL"] = "sqlite+aiosqlite:////tmp/nyayamitra.db"

# Also set the Gemini API Key
os.environ["GEMINI_API_KEY"] = "AIzaSyC8E_7FY7k0Ws69YmPmfZzwozgtahbBaWk"

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

from app.main import app
