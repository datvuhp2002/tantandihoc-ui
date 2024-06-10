import React, { useEffect, useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import dayjs from "dayjs";
import moment from "moment";
import "~/helper/vi";
import { Wrapper } from "../../Popper";
export default function BarChartLayout({ data, startDate, endDate }) {
  const [recordDates, setRecordDates] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [revenues, setRevenues] = useState([]);
  useEffect(() => {
    if (data && data.data && data.data.length > 0) {
      const extractedRecordDates = data.data.map((item) =>
        dayjs(item.recordDate).format("YYYY-MM-DD")
      );
      const extractedExpenses = data.data.map((item) => item.expense);
      const extractedRevenues = data.data.map((item) => item.revenue);
      setRecordDates(extractedRecordDates);
      setExpenses(extractedExpenses);
      setRevenues(extractedRevenues);
    } else {
      setRecordDates([]);
      setExpenses([]);
      setRevenues([]);
    }
  }, [data]);
  if (
    recordDates.length === 0 ||
    expenses.length === 0 ||
    revenues.length === 0
  ) {
    return (
      <Wrapper className="p-3">
        <h2 className="">
          Không có thống kê nào từ ngày{" "}
          {moment(startDate).local("vi").format("LL")} đến ngày{" "}
          {moment(endDate).local("vi").format("LL")}
        </h2>
      </Wrapper>
    );
  }
  return (
    <BarChart
      height={300}
      series={[
        { data: expenses, label: "Chi", id: "expenseId" },
        { data: revenues, label: "Thu", id: "revenueId" },
      ]}
      xAxis={[{ data: recordDates, scaleType: "band" }]}
    />
  );
}
