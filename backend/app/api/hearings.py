from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import date, timedelta
from app.database import get_db
from app.models import User, Case, Hearing
from app.schemas import HearingCreate, HearingResponse
from app.auth import get_current_user

router = APIRouter(prefix="/api/hearings", tags=["hearings"])


@router.post("/", response_model=HearingResponse)
async def create_hearing(
    hearing_data: HearingCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Verify case belongs to user
    result = await db.execute(
        select(Case).where(Case.id == hearing_data.case_id, Case.user_id == current_user.id)
    )
    if not result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Case not found")

    hearing = Hearing(
        case_id=hearing_data.case_id,
        hearing_date=hearing_data.hearing_date,
        court_name=hearing_data.court_name,
        judge_name=hearing_data.judge_name,
        hearing_type=hearing_data.hearing_type,
        outcome=hearing_data.outcome,
        next_date=hearing_data.next_date,
        notes=hearing_data.notes,
    )
    db.add(hearing)
    await db.commit()
    await db.refresh(hearing)
    return hearing


@router.get("/{case_id}", response_model=list[HearingResponse])
async def get_case_hearings(
    case_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Hearing).where(Hearing.case_id == case_id).order_by(Hearing.hearing_date.desc())
    )
    return result.scalars().all()


@router.get("/upcoming/all", response_model=list[HearingResponse])
async def get_upcoming_hearings(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    today = date.today()
    week_later = today + timedelta(days=7)

    # Get all case IDs for this user
    cases_result = await db.execute(
        select(Case.id).where(Case.user_id == current_user.id)
    )
    case_ids = [c for c in cases_result.scalars().all()]

    if not case_ids:
        return []

    result = await db.execute(
        select(Hearing)
        .where(
            Hearing.case_id.in_(case_ids),
            Hearing.hearing_date >= today,
            Hearing.hearing_date <= week_later,
        )
        .order_by(Hearing.hearing_date.asc())
    )
    return result.scalars().all()
