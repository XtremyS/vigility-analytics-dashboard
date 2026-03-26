from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.models.user import User
from app.db.session import get_db
from app.schemas.analytics import AnalyticsResponse
from app.services.analytics_service import get_analytics

router = APIRouter()


@router.get("/analytics", response_model=AnalyticsResponse)
def analytics(
    start_date: str | None = Query(None),
    end_date: str | None = Query(None),
    age_group: str | None = Query(None),
    gender: str | None = Query(None),
    feature_name: str | None = Query(None),
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    return get_analytics(db, start_date, end_date, age_group, gender, feature_name)
