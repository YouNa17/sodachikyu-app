# TeamC_sodachikyu

# プロジェクト名

- そだちきゅ

## 概要

- 本プロジェクトは、環境問題に関心はあるものの、「何をすればよいか分からない」「行動が続かない」と
  感じているユーザーに対し、日常の中で実行できる小さな環境行動（ミニアクション）を提示し、行動できたこと
  自体を肯定する体験を提供する
- 本プロジェクトは、数値評価や他者との比較ではなく、地球キャラクターの成長を通して、行動の積み重ねを
  直感的に感じられる設計

## 目的

- 環境問題への関心は社会全体で高まっている一方で、「関心はあるが、具体的な行動に移せていない人」は
  依然として多い。その背景には、環境のための行動が “正しさ” や “成果” を前提に語られやすい構造 がある
- CO₂削減量などの数値で効果を示される、他者との比較や判断で評価される「より良い選択」
  「正解の行動」を求められるこうした設計は、行動できている一部の人には有効だが、行動に踏み
  出せていない人にとっては 心理的ハードルをさらに高める要因 になっている。
- 結果として、行動そのものを始められない、または継続できない状態 が生まれる。
- こういった上記背景から、下記を目的とした開発を行った。
  　- ユーザに行動を強制・指導するのではなく、判断・比較・評価を排除した環境の中で、気づけば行動している状態を生み出す。
  - 環境行動を「頑張ること」「正解を選ぶこと」ではなく、生活の中に静かに組み込める行為として再定義する。
  - 無理な継続を求めずとも、結果として行動が続いていく状態を実現する。

## 想定ユーザー

- 環境問題に関心はあるが、積極的な活動はしていない人
- 評価・他者との比較・成果指標に疲れている層

---

## 技術スタック

### Frontend

- Next.js + TypeScript
- Tailwind CSS

### Backend

- FastAPI
- Pydantic

### Database

- PostgreSQL

### Infrastructure

- Docker

---

## ディレクトリ構成

sodachikyu/
├── backend/
│ ├── app/
│ │ ├── main.py
│ │ ├── api/
│ │ │ ├── deps.py
│ │ │ ├── routers/
│ │ │ │ ├── auth.py　　　　
│ │ │ ├── users.py # GET /api/users/me
│ │ │ ├── categories.py
│ │ │ ├── actions.py # カテゴリ配下の actions 取得
│ │ │ ├── action_logs.py # ★ POST /api/users/me/action-logs
│ │ │ └── status.py # GET /api/status/today
│ │ ├── core/
│ │ │ ├── config.py
│ │ │ └── security.py
│ │ ├── models/
│ │ │ ├── user.py
│ │ │ ├── category.py
│ │ │ ├── action.py
│ │ │ └── action_log.py  
│ │ ├── schemas/
│ │ │ ├── user.py
│ │ │ ├── category.py
│ │ │ ├── action.py
│ │ │ ├── action_log.py
│ │ │ └── status.py
│ │ ├── services/
│ │ │ ├── auth_service.py
│ │ │ ├── action_service.py
│ │ │ ├── action_log_service.py  
│ │ │ └── status_service.py
│ │ ├── db/
│ │ │ ├── base.py
│ │ │ ├── session.py
│ │ │ └── init_db.py
│ │ └── utils/
│ │ └── date.py # JSTの「今日」判定
│ ├── alembic/
│ │ ├── versions/
│ │ └── env.py
│ ├── alembic.ini
│ ├── Dockerfile
│ ├── requirements.txt
│ └── pytest.ini
│
├── frontend/
│ ├── app/
│ │ ├── layout.tsx
│ │ ├── page.tsx　　　トップページ
│ │ ├── login/
│ │ │ └── page.tsx　　　ログインページ
│ │ ├── categories/
│ │ │ ├── page.tsx　　　カテゴリ一覧
│ │ │ └── [id]/
│ │ │ └── page.tsx　　　ミニアクション一覧
│ │ └── components/
│ │ ├── EarthCharacter.tsx　　　地球の状態表示
│ │ ├── ActionButton.tsx　　　アクション実行
│ │ └── CategoryButton.tsx　　　カテゴリボタン
│ ├── lib/
│ │ ├── api.ts　　　FastAPI通信
│ │ ├── firebase.ts　　　Firebase初期化
│ │ └── auth.ts　　　ログイン処理
│ ├── styles/
│ │ └── globals.css
│ ├── tailwind.config.js
│ ├── postcss.config.js
│ ├── next.config.js
│ └── package.json
│
├── docs/　　　　　
│ ├── api/
│ │ └── openapi.yaml # OpenAPI（Swagger）仕様書
│ └── db/
│ └── er_diagram.drawio # ER図（DB設計）
│
├── .github/
│ └── workflows/
│ └── ci.yml # GitHub Actions（CI）
│
├── .vscode/
│ └── settings.json # VSCode 設定（任意）
│
├── docker-compose.yml
├── .env.example  
├── .gitignore
└── README.md

