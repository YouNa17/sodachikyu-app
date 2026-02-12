# -----------------
# Firebase Admin初期化ファイル作成
# -----------------
import os
import firebase_admin
from firebase_admin import credentials

# Firebaseを初期化する関数。
def init_firebase():
    # Firebase Adminは1プロセスで1回しか initialize_app() できないだから既に初期化済みなら何もしない。
    if firebase_admin._apps:
        return

# サービスアカウントキーをPythonに渡す
    cred = credentials.Certificate({
        "type": "service_account",
        "project_id": os.getenv("FIREBASE_PROJECT_ID"),
        "private_key": os.getenv("FIREBASE_PRIVATE_KEY", "").replace("\\n", "\n"),
        "client_email": os.getenv("FIREBASE_CLIENT_EMAIL"),
    })

# 初期化
    firebase_admin.initialize_app(cred)