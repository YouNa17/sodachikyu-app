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
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    key_path = os.path.join(base_dir, "core", "serviceAccountKey.json")

    cred = credentials.Certificate(key_path)

    # 初期化
    firebase_admin.initialize_app(cred)
