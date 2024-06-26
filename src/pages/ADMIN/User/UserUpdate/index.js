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
import { useParams } from "react-router-dom";
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
  const handleSubmitFormAdd = async (data) => {
    dispatch(actions.controlLoading(true));
    try {
      const res = await requestApi("/users", "POST", data);
      dispatch(actions.controlLoading(false));
      toast.success("Tạo người dùng thành công", {
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
        console.log(res.data);
        setValue("username", res.data.username);
        setValue("email", res.data.email);
      })
      .catch((err) => console.log(err.response.data.message));
  }, []);
  return (
    <div className={cx("wrapper", "row d-flex ")}>
      <form>
        <div className={cx("", "col-md-6")}>
          <div className={cx("", "mb-3 mt-3")}>
            <label className="form-label">Username người dùng:</label>
            <input
              type="text"
              className="form-control"
              placeholder="Username..."
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
              className="form-control"
              placeholder="Email..."
              {...register("email", {
                required: "Vui lòng viết tóm tắt của bài viết",
              })}
            ></input>
            {errors.email && (
              <p className="text-danger">{errors.email.message}</p>
            )}
          </div>
          {/* <div className={cx("", "mb-3 mt-3")}>
            <label className="form-label">Chức vụ người dùng:</label>
            <select
              type="text"
              className="form-control"
              placeholder="Chức vụ"
              {...register("role", {
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
          </div> */}
          <Button
            onClick={handleSubmit(handleSubmitFormAdd)}
            className="btn btn-success"
          >
            Cập nhật
          </Button>
        </div>
      </form>
    </div>
  );
};
export default UserUpdate;
