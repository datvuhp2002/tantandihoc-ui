import React, { useState, useEffect } from "react";
import styles from "./LessonCreate.module.scss";
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

const cx = classNames.bind(styles);

const LessonCreate = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const [videoFile, setVideoFile] = useState("");
  const [videoOption, setVideoOption] = useState("none"); // "upload", "youtube", "none"
  const [courseId, setCourseId] = useState(1);
  const [courses, setCourseData] = useState([]);
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();
  const handleSubmitFormUploadAdd = async (data) => {
    console.log("data form =>", data);
    const { videoUrl, ...dataUpload } = data;
    let formData = new FormData();
    for (let key in dataUpload) {
      if (key === "videoFile") {
        formData.append(key, dataUpload[key][0]);
      } else {
        formData.append(key, dataUpload[key]);
      }
    }
    dispatch(actions.controlLoading(true));
    try {
      const res = await requestApi(
        "/lessons/upload-video-from-client",
        "POST",
        formData,
        "json",
        "multipart/form-data"
      );
      console.log("res=>", res);
      dispatch(actions.controlLoading(false));
      toast.success("Thêm bài học thành công", {
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
  const handleSubmitFormUrlAdd = async (data) => {
    const { videoFile, ...dataUrl } = data;
    dispatch(actions.controlLoading(true));
    try {
      const res = await requestApi(
        "/lessons/link-video-youtube",
        "POST",
        dataUrl
      );
      dispatch(actions.controlLoading(false));
      toast.success("Thêm bài học thành công", {
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
  const onVideoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const videoUrl = URL.createObjectURL(file);
      setVideoFile({
        video: videoUrl,
      });
    }
  };
  function uploadPlugin(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return new CustomUploadAdapter(loader);
    };
  }
  const handleVideoOptionChange = (option) => {
    setVideoOption(option);
    // reset(); // Reset the form
    setVideoFile(""); // Reset the video file preview
  };
  useEffect(() => {
    requestApi(`/courses?items_per_page=All`, "GET")
      .then((res) => {
        console.log(res.data);
        setCourseData(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <div className={cx("wrapper", "row d-flex")}>
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

      <div className="mb-4">
        <button
          className={`btn p-3 ${
            videoOption === "upload" ? "btn-primary" : "btn-secondary"
          }`}
          onClick={() => handleVideoOptionChange("upload")}
        >
          Upload Video
        </button>
        <button
          className={`btn ms-2 p-3 ${
            videoOption === "youtube" ? "btn-primary" : "btn-secondary"
          }`}
          onClick={() => handleVideoOptionChange("youtube")}
        >
          YouTube Video
        </button>
        <button
          className={`btn ms-2 p-3 ${
            videoOption === "none" ? "btn-primary" : "btn-secondary"
          }`}
          onClick={() => handleVideoOptionChange("none")}
        >
          No Video
        </button>
      </div>

      <form>
        <div className="row">
          <div className="col-12 col-md-6">
            <div className="mb-3">
              <label className="form-label">Tiêu đề:</label>
              <input
                type="text"
                className="form-control p-3 fs-5"
                placeholder="Tiêu đề bài học"
                {...register("title", {
                  required: "Vui lòng nhập tên bài học",
                })}
              />
              {errors.title && (
                <p className="text-danger">{errors.title.message}</p>
              )}
            </div>
            <div className={cx("", "mb-3 mt-3")}>
              <label className="form-label">Thể loại khóa học:</label>
              <select
                type="text"
                className="form-control"
                placeholder="Nội dung khóa học của bạn"
                {...register("course_id", {
                  required: "Vui lòng viết nội dung của khóa học",
                })}
              >
                {courses &&
                  courses.map((item, index) => {
                    return (
                      <option key={index} value={item.id}>
                        {item.name}
                      </option>
                    );
                  })}
              </select>
              {errors.course_id && (
                <p className="text-danger">{errors.course_id.message}</p>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label">Nội dung:</label>
              <CKEditor
                editor={Editor}
                data=""
                onReady={(editor) => {
                  register("content", {
                    required: "Vui lòng viết nội dung cho bài học của bạn",
                  });
                }}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setValue("content", data);
                  console.log(event);
                }}
                config={{ extraPlugins: [uploadPlugin] }}
                className="h-100"
              />
            </div>
          </div>
          <div className="col-12 col-md-6">
            {videoOption === "upload" && (
              <div
                className={cx(
                  "",
                  "mb-3 mt-3 d-flex flex-column align-items-center"
                )}
              >
                <label
                  htmlFor="file"
                  className={cx("btn_changeAvatar", "mb-3")}
                >
                  Thêm video
                </label>
                {videoFile.video && (
                  <div className={cx("video-thumbnail")}>
                    <video
                      src={videoFile.video}
                      controls
                      height="100%"
                      width="100%"
                      className={cx("video-preview", "w-100")}
                    ></video>
                  </div>
                )}
                <input
                  id="file"
                  type="file"
                  accept="video/*"
                  className="d-none"
                  {...register("videoFile", {
                    required: "Vui lòng thêm video cho bài học",
                    onChange: onVideoChange,
                  })}
                />
                {errors.videoFile && (
                  <p className="text-danger">{errors.videoFile.message}</p>
                )}
              </div>
            )}
            {videoOption === "youtube" && (
              <div className="mb-3">
                <label className="form-label">YouTube Video URL:</label>
                <input
                  type="text"
                  className="form-control p-3 fs-5"
                  placeholder="URL của video YouTube"
                  {...register("videoUrl", {
                    required: "Vui lòng nhập URL video YouTube",
                  })}
                />
                {errors.videoUrl && (
                  <p className="text-danger">{errors.videoUrl.message}</p>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="d-flex align-items-end justify-content-end">
          <Button
            onClick={handleSubmit(
              videoOption === "upload"
                ? handleSubmitFormUploadAdd
                : handleSubmitFormUrlAdd
            )}
            className="btn"
          >
            Tạo
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LessonCreate;
