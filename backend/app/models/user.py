from sqlalchemy import Column, String, Integer, DateTime, JSON
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, nullable=False, index=True)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="user")
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Skincare Pivoted Metadata fields
    skin_type = Column(String, nullable=True)  # Oily, Dry, Sensitive, Combination
    skin_concerns = Column(JSON, nullable=True) # e.g., ["Acne", "Hyperpigmentation"]
    prescription_data = Column(String, nullable=True) # Extracted OCR prescription details