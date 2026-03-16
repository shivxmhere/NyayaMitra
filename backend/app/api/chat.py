from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models import User, Case, ChatMessage
from app.schemas import ChatRequest, ChatResponse, ChatHistoryItem
from app.auth import get_current_user
from app.services.gemini_service import get_nyaya_response

router = APIRouter(prefix="/api/chat", tags=["chat"])


@router.post("/", response_model=ChatResponse)
async def chat(
    chat_data: ChatRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    case_context = ""
    if chat_data.case_id:
        result = await db.execute(select(Case).where(Case.id == chat_data.case_id))
        case = result.scalar_one_or_none()
        if case:
            case_context = (
                f"Prisoner: {case.prisoner_name}, Age: {case.prisoner_age}, "
                f"FIR: {case.fir_number}, Charges: {case.charges}, "
                f"Court: {case.court_name}, Status: {case.case_status}, "
                f"Arrest Date: {case.arrest_date}, "
                f"Bail Eligibility: {case.bail_eligibility}"
            )

    result = await get_nyaya_response(
        message=chat_data.message,
        language=chat_data.language,
        case_context=case_context,
    )

    # Save to DB
    chat_msg = ChatMessage(
        user_id=current_user.id,
        case_id=chat_data.case_id,
        message=chat_data.message,
        response=result["response"],
        language=chat_data.language,
    )
    db.add(chat_msg)
    await db.commit()

    return ChatResponse(
        response=result["response"],
        language=chat_data.language,
        suggested_actions=result.get("suggested_actions", []),
    )


@router.get("/history/{case_id}", response_model=list[ChatHistoryItem])
async def get_chat_history(
    case_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(ChatMessage)
        .where(
            ChatMessage.user_id == current_user.id,
            ChatMessage.case_id == case_id,
        )
        .order_by(ChatMessage.created_at.desc())
        .limit(20)
    )
    return result.scalars().all()
