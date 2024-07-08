import React, { useState, useEffect } from "react";
import styles from "./CourseReceived.module.scss";
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
import { Link, useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faPencilAlt,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
const cx = classNames.bind(styles);
const CourseReceived = () => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const navigator = useNavigate();
  const params = useParams();
  const [thumbnail, setThumbnail] = useState("");
  const [categories, setCategories] = useState([]);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const handleSubmitFormAdd = async (data) => {
    dispatch(actions.controlLoading(true));
    data.course_id = Number(params.id);
    try {
      await requestApi("/course-received", "POST", data);
      dispatch(actions.controlLoading(false));
      toast.success("Thêm thành công", {
        position: "top-right",
        autoClose: 3000,
      });
      setValue("name", "");
    } catch (err) {
      console.log("err=>", err);
      dispatch(actions.controlLoading(false));
      toast.error(err.response.data.message, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };
  const handleDelete = async () => {
    setShowModal(true);
  };
  const requestDeleteApi = async () => {
    console.log("delete");
    try {
      await requestApi(`/courses/${params.id}`, "DELETE");
      dispatch(actions.controlLoading(false));
      toast.success("Hủy thành công", {
        position: "top-right",
        autoClose: 3000,
      });
      navigator("/admin/course");
    } catch (err) {
      console.log("err=>", err);
      dispatch(actions.controlLoading(false));
      toast.error(err.response.data.message, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };
  const onImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      let reader = new FileReader();
      reader.onload = (e) => {
        setThumbnail({
          img: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };
  useEffect(() => {}, []);

  return (
    <div className={cx("wrapper", "row d-flex ")}>
      <div className="d-flex align-item-center justify-content-between">
        <div>
          <h1 className="mt-4 p-0">Courses Received</h1>
          <ol className="breadcrumb mb-4">
            <li className="breadcrumb-item">
              <Link to="/admin/dashboard">Dashboard</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/admin/course">Courses</Link>
            </li>
            <li className="breadcrumb-item">Courses Add</li>
            <li className="breadcrumb-item">Course Received</li>
          </ol>
        </div>
        <div
          className={cx(
            "",
            "col-md-6 align-item-center justify-content-center d-flex"
          )}
        >
          <div className="d-flex align-items-center">
            <Btn
              onClick={handleDelete}
              className="btn btn-danger"
              leftIcon={<FontAwesomeIcon icon={faTrash} />}
            >
              Hủy tạo
            </Btn>
          </div>
          <div className="d-flex align-items-center ms-2">
            <Btn
              className="btn "
              leftIcon={<FontAwesomeIcon icon={faPencilAlt} />}
            >
              Nháp
            </Btn>
          </div>
          <div className="d-flex align-items-center ms-2">
            <Btn
              className="btn"
              rightIcon={<FontAwesomeIcon icon={faArrowRight} />}
              onClick={() => navigator(`/admin/lesson/lesson-add/${params.id}`)}
            >
              Tiếp tục
            </Btn>
          </div>
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
            <Btn onClick={handleSubmit(handleSubmitFormAdd)} className="btn">
              Tạo
            </Btn>
          </div>
        </div>
      </form>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure want to delete?</Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShowModal(false)} className="p-2 fs-5">
            Close
          </Button>
          <Button className="btn-danger p-2 fs-5" onClick={requestDeleteApi}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default CourseReceived;
