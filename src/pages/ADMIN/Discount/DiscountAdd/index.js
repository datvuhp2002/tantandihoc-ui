import React, { useState, useEffect } from "react";
import styles from "./DiscountAdd.module.scss";
import classNames from "classnames/bind";
import requestApi from "~/utils/api";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as actions from "~/redux/actions";
import Input from "~/components/Input";
import Button from "~/components/Button";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faSquarePlus } from "@fortawesome/free-solid-svg-icons";
const cx = classNames.bind(styles);

const DiscountAdd = () => {
  const dispatch = useDispatch();
  const navigation = useNavigate();
  const [thumbnail, setThumbnail] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm();

  const startDate = watch("start_date");
  const endDate = watch("end_date");

  const handleSubmitFormAdd = async (data) => {
    const formatData = {
      value: Number(data.value),
      name: data.name,
      type: data.type,
      start_date: new Date(data.start_date).toISOString(),
      end_date: new Date(data.end_date).toISOString(),
    };
    console.log(formatData);

    dispatch(actions.controlLoading(true));
    await requestApi("/discount", "POST", formatData)
      .then((res) => {
        dispatch(actions.controlLoading(false));
        toast.success("Thêm mã giảm thành công", {
          position: "top-right",
          autoClose: 3000,
        });
        navigation("/admin/discount");
      })
      .catch((err) => {
        console.log("err=>", err);
        dispatch(actions.controlLoading(false));
        toast.error(err.response.data.message, {
          position: "top-right",
          autoClose: 3000,
        });
      });
  };

  useEffect(() => {}, []);

  return (
    <div className={cx("wrapper", "row d-flex ")}>
      <h1 className="mt-4 p-0">Discount Add</h1>
      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item">
          <Link to="/admin/dashboard">Dashboard</Link>
        </li>
        <li className="breadcrumb-item">
          <Link to="/admin/discount">Discount</Link>
        </li>
        <li className="breadcrumb-item">Discount Add</li>
      </ol>
      <form
        className="row d-flex align-item-center justify-content-between mb-5"
        onSubmit={handleSubmit(handleSubmitFormAdd)}
      >
        <div className="col-md-7">
          <div className={cx("", "mb-3 mt-3")}>
            <label className="form-label">Tên mã giảm giá:</label>
            <input
              type="text"
              className="form-control p-3 fs-5"
              placeholder="Tên mã giảm giá..."
              {...register("name", {
                required: "Vui lòng nhập tên mã giảm giá",
              })}
            ></input>
            {errors.name && (
              <p className="text-danger">{errors.name.message}</p>
            )}
          </div>
          <div className={cx("", "mb-3 mt-3")}>
            <label htmlFor="type">Loại giảm giá</label>
            <select
              id="type"
              className="form-control"
              {...register("type", {
                required: "Vui lòng chọn loại giảm giá",
              })}
            >
              <option value="percentage">Phần trăm</option>
              <option value="fixed">Giá trị</option>
            </select>
            {errors.type && (
              <p className="text-danger">{errors.type.message}</p>
            )}
          </div>
          <div className={cx("", "mb-3 mt-3")}>
            <label className="form-label">Giá trị:</label>
            <input
              type="text"
              className="form-control p-3 fs-5"
              placeholder="Giá trị giảm giá..."
              {...register("value", {
                required: "Vui lòng nhập giá trị giảm giá",
              })}
            ></input>
            {errors.value && (
              <p className="text-danger">{errors.value.message}</p>
            )}
          </div>
          <div className={cx("", "mb-3 mt-3")}>
            <label htmlFor="start_date">Ngày bắt đầu</label>
            <input
              className="w-100 p-2"
              type="datetime-local"
              id="start_date"
              {...register("start_date", {
                required: "Vui lòng nhập ngày bắt đầu giảm giá",
              })}
            />
            {errors.start_date && (
              <p className="text-danger">{errors.start_date.message}</p>
            )}
          </div>
          <div className={cx("", "mb-3 mt-3")}>
            <label htmlFor="end_date">Ngày kết thúc</label>
            <input
              className="w-100 p-2"
              type="datetime-local"
              id="end_date"
              {...register("end_date", {
                required: "Vui lòng nhập ngày kết thúc giảm giá",
                validate: (value) =>
                  new Date(value) >= new Date(startDate) ||
                  "Ngày kết thúc phải sau ngày bắt đầu",
              })}
            />
            {errors.end_date && (
              <p className="text-danger">{errors.end_date.message}</p>
            )}
          </div>
          <div className="d-flex align-items-end justify-content-end">
            <Button type="submit" className="btn" create>
              Tạo
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DiscountAdd;
