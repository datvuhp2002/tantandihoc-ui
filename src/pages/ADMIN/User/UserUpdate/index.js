import React, { useState, useEffect } from "react";
import styles from "./UserUpdate.module.scss";
import classNames from "classnames/bind";
import requestApi from "~/utils/api";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as actions from "~/redux/actions";
import Input from "~/components/Input";
import Button from "~/components/Button";
import Image from "~/components/Image";
import { Link, useParams } from "react-router-dom";
const cx = classNames.bind(styles);
const UserUpdate = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const [thumbnail, setThumbnail] = useState("");
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [userId, setUserId] = useState();
  const handleSubmitFormUpdate = async (data) => {
    try {
      const res = await requestApi(`/users/${userId}`, "PUT", data);
      dispatch(actions.controlLoading(false));
      toast.success("Cập nhật người dùng thành công", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      console.log("err=>", err.message);
      dispatch(actions.controlLoading(false));
      toast.error(err.response.data.message, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };
  useEffect(() => {
    requestApi(`/users/${params.id}`, "GET")
      .then((res) => {
        setUserId(res.data.id);
        setValue("fullname", res.data.fullname);
        setValue("roles", res.data.roles);
        setValue("username", res.data.username);
        setValue("email", res.data.email);
      })
      .catch((err) => console.log(err.response.data.message));
  }, []);
  return (
    <div className={cx("wrapper", "row d-flex ")}>
      <div className="container-fluid px-4">
        <h1 className="mt-4">Cập nhật thông tin người dùng</h1>
        <ol className="breadcrumb mb-4">
          <li className="breadcrumb-item">
            <Link to="/admin/dashboard">Bảng tin</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/admin/user">Người dùng</Link>
          </li>
          <li className="breadcrumb-item">Cập nhật thông tin người dùng</li>
        </ol>
        <form className="row">
          <div className={cx("", "col-md-6 col-12")}>
            <div className={cx("", "mb-3 mt-3")}>
              <label className="form-label">Họ tên người dùng:</label>
              <input
                type="text"
                className="form-control p-3 fs-5"
                placeholder="Họ tên người dùng..."
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
                placeholder="Username..."
                {...register("username", {
                  required: "Vui lòng nhập tên người dùng",
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
              <Button onClick={handleSubmit(handleSubmitFormUpdate)} update>
                Cập nhật
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
export default UserUpdate;
