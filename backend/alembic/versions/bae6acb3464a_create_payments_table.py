"""create payments table

Revision ID: bae6acb3464a
Revises: 274626ddbd46
Create Date: 2026-02-19 07:12:00.478800

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'bae6acb3464a'
down_revision: Union[str, Sequence[str], None] = '274626ddbd46'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        "payments",
        sa.Column("id", sa.UUID(), primary_key=True),
        sa.Column("user_id", sa.UUID(), nullable=True),
        sa.Column("stripe_payment_id", sa.String(), nullable=False, unique=True),
        sa.Column("amount", sa.Integer(), nullable=False),
        sa.Column("currency", sa.String(length=3), nullable=False),
        sa.Column("status", sa.String(), nullable=False),
        sa.Column("paid_at", sa.DateTime(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
    )

def downgrade() -> None:
    """Downgrade schema."""
    op.drop_table("payments")