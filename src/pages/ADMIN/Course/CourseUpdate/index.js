import React, { useState, useEffect } from "react";
import styles from "./CourseUpdate.module.scss";
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
const CourseUpdate = () => {
  const dispatch = useDispatch();
  const [thumbnail, setThumbnail] = useState("");
  const [categories, setCategories] = useState([]);
  const param = useParams();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const handleSubmitFormUpdate = async (data) => {
    let formData = new FormData();
    for (let key in data) {
      if (key === "thumbnail") {
        if (data[key] && data[key].length > 0) {
          formData.append(key, data[key][0]);
        }
      } else {
        formData.append(key, data[key]);
      }
    }
    dispatch(actions.controlLoading(true));
    try {
      const res = await requestApi(
        `/courses/${param.id}`,
        "PUT",
        formData,
        "json",
        "multipart/form-data"
      );
      dispatch(actions.controlLoading(false));
      toast.success("Cập nhật khoá học thành công", {
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
    requestApi(`/courses/${param.id}`, "GET").then((res) => {
      setValue("name", res.data.name);
      setValue("description", res.data.description);
      setThumbnail({
        img: res.data.thumbnail,
      });
    });
  }, []);

  return (
    <div className={cx("wrapper", "row d-flex")}>
      <h1 className="mt-4 p-0">Courses Update</h1>
      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item">
          <Link to="/admin/dashboard">Dashboard</Link>
        </li>
        <li className="breadcrumb-item">
          <Link to="/admin/course">Courses</Link>
        </li>
        <li className="breadcrumb-item">Courses Update</li>
      </ol>
      <form>
        <div className={cx("", "col-md-6")}>
          <div className={cx("", "mb-3 mt-3")}>
            <label className="form-label">Tên khóa học:</label>
            <input
              type="text"
              className="form-control p-3"
              placeholder="Tên khóa học"
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
              className="form-control p-3 "
              placeholder="Miêu tả khóa học"
              {...register("description", {
                required: "Vui lòng viết miêu tả của khóa học",
              })}
            ></input>
            {errors.description && (
              <p className="text-danger">{errors.description.message}</p>
            )}
          </div>
          <div className={cx("", "mb-3 mt-3")}>
            <label htmlFor="file" className={cx("btn_changeThumbnail")}>
              thêm bìa bài viết
            </label>
            {thumbnail.img && (
              <Image
                avatar_profile
                rounded
                src={`${process.env.REACT_APP_API_URL}/${thumbnail.img}`}
              ></Image>
            )}
            <input
              id="file"
              type="file"
              accept="image/*"
              className="d-none"
              {...register("thumbnail", {
                onChange: onImageChange,
              })}
            />
            {errors.thumbnail && (
              <p className="text-danger">{errors.thumbnail.message}</p>
            )}
          </div>
          <Button
            onClick={handleSubmit(handleSubmitFormUpdate)}
            className="btn"
          >
            Cập nhật
          </Button>
        </div>
      </form>
    </div>
  );
};
export default CourseUpdate;
