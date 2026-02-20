# -----------------
# 支援（Stripe決済）を開始するAPI
# -----------------
# ・ログイン済ユーザのみ利用可能
# ・指定された金額でstripe Cheakout セッションを作成する
# ・決済結果の保存・ステータス更新は webhook側で行う
# -----------------
from fastapi import APIRouter
from pydantic import BaseModel
from app.services.payment_service import create_checkout_session

# ルーター定義
# Swagger上では「support」グループとして表示
router = APIRouter(prefix="/api/support", tags=["support"])


# リクエストボディ定義
# フロントからは支援金額のみを受け取る
class SupportRequest(BaseModel):
    amount: int

# 支援（Stripe決済）を開始するAPI
@router.post("/")
def support(request: SupportRequest):
    url = create_checkout_session(request.amount)
    return {"checkout_url": url}

