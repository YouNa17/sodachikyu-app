# -----------------
# 今日の回数集計、地球状態、メッセージのロジック
# -----------------
from sqlalchemy.orm import Session
from app.models.action_log import ActionLog
from app.utils.date import get_jst_today


def build_today_status(db: Session, user_id):
    # JSTの日付取得
    today = get_jst_today()

    # 今日の実行回数カウント
    # action_logsテーブルでログイン中ユーザーと今日の日付で絞り件数を数える
    count = (
        db.query(ActionLog)
        .filter(
            ActionLog.user_id == user_id,
            ActionLog.action_date == today
        )
        .count()
    )

    earth_state, message = _build_earth_state(count)

    return {
        "server_date": today,
        "action_count_today": count,
        "earth_state": earth_state,
        "message": message
    }


def _build_earth_state(count: int):
    # 地球状態ロジック（将来AIに置き換え可能)
    if count == 0:
        return "normal", "今日もここに来てくれてありがとう"
    elif count < 5:
        return "smile", "いい調子！小さな一歩が未来を変えるよ"
    else:
        return "happy", "素晴らしい！地球も喜んでるよ"