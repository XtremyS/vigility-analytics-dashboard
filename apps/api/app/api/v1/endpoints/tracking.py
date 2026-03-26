from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.models.user import User
from app.db.session import get_db
from app.schemas.tracking import TrackRequest
from app.services.tracking_service import track_feature_click

router = APIRouter()


@router.post("/track")
def track(
    payload: TrackRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    track_feature_click(db, current_user.id, payload.feature_name, payload.timestamp)
    return {"message": "tracked"}
