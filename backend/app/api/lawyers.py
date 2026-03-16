from fastapi import APIRouter
from app.services.lawyer_finder import find_lawyers, get_legal_aid_info

router = APIRouter(prefix="/api/lawyers", tags=["lawyers"])


@router.get("/")
async def search_lawyers(district: str = "", legal_aid_only: bool = False):
    lawyers = find_lawyers(district=district, legal_aid_only=legal_aid_only)
    return lawyers


@router.get("/legal-aid-info")
async def legal_aid_info(district: str = ""):
    return get_legal_aid_info(district)
