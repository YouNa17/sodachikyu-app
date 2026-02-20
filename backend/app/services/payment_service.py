# -----------------
# 決済関連のロジック
# -----------------

import stripe  # ← Stripe SDK（checkout がある）

from sqlalchemy.orm import Session
from app.models.payment import Payment

# ===============================
# ① 支援開始：Checkout Session作成
# ===============================


def create_checkout_session(amount: int):
    print("STRIPE KEY:", stripe.api_key)
    session = stripe.checkout.Session.create(
        mode="payment",
        payment_method_types=["card"],
        line_items=[
            {
                "price_data": {
                    "currency": "jpy",
                    "product_data": {
                        "name": "ちきゅまる応援支援 🌱",
                    },
                    "unit_amount": amount,
                },
                "quantity": 1,
            }
        ],
        success_url="http://localhost:3000/support/success",
        cancel_url="http://localhost:3000/home",
    )

    # Stripeが作った決済ページのURLを返す
    return session.url


# ===============================
# ② 支援完了：Webhookから決済結果を保存
# ===============================
def save_payment_from_checkout_session(
    db: Session,
    session: stripe.checkout.Session,
):

    payment = Payment(
        user_id=None,  # 将来ユーザー紐付けする場合に対応
        stripe_payment_id=session.payment_intent,
        amount=session.amount_total,
        currency=session.currency,
        status=session.payment_status,
        paid_at=None,  # 必要に応じて timestamp を入れる
    )

    db.add(payment)
    db.commit()
