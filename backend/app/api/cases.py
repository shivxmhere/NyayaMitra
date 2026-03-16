from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models import User, Case
from app.schemas import CaseCreate, CaseResponse, CaseUpdate
from app.auth import get_current_user
from app.services.case_summarizer import summarize_case_hindi, summarize_case_english, check_bail_eligibility

router = APIRouter(prefix="/api/cases", tags=["cases"])


@router.post("/", response_model=CaseResponse)
async def create_case(
    case_data: CaseCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    case = Case(
        user_id=current_user.id,
        prisoner_name=case_data.prisoner_name,
        prisoner_age=case_data.prisoner_age,
        fir_number=case_data.fir_number,
        police_station=case_data.police_station,
        district=case_data.district,
        state=case_data.state,
        charges=case_data.charges,
        case_status=case_data.case_status,
        court_name=case_data.court_name,
        judge_name=case_data.judge_name,
        arrest_date=case_data.arrest_date,
        last_hearing=case_data.last_hearing,
        next_hearing=case_data.next_hearing,
    )

    # Auto-check bail eligibility
    case.bail_eligibility = await check_bail_eligibility(case_data.charges)

    db.add(case)
    await db.commit()
    await db.refresh(case)

    # Auto-generate AI summaries
    try:
        case.ai_summary_hindi = await summarize_case_hindi(case)
        case.ai_summary_english = await summarize_case_english(case)
        await db.commit()
        await db.refresh(case)
    except Exception:
        pass

    return case


@router.get("/", response_model=list[CaseResponse])
async def get_cases(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Case).where(Case.user_id == current_user.id).order_by(Case.created_at.desc())
    )
    return result.scalars().all()


@router.get("/{case_id}", response_model=CaseResponse)
async def get_case(
    case_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Case).where(Case.id == case_id, Case.user_id == current_user.id)
    )
    case = result.scalar_one_or_none()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    return case


@router.put("/{case_id}", response_model=CaseResponse)
async def update_case(
    case_id: int,
    case_data: CaseUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Case).where(Case.id == case_id, Case.user_id == current_user.id)
    )
    case = result.scalar_one_or_none()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    update_data = case_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(case, field, value)

    if "charges" in update_data:
        case.bail_eligibility = await check_bail_eligibility(update_data["charges"])

    await db.commit()
    await db.refresh(case)
    return case
