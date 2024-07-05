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

const LessonAddUploadLocalVid = () => {
  const params = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const [videoFile, setVideoFile] = useState("");
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [hasCourse, setHasCourse] = useState(false);
  const [courseId, setCourseId] = useState(1);
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm();

  const handleSubmitFormUploadAdd = async (data) => {
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

      <div className="mb-4 d-flex">
        <Button
          className={`btn p-3`}
          toActive={
            hasCourse
              ? `/admin/lesson/lesson-add/upload-vid?course_id=${courseId}`
              : "/admin/lesson/lesson-add/upload-vid"
          }
        >
          Upload Video
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
          No Video
        </Button>
      </div>
      <form>
        <div className="row">
          <div className="col-12 col-md-6">
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
          <div className="col-12 col-md-6">
            <div
              className={cx(
                "",
                "mb-3 mt-3 d-flex flex-column align-items-center"
              )}
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
          </div>
        </div>
        <div className="d-flex align-items-end justify-content-end">
          <Button
            onClick={handleSubmit(handleSubmitFormUploadAdd)}
            className="btn"
          >
            Tạo
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LessonAddUploadLocalVid;
