import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "./Register.module.scss";
import requestApi from "~/utils/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import * as actions from "~/redux/actions";
import Input from "~/components/Input";
import Button from "~/components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock, faUser } from "@fortawesome/free-solid-svg-icons";
const cx = classNames.bind(styles);
const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [RegisterFormData, setRegisterFormData] = useState({});
  const [requestData, setRequestData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const onChange = (e) => {
    let target = e.target;
    setRegisterFormData({
      ...RegisterFormData,
      [target.name]: target.value,
    });
  };
  const validateFormRegister = () => {
    let isValid = true;
    const errors = {};
    if (
      RegisterFormData.username === "" ||
      RegisterFormData.username === undefined
    ) {
      errors.username = "Hãy nhập username của bạn";
    }
    if (RegisterFormData.email === "" || RegisterFormData.email === undefined) {
      errors.email = "Hãy nhập email của bạn";
    } else {
      let valid = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(
        RegisterFormData.email
      );
      if (!valid) {
        errors.email = "Email is not valid";
      }
    }
    if (
      RegisterFormData.password === "" ||
      RegisterFormData.password === undefined ||
      RegisterFormData.password.length < 6
    ) {
      errors.password = "Mật khẩu không được thiếu và phải trên 6 ký tự";
    }
    if (
      RegisterFormData.check_password === "" ||
      RegisterFormData.check_password === undefined ||
      RegisterFormData.check_password.length < 6
    ) {
      errors.check_password = "Mật khẩu không được thiếu và phải trên 6 ký tự";
    }
    if (RegisterFormData.check_password !== RegisterFormData.password) {
      errors.check_password = "Mật khẩu không trùng khớp";
    }
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      isValid = false;
    } else {
      setFormErrors({});
    }
    return isValid;
  };
  const onChangePassword = async () => {
    let valid = validateFormRegister();
    if (valid) {
      const { check_password, ...formDataWithoutCheckPassword } =
        RegisterFormData;
      console.log(formDataWithoutCheckPassword);
      await requestApi("/auth/register", "POST", formDataWithoutCheckPassword)
        .then((res) => {
          toast.success("Đăng ký thành công", {
            position: "top-right",
          });
          navigate("/login");
        })
        .catch((err) => {
          console.log("Err", err);
          if (typeof err.response !== "undefined") {
            if (err.response.status !== 201) {
              toast.error("Email đã tồn tại, thử email khác", {
                position: "top-right",
              });
            }
          } else {
            toast.error("Server is down, please try again", {
              position: "top-right",
            });
          }
        });
    }
  };
  return (
    <div className={cx("wrapper")}>
      <div className={cx("container", "d-flex row")}>
        <div className="background col"></div>
        <div className={cx("form-login", "col-md-6")}>
          <div className={cx("welcome")}>
            <h1>Xin Chào</h1>
            <h5 className={cx("", "text-opacity")}>
              Hãy đăng ký để tạo tài khoản quản lý chi tiêu của bạn
            </h5>
          </div>
          <div>
            <div className={cx("input-field")}>
              <Input
                leftIcon={<FontAwesomeIcon icon={faUser} />}
                name="username"
                login
                placeholder="Username"
                onChange={onChange}
              />
              {formErrors.username && (
                <p style={{ color: "red" }}>{formErrors.username}</p>
              )}
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
              <Input
                leftIcon={<FontAwesomeIcon icon={faLock} />}
                password
                rounded
                name="password"
                type="password"
                placeholder="Mật khẩu"
                onChange={onChange}
                autocomplete="new-password"
              />
              {formErrors.password && (
                <p style={{ color: "red" }}>{formErrors.password}</p>
              )}
              <Input
                leftIcon={<FontAwesomeIcon icon={faLock} />}
                password
                rounded
                name="check_password"
                type="password"
                placeholder="Nhập lại mật khẩu"
                onChange={onChange}
              />
              {formErrors.check_password && (
                <p style={{ color: "red" }}>{formErrors.check_password}</p>
              )}
            </div>
            <div
              className={
                (cx("action"),
                "d-flex align-items-center justify-content-end my-4")
              }
            >
              <Button
                rounded
                register
                type="button"
                to="/register"
                onClick={onChangePassword}
              >
                Đăng ký
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
