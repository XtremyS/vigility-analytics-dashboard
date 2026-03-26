from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.db.models.feature_click import FeatureClick


def track_feature_click(
    db: Session, user_id: int, feature_name: str, timestamp: datetime | None = None
) -> None:
    click = FeatureClick(
        user_id=user_id,
        feature_name=feature_name,
        timestamp=timestamp or datetime.now(timezone.utc),
    )
    db.add(click)
    db.commit()
