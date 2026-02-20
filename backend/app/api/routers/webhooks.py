from fastapi import APIRouter, Request, Header, HTTPException
import stripe
import os
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


# Stripe からの Webhook を受信するための POST エンドポイント
@router.post("/stripe")
async def stripe_webhook(
    # # Stripe から送信されるリクエスト全体を受け取る
    request: Request,
    stripe_signature: str = Header(None, alias="Stripe-Signature"),
    db: Session = Depends(get_db),
):

    # Stripeから送られてくる raw payloadを取得
    payload = await request.body()

    # ------------------------------------------------------
    # 署名検証（Stripeが送信した正規の webhook であることを検証
    # ------------------------------------------------------
    try:
        event = stripe.Webhook.construct_event(
            payload=payload,
            sig_header=stripe_signature,
            secret=STRIPE_WEBHOOK_SECRET,
        )
    # 署名が不正なら 400 を返す
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid Stripe signature")
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid payload")

    # -------------------------
    # イベント分岐
    # -------------------------
    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]

        # 決済結果をDBに保存
        save_payment_from_checkout_session(db, session)

        print("Checkout completed & saved:", session["id"])

    else:
        # MVPでは未対応イベントは無視
        print("Unhandled event type:", event["type"])

    # Stripeには必ず200を返す
    return {"status": "success"}
