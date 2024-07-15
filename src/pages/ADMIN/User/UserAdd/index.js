import React, { useState, useEffect } from "react";
import styles from "./UserAdd.module.scss";
import classNames from "classnames/bind";
import requestApi from "~/utils/api";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as actions from "~/redux/actions";
import Input from "~/components/Input";
import Button from "~/components/Button";
import Image from "~/components/Image";
import { Link, useNavigate } from "react-router-dom";
const cx = classNames.bind(styles);
const UserAdd = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [thumbnail, setThumbnail] = useState("");
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const handleSubmitFormAdd = async (data) => {
    console.log("data form =>", data);
    dispatch(actions.controlLoading(true));
    try {
      const res = await requestApi("/users", "POST", data);
      console.log("res=>", res);
      dispatch(actions.controlLoading(false));
      toast.success("Tạo người dùng thành công", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/admin/user");
    } catch (err) {
      console.log("err=>", err.message);
      dispatch(actions.controlLoading(false));
      toast.error(err.response.data.message, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };
  useEffect(() => {}, []);
  return (
    <div className={cx("wrapper", "row d-flex ")}>
      <div className="container-fluid px-4">
        <h1 className="mt-4">Tạo người dùng</h1>
        <ol className="breadcrumb mb-4">
          <li className="breadcrumb-item">
            <Link to="/admin/dashboard">Bảng tin</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/admin/user">Người dùng</Link>
          </li>
          <li className="breadcrumb-item">Tạo người dùng</li>
        </ol>
        <form>
          <div className={cx("", "col-md-6")}>
            <div className={cx("", "mb-3 mt-3")}>
              <label className="form-label">Họ tên người dùng:</label>
              <input
                type="text"
                className="form-control p-3 fs-5"
                placeholder="Họ tên..."
                {...register("fullname", {
                  required: "Vui lòng nhập họ tên người dùng",
                })}
              ></input>
              {errors.fullname && (
                <p className="text-danger">{errors.fullname.message}</p>
              )}
            </div>
            <div className={cx("", "mb-3 mt-3")}>
              <label className="form-label">Tên người dùng:</label>
              <input
                type="text"
                className="form-control p-3 fs-5"
                placeholder="Tên người dùng..."
                {...register("username", {
                  required: "Vui lòng nhập username",
                })}
              ></input>
              {errors.username && (
                <p className="text-danger">{errors.username.message}</p>
              )}
            </div>
            <div className={cx("", "mb-3 mt-3")}>
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control p-3 fs-5"
                placeholder="Email..."
                {...register("email", {
                  required: "Vui lòng viết tóm tắt của bài viết",
                })}
              ></input>
              {errors.email && (
                <p className="text-danger">{errors.email.message}</p>
              )}
            </div>
            <div className={cx("", "mb-3 mt-3")}>
              <label className="form-label">Mật khẩu</label>
              <input
                type="password"
                className="form-control p-3 fs-5"
                placeholder="Password..."
                {...register("password", {
                  required: "Vui lòng viết tóm tắt của bài viết",
                })}
              ></input>
              {errors.password && (
                <p className="text-danger">{errors.password.message}</p>
              )}
            </div>
            <div className={cx("", "mb-3 mt-3")}>
              <label className="form-label">Chức vụ người dùng:</label>
              <select
                type="text"
                className="form-control p-3 fs-5"
                placeholder="Chức vụ"
                {...register("roles", {
                  required: "Vui lòng viết nội dung của bài viết",
                })}
              >
                <option selected value="User">
                  Người dùng
                </option>
                <option value="Admin">Quản trị viên</option>
              </select>
              {errors.role && (
                <p className="text-danger">{errors.role.message}</p>
              )}
            </div>
            <div className="d-flex align-items-center justify-content-end">
              <Button onClick={handleSubmit(handleSubmitFormAdd)} create>
                Tạo
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
export default UserAdd;
