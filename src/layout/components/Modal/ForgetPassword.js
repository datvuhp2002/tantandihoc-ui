import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Input from "~/components/Input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import Button from "~/components/Button";
import requestApi from "~/utils/api";
import "./modal.scss";
import { toast } from "react-toastify";
const ForgetPassword = ({ ...passProps }) => {
  const props = { ...passProps };
  const [forgetPasswordData, setForgetPasswordData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [dataRequest, setDataRequest] = useState({});
  const onChange = (e) => {
    let target = e.target;
    setForgetPasswordData({
      ...forgetPasswordData,
      [target.name]: target.value,
    });
  };
  const validateFormChangePassword = () => {
    let isValid = true;
    const errors = {};
    if (
      forgetPasswordData.email === "" ||
      forgetPasswordData.email === undefined
    ) {
      errors.email = "Hãy nhập email của bạn";
    } else {
      let valid = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(
        forgetPasswordData.email
      );
      if (!valid) {
        errors.email = "Email is not valid";
      }
    }
    if (
      forgetPasswordData.change_password === "" ||
      forgetPasswordData.change_password === undefined ||
      forgetPasswordData.change_password.length < 6
    ) {
      errors.change_password = "Mật khẩu không được thiếu và phải trên 6 ký tự";
    }
    if (
      forgetPasswordData.check_password === "" ||
      forgetPasswordData.check_password === undefined ||
      forgetPasswordData.check_password.length < 6
    ) {
      errors.check_password = "Mật khẩu không được thiếu và phải trên 6 ký tự";
    }
    if (
      forgetPasswordData.check_password !== forgetPasswordData.change_password
    ) {
      errors.check_password = "Mật khẩu không trùng khớp";
    } else {
      forgetPasswordData.password = forgetPasswordData.check_password;
    }
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      isValid = false;
    } else {
      setFormErrors({});
    }
    return isValid;
  };
  const validateForm = () => {
    let isValid = true;
    const errors = {};
    if (
      forgetPasswordData.email === "" ||
      forgetPasswordData.email === undefined
    ) {
      errors.email = "Hãy nhập email của bạn";
    } else {
      let valid = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(
        forgetPasswordData.email
      );
      if (!valid) {
        errors.email = "Email is not valid";
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
    if (valid) {
      console.log("Request api");
      await requestApi("/auth/forgetPassword", "POST", forgetPasswordData)
        .then((res) => {
          setDataRequest(res);
          console.log(dataRequest.data);
        })
        .catch((err) => {
          console.log("Err", err);
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
  const onChangePassword = async () => {
    let valid = validateFormChangePassword();
    if (valid) {
      await requestApi("/auth/changePassword", "Put", forgetPasswordData)
        .then((res) => {
          toast.success("Đổi mật khẩu thành công", {
            position: "top-right",
          });
          props.onHide();
        })
        .catch((err) => {
          console.log("Err", err);
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
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      dialogClassName="wrapper"
    >
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>
        <div>
          <h1>Lấy lại mật khẩu</h1>
          <p className=" text-center">
            Vui lòng nhập Email bạn đã dùng để đăng ký tài khoản, để thực hiện
            yêu cầu thay đổi mật khẩu theo hướng dẫn trong Email.
          </p>
        </div>
        <div className="d-flex flex-column align-items-center ">
          <Input
            leftIcon={<FontAwesomeIcon icon={faEnvelope} />}
            name="email"
            type="email"
            login
            placeholder="Email"
            onChange={onChange}
            className="mb-3"
          />
          {formErrors.email && (
            <p style={{ color: "red" }}>{formErrors.email}</p>
          )}
          {!dataRequest.data ? (
            <Button
              login
              rounded
              btnContinue
              type="button"
              onClick={onSubmit}
              className="col-5 mt-4 "
            >
              Tiếp tục
            </Button>
          ) : (
            <div className="changePassword w-100">
              <Input
                leftIcon={<FontAwesomeIcon icon={faLock} />}
                password
                rounded
                name="change_password"
                type="password"
                placeholder="Mật khẩu"
                onChange={onChange}
                autocomplete="new-password"
              />
              {formErrors.change_password && (
                <p style={{ color: "red" }}>{formErrors.change_password}</p>
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
          )}
          {dataRequest.data && (
            <Button
              login
              rounded
              btnContinue
              onClick={onChangePassword}
              type="button"
              className="col-5 mt-4 "
            >
              Đổi mật khẩu
            </Button>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ForgetPassword;
