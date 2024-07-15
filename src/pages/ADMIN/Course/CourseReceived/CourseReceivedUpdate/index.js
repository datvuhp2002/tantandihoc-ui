import React, { useState, useEffect } from "react";
import styles from "./CourseReceivedUpdate.module.scss";
import classNames from "classnames/bind";
import requestApi from "~/utils/api";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as actions from "~/redux/actions";
import { Button, Modal } from "react-bootstrap";
import Input from "~/components/Input";
import Btn from "~/components/Button";
import Image from "~/components/Image";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faPencilAlt,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
const cx = classNames.bind(styles);
const CourseReceivedUpdate = () => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const navigator = useNavigate();
  const params = useParams();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const handleSubmitFormUpdate = async (data) => {
    dispatch(actions.controlLoading(true));
    try {
      await requestApi(`/course-received/${params.id}`, "PUT", data);
      dispatch(actions.controlLoading(false));
      toast.success("Cập nhật thành công thành công", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      console.log("err=>", err);
      dispatch(actions.controlLoading(false));
      toast.error(err.response.data.message, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {
    requestApi(`/course-received/detail/${params.id}`, "GET")
      .then((res) => {
        setValue("name", res.data.name);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <div className={cx("wrapper", "row d-flex ")}>
      <div className="d-flex align-item-center justify-content-between">
        <div>
          <h1 className="mt-4 p-0">Cập nhật khóa học mang lại</h1>
          <ol className="breadcrumb mb-4">
            <li className="breadcrumb-item">
              <Link to="/admin/dashboard">Bảng tin</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/admin/course">Khóa học</Link>
            </li>
            <li className="breadcrumb-item">Cập nhật khóa học mang lại</li>
          </ol>
        </div>
      </div>
      <form>
        <div className={cx("", "col-md-6")}>
          <div className={cx("", "mb-3 mt-3")}>
            <label className="form-label">Khóa học mang lại:</label>
            <input
              type="text"
              className="form-control p-3 fs-5"
              placeholder="Khóa học mang lại..."
              {...register("name")}
            ></input>
          </div>
          <div className="d-flex justify-content-end">
            <Btn
              onClick={handleSubmit(handleSubmitFormUpdate)}
              className="btn"
              update
            >
              Cập nhật
            </Btn>
          </div>
        </div>
      </form>
    </div>
  );
};
export default CourseReceivedUpdate;
