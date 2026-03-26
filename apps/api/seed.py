from datetime import datetime, timedelta, timezone
from random import choice, randint

from app.core.security import get_password_hash
from app.db.base import Base
from app.db.models.feature_click import FeatureClick
from app.db.models.user import User
from app.db.session import SessionLocal, engine

FEATURES = [
    "date_filter",
    "age_filter",
    "gender_filter",
    "bar_chart_click_date_filter",
    "bar_chart_click_age_filter",
    "bar_chart_click_gender_filter",
]
GENDERS = ["Male", "Female", "Other"]


def run_seed() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if db.query(User).count() == 0:
            for idx in range(15):
                db.add(
                    User(
                        username=f"user_{idx+1}",
                        password=get_password_hash("password123"),
                        age=randint(15, 60),
                        gender=choice(GENDERS),
                    )
                )
            db.commit()

        users = db.query(User).all()
        now = datetime.now(timezone.utc)
        for _ in range(120):
            db.add(
                FeatureClick(
                    user_id=choice(users).id,
                    feature_name=choice(FEATURES),
                    timestamp=now - timedelta(days=randint(0, 20), hours=randint(0, 23)),
                )
            )
        db.commit()
        print("Seed completed with users and feature clicks.")
    finally:
        db.close()


if __name__ == "__main__":
    run_seed()
