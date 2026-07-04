import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.order import Order
from app.schemas.order import OrderCreate


async def create_order(db: AsyncSession, data: OrderCreate, user_id: uuid.UUID) -> Order:
    order = Order(user_id=user_id, items=data.items, total=data.total, status="pending")
    db.add(order)
    await db.commit()
    await db.refresh(order)
    return order


async def get_user_orders(db: AsyncSession, user_id: uuid.UUID) -> list[Order]:
    result = await db.execute(select(Order).where(Order.user_id == user_id))
    return result.scalars().all()
