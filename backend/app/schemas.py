from pydantic import BaseModel
from typing import Optional, List
from datetime import date, datetime


# ── Auth ─────────────────────────────────────────
class UserCreate(BaseModel):
    username: str
    email: str
    full_name: str
    password: str
    phone: str = ""
    district: str = ""
    language: str = "hindi"


class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    full_name: str
    phone: str
    language: str
    role: str
    district: str
    state: str
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None


# ── Cases ────────────────────────────────────────
class CaseCreate(BaseModel):
    prisoner_name: str
    prisoner_age: int
    fir_number: str
    police_station: str
    district: str
    state: str = "Uttar Pradesh"
    charges: str
    court_name: str
    judge_name: str = ""
    arrest_date: date
    last_hearing: Optional[date] = None
    next_hearing: Optional[date] = None
    case_status: str = "undertrial"


class CaseUpdate(BaseModel):
    prisoner_name: Optional[str] = None
    prisoner_age: Optional[int] = None
    charges: Optional[str] = None
    case_status: Optional[str] = None
    court_name: Optional[str] = None
    judge_name: Optional[str] = None
    next_hearing: Optional[date] = None
    last_hearing: Optional[date] = None


class CaseResponse(BaseModel):
    id: int
    user_id: int
    prisoner_name: str
    prisoner_age: int
    fir_number: str
    police_station: str
    district: str
    state: str
    charges: str
    case_status: str
    court_name: str
    judge_name: str
    arrest_date: date
    last_hearing: Optional[date]
    next_hearing: Optional[date]
    ai_summary_hindi: Optional[str]
    ai_summary_english: Optional[str]
    bail_eligibility: str
    created_at: datetime

    class Config:
        from_attributes = True


# ── Bail ─────────────────────────────────────────
class BailRequest(BaseModel):
    case_id: int
    applicant_name: str
    grounds: List[str]
    advocate_name: Optional[str] = None


class BailResponse(BaseModel):
    id: int
    case_id: int
    generated_text: str
    generated_text_english: Optional[str]
    applicant_name: str
    advocate_name: Optional[str]
    grounds: str
    status: str
    generated_at: datetime

    class Config:
        from_attributes = True


class BailStatusUpdate(BaseModel):
    status: str


# ── Chat ─────────────────────────────────────────
class ChatRequest(BaseModel):
    message: str
    language: str = "hindi"
    case_id: Optional[int] = None


class ChatResponse(BaseModel):
    response: str
    language: str
    suggested_actions: List[str] = []


class ChatHistoryItem(BaseModel):
    id: int
    message: str
    response: str
    language: str
    created_at: datetime

    class Config:
        from_attributes = True


# ── Lawyers ──────────────────────────────────────
class LawyerResponse(BaseModel):
    id: int
    name: str
    bar_council_number: str
    district: str
    state: str
    specialization: str
    phone: str
    email: Optional[str]
    is_legal_aid: bool
    languages: str
    cases_handled: int
    rating: float
    available: bool

    class Config:
        from_attributes = True


# ── Hearings ─────────────────────────────────────
class HearingCreate(BaseModel):
    case_id: int
    hearing_date: date
    court_name: str
    hearing_type: str
    judge_name: str = ""
    outcome: Optional[str] = None
    next_date: Optional[date] = None
    notes: Optional[str] = None


class HearingResponse(BaseModel):
    id: int
    case_id: int
    hearing_date: date
    court_name: str
    judge_name: str
    hearing_type: str
    outcome: Optional[str]
    next_date: Optional[date]
    notes: Optional[str]
    reminder_sent: bool

    class Config:
        from_attributes = True


# ── Dashboard ────────────────────────────────────
class DashboardStats(BaseModel):
    total_cases: int
    undertrial_cases: int
    bail_applications_filed: int
    upcoming_hearings_7days: int
    cases_with_lawyers: int
