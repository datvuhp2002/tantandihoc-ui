import React, { useState, useEffect } from "react";
import styles from "./Blog.module.scss";
import classNames from "classnames/bind";
import SlideCard from "~/layout/components/SlideCard";
import Input from "~/components/Input";
import Button from "~/components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button as BTN, Modal } from "react-bootstrap";
import {
  faBuildingColumns,
  faCartShopping,
  faEye,
  faPencil,
  faPhone,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import Card from "~/layout/components/Card";
import dayjs from "dayjs";
import WeekPicker from "~/layout/components/CustomDatePicker";
import * as actions from "~/redux/actions";
import requestApi from "~/utils/api";
import { useDispatch } from "react-redux";
import DataTable from "~/layout/common/DataTable";
import { Link } from "react-router-dom";
import moment from "moment";
import "~/helper/vi";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
const cx = classNames.bind(styles);
const Blog = () => {
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
  return <div className={cx("wrapper", "row d-flex ")}>blog</div>;
};
export default Blog;
