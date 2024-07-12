import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "./ForgetPassword.module.scss";
import requestApi from "~/utils/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import * as actions from "~/redux/actions";
import Input from "~/components/Input";
import Button from "~/components/Button";
import Image from "~/components/Image";
import images from "~/public/assets/images";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";

const cx = classNames.bind(styles);

const ForgetPassword = () => {
  const [showForgetPasswordModal, setShowForgetPasswordModal] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loginData, setLoginData] = useState({});
  const [formErrors, setFormErrors] = useState({});

  const onChange = (e) => {
    let target = e.target;
    setLoginData({
      ...loginData,
      [target.name]: target.value,
    });
  };

  const validateForm = () => {
    let isValid = true;
    const errors = {};
    if (loginData.email === "" || loginData.email === undefined) {
      errors.email = "Email không được để trống";
    } else {
      let valid = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(
        loginData.email
      );
      if (!valid) {
        errors.email = "Email không đúng";
      }
    }
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      isValid = false;
    } else {
      setFormErrors({});
    }

    return isValid;
  };

  const onSubmit = async () => {
    let valid = validateForm();

    console.log(loginData);
    if (valid) {
      dispatch(actions.controlLoading(true));
      await requestApi("/auth/send-token", "POST", loginData)
        .then((res) => {
          if (res.data) {
            navigate("/verify-token");
          }
          dispatch(actions.controlLoading(false));
          toast.success(
            "Đã gửi email xác minh. Vui lòng nhập mã OTP để tiếp tục.",
            {
              position: "top-right",
              autoClose: 3000,
            }
          );
        })
        .catch((err) => {
          console.log(err);
          dispatch(actions.controlLoading(false));
        });
    }
  };

  return (
    <div className={cx("wrapper")}>
      <div
        className={cx(
          "container",
          "d-flex algin-items-center justify-content-center row"
        )}
      >
        <div className={cx("form-login", "col-md-4")}>
          <div className={cx("welcome", "mb-4")}>
            <h1>Xin Chào</h1>
            <h5 className={cx("", "text-opacity")}>
              Lấy lại mật khẩu bằng cách xác nhận mã OTP
            </h5>
          </div>
          <form>
            <Input
              leftIcon={<FontAwesomeIcon icon={faEnvelope} />}
              name="email"
              type="email"
              login
              placeholder="Email"
              onChange={onChange}
            />
            {formErrors.email && (
              <p style={{ color: "red" }}>{formErrors.email}</p>
            )}
            <div
              className={cx(
                "action",
                "d-flex align-items-center justify-content-center mb-4"
              )}
            >
              <Button
                rounded
                login
                type="button"
                onClick={onSubmit}
                className="mt-3"
              >
                Nhận mã OTP
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
