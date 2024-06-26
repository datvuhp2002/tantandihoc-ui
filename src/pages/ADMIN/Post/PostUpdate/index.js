import React, { useState, useEffect } from "react";
import styles from "./PostUpdate.module.scss";
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
const PostUpdate = () => {
  const param = useParams();
  const dispatch = useDispatch();
  const [thumbnail, setThumbnail] = useState("");
  const [categories, setCategories] = useState([]);
  const [contentValue, setContentValue] = useState("");
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
        `/posts/${param.id}`,
        "PUT",
        formData,
        "json",
        "multipart/form-data"
      );
      dispatch(actions.controlLoading(false));
      toast.success("Cập nhật bài viết thành công", {
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
    dispatch(actions.controlLoading(true));
    const categories = requestApi("/categories", "GET");
    const posts = requestApi(`/posts/${param.id}`, "GET");
    Promise.all([categories, posts])
      .then((res) => {
        setCategories(res[0].data.data);
        console.log(res[1].data);
        setValue("categoryId", res[1].data.categoryId);
        setValue("title", res[1].data.title);
        setValue("summary", res[1].data.summary);
        setContentValue(res[1].data.content);
        setThumbnail({
          img: `${process.env.REACT_APP_API_URL}/${res[1].data.thumbnail}`,
        });
        dispatch(actions.controlLoading(false));
      })
      .catch((err) => {
        console.error(err);
        dispatch(actions.controlLoading(false));
      });
  }, []);
  function uploadPlugin(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return new CustomUploadAdapter(loader);
    };
  }
  return (
    <div className={cx("wrapper", "row d-flex ")}>
      <h1 className="mt-4 p-0">Posts Add</h1>
      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item">
          <Link to="/admin/dashboard">Dashboard</Link>
        </li>
        <li className="breadcrumb-item">
          <Link to="/admin/post">Posts</Link>
        </li>
        <li className="breadcrumb-item">Posts Update</li>
      </ol>
      <form className="p-0">
        <div className={cx("", "col-md-6")}>
          <div className={cx("", "mb-3 mt-3")}>
            <label className="form-label">Thể loại bài viết:</label>
            <select
              type="text"
              className="form-control"
              placeholder="Nội dung bài viết của bạn"
              {...register("categoryId", {
                required: "Vui lòng viết nội dung của bài viết",
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
          <div className={cx("", "mb-3 mt-3")}>
            <label className="form-label">Nội dung:</label>
            <CKEditor
              editor={Editor}
              data={contentValue}
              onReady={(editor) => {
                register(`content`, {
                  required: `Vui lòng viết nội dung cho bài viết của bạn`,
                });
              }}
              onChange={(event, editor) => {
                const data = editor.getData();
                setValue("content", data);
              }}
              config={{
                extraPlugins: [uploadPlugin],
              }}
            />
          </div>
          <div className={cx("", "mb-3 mt-3")}>
            <label htmlFor="file" className={cx("btn_changeAvatar")}>
              thêm bìa hình ảnh
            </label>
            {thumbnail.img && (
              <Image
                avatar_profile
                rounded
                src={thumbnail.img}
                className={cx("avatar-img")}
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
            className="btn btn-success"
          >
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};
export default PostUpdate;
