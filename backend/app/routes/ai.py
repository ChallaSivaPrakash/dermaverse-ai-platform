from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models.user import User
from app.middleware.auth import get_current_user
from app.schemas.ai import ConsultationRequest, ConsultationResponse
from app.services import ai_service

router = APIRouter(prefix="/api/ai", tags=["ai"])

@router.post("/ask", response_model=ConsultationResponse)
async def ask_ai(
    request: ConsultationRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Server-Side Guardrail: Enforce clinical lighting protocol
    if request.has_image and not request.lighting_confirmed:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Lighting protocol violation. Must confirm natural daylight."
        )
        
    try:
        # Trigger the LangGraph diagnostic workflow
        response_payload = await ai_service.run_diagnostic_graph(request, current_user, db)
        return response_payload
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"Diagnostic processing failed: {str(e)}"
        )