import React, { useState, useEffect } from "react";
import styles from "./LessonAdd.module.scss";
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

const LessonAddYoutubeVideo = () => {
  const params = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [videoId, setVideoId] = useState(null);
  const [hasCourse, setHasCourse] = useState(false);
  const [courseId, setCourseId] = useState(1);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm();

  const youtubeParser = (url) => {
    if (!url) return false;
    const regExp =
      /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[7].length === 11 ? match[7] : false;
  };
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const course_id = searchParams.get("course_id");
    if (course_id) {
      setHasCourse(true);
      setCourseId(course_id);
      requestApi(`/courses/${course_id}`)
        .then((res) => {
          console.log("data", res.data);
          const data = {
            label: res.data.name,
            id: res.data.id,
          };
          setCourses([data]);
          setSelectedCourse(data);
          setValue("course_id", res.data.id);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      requestApi(`/courses?items_per_page=all`)
        .then((res) => {
          console.log("data", res.data);
          const data = res.data.data.map((item) => ({
            label: item.name,
            id: item.id,
          }));
          setCourses(data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [location.search, setValue]);
  const handleSubmitFormUrlAdd = async (data) => {
    console.log("data form =>", data);
    if (videoId == false) {
      toast.error("Url không hợp lệ vui lòng thử lại!", {
        position: "top-right",
        autoClose: 3000,
      });
    } else {
      data.videoUrl = videoId;
      dispatch(actions.controlLoading(true));
      try {
        const res = await requestApi(
          "/lessons/link-video-youtube",
          "POST",
          data
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
    }
  };

  function uploadPlugin(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return new CustomUploadAdapter(loader);
    };
  }

  const videoUrl = watch("videoUrl");

  useEffect(() => {
    const id = youtubeParser(videoUrl);
    setVideoId(id);
    if (id) {
      setValue("videoUrl", `https://www.youtube.com/embed/${id}`);
    }
  }, [videoUrl, setValue]);

  return (
    <div className={cx("wrapper", "row d-flex")}>
      <h1 className="mt-4 p-0">Thêm bài học</h1>
      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item">
          <Link to="/admin/dashboard">Bảng tin</Link>
        </li>
        <li className="breadcrumb-item">
          <Link to="/admin/lesson">Bài học</Link>
        </li>
        <li className="breadcrumb-item">Thêm bài học</li>
        <li className="breadcrumb-item">Video từ Youtube</li>
      </ol>

      <div className="mb-4 d-flex">
        <Button
          className={`btn p-3`}
          toActive={
            hasCourse
              ? `/admin/lesson/lesson-add/upload-vid?course_id=${courseId}`
              : "/admin/lesson/lesson-add/upload-vid"
          }
        >
          Đăng tải Video
        </Button>
        <Button
          className={`btn ms-2 p-3 `}
          toActive={
            hasCourse
              ? `/admin/lesson/lesson-add/url-vid?course_id=${courseId}`
              : "/admin/lesson/lesson-add/url-vid"
          }
        >
          YouTube Video
        </Button>
        <Button
          className={`btn ms-2 p-3`}
          toActive={
            hasCourse
              ? `/admin/lesson/lesson-add/no-vid?course_id=${courseId}`
              : "/admin/lesson/lesson-add/no-vid"
          }
        >
          Không Video
        </Button>
      </div>
      <form>
        <div className="row">
          <div className="col-12 col-md-6 mb-3">
            <div className="mb-3">
              <label className="form-label">Khóa học:</label>
              <Controller
                name="course_id"
                control={control}
                rules={{ required: "Vui lòng chọn khóa học" }}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    value={selectedCourse}
                    options={courses}
                    readOnly={hasCourse}
                    getOptionLabel={(option) => option.label}
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    }
                    onChange={(event, value) => {
                      field.onChange(value ? value.id : null);
                      setSelectedCourse(value);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Khóa học"
                        error={!!errors.course_id}
                        helperText={
                          errors.course_id ? errors.course_id.message : ""
                        }
                        InputProps={{
                          ...params.InputProps,
                          readOnly: hasCourse,
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
          <div className={cx("", "col-12 col-md-6 mb-3")}>
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
            {videoId && (
              <div className={cx("video-thumbnail")}>
                <div className="mb-3 w-100 h-100">
                  <label className="form-label">Xem trước:</label>
                  <div className="w-100 h-100">
                    <iframe
                      height="100%"
                      className={cx("video-preview", "w-100")}
                      src={`https://www.youtube.com/embed/${videoId}`}
                      allowFullScreen
                      title="YouTube video preview"
                    ></iframe>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="d-flex align-items-end justify-content-end">
          <Button
            onClick={handleSubmit(handleSubmitFormUrlAdd)}
            className="btn"
          >
            Tạo
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LessonAddYoutubeVideo;
