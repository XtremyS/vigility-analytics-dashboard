from pydantic import BaseModel


class BarDataPoint(BaseModel):
    feature_name: str
    total_clicks: int


class LineDataPoint(BaseModel):
    bucket: str
    clicks: int


class AnalyticsResponse(BaseModel):
    bar_data: list[BarDataPoint]
    line_data: list[LineDataPoint]
