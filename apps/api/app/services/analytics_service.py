from sqlalchemy import func
from sqlalchemy.orm import Session

from app.db.models.feature_click import FeatureClick
from app.db.models.user import User
from app.schemas.analytics import AnalyticsResponse


def _apply_user_filters(query, age_group: str | None, gender: str | None):
    if age_group == "<18":
        query = query.filter(User.age < 18)
    elif age_group == "18-40":
        query = query.filter(User.age >= 18, User.age <= 40)
    elif age_group == ">40":
        query = query.filter(User.age > 40)

    if gender:
        query = query.filter(User.gender == gender)

    return query


def get_analytics(
    db: Session,
    start_date: str | None,
    end_date: str | None,
    age_group: str | None,
    gender: str | None,
    feature_name: str | None,
) -> AnalyticsResponse:
    base_query = db.query(FeatureClick).join(User, User.id == FeatureClick.user_id)
    if start_date:
        base_query = base_query.filter(FeatureClick.timestamp >= start_date)
    if end_date:
        base_query = base_query.filter(FeatureClick.timestamp <= end_date)
    base_query = _apply_user_filters(base_query, age_group, gender)

    bar_rows = (
        base_query.with_entities(
            FeatureClick.feature_name,
            func.count(FeatureClick.id).label("total_clicks"),
        )
        .group_by(FeatureClick.feature_name)
        .order_by(func.count(FeatureClick.id).desc())
        .all()
    )

    selected_feature = feature_name or (bar_rows[0][0] if bar_rows else None)
    line_data = []
    if selected_feature:
        line_rows = (
            base_query.filter(FeatureClick.feature_name == selected_feature)
            .with_entities(
                func.date(FeatureClick.timestamp).label("bucket"),
                func.count(FeatureClick.id).label("clicks"),
            )
            .group_by(func.date(FeatureClick.timestamp))
            .order_by(func.date(FeatureClick.timestamp))
            .all()
        )
        line_data = [{"bucket": str(row.bucket), "clicks": row.clicks} for row in line_rows]

    return AnalyticsResponse(
        bar_data=[
            {"feature_name": row.feature_name, "total_clicks": row.total_clicks}
            for row in bar_rows
        ],
        line_data=line_data,
    )
