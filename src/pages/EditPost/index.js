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
import CustomUploadAdapter from "~/helpers/CustomUploadAdapter";
import { Link, useParams } from "react-router-dom";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

const cx = classNames.bind(styles);

const EditPost = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [thumbnail, setThumbnail] = useState("");
  const [categories, setCategories] = useState([]);
  const [contentValue, setContentValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [postData, setPostData] = useState({});
  useEffect(() => {
    const fetchPostData = async () => {
      dispatch(actions.controlLoading(true));
      try {
        const [categoriesRes, postRes] = await Promise.all([
          requestApi("/categories", "GET"),
          requestApi(`/posts/${id}`, "GET"),
        ]);
        setCategories(categoriesRes.data.data);
        const postData = postRes.data;
        setValue("categoryId", postData.categoryId);
        setValue("title", postData.title);
        setValue("summary", postData.summary);
        setContentValue(postData.content);
        setThumbnail({
          img: `${process.env.REACT_APP_API_URL}/${postData.thumbnail}`,
        });
        console.log(`${process.env.REACT_APP_API_URL}/${postData.thumbnail}`);
        setPostData(postData);
        categoriesRes.data.data.map((category) => {
          if (category.id === postData.categoryId) {
            setSelectedCategory(category);
          }
        });
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

    fetchPostData();
  }, [id, dispatch, setValue]);

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
        `/posts/${id}`,
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

  function uploadPlugin(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return new CustomUploadAdapter(loader);
    };
  }

  return (
    <div className={cx("wrapper", "row d-flex ")}>
      <h1 className="mt-4 p-0">Cập nhật bài viết</h1>
      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item">
          <Link to="/admin/dashboard">Bảng tin</Link>
        </li>
        <li className="breadcrumb-item">
          <Link to="/admin/post">Bài viết</Link>
        </li>
        <li className="breadcrumb-item">Cập nhật bài viết</li>
      </ol>
      <form className="p-0 row">
        <div className="col-12 row">
          <div className={cx("", "col-6")}>
            <div className={cx("", "mb-3 mt-3")}>
              <label className="form-label">Thể loại bài viết:</label>
              {postData.categoryId && (
                <Autocomplete
                  {...register("categoryId", {
                    required: "Vui lòng chọn thể loại bài viết",
                  })}
                  options={categories}
                  getOptionLabel={(option) => option.name}
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
                  value={selectedCategory}
                  onChange={(event, value) => {
                    setValue("categoryId", value ? value.id : null);
                    setSelectedCategory(value);
                  }}
                />
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
          </div>
          <div className={cx("", "col-6")}>
            <div className={cx("", "mb-3 mt-3")}>
              <label htmlFor="file" className={cx("btn_changeAvatar")}>
                Thêm bìa hình ảnh
              </label>
              {thumbnail.img && (
                <Image
                  src={thumbnail.img}
                  className={cx("avatar-img", "mt-3")}
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
          </div>
        </div>
        <div className="col-12 mt-4">
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
        </div>
      </form>
      <div className="d-flex align-items-center justify-content-end">
        <Button onClick={handleSubmit(handleSubmitFormUpdate)} rounded update>
          Cập nhật
        </Button>
      </div>
    </div>
  );
};

export default EditPost;
