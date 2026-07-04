import uuid
from typing import Any
from pydantic import BaseModel


class OrderCreate(BaseModel):
    items: list[dict[str, Any]]
    total: float = 0.0


class OrderOut(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    status: str
    total: float
    items: list[dict[str, Any]]

    model_config = {"from_attributes": True}
