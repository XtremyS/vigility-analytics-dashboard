from datetime import datetime

from pydantic import BaseModel, Field


class TrackRequest(BaseModel):
    feature_name: str = Field(min_length=2, max_length=128)
    timestamp: datetime | None = None
