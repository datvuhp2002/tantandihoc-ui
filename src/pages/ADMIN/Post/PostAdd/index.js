import React, { useState, useEffect } from "react";
import styles from "./PostAdd.module.scss";
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
import { Link } from "react-router-dom";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

const cx = classNames.bind(styles);

const PostAdd = () => {
  const dispatch = useDispatch();
  const [thumbnail, setThumbnail] = useState("");
  const [categories, setCategories] = useState([]);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

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

  const handleSubmitFormAdd = async (data) => {
    console.log("data form =>", data);
    let formData = new FormData();
    for (let key in data) {
      if (key === "thumbnail") {
        formData.append(key, data[key][0]);
      } else {
        formData.append(key, data[key]);
      }
    }
    dispatch(actions.controlLoading(true));
    try {
      const res = await requestApi(
        "/posts",
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

  function uploadPlugin(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return new CustomUploadAdapter(loader);
    };
  }

  return (
    <div className={cx("wrapper", "row d-flex mb-5")}>
      <h1 className="mt-4 p-0">Posts Add</h1>
      <div className="d-flex align-items-center justify-content-between">
        <ol className="breadcrumb mb-4">
          <li className="breadcrumb-item">
            <Link to="/admin/dashboard">Dashboard</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/admin/post">Posts</Link>
          </li>
          <li className="breadcrumb-item">Posts Add</li>
        </ol>

        <Button onClick={handleSubmit(handleSubmitFormAdd)} create rounded>
          Xuất bản
        </Button>
      </div>
      <form className="p-0 row">
        <div className="row">
          <div className={cx("", "col-md-6")}>
            <div className={cx("", "mb-3 mt-3")}>
              <label className="form-label">Thể loại bài viết:</label>
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
                onChange={(event, value) => {
                  setValue("categoryId", value ? value.id : null);
                }}
              />
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
          <div className={cx("", "col-md-6")}>
            <div className={cx("", "mb-3 mt-3")}>
              <label htmlFor="file" className={cx("btn_changeAvatar")}>
                Thêm bìa hình ảnh
              </label>
              {thumbnail.img && (
                <Image
                  avatar_profile
                  src={thumbnail.img}
                  className={cx("avatar-img", "mt-4")}
                ></Image>
              )}
              <input
                id="file"
                type="file"
                accept="image/*"
                className="d-none"
                {...register("thumbnail", {
                  required: "Vui lòng chọn ảnh bìa cho bài viết",
                  onChange: onImageChange,
                })}
              />
              {errors.thumbnail && (
                <p className="text-danger">{errors.thumbnail.message}</p>
              )}
            </div>
          </div>
          <div>
            <div className={cx("", "mb-3 mt-3")}>
              <label className="form-label">Nội dung:</label>
              <CKEditor
                editor={Editor}
                data="<p>Nội dung viết ở đây</p>"
                onReady={(editor) => {
                  register(`content`, {
                    required: `Vui lòng viết nội dung cho bài viết của bạn`,
                  });
                }}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  console.log("data =>", data);
                  setValue("content", data);
                  console.log(event);
                }}
                config={{
                  extraPlugins: [uploadPlugin],
                }}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PostAdd;
