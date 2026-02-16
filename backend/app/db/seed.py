from app.db.session import SessionLocal
from app.models.category import Category
from app.models.action import Action


# ----------------------------
# categories seed
# ----------------------------
def seed_categories(db):
    categories = [
        {"id": 1, "name": "日常の選択"},
        {"id": 2, "name": "食べ物"},
        {"id": 3, "name": "家の中"},
        {"id": 4, "name": "ごみ"},
    ]

    for category_data in categories:
        exists = db.query(Category).filter(Category.id == category_data["id"]).first()

        if not exists:
            category = Category(**category_data)
            db.add(category)
            print(f"Added category: {category.name}")
        else:
            print(f"Category already exists: {exists.name}")

    db.commit()


# ----------------------------
# actions seed
# ----------------------------
def seed_actions(db):
    actions = [
        # 日常の選択
        {
            "category_id": 1,
            "action_key": "use_my_bag",
            "title": "マイバッグを使う",
            "description": "買い物のときにレジ袋を受け取らず、マイバッグを使う。",
        },
        {
            "category_id": 1,
            "action_key": "use_my_bottle",
            "title": "マイボトルを使う",
            "description": "飲み物を買う代わりに、マイボトルを持ち歩いて使う。",
        },
        {
            "category_id": 1,
            "action_key": "choose_reuse",
            "title": "リユースする",
            "description": "新品ではなく中古品を選ぶ。また不要なものをフリーマーケットやリユースショップに出す。誰かに譲る。",
        },
        {
            "category_id": 1,
            "action_key": "refuse_disposable_cutlery",
            "title": "使い捨ての箸などを断る",
            "description": "使い捨ての箸、スプーンやフォークを受け取らない。",
        },
        {
            "category_id": 1,
            "action_key": "choose_eco_transport",
            "title": "徒歩・自転車・公共交通を使う",
            "description": "車ではなく徒歩、自転車、公共交通機関を使って移動する。",
        },
        # 食べ物
        {
            "category_id": 2,
            "action_key": "finish_meal",
            "title": "食事を残さない",
            "description": "外食で残さず食べる。または食べきれなかった分を持ち帰る。",
        },
        {
            "category_id": 2,
            "action_key": "choose_temaedori",
            "title": "てまえどりをする",
            "description": "陳列されている手前の商品から選んで購入する。",
        },
        {
            "category_id": 2,
            "action_key": "choose_discounted_food",
            "title": "見切り品・規格外商品を選ぶ",
            "description": "見切り品や規格外の商品を選んで購入する。",
        },
        # 家の中
        {
            "category_id": 3,
            "action_key": "turn_off_lights",
            "title": "使っていない電気を消す",
            "description": "使っていない部屋の電気をこまめに消す。",
        },
        {
            "category_id": 3,
            "action_key": "adjust_ac_temperature",
            "title": "エアコン温度を調整する",
            "description": "エアコンの設定温度を1度（冷房：高く、暖房：低く）調整する。",
        },
        {
            "category_id": 3,
            "action_key": "turn_off_tv",
            "title": "テレビを消す",
            "description": "見ていないときはテレビの電源を切る。",
        },
        {
            "category_id": 3,
            "action_key": "stop_rice_warmer",
            "title": "炊飯器の保温を止める",
            "description": "炊飯後は必要に応じて保温を止める。",
        },
        {
            "category_id": 3,
            "action_key": "unplug_devices",
            "title": "家電のコンセントを抜く",
            "description": "使っていない家電のコンセントを抜く。",
        },
        # ごみ
        {
            "category_id": 4,
            "action_key": "recycle_at_station",
            "title": "リサイクルステーションに持って行く",
            "description": "資源ごみをリサイクルステーションに持って行く。",
        },
        {
            "category_id": 4,
            "action_key": "separate_garbage",
            "title": "ごみを分別する",
            "description": "ルールに従ってごみを分別する。",
        },
        {
            "category_id": 4,
            "action_key": "drain_or_dry_food_waste",
            "title": "生ごみの水を切る",
            "description": "生ごみの水分を切ったり、生ごみ乾燥機などを使い乾燥させてから捨てる。",
        },
    ]
    # actionsリストの中のデータを一つずつ取り出す
    for action_data in actions:
        # DBに同じaction_keyがあるか探す
        exists = (
            db.query(Action)
            .filter(Action.action_key == action_data["action_key"])
            .first()
        )

        # DBに存在しない場合だけ追加する
        if not exists:
            action = Action(**action_data)
            # DBに追加し、追加したことをログに出す
            db.add(action)
            print(f"Added action: {action.title}")
        else:
            # すでにある場合は追加しない
            print(f"Action already exists: {exists.title}")

    db.commit()


# ----------------------------
# run seed
# ----------------------------
# seed全体を実行する関数
def run_seed():
    # DB接続を開始する
    db = SessionLocal()

    print("Start seeding...")

    seed_categories(db)
    seed_actions(db)

    db.close()

    print("Seeding completed!")


if __name__ == "__main__":
    run_seed()
