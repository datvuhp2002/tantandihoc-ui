import React, { useState, useEffect } from "react";
import styles from "./LessonUpdate.module.scss";
import classNames from "classnames/bind";
import requestApi from "~/utils/api";
import { useDispatch } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import * as actions from "~/redux/actions";
import Button from "~/components/Button";
import Editor from "ckeditor5-custom-build/build/ckeditor";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import CustomUploadAdapter from "~/helpers/CustomUploadAdapter";
import { Link, useLocation, useParams } from "react-router-dom";
import { Autocomplete } from "@mui/material";
import TextField from "@mui/material/TextField";

const cx = classNames.bind(styles);

const LessonUpdate = () => {
  const params = useParams();
  const location = useLocation();
  const [lesson, setLesson] = useState({});
  const dispatch = useDispatch();
  const [videoFile, setVideoFile] = useState("");
  const [videoId, setVideoId] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseId, setCourseId] = useState(1);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    requestApi(`/lessons/${params.id}`, "GET")
      .then((res) => {
        const lessonData = res.data;
        setLesson(lessonData);
        setValue("title", lessonData.title);
        setValue("content", lessonData.content);
        requestApi(`/courses/${lessonData.course_id}`, "GET")
          .then((res) => {
            const data = {
              label: res.data.name,
              id: res.data.id,
            };
            setCourses([data]);
            setSelectedCourse(data);
          })
          .catch((err) => {
            console.log(err);
          });
        setVideoFile(
          lessonData.videoFile
            ? {
                video: `${process.env.REACT_APP_API_URL}/${lessonData.videoFile}`,
              }
            : ""
        );
        setValue("videoUrl", lessonData.videoUrl);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, [location.search, params.id, setValue]);

  const handleSubmitForm = async (data) => {
    const { course_id, ...NewData } = data;
    if (NewData.videoFile && NewData.videoUrl) {
      toast.warning(
        "Nếu có cả 2 vid cả video URL và Video được upload lên, thì website sẽ ưu tiên lấy video được upload",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
    }
    let formData = new FormData();
    for (let key in NewData) {
      if (key === "videoFile") {
        formData.append(key, NewData[key][0]);
      } else {
        formData.append(key, NewData[key]);
      }
    }
    dispatch(actions.controlLoading(true));
    try {
      const res = await requestApi(
        `/lessons/${params.id}`,
        "PUT",
        formData,
        "json",
        "multipart/form-data"
      );
      dispatch(actions.controlLoading(false));
      toast.success("Cập nhật bài học thành công", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
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

  const youtubeParser = (url) => {
    if (!url) return false;
    const regExp =
      /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[7].length === 11 ? match[7] : false;
  };

  const videoUrl = watch("videoUrl");
  useEffect(() => {
    const videoId = youtubeParser(videoUrl);
    setVideoId(videoId);
  }, [videoUrl]);
  return (
    <div className={cx("wrapper", "row d-flex")}>
      <h1 className="mt-4 p-0">Lesson Update</h1>
      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item">
          <Link to="/admin/dashboard">Dashboard</Link>
        </li>
        <li className="breadcrumb-item">
          <Link to="/admin/course">Courses</Link>
        </li>
        <li className="breadcrumb-item">Lesson Update</li>
      </ol>

      <form>
        <div className="row">
          <div className="col-12 col-md-6">
            <div className="mb-3">
              <label className="form-label">Khóa học:</label>
              <Controller
                name="course_id"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    value={selectedCourse}
                    options={courses}
                    readOnly
                    getOptionLabel={(option) => option.label}
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Khóa học"
                        InputProps={{
                          ...params.InputProps,
                        }}
                      />
                    )}
                  />
                )}
              />
            </div>
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
            <div className="mb-3">
              <label className="form-label">Nội dung:</label>
              <CKEditor
                editor={Editor}
                data={lesson.content || ""}
                onReady={(editor) => {
                  register("content", {
                    required: "Vui lòng viết nội dung cho bài học của bạn",
                  });
                }}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setValue("content", data);
                }}
                config={{ extraPlugins: [uploadPlugin] }}
                className="h-100"
              />
            </div>
          </div>
          <div className="col-12 col-md-6">
            <div
              className={cx("mb-3 mt-3 d-flex flex-column align-items-center")}
            >
              <label htmlFor="file" className={cx("btn_changeAvatar", "mb-3")}>
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
                type="file"
                className="form-control d-none"
                id="file"
                {...register("videoFile", {
                  onChange: onVideoChange,
                })}
              />
            </div>
            <div className={cx("mb-3")}>
              <label className="form-label">YouTube URL:</label>
              <input
                type="text"
                className="form-control p-3 fs-5"
                placeholder="Nhập YouTube URL"
                {...register("videoUrl")}
              />
              {videoId && (
                <iframe
                  className="mt-3"
                  width="560"
                  height="315"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              )}
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-center mt-4">
          <Button
            className="btn btn-lg px-5"
            onClick={handleSubmit(handleSubmitForm)}
          >
            Lưu
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LessonUpdate;
