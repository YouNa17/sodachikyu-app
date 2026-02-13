# -----------------
# IDトークン検証
# -----------------
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from firebase_admin import auth as firebase_auth
from app.core.firebase import init_firebase

# Bearerトークン必須化
bearer = HTTPBearer()


#  Depends(bearer) がヘッダーを読む
#  Authorizationが無いと自動で 403 になる
#  あれば creds.credentials にトークンが入る
def verify_token(
    creds: HTTPAuthorizationCredentials = Depends(bearer),
):
    init_firebase()

    try:
        # 署名・有効期限・発行元・改ざんチェック、通らなければエラーを返す
        decoded = firebase_auth.verify_id_token(creds.credentials)
        return decoded
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
