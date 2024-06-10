import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "./Login.module.scss";
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
import ForgetPassword from "~/layout/components/Modal/ForgetPassword";

const cx = classNames.bind(styles);
const Login = () => {
  const [modalShow, setModalShow] = useState(false);
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
        errors.email = "Email is not valid";
      }
    }
    if (loginData.password === "" || loginData.password === undefined) {
      errors.password = "Please enter password";
    }
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      isValid = false;
    } else {
      setFormErrors({});
    }
    return isValid;
  };
  const onSubmit = () => {
    let valid = validateForm();
    if (valid) {
      dispatch(actions.controlLoading(true));
      console.log("Request api");
      requestApi("/auth/login", "POST", loginData)
        .then((res) => {
          dispatch(actions.controlLoading(false));
          localStorage.setItem("access_token", res.data.access_token);
          localStorage.setItem("refresh_token", res.data.refresh_token);
          navigate("/");
        })
        .catch((err) => {
          console.log("Err", err);
          dispatch(actions.controlLoading(false));
          if (typeof err.response !== "undefined") {
            if (err.response.status !== 201) {
              toast.error(err.response.data.message, {
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
        <div className={cx("background", "col")}>
          <Image background src={images.background}></Image>
        </div>
        <div className={cx("form-login", "col-md-4")}>
          <div className={cx("welcome", "mb-4")}>
            <h1>Xin Chào</h1>
            <h5 className={cx("", "text-opacity")}>
              Hãy đăng nhập để học cùng Tantan
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
            <Input
              leftIcon={<FontAwesomeIcon icon={faLock} />}
              password
              name="password"
              type="password"
              placeholder="Password"
              onChange={onChange}
            />
            {formErrors.password && (
              <p style={{ color: "red" }}>{formErrors.password}</p>
            )}
            <div
              className={cx(
                "forget-password",
                "d-flex align-items-center justify-content-end"
              )}
            >
              <Button
                forgetPassword
                variant="primary"
                type="button"
                onClick={() => setModalShow(true)}
              >
                Quên mật khẩu?
              </Button>
              <ForgetPassword
                show={modalShow}
                onHide={() => setModalShow(false)}
              />
            </div>
            <div
              className={
                (cx("action"),
                "d-flex align-items-center justify-content-between mb-4")
              }
            >
              <Button
                rounded
                login
                type="button"
                onClick={onSubmit}
                className="w-100"
              >
                Đăng nhập
              </Button>
              <Button
                rounded
                register
                type="button"
                className="w-100"
                to="/register"
              >
                Đăng ký
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
