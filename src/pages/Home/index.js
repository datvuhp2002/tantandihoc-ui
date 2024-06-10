import React, { useEffect, useState } from "react";
import styles from "./Home.module.scss";
import classNames from "classnames/bind";
import SlideCard from "~/layout/components/SlideCard";
import Input from "~/components/Input";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Card from "~/layout/components/Card";
import { capitalize } from "lodash";
import * as logo from "@fortawesome/free-solid-svg-icons";
import Button from "~/components/Button";
import WeekPicker from "~/layout/components/CustomDatePicker";
import { useDispatch } from "react-redux";
import requestApi from "~/utils/api";
import * as actions from "~/redux/actions";
import moment from "moment";
const cx = classNames.bind(styles);
const Home = () => {
  const dispatch = useDispatch();

  // useEffect(() => {
  //   if (!startDate || !endDate) {
  //     const currentDay = dayjs();
  //     const { startDate, endDate } = getWeekRange(currentDay);
  //     setStartDate(startDate);
  //     setEndDate(endDate);
  //   }
  //   const query = `?transaction_type=${transactionType}&start_date=${startDate}&end_date=${endDate}`;
  //   const promiseStatistics = requestApi(
  //     `/statistics/calculatorByRange${query}`,
  //     "GET"
  //   );
  //   const promiseStatisticsMonth = requestApi(
  //     `/statistics/calculatorByMonth?date=${startDate}`,
  //     "GET"
  //   );
  //   const promiseWallet = requestApi(`/wallet/getAll`, "GET");
  //   dispatch(actions.controlLoading(true));
  //   Promise.all([promiseStatistics, promiseStatisticsMonth, promiseWallet])
  //     .then((res) => {
  //       dispatch(actions.controlLoading(false));
  //       setStatisticsData(res[0].data);
  //       setTransactionsData(res[0].data.transaction.data);
  //       setStatisticsRangeMonthData(res[1].data);
  //       setTransactionRangeMonthData(res[1].data.transaction.data);
  //       setWalletData(res[2].data.data);
  //     })
  //     .catch((err) => {
  //       dispatch(actions.controlLoading(false));
  //     });
  // }, [startDate, endDate, transactionType]);
  return (
    <div className={cx("wrapper")}>
      <div className="mb-5">
        <div className={cx("", "d-flex row mt-5")}>
          <h1>Khóa học miễn phí</h1>
          <div className={cx("group-corse")}>
            <Card />
            <Card />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
