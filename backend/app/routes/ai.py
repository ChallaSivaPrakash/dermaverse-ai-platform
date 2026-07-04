from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.middleware.auth import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/ai", tags=["ai"])


class AskRequest(BaseModel):
    message: str


class AskResponse(BaseModel):
    response: str


@router.post("/ask", response_model=AskResponse)
async def ask_ai(
    body: AskRequest,
    current_user: User = Depends(get_current_user),  # noqa: ARG001
):
    return AskResponse(response="AI service coming soon")
