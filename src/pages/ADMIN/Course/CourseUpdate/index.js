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
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

const cx = classNames.bind(styles);

const CourseUpdate = () => {
  const dispatch = useDispatch();
  const [thumbnail, setThumbnail] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [discount, setDiscount] = useState([]);
  const param = useParams();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchCourseData = async () => {
      dispatch(actions.controlLoading(true));
      try {
        const [categoriesRes, courseRes, discountRes] = await Promise.all([
          requestApi("/categories", "GET"),
          requestApi(`/courses/${param.id}`, "GET"),
          requestApi("/discount?items_per_page=All", "GET"),
        ]);
        setCategories(categoriesRes.data.data);
        setDiscount(discountRes.data.data);
        const courseData = courseRes.data;
        setValue("name", courseData.name);
        setValue("description", courseData.description);
        setValue("categoryId", courseData.categoryId);
        setValue("price", courseData.price);
        setThumbnail({
          img: `${process.env.REACT_APP_API_URL}/${courseData.thumbnail}`,
        });

        // Find and set the selected category
        const category = categoriesRes.data.data.find(
          (cat) => cat.id === courseData.categoryId
        );
        setSelectedCategory(category);
        const discount = discountRes.data.data.find(
          (dis) => dis.id === courseData.discount_id
        );
        setSelectedDiscount(discount);
        dispatch(actions.controlLoading(false));
      } catch (err) {
        console.error(err);
        dispatch(actions.controlLoading(false));
        toast.error(err.response.data.message, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    };
    fetchCourseData();
  }, [param.id, dispatch, setValue]);

  const handleSubmitFormUpdate = async (data) => {
    if (data.discount === null) delete data.discount;
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
      await requestApi(
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

  return (
    <div className={cx("wrapper", "row d-flex")}>
      <h1 className="mt-4 p-0">Cập nhật khóa học</h1>
      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item">
          <Link to="/admin/dashboard">Bảng tin</Link>
        </li>
        <li className="breadcrumb-item">
          <Link to="/admin/course">Khóa học</Link>
        </li>
        <li className="breadcrumb-item">Cập nhật khóa học</li>
      </ol>
      <form className="row">
        <div className={cx("", "col-md-6")}>
          <div className={cx("", "mb-3 mt-3")}>
            <label className="form-label">Tên khóa học:</label>
            <input
              type="text"
              className="form-control p-3 fs-5"
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
            <label className="form-label">Mã giảm giá:</label>
            <Autocomplete
              options={discount}
              getOptionLabel={(option) => option.name}
              value={selectedDiscount}
              onChange={(event, value) => {
                setSelectedDiscount(value);
                setValue("discount_id", value ? value.id : null);
              }}
              renderInput={(params) => (
                <TextField {...params} variant="outlined" />
              )}
            />
          </div>
          <div className={cx("", "mb-3 mt-3")}>
            <label className="form-label">Miêu tả khóa học:</label>
            <input
              type="text"
              className="form-control p-3 fs-5"
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
            <label className="form-label">Thể loại khóa học:</label>
            <Autocomplete
              options={categories}
              getOptionLabel={(option) => option.name}
              value={selectedCategory}
              onChange={(event, value) => {
                setSelectedCategory(value);
                setValue("categoryId", value ? value.id : null);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  error={!!errors.categoryId}
                  helperText={
                    errors.categoryId ? errors.categoryId.message : ""
                  }
                  variant="outlined"
                />
              )}
            />
          </div>
          <div className={cx("", "mb-3 mt-3")}>
            <label className="form-label">Giá khóa học:</label>
            <input
              type="text"
              className="form-control p-3 fs-5"
              placeholder="Giá khóa học..."
              {...register("price", {
                required: "Vui lòng thêm giá của khóa học",
              })}
            ></input>
            {errors.price && (
              <p className="text-danger">{errors.price.message}</p>
            )}
          </div>
        </div>
        <div className={cx("", "col-md-6")}>
          <div className={cx("", "mb-3 mt-3")}>
            <label htmlFor="file" className={cx("btn_changeThumbnail", "mb-3")}>
              Thêm bìa khóa học
            </label>
            {thumbnail.img && (
              <Image avatar_profile src={thumbnail.img}></Image>
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
        </div>
        <div className="d-flex align-items-center justify-content-end">
          <Button
            onClick={handleSubmit(handleSubmitFormUpdate)}
            className="btn"
            update
          >
            Cập nhật
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CourseUpdate;
