from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from datetime import date, timedelta
from app.database import get_db
from app.models import User, Case, BailApplication, Hearing
from app.schemas import CaseCreate, CaseResponse, CaseUpdate, DashboardStats
from app.auth import get_current_user
from app.services.case_summarizer import summarize_case_hindi, summarize_case_english, check_bail_eligibility

router = APIRouter(prefix="/api/cases", tags=["cases"])


@router.get("/stats", response_model=DashboardStats)
async def get_case_stats(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Total cases
    result = await db.execute(select(func.count(Case.id)).where(Case.user_id == current_user.id))
    total_cases = result.scalar() or 0

    # Undertrial cases
    result = await db.execute(
        select(func.count(Case.id)).where(
            Case.user_id == current_user.id, Case.case_status == "undertrial"
        )
    )
    undertrial_cases = result.scalar() or 0

    # Bail applications filed
    result = await db.execute(
        select(func.count(BailApplication.id)).where(
            BailApplication.user_id == current_user.id
        )
    )
    bail_applications_filed = result.scalar() or 0

    # Upcoming hearings in 7 days
    today = date.today()
    week_later = today + timedelta(days=7)

    # Get all case IDs for this user
    cases_result = await db.execute(select(Case.id).where(Case.user_id == current_user.id))
    case_ids = [c for c in cases_result.scalars().all()]

    upcoming_hearings_7days = 0
    if case_ids:
        result = await db.execute(
            select(func.count(Hearing.id)).where(
                Hearing.case_id.in_(case_ids),
                Hearing.hearing_date >= today,
                Hearing.hearing_date <= week_later,
            )
        )
        upcoming_hearings_7days = result.scalar() or 0

    # Cases with lawyers
    # Heuristic: A case has a lawyer if it has at least one bail application with an advocate name
    result = await db.execute(
        select(func.count(Case.id.distinct()))
        .join(BailApplication)
        .where(
            Case.user_id == current_user.id,
            BailApplication.advocate_name != None,
            BailApplication.advocate_name != "",
        )
    )
    cases_with_lawyers = result.scalar() or 0

    return {
        "total_cases": total_cases,
        "undertrial_cases": undertrial_cases,
        "bail_applications_filed": bail_applications_filed,
        "upcoming_hearings_7days": upcoming_hearings_7days,
        "cases_with_lawyers": cases_with_lawyers,
    }


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
