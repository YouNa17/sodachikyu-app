from fastapi import FastAPI
from app.db.session import engine
from sqlalchemy import text
from app.api.routers import users, status, categories

app = FastAPI()


@app.get("/")
def root():
    return {"message": "FastAPI is running"}


# アプリ起動時にDB接続できるかのテスト
@app.on_event("startup")
def test_connection():
    with engine.connect() as conn:
        conn.execute(text("SELECT 1"))
    print("DB connected!")


app.include_router(users.router)
app.include_router(status.router)
app.include_router(categories.router)
