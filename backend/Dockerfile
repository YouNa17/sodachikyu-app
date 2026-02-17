FROM python:3.11-slim

# 作業ディレクトリ
WORKDIR /app

# 依存関係を先にコピー、キャッシュが効いてビルドが早くなる
COPY requirements.txt .

# Pythonライブラリをインストール
RUN pip install --no-cache-dir -r requirements.txt

# アプリとテストをコピー
COPY  . .

# Pythonパス設定
ENV PYTHONPATH=/app:/app/app

# FastAPI 起動
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]