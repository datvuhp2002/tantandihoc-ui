import * as React from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import dayjs from "dayjs";
import moment from "moment";
import "~/helper/vi";
import { Wrapper } from "../../Popper";

export default function PieChartLayout({ data, startDate, endDate }) {
  const [recordDates, setRecordDates] = React.useState([]);
  const [expenses, setExpenses] = React.useState([]);
  const [revenues, setRevenues] = React.useState([]);

  React.useEffect(() => {
    console.log(data);
    if (data && data.data && data.data.length > 0) {
      const extractedRecordDates = data.data.map((item) =>
        dayjs(item.recordDate).format("YYYY-MM-DD")
      );
      const extractedExpenses = data.transaction.data
        .filter((item) => item.transactionType === "Expense")
        .map((item) => ({
          recordDate: item.recordDate,
          transactionType: item.transactionType,
          bill: item.bill,
          note: item.note,
          paymentImage: item.paymentImage,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          deletedAt: item.deletedAt,
          deleteMark: item.deleteMark,
          user_id: item.user_id,
          wallet_id: item.wallet_id,
          category_id: item.category_id,
          currency_id: item.currency_id,
          categoriesGroup_id: item.categoriesGroup_id,
        }));
      const extractedRevenues = data.transaction.data
        .filter((item) => item.transactionType === "Revenue")
        .map((item) => ({
          recordDate: item.recordDate,
          transactionType: item.transactionType,
          bill: item.bill,
          note: item.note,
          paymentImage: item.paymentImage,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          deletedAt: item.deletedAt,
          deleteMark: item.deleteMark,
          user_id: item.user_id,
          wallet_id: item.wallet_id,
          category_id: item.category_id,
          currency_id: item.currency_id,
          categoriesGroup_id: item.categoriesGroup_id,
        }));
      console.log("RecordDate", extractedExpenses);
      console.log("Expenses", extractedExpenses);
      console.log("Thu", extractedRevenues);
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
    <div className="d-flex">
      <Wrapper chart className="p-3 w-50 ">
        <h2 className="">Biểu đồ doanh thu:</h2>
        <PieChart
          series={[
            {
              data: revenues.map((revenue, index) => ({
                id: index,
                value: revenue.bill,
                label: `${revenue.note}-${revenue.bill}`,
              })),
              highlightScope: { faded: "global", highlighted: "item" },
              faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
            },
          ]}
          height={200}
        />
      </Wrapper>

      <Wrapper className="p-3 w-50 ms-3">
        <h2 className="">Biểu đồ Chi phí:</h2>
        <PieChart
          series={[
            {
              data: expenses.map((expense, index) => ({
                id: index,
                value: expense.bill,
                label: expense.note,
              })),
              highlightScope: { faded: "global", highlighted: "item" },
              faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
            },
          ]}
          height={200}
        />
      </Wrapper>
    </div>
  );
}
