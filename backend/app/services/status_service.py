# -----------------
# 今日の回数集計、地球状態、メッセージのロジック
# -----------------
from datetime import datetime
from sqlalchemy.orm import Session
from app.models.action_log import ActionLog
from app.models.user import User
from zoneinfo import ZoneInfo
from app.utils.date import get_jst_today
from app.services.earth_ai_service import generate_earth_message_with_ai

JST = ZoneInfo("Asia/Tokyo")
UTC = ZoneInfo("UTC")


def build_today_status(db: Session, user_id):
    # JSTの日付取得
    today = get_jst_today()

    # user取得
    user = db.query(User).filter(User.id == user_id).first()

    updated_at = user.updated_at

    # naive datetimeならUTCとして扱う
    if updated_at.tzinfo is None:
        updated_at = updated_at.replace(tzinfo=UTC)

    # JSTに変換
    last_login_date = updated_at.astimezone(JST).date()

    # ★ここで初回ログイン判定
    is_first_login_today = last_login_date != today

    # ★初回ログインなら更新
    if is_first_login_today:
        user.updated_at = datetime.utcnow()
        db.commit()

    # 今日の実行回数カウント
    # action_logsテーブルでログイン中ユーザーと今日の日付で絞り件数を数える
    count = (
        db.query(ActionLog)
        .filter(ActionLog.user_id == user_id, ActionLog.action_date == today)
        .count()
    )

    if is_first_login_today:
        try:
            earth_state, message = generate_earth_message_with_ai()
        except Exception as e:
            print("AI generation failed:", e)
            # AI失敗時は従来ロジックにフォールバック
            earth_state, message = _build_earth_state(count)
    else:
        earth_state, message = _build_earth_state(count)

    return {
        "server_date": today,
        "action_count_today": count,
        "earth_state": earth_state,
        "message": message,
    }


def _build_earth_state(count: int):
    # 地球状態ロジック
    if count == 0:
        return "normal", "今日もここに来てくれてありがとう"
    elif count < 5:
        return "smile", "いい調子！小さな一歩が未来を変えるよ"
    else:
        return "happy", "素晴らしい！地球も喜んでるよ"
