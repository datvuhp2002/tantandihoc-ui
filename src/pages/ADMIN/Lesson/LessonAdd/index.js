import React, { useState, useEffect } from "react";
import styles from "./LessonAdd.module.scss";
import classNames from "classnames/bind";
import requestApi from "~/utils/api";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as actions from "~/redux/actions";
import Input from "~/components/Input";
import Button from "~/components/Button";
import Image from "~/components/Image";
import Editor from "ckeditor5-custom-build/build/ckeditor";
import { CKEditor } from "@ckeditor/ckeditor5-react";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import CustomUploadAdapter from "~/helpers/CustomUploadAdapter";
import { Link, useParams } from "react-router-dom";
const cx = classNames.bind(styles);
const LessonAdd = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const [thumbnail, setThumbnail] = useState("");
  const [categories, setCategories] = useState([]);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const handleSubmitFormAdd = async (data) => {
    console.log("data form =>", data);
    data.course_id = params.id;
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
        "/lessons",
        "POST",
        formData,
        "json",
        "multipart/form-data"
      );
      console.log("res=>", res);
      dispatch(actions.controlLoading(false));
      toast.success("Thêm bài viết thành công", {
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
  useEffect(() => {}, []);
  function uploadPlugin(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return new CustomUploadAdapter(loader);
    };
  }
  return (
    <div className={cx("wrapper", "row d-flex ")}>
      <h1 className="mt-4 p-0">Lesson Add</h1>
      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item">
          <Link to="/admin/dashboard">Dashboard</Link>
        </li>
        <li className="breadcrumb-item">
          <Link to="/admin/course">Courses</Link>
        </li>
        <li className="breadcrumb-item">Lesson Add</li>
      </ol>
      <form className="p-0 d-flex align-items-start">
        <div className={cx("", "mb-3 mt-3 col-md-6")}>
          <label className="form-label">Nội dung:</label>
          <CKEditor
            editor={Editor}
            data="<p>Hello from CKEditor&nbsp;5!</p>"
            onReady={(editor) => {
              register(`content`, {
                required: `Vui lòng viết nội dung cho bài viết của bạn`,
              });
            }}
            onChange={(event, editor) => {
              const data = editor.getData();
              setValue("content", data);
              console.log(event);
            }}
            config={{
              extraPlugins: [uploadPlugin],
            }}
          />
        </div>
        <div className="d-flex flex-column col-md-6 ms-3">
          <div
            className={cx("", "mb-3 mt-3 d-flex flex-column align-item-start")}
          >
            <label className="form-label">Tiêu đề:</label>
            <input
              type="text"
              className="form-control p-3 fs-5"
              placeholder="Tiêu đề bài viết"
              {...register("title", {
                required: "Vui lòng nhập tiêu đề bài viết",
              })}
            ></input>
            {errors.title && (
              <p className="text-danger">{errors.title.message}</p>
            )}
          </div>
          <div className={cx("", "mb-3 mt-3")}>
            <label className="form-label">Tóm tắt:</label>
            <input
              type="text"
              className="form-control p-3 fs-5"
              placeholder="Tóm tắt bài viết"
              {...register("summary", {
                required: "Vui lòng viết tóm tắt của bài viết",
              })}
            ></input>
            {errors.summary && (
              <p className="text-danger">{errors.summary.message}</p>
            )}
          </div>
          <div
            className={cx(
              "",
              "mb-3 mt-3 d-flex flex-column align-items-center"
            )}
          >
            <label htmlFor="file" className={cx("btn_changeAvatar", "mb-3")}>
              thêm bìa hình ảnh
            </label>
            {thumbnail.img && (
              <Image
                avatar_profile
                src={thumbnail.img}
                className={cx("avatar-img")}
              ></Image>
            )}
            <input
              id="file"
              type="file"
              accept="*"
              className="d-none"
              {...register("thumbnail", {
                required: "Vui lòng viết thêm ảnh của bài viết",
                onChange: onImageChange,
              })}
            />
            {errors.thumbnail && (
              <p className="text-danger">{errors.thumbnail.message}</p>
            )}
          </div>
          <div className="d-flex align-items-end justify-content-end">
            <Button onClick={handleSubmit(handleSubmitFormAdd)} className="btn">
              Tạo
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
export default LessonAdd;
