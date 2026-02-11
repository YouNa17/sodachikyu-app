# -----------------
# DBと接続する窓口
# -----------------
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os

# 環境変数から DB の接続情報を取得
# FIXME：無ければデフォルト値を使う
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg2://postgres:postgres@db:5432/sodachikyu"
)

# DBとの接続装置(engine)を使って実際にDB操作するセッションを作る
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)