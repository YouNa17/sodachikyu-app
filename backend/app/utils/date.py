# JST今日判定
from datetime import datetime, date
from zoneinfo import ZoneInfo

JST = ZoneInfo("Asia/Tokyo")

def get_jst_today() -> date:
    """JST基準の今日を返す"""
    return datetime.now(JST).date()