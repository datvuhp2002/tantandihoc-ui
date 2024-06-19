import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import requestApi from "~/utils/api";
import { useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./MyPost.module.scss";
import Image from "~/components/Image";
import Button from "~/components/Button";
import Input from "~/components/Input";
import { Wrapper } from "~/layout/components/Popper";
import { useDispatch } from "react-redux";
import * as actions from "~/redux/actions";
import { useForm } from "react-hook-form";
const cx = classNames.bind(styles);
const MyPost = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [userData, setUserData] = useState({});
  const [showForm, setShowForm] = useState(true);

  const onHandleShowForm = () => {
    Object.keys(userData).map((key) => {
      setValue(key, userData[key]);
    });
    setShowForm(!showForm);
  };
  const onImageChange = (e) => {};

  return <div className={cx("wrapper", "d-flex row ")}>saved</div>;
};

export default MyPost;
