# -----------------
# カテゴリに属するアクション一覧を取得し、今日やったかどうかを付けて返す
# -----------------
from sqlalchemy.orm import Session
from app.models.action import Action
from app.models.action_log import ActionLog
from app.schemas.action import ActionItem
from app.utils.date import get_jst_today


def get_actions_by_category(db: Session, user_id, category_id: int):
    # 今日の日付取得
    today = get_jst_today()

    # actionテーブルを見て指定したカテゴリだけ抽出し全件取得
    actions = (
        db.query(Action)
        .filter(Action.category_id == category_id)
        .all()
    )
    # 今日のログ取得。今日のログイン中ユーザーの実行されたaction_idだけ取得
    today_logs = (
        db.query(ActionLog.action_id)
        .filter(
            ActionLog.user_id == user_id,
            ActionLog.action_date == today
        )
        .all()
    )

    # done_idsをセット化
    done_ids = {log.action_id for log in today_logs}

    # レスポンス整形
    response_actions = [
        ActionItem(
            id=a.id,
            title=a.title,
            description=a.description,
            done_today=a.id in done_ids
        )
        for a in actions
    ]

    return {
        "server_date": today,
        "actions": response_actions
    }