# -----------------
# 全テーブルの設計図の親
# -----------------
from sqlalchemy.orm import DeclarativeBase


# このBaseを継承するとSQLAlchemyがDBテーブルであると認識する
class Base(DeclarativeBase):
    pass


# Alembicに全モデルを認識させるためimport
from app.models import user  # noqa: F401, E402
from app.models import category  # noqa: F401, E402
from app.models import action  # noqa: F401, E402
from app.models import action_log  # noqa: F401, E402
