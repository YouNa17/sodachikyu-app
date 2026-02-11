# -----------------
# 全テーブルの設計図の親
# -----------------
from sqlalchemy.orm import DeclarativeBase

# このBaseを継承するとSQLAlchemyがDBテーブルであると認識する
class Base(DeclarativeBase):
    pass