from pydantic import BaseModel, Field
from typing import Optional

class ConsultationRequest(BaseModel):
    text_query: Optional[str] = Field(None, description="User query describing skin conditions.")
    has_image: bool = Field(False, description="Flags if a diagnostic photo is provided.")
    lighting_confirmed: bool = Field(False, description="True if image is in natural daylight.")
    prescription_text: Optional[str] = Field(None, description="Text from a verified dermatologist note.")

class ConsultationResponse(BaseModel):
    analysis: str = Field(..., description="Dermatological summary from the LLM agent.")
    suggested_routine: str = Field(..., description="Step-by-step product usage instructions.")
    is_safe_to_proceed: bool = Field(..., description="False if ingredients conflict with prescription.")