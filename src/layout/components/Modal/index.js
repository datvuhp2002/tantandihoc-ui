import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Input from "~/components/Input";
import Button from "~/components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import requestApi from "~/utils/api";
import { toast } from "react-toastify";
import "./modal.scss";

const abc = ({ show, onHide }) => {
  const [forgetPasswordData, setForgetPasswordData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [showEmailModal, setShowEmailModal] = useState(true); // State to control the display of email modal
  const [showOTPModal, setShowOTPModal] = useState(false); // State to control the display of OTP modal
  const [tokenVerified, setTokenVerified] = useState(false); // State to mark token verification success

  const onChange = (e) => {
    let target = e.target;
    setForgetPasswordData({
      ...forgetPasswordData,
      [target.name]: target.value,
    });
  };

  const validateEmailForm = () => {
    let isValid = true;
    const errors = {};
    if (!forgetPasswordData.email) {
      errors.email = "Hãy nhập email của bạn";
      isValid = false;
    } else {
      let valid = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
        forgetPasswordData.email
      );
      if (!valid) {
        errors.email = "Email không hợp lệ";
        isValid = false;
      }
    }
    setFormErrors(errors);
    return isValid;
  };

  const onSubmitEmail = async () => {
    if (validateEmailForm()) {
      try {
        await requestApi("/auth/send-token", "POST", forgetPasswordData);
        setShowEmailModal(false);
        setShowOTPModal(true);
        toast.success(
          "Đã gửi email xác minh. Vui lòng nhập mã OTP để tiếp tục.",
          {
            position: "top-right",
          }
        );
      } catch (err) {
        handleRequestError(err);
      }
    }
  };

  const validateOTPForm = () => {
    let isValid = true;
    const errors = {};
    if (!forgetPasswordData.token) {
      errors.token = "Hãy nhập mã OTP";
      isValid = false;
    }
    setFormErrors(errors);
    return isValid;
  };

  const onSubmitOTP = async () => {
    if (validateOTPForm()) {
      try {
        await requestApi("/auth/verify-token", "POST", forgetPasswordData);
        setTokenVerified(true);
        toast.success(
          "Xác minh mã OTP thành công. Vui lòng nhập mật khẩu mới.",
          {
            position: "top-right",
          }
        );
      } catch (err) {
        handleRequestError(err);
      }
    }
  };

  const validatePasswordForm = () => {
    let isValid = true;
    const errors = {};
    if (
      forgetPasswordData.change_password === "" ||
      forgetPasswordData.change_password === undefined ||
      forgetPasswordData.change_password.length < 6
    ) {
      errors.change_password = "Mật khẩu không được thiếu và phải trên 6 ký tự";
      isValid = false;
    }
    if (
      forgetPasswordData.check_password === "" ||
      forgetPasswordData.check_password === undefined ||
      forgetPasswordData.check_password.length < 6
    ) {
      errors.check_password = "Mật khẩu không được thiếu và phải trên 6 ký tự";
      isValid = false;
    }
    if (
      forgetPasswordData.check_password !== forgetPasswordData.change_password
    ) {
      errors.check_password = "Mật khẩu không trùng khớp";
      isValid = false;
    }
    setFormErrors(errors);
    return isValid;
  };

  const onSaveNewPassword = async () => {
    if (validatePasswordForm()) {
      try {
        await requestApi("/auth/changePassword", "PUT", forgetPasswordData);
        toast.success("Đổi mật khẩu thành công", { position: "top-right" });
        onHide(); // Close the modal after successfully changing password
      } catch (err) {
        handleRequestError(err);
      }
    }
  };

  const handleRequestError = (err) => {
    console.error("Error:", err);
    if (err.response && err.response.data && err.response.data.message) {
      toast.error(err.response.data.message, { position: "top-right" });
    } else {
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau", {
        position: "top-right",
      });
    }
  };

  const handleClose = () => {
    setShowEmailModal(false);
    setShowOTPModal(false);
    setTokenVerified(false);
    onHide(); // Close the modal
  };

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        dialogClassName="wrapper"
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          {showEmailModal && (
            <div>
              <h1>Lấy lại mật khẩu</h1>
              <p className="text-center">
                Vui lòng nhập Email bạn đã dùng để đăng ký tài khoản, để thực
                hiện yêu cầu thay đổi mật khẩu theo hướng dẫn trong Email.
              </p>
              <div className="d-flex flex-column align-items-center">
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
                <Button
                  login
                  rounded
                  btnContinue
                  type="button"
                  onClick={onSubmitEmail}
                  className="col-5 mt-4"
                >
                  Tiếp tục
                </Button>
              </div>
            </div>
          )}
          {showOTPModal && (
            <div>
              <h1>Xác minh OTP</h1>
              <p className="text-center">
                Vui lòng nhập mã OTP đã được gửi đến email của bạn để tiếp tục.
              </p>
              <div className="d-flex flex-column align-items-center">
                <Input
                  leftIcon={<FontAwesomeIcon icon={faLock} />}
                  name="token"
                  type="text"
                  placeholder="Mã OTP"
                  onChange={onChange}
                  className="mb-3"
                />
                {formErrors.token && (
                  <p style={{ color: "red" }}>{formErrors.token}</p>
                )}
                <Button
                  login
                  rounded
                  btnContinue
                  type="button"
                  onClick={onSubmitOTP}
                  className="col-5 mt-4"
                >
                  Xác minh OTP
                </Button>
              </div>
            </div>
          )}
          {tokenVerified && (
            <div>
              <h1>Đổi mật khẩu</h1>
              <p className="text-center">Vui lòng nhập mật khẩu mới.</p>
              <div className="d-flex flex-column align-items-center">
                <Input
                  leftIcon={<FontAwesomeIcon icon={faLock} />}
                  password
                  rounded
                  name="change_password"
                  type="password"
                  placeholder="Mật khẩu mới"
                  onChange={onChange}
                  className="mb-3"
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
                  className="mb-3"
                />
                {formErrors.check_password && (
                  <p style={{ color: "red" }}>{formErrors.check_password}</p>
                )}
                <Button
                  login
                  rounded
                  btnContinue
                  type="button"
                  onClick={onSaveNewPassword}
                  className="col-5 mt-4"
                >
                  Đổi mật khẩu
                </Button>
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default abc;
