import React, { useState, useEffect } from "react";
import styles from "./CreatePost.module.scss";
import classNames from "classnames/bind";
import requestApi from "~/utils/api";
import { useDispatch } from "react-redux";
import DataTable from "~/layout/common/DataTable";
import { Link } from "react-router-dom";
import moment from "moment";
import "~/helper/vi";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
const cx = classNames.bind(styles);
const CreatePost = () => {
  const dispatch = useDispatch();

  // useEffect(() => {
  //   console.log(transactionType);
  //   if (!startDate || !endDate) {
  //     const currentDay = dayjs();
  //     const { startDate, endDate } = getWeekRange(currentDay);
  //     setStartDate(startDate);
  //     setEndDate(endDate);
  //   }
  //   const query = `?start_date=${startDate}&end_date=${endDate}&transaction_type=${transactionType}`;
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
  //       setNumOfPages(res[0].data.lastPage);
  //       setStatisticsData(res[0].data);
  //       setTransactionsData(res[0].data.transaction.data);
  //       console.log(res[0].data.transaction.data);
  //       setWalletData(res[2].data.data);
  //     })
  //     .catch((err) => {
  //       dispatch(actions.controlLoading(false));
  //     });
  // }, [startDate, endDate, searchString, transactionType]);
  return <div className={cx("wrapper", "row d-flex ")}>CreatePost</div>;
};
export default CreatePost;
