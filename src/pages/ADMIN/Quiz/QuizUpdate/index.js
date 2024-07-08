import React, { useState, useEffect } from "react";
import styles from "./QuizUpdate.module.scss";
import classNames from "classnames/bind";
import requestApi from "~/utils/api";
import { useDispatch } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import * as actions from "~/redux/actions";
import Input from "~/components/Input";
import Button from "~/components/Button";
import Image from "~/components/Image";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faSquarePlus } from "@fortawesome/free-solid-svg-icons";
import { Autocomplete } from "@mui/material";
import TextField from "@mui/material/TextField";
const cx = classNames.bind(styles);
const QuizUpdate = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const [thumbnail, setThumbnail] = useState("");
  const [hasLesson, setHasLesson] = useState(false);
  const [lessonId, setLessonId] = useState();
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm();
  const handleSubmitFormUpdate = async (data) => {
    dispatch(actions.controlLoading(true));
    await requestApi(`/quiz/${params.id}`, "PUT", data)
      .then((res) => {
        dispatch(actions.controlLoading(false));
        toast.success("Cập nhật thành công", {
          position: "top-right",
          autoClose: 3000,
        });
      })
      .catch((err) => {
        console.log("err=>", err);
        dispatch(actions.controlLoading(false));
        toast.error(err.response.data.message, {
          position: "top-right",
          autoClose: 3000,
        });
      });
  };
  useEffect(() => {
    requestApi(`/quiz/${params.id}`, "GET").then((res) => {
      console.log("res", res.data);
      setValue("title", res.data.title);
      setValue("question", res.data.question);
      requestApi(`/lessons/${res.data.lesson_id}`)
        .then((res) => {
          console.log("data", res.data);
          const data = {
            label: res.data.title,
            id: res.data.id,
          };
          setLessons([data]);
          setSelectedLesson(data);
          setValue("lesson_id", res.data.id);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }, [params.id, setValue]);
  return (
    <div className={cx("wrapper", "row d-flex ")}>
      <h1 className="mt-4 p-0">Quiz Update</h1>
      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item">
          <Link to="/admin/dashboard">Dashboard</Link>
        </li>
        <li className="breadcrumb-item">
          <Link to="/admin/quiz">Quiz</Link>
        </li>
        <li className="breadcrumb-item">Quiz Update</li>
      </ol>
      <form className=" row d-flex align-item-center justify-content-between mb-5">
        <div className="col-md-7">
          <div className="mb-3">
            <label className="form-label">Bài học:</label>
            <Controller
              name="lesson_id"
              control={control}
              rules={{ required: "Vui lòng chọn bài học" }}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  value={selectedLesson}
                  options={lessons}
                  readOnly
                  getOptionLabel={(option) => option.label}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  onChange={(event, value) => {
                    field.onChange(value ? value.id : null);
                    setSelectedLesson(value);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={!!errors.lesson_id}
                      helperText={
                        errors.lesson_id ? errors.lesson_id.message : ""
                      }
                      InputProps={{
                        ...params.InputProps,
                        readOnly: true,
                      }}
                    />
                  )}
                />
              )}
            />
          </div>
          <div className={cx("", "mb-3 mt-3")}>
            <label className="form-label">Đầu đề câu hỏi:</label>
            <input
              type="text"
              className="form-control p-3 fs-5"
              placeholder="Đầu đề câu hỏi..."
              {...register("title", {
                required: "Vui lòng nhập đầu đề câu hỏi",
              })}
            ></input>
            {errors.title && (
              <p className="text-danger">{errors.title.message}</p>
            )}
          </div>
          <div className={cx("", "mb-3 mt-3")}>
            <label className="form-label">Câu hỏi:</label>
            <input
              type="text"
              className="form-control p-3 fs-5"
              placeholder="Miêu tả thể loại..."
              {...register("question", {
                required: "Vui lòng nhập câu hỏi",
              })}
            ></input>
            {errors.question && (
              <p className="text-danger">{errors.question.message}</p>
            )}
          </div>
          <div className="d-flex align-items-end justify-content-end">
            <Button
              onClick={handleSubmit(handleSubmitFormUpdate)}
              rightIcon={<FontAwesomeIcon icon={faSquarePlus} />}
              className="btn"
            >
              Tạo
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
export default QuizUpdate;