---

## 環境構築

- 本プロジェクトでは、バックエンドおよびデータベースをDockerで起動する

### 前提条件

- Git
- Docker
- Python

---

## 起動確認

- Frontend: http://localhost:3000
- Backend: http://localhost:8000

---

## 機能一覧（MVP）

- Firebase Authentication によるログイン機能
- ログインユーザー情報取得機能
- カテゴリ一覧表示機能
- ミニアクション一覧表示機能
- アクション実行記録機能（1日1回制御）
- 当日の行動数に応じた地球状態表示機能
- 当日実行済みアクションの判定機能（done_today）
- 日付変更による自動リセット機能（JST基準）

---

## 設計方針（MVP）

- 認証は Firebase Authentication を使用し、バックエンドでは認証処理を行わない
- 日付の判定（「今日」）はサーバー側で日本時間（JST）を基準に行う
- 当日の状態や実行済み判定は action_logs テーブルから算出する
- daily_status のような状態管理用テーブルは作成しない

---

## エラーハンドリングについて（MVP）

本MVPでは、アプリの基本動作確認を優先し、
以下の最低限のエラーハンドリングのみを実装対象としている。

- 401 Unauthorized（認証エラー）
- 404 Not Found（存在しないリソース）
- 409 Conflict（1日1回制御による重複実行）

共通エラーフォーマットの統一や詳細なエラー分類については、
MVP以降の拡張フェーズで対応予定としている。

---

## 認証方式（Firebase Authentication）

本アプリでは、認証に Firebase Authentication を使用している。

ログイン処理はフロントエンド側で行い、
バックエンド（FastAPI）は Firebase ID Token の検証のみを担当する。

### 処理の流れ

1. フロントエンドで Firebase Authentication によりログイン
2. Firebase ID Token を取得
3. APIリクエスト時に Authorization ヘッダへ Bearer Token を付与
4. バックエンドで ID Token を検証
5. 検証成功時、Firebase UID を元にユーザーを取得または作成
6. 認証済みユーザーとしてAPI処理を継続

※ バックエンドではパスワード等の認証情報は管理しない。

---

## API仕様

| Method | Path                                  | 概要                 |
| ------ | ------------------------------------- | -------------------- |
| GET    | /api/users/me                         | ログインユーザー取得 |
| GET    | /api/status/today                     | 今日の状態取得       |
| GET    | /api/categories                       | カテゴリ一覧取得     |
| GET    | /api/categories/{category_id}/actions | アクション一覧取得   |
| POST   | /api/users/me/action-logs             | アクション記録       |

※ APIの詳細仕様については Swagger にて管理している。

---

## データベース

- 使用DB：PostgreSQL
- マイグレーション : Alembic

### ER図（DB設計）

- 本プロジェクトのER図は draw.io を使用して作成している
- ER図ファイルはリポジトリ内で管理、docs/db/ 配下に配置している
- DBスキーマの変更を行う場合は、ER図 → マイグレーションの順で更新する

### マイグレーション方法

本プロジェクトでは、FastAPI + SQLAlchemy を使用しており、  
**マイグレーション管理には Alembic を利用**している。

#### マイグレーションの流れ

1. モデル（SQLAlchemy）を修正・追加
2. Alembic によりマイグレーションファイルを作成
3. マイグレーションを実行して DB に反映

#### マイグレーション管理方針

- マイグレーションファイルは backend/alembic/versions/ 配下で管理
- DBスキーマの変更は、直接DBを操作せず、必ずマイグレーション経由で行う

#### UNIQUE制約について

本アプリでは、アプリ仕様を DB レベルでも保証するため、以下の UNIQUE 制約を設定している。

- `users.firebase_uid`
  - Firebase Authentication の UID をユーザー識別子として利用
  - 同一ユーザーの重複登録を防止
- `action_logs (user_id, action_id, action_date)`
  - 1ユーザーが同一アクションを同一日に複数回実行できないよう制御
  - 「1日1回まで」という仕様を DB 制約としても担保
- `actions (category_id, title)`
  - 同一カテゴリ内で同じアクションが重複しないよう制御

上記理由から、本アプリでは daily_status テーブルは作成せず、
当日の状態は action_logs から算出する設計としている。
