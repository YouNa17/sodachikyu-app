from fastapi import APIRouter, Request, Header, HTTPException
import stripe
import os
import json
from sqlalchemy.orm import Session
from fastapi import Depends
from app.db.session import get_db
from app.services.payment_service import save_payment_from_checkout_session

router = APIRouter(
    prefix="/api/webhooks",
    tags=["webhooks"],
)

# Stripe Webhook 用の署名シークレット
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET")


@router.post("/stripe")
async def stripe_webhook(
    request: Request,
    stripe_signature: str = Header(None, alias="Stripe-Signature"),
    db: Session = Depends(get_db),
):
    """
    Stripe Webhook 受信エンドポイント

    - Stripe からのイベントを受信する
    - 署名を検証して正当なリクエストか確認する
    - event.type に応じて処理を分岐する
    """

    payload = await request.body()

    # -------------------------
    # 署名検証（MVPでは必須）
    # -------------------------
    try:
        event = stripe.Webhook.construct_event(
            payload=payload,
            sig_header=stripe_signature,
            secret=STRIPE_WEBHOOK_SECRET,
        )
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid Stripe signature")
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid payload")

    # -------------------------
    # イベント分岐
    # -------------------------
    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]

        save_payment_from_checkout_session(db, session)

        print("Checkout completed & saved:", session["id"])

    else:
        # MVPでは未対応イベントは無視
        print("Unhandled event type:", event["type"])

    # Stripeには必ず200を返す
    return {"status": "success"}
