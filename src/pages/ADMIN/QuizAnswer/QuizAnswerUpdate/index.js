import React, { useState, useEffect } from "react";
import styles from "./QuizAnswerUpdate.module.scss";
import classNames from "classnames/bind";
import requestApi from "~/utils/api";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as actions from "~/redux/actions";
import Input from "~/components/Input";
import Button from "~/components/Button";
import Image from "~/components/Image";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faWrench } from "@fortawesome/free-solid-svg-icons";
const cx = classNames.bind(styles);
const QuizAnswerUpdate = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const navigation = useNavigate();
  const [thumbnail, setThumbnail] = useState("");
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const handleSubmitFormUpdate = async (data) => {
    dispatch(actions.controlLoading(true));
    await requestApi(`/categories/${params.id}`, "PUT", data)
      .then((res) => {
        dispatch(actions.controlLoading(false));
        toast.success("Cập nhật thành công", {
          position: "top-right",
          autoClose: 3000,
        });
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

  useEffect(() => {
    dispatch(actions.controlLoading(true));
    requestApi(`/categories/${params.id}`, "GET")
      .then((res) => {
        dispatch(actions.controlLoading(false));
        console.log(res.data);
        setValue("name", res.data.name);
        setValue("description", res.data.description);
      })
      .catch((err) => {
        console.log("err=>", err);
        dispatch(actions.controlLoading(false));
        toast.error(err.response.data.message, {
          position: "top-right",
          autoClose: 3000,
        });
      });
  }, []);

  return (
    <div className={cx("wrapper", "row d-flex ")}>
      <h1 className="mt-4 p-0">Categories Update</h1>
      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item">
          <Link to="/admin/dashboard">Dashboard</Link>
        </li>
        <li className="breadcrumb-item">
          <Link to="/admin/categories">Categories</Link>
        </li>
        <li className="breadcrumb-item">Category Update</li>
      </ol>
      <form className="d-flex align-item-center justify-content-between mb-5">
        <div className="col-12 col-md-7">
          <div className={cx("", "mb-3 mt-3")}>
            <label className="form-label">Tên thể loại:</label>
            <input
              type="text"
              className="form-control p-3 fs-5"
              placeholder="Tên thể loại..."
              {...register("name", {
                required: "Vui lòng nhập tên thể loại",
              })}
            ></input>
            {errors.name && (
              <p className="text-danger">{errors.name.message}</p>
            )}
          </div>
          <div className={cx("", "mb-3 mt-3")}>
            <label className="form-label">Miêu tả thể loại:</label>
            <input
              type="text"
              className="form-control p-3 fs-5"
              placeholder="Miêu tả thể loại..."
              {...register("description", {
                required: "Vui lòng viết miêu tả của thể loại",
              })}
            ></input>
            {errors.description && (
              <p className="text-danger">{errors.description.message}</p>
            )}
          </div>
          <div className="d-flex align-items-end justify-content-end">
            <Button
              onClick={handleSubmit(handleSubmitFormUpdate)}
              rightIcon={<FontAwesomeIcon icon={faWrench} />}
              className="btn"
            >
              Chỉnh sửa
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
export default QuizAnswerUpdate;
