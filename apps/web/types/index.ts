export type BarPoint = {
  feature_name: string;
  total_clicks: number;
};

export type LinePoint = {
  bucket: string;
  clicks: number;
};

export type AnalyticsResponse = {
  bar_data: BarPoint[];
  line_data: LinePoint[];
};
