from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.config import settings
from app.database import init_db
from app.api import auth, cases, bail, lawyers, hearings, chat


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield


app = FastAPI(
    title="NyayaMitra API",
    description="AI Legal Co-Pilot for India's Undertrial Prisoners",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(cases.router)
app.include_router(bail.router)
app.include_router(lawyers.router)
app.include_router(hearings.router)
app.include_router(chat.router)


@app.get("/health")
async def health():
    return {"status": "active", "mission": "Justice for all Indians"}
