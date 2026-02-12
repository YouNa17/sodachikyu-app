# -----------------
# DBと接続する窓口
# -----------------
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os

# 環境変数から DB の接続情報を取得
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL is not set")

# DBとの接続装置(engine)を使って実際にDB操作するセッションを作る
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# -----------------
# FastAPI dependency用
# -----------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()