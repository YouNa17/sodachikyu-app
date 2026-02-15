# -----------------
# アクション記録・1日1回制御・ステータス返却
# -----------------

from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.models.action_log import ActionLog
from app.models.action import Action
from app.services.status_service import build_today_status
from app.utils.date import get_jst_today


def create_action_log(db: Session, user_id, action_id: int):
    today = get_jst_today()

    # 指定されたaction_idが本当に存在するか確認
    action = db.query(Action).filter(Action.id == action_id).first()

    if not action:
        raise ValueError("Action not found")

    # 1日1回制御（UniqueConstraintでも守られるが事前チェック）
    existing = (
        db.query(ActionLog)
        .filter(
            ActionLog.user_id == user_id,
            ActionLog.action_id == action_id,
            ActionLog.action_date == today,
        )
        .first()
    )

    # 存在しなければ新しいDBレコードを作成
    if not existing:
        log = ActionLog(user_id=user_id, action_id=action_id, action_date=today)

        # 保存対象に追加
        db.add(log)

        try:
            # 保存確定
            db.commit()
            # UniqueConstraint違反時にエラー回避
        except IntegrityError:
            db.rollback()

    # 今日のステータス取得、今日の状態を再計算
    status = build_today_status(db, user_id)

    return {
        "server_date": status["server_date"],
        "action_id": action.id,
        "action_title": action.title,
        "action_count_today": status["action_count_today"],
        "earth_state": status["earth_state"],
        "message": status["message"],
    }
