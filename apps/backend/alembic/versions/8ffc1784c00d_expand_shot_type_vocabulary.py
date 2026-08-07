"""expand shot_type vocabulary

Revision ID: 8ffc1784c00d
Revises: 8f3fa93eeda1
Create Date: 2026-08-07 01:48:56.237845

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '8ffc1784c00d'
down_revision: Union[str, Sequence[str], None] = '8f3fa93eeda1'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


NEW_SHOT_TYPES = (
    "FH_SMASH", "BH_SMASH", "STICK_SMASH", "JUMP_SMASH",
    "FH_CLEAR", "BH_CLEAR",
    "FH_DROP", "BH_DROP",
    "FH_DRIVE", "BH_DRIVE",
    "NET_PUSH",
)

OLD_SHOT_TYPES = (
    "FH_SMASH", "BH_SMASH", "FH_CLEAR", "BH_CLEAR",
    "FH_DROP", "BH_DROP", "FH_DRIVE", "NET_PUSH",
)


def upgrade() -> None:
    # shots table
    op.drop_constraint("ck_shots_shot_type_valid", "shots", type_="check")
    op.create_check_constraint(
        "ck_shots_shot_type_valid", "shots",
        f"shot_type IN {NEW_SHOT_TYPES}"
    )

    # analyses table
    op.drop_constraint("ck_analyses_shot_type_valid", "analyses", type_="check")
    op.create_check_constraint(
        "ck_analyses_shot_type_valid", "analyses",
        f"shot_type IN {NEW_SHOT_TYPES}"
    )

    # personal_baselines table
    op.drop_constraint("ck_baseline_shot_type_valid", "personal_baselines", type_="check")
    op.create_check_constraint(
        "ck_baseline_shot_type_valid", "personal_baselines",
        f"shot_type IN {NEW_SHOT_TYPES}"
    )


def downgrade() -> None:
    op.drop_constraint("ck_shots_shot_type_valid", "shots", type_="check")
    op.create_check_constraint(
        "ck_shots_shot_type_valid", "shots",
        f"shot_type IN {OLD_SHOT_TYPES}"
    )

    op.drop_constraint("ck_analyses_shot_type_valid", "analyses", type_="check")
    op.create_check_constraint(
        "ck_analyses_shot_type_valid", "analyses",
        f"shot_type IN {OLD_SHOT_TYPES}"
    )

    op.drop_constraint("ck_baseline_shot_type_valid", "personal_baselines", type_="check")
    op.create_check_constraint(
        "ck_baseline_shot_type_valid", "personal_baselines",
        f"shot_type IN {OLD_SHOT_TYPES}"
    )