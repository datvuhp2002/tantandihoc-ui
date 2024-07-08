import React, { useState, useEffect } from "react";
import styles from "./QuizAnswerAdd.module.scss";
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
const QuizAnswerAdd = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm();
  const handleSubmitFormAdd = async (data) => {
    data.quiz_id = params.id;
    if (data.correct === "true") {
      data.correct = true;
    } else {
      data.correct = false;
    }
    console.log(data);
    dispatch(actions.controlLoading(true));
    await requestApi("/quiz-answer", "POST", data)
      .then((res) => {
        dispatch(actions.controlLoading(false));
        toast.success("Thêm câu trả lời thành công", {
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

  return (
    <div className={cx("wrapper", "row d-flex ")}>
      <h1 className="mt-4 p-0">Quiz Answer Add</h1>
      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item">
          <Link to="/admin/dashboard">Dashboard</Link>
        </li>
        <li className="breadcrumb-item">
          <Link to={`/admin/quiz`}>Quiz</Link>
        </li>
        <li className="breadcrumb-item">
          <Link to={`/admin/quiz/quiz-answer/${params.id}`}>Quiz Answer</Link>
        </li>
        <li className="breadcrumb-item">Quiz Answer Add</li>
      </ol>
      <form className=" row d-flex align-item-center justify-content-between mb-5">
        <div className="col-md-7">
          <div className="mb-3">
            <label className="form-label">Đáp án là đúng hoặc sai:</label>
            <select
              class="form-select"
              aria-label="Default select example"
              {...register("correct")}
            >
              <option value={false} selected>
                Sai
              </option>
              <option value={true}>Đúng</option>
            </select>
          </div>
          <div className={cx("", "mb-3 mt-3")}>
            <label className="form-label">Câu trả lời:</label>
            <input
              type="text"
              className="form-control p-3 fs-5"
              placeholder="Vui lòng nhập câu trả lời ..."
              {...register("answer", {
                required: "Vui lòng nhập câu trả lời",
              })}
            ></input>
            {errors.answer && (
              <p className="text-danger">{errors.answer.message}</p>
            )}
          </div>
          <div className="d-flex align-items-end justify-content-end">
            <Button
              create
              onClick={handleSubmit(handleSubmitFormAdd)}
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
export default QuizAnswerAdd;
