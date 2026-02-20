from fastapi import FastAPI
from app.db.session import engine
from sqlalchemy import text
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.api.routers import users, status, categories, actions, action_logs, support, webhooks
from app.core.stripe import init_stripe


# =========================
# lifespan（startup/shutdown処理）
# =========================
@asynccontextmanager
async def lifespan(app: FastAPI):
    # startup時：DB接続確認
    with engine.connect() as conn:
        conn.execute(text("SELECT 1"))
    print("DB connected!")
    
    init_stripe()
    print("Stripe initialized!")

    yield

    # shutdown時（今回は特になし）


# lifespanをFastAPIに設定
app = FastAPI(lifespan=lifespan)

# CORS設定
origins = [
    "http://localhost:3000",  # Next.jsローカル
    "http://127.0.0.1:3000",
]

# CORS機能をFastAPIに追加する
app.add_middleware(
    CORSMiddleware,
    # 許可するフロントのURL
    allow_origins=origins,
    # 認証（Firebase tokenなど）を許可
    allow_credentials=True,
    # HTTPメソッド全て許可
    allow_methods=["*"],
    # Authorizationなどのヘッダーを許可
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "FastAPI is running"}


app.include_router(users.router)
app.include_router(status.router)
app.include_router(categories.router)
app.include_router(actions.router)
app.include_router(action_logs.router)
app.include_router(support.router)
app.include_router(webhooks.router)