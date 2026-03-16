from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models import User, Case, BailApplication
from app.schemas import BailRequest, BailResponse, BailStatusUpdate
from app.auth import get_current_user
from app.services.bail_generator import generate_bail_application, DEFAULT_BAIL_GROUNDS, DEFAULT_BAIL_GROUNDS_HINDI
from datetime import datetime

router = APIRouter(prefix="/api/bail", tags=["bail"])


@router.post("/generate", response_model=BailResponse)
async def generate_bail(
    bail_data: BailRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Get the case
    result = await db.execute(select(Case).where(Case.id == bail_data.case_id))
    case = result.scalar_one_or_none()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    # Generate bail application
    generated = await generate_bail_application(
        case=case,
        applicant_name=bail_data.applicant_name,
        grounds=bail_data.grounds,
        advocate_name=bail_data.advocate_name,
    )

    bail_app = BailApplication(
        case_id=bail_data.case_id,
        user_id=current_user.id,
        generated_text=generated["hindi"],
        generated_text_english=generated["english"],
        applicant_name=bail_data.applicant_name,
        advocate_name=bail_data.advocate_name,
        court_address=case.court_name,
        grounds=", ".join(bail_data.grounds),
        status="draft",
    )
    db.add(bail_app)
    await db.commit()
    await db.refresh(bail_app)
    return bail_app


@router.get("/{case_id}", response_model=list[BailResponse])
async def get_bail_applications(
    case_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(BailApplication)
        .where(BailApplication.case_id == case_id)
        .order_by(BailApplication.generated_at.desc())
    )
    return result.scalars().all()


@router.patch("/{bail_id}/status", response_model=BailResponse)
async def update_bail_status(
    bail_id: int,
    status_update: BailStatusUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(BailApplication).where(BailApplication.id == bail_id))
    bail_app = result.scalar_one_or_none()
    if not bail_app:
        raise HTTPException(status_code=404, detail="Bail application not found")

    bail_app.status = status_update.status
    if status_update.status == "filed":
        bail_app.filed_at = datetime.utcnow()
    await db.commit()
    await db.refresh(bail_app)
    return bail_app


@router.get("/grounds/defaults")
async def get_default_grounds():
    return {
        "grounds_english": DEFAULT_BAIL_GROUNDS,
        "grounds_hindi": DEFAULT_BAIL_GROUNDS_HINDI,
    }
