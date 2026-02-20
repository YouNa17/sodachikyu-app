# ---------------------------------------------
# Stripe決済の支援履歴を保存する paymentsテーブル
# ---------------------------------------------
import uuid
from sqlalchemy import Column, String, Integer, DateTime
from sqlalchemy.dialects.postgresql import UUID
from app.db.base import Base
from datetime import datetime


class Payment(Base):
    __tablename__ = "payments"

    # アプリ側管理用の識別子
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # 支援を行ったログインユーザーのID
    user_id = Column(UUID(as_uuid=True), nullable=True)

    # Stripe上で作成された決済ID
    stripe_payment_id = Column(String, unique=True, nullable=False)

    # 支援金額
    amount = Column(Integer, nullable=False)

    # 通貨コード
    currency = Column(String(3), nullable=False)

    # 決済状態
    status = Column(String, nullable=False)

    # Stripe側で決済が完了した時刻(UTC)
    paid_at = Column(DateTime, nullable=True)

    # paymentsレコード作成時刻
    created_at = Column(DateTime, default=datetime.utcnow)
