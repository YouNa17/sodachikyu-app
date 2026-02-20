# Stripe SDK の初期設定
import stripe
import os

# Stripe SDK にAPIキーを設定
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
