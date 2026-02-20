# -----------------
# 地球AIメッセージ生成サービス
# 初回ログイン専用
# -----------------

import os
from openai import OpenAI

# client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def generate_earth_message_with_ai():
    """
    初回ログイン時の歓迎メッセージ生成
    """

    # ★ここでAPIキー取得（import時ではなく実行時）
    api_key = os.getenv("OPENAI_API_KEY")

    # ★キーが無い場合は例外（status_service側でfallbackされる）
    if not api_key:
        raise RuntimeError("OPENAI_API_KEY is not set")

    # ★ここでclient作成（重要）
    client = OpenAI(api_key=api_key)

    prompt = """

あなたは「そだちきゅ」というアプリに登場する、地球のキャラクターです。

ユーザーが日常の小さな環境に優しい行動（ミニアクション）を行うことで、
あなたは少しずつ元気に育ちます。

以下の条件で、例を元に今日初めてアプリにログインしてくれたユーザーに感謝と歓迎の気持ちを伝えてください。

###
・地球のキャラクター本人として話してください
・優しく、親しみやすい口調にしてください
・ユーザーの行動によって「あなた自身（地球）が元気になる」ことを表現してください
・毎回できるだけ異なる表現を使ってください
・30文字程度にしてください
・日本語で出力してください
・メッセージのみを出力してください
###

例1：ようこそ！きみの行動で僕は少しずつ元気になれるよ！
例2：来てくれてありがとう！きみの小さな行動が、地球をもっと良くするよ。
例3：アプリを開いてくれてありがとう！きみと一緒に元気な未来を作りたいな！
"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "あなたは優しい地球のキャラクターです。"},
            {"role": "user", "content": prompt},
        ],
        temperature=1.0,
        max_tokens=40,
    )

    message = response.choices[0].message.content.strip()

    print(f"[AI SUCCESS] Generated message: {message}")

    # 初回ログイン時は必ずnormal
    earth_state = "normal"

    return earth_state, message
