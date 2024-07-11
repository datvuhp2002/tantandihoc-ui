import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";

export default function Chart({ data }) {
  const barCategories = data.map((item) => `Tháng ${item.month}`);
  const seriesData = data.map((item) => item.count);

  return (
    <BarChart
      xAxis={[
        {
          id: "barCategories",
          data: barCategories,
          scaleType: "band",
        },
      ]}
      series={[
        {
          data: seriesData,
        },
      ]}
      width={500}
      height={300}
    />
  );
}
