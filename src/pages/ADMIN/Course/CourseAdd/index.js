import React, { useState, useEffect } from "react";
import styles from "./CourseAdd.module.scss";
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
const cx = classNames.bind(styles);
const CourseAdd = () => {
  const dispatch = useDispatch();
  const navigation = useNavigate();
  const [thumbnail, setThumbnail] = useState("");
  const [categories, setCategories] = useState([]);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const handleSubmitFormAdd = async (data) => {
    let formData = new FormData();
    for (let key in data) {
      if (key == "thumbnail") {
        formData.append(key, data[key][0]);
      } else {
        formData.append(key, data[key]);
      }
    }
    dispatch(actions.controlLoading(true));
    try {
      const res = await requestApi(
        "/courses",
        "POST",
        formData,
        "json",
        "multipart/form-data"
      );
      dispatch(actions.controlLoading(false));
      toast.success("Thêm khoá học thành công", {
        position: "top-right",
        autoClose: 3000,
      });
      navigation(`/admin/course/course-received-add/${res.data.id}`);
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
  useEffect(() => {
    dispatch(actions.controlLoading(true));
    requestApi("/categories", "GET")
      .then((res) => {
        console.log("res=>", res.data);
        setCategories(res.data.data);
        dispatch(actions.controlLoading(false));
      })
      .catch((err) => {
        console.error(err);
        dispatch(actions.controlLoading(false));
      });
  }, []);

  return (
    <div className={cx("wrapper", "row d-flex ")}>
      <h1 className="mt-4 p-0">Courses Add</h1>
      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item">
          <Link to="/admin/dashboard">Dashboard</Link>
        </li>
        <li className="breadcrumb-item">
          <Link to="/admin/course">Courses</Link>
        </li>
        <li className="breadcrumb-item">Courses Add</li>
      </ol>
      <form className=" row d-flex align-item-center justify-content-between mb-5">
        <div className="col-md-7">
          <div className={cx("", "mb-3 mt-3")}>
            <label className="form-label">Thể loại khóa học:</label>
            <select
              type="text"
              className="form-control"
              placeholder="Nội dung khóa học của bạn"
              {...register("categoryId", {
                required: "Vui lòng viết nội dung của khóa học",
              })}
            >
              {categories.map((item, index) => {
                return (
                  <option key={index} value={item.id}>
                    {item.name}
                  </option>
                );
              })}
            </select>
            {errors.category_id && (
              <p className="text-danger">{errors.category_id.message}</p>
            )}
          </div>
          <div className={cx("", "mb-3 mt-3")}>
            <label className="form-label">Tên khóa học:</label>
            <input
              type="text"
              className="form-control p-3 fs-5"
              placeholder="Tên khóa học..."
              {...register("name", {
                required: "Vui lòng nhập tên khóa học",
              })}
            ></input>
            {errors.name && (
              <p className="text-danger">{errors.name.message}</p>
            )}
          </div>
          <div className={cx("", "mb-3 mt-3")}>
            <label className="form-label">Miêu tả khóa học:</label>
            <input
              type="text"
              className="form-control p-3 fs-5"
              placeholder="Miêu tả khóa học..."
              {...register("description", {
                required: "Vui lòng viết miêu tả của khóa học",
              })}
            ></input>
            {errors.description && (
              <p className="text-danger">{errors.description.message}</p>
            )}
          </div>
        </div>
        <div
          className={cx(
            "",
            "mb-3 mt-3 col-md-5 d-flex flex-column align-items-center "
          )}
        >
          <label htmlFor="file" className={cx("btn_changeThumbnail", "mb-3")}>
            Thêm bìa khóa học
          </label>
          {thumbnail.img && <Image avatar_profile src={thumbnail.img}></Image>}
          <input
            id="file"
            type="file"
            accept="image/*"
            className="d-none"
            {...register("thumbnail", {
              required: "Vui lòng viết thêm ảnh của khóa học",
              onChange: onImageChange,
            })}
          />
          {errors.thumbnail && (
            <p className="text-danger">{errors.thumbnail.message}</p>
          )}
        </div>
      </form>
      <div className="d-flex align-items-center justify-content-end">
        <Button
          onClick={handleSubmit(handleSubmitFormAdd)}
          rightIcon={<FontAwesomeIcon icon={faArrowRight} />}
          className="btn"
        >
          Tiếp tục
        </Button>
      </div>
    </div>
  );
};
export default CourseAdd;
