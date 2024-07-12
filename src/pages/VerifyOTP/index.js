import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Input from "~/components/Input";
import Button from "~/components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey, faLock } from "@fortawesome/free-solid-svg-icons";
import requestApi from "~/utils/api";
import { toast } from "react-toastify";
import classNames from "classnames/bind";
import styles from "./VerifyOTP.module.scss";
import { useNavigate } from "react-router-dom";

const cx = classNames.bind(styles);
const VerifyOTP = () => {
  const [otpData, setOtpData] = useState({});
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState({});
  const [tokenVerified, setTokenVerified] = useState(false); // State to mark token verification success
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const onChange = (e) => {
    let target = e.target;
    setOtpData({
      ...otpData,
      [target.name]: target.value,
    });
  };

  const validateOTPForm = () => {
    let isValid = true;
    const errors = {};
    if (!otpData.token) {
      errors.token = "Hãy nhập mã OTP";
      isValid = false;
    }
    setFormErrors(errors);
    return isValid;
  };

  const onSubmitOTP = async () => {
    if (validateOTPForm()) {
      try {
        await requestApi("/auth/verify-token", "POST", otpData).then((res) => {
          console.log(res.data);
          setEmail(res.data.email);
          setTokenVerified(true);
          setShowModal(true);
          toast.success(
            "Xác minh mã OTP thành công. Vui lòng nhập mật khẩu mới.",
            {
              position: "top-right",
              autoClose: 3000,
            }
          );
        });
      } catch (err) {
        handleRequestError(err);
      }
    }
  };

  const validatePasswordForm = () => {
    let isValid = true;
    const errors = {};
    if (
      otpData.change_password === "" ||
      otpData.change_password === undefined ||
      otpData.change_password.length < 6
    ) {
      errors.change_password = "Mật khẩu không được thiếu và phải trên 6 ký tự";
      isValid = false;
    }
    if (
      otpData.check_password === "" ||
      otpData.check_password === undefined ||
      otpData.check_password.length < 6
    ) {
      errors.check_password = "Mật khẩu không được thiếu và phải trên 6 ký tự";
      isValid = false;
    }
    if (otpData.check_password !== otpData.change_password) {
      errors.check_password = "Mật khẩu không trùng khớp";
      isValid = false;
    }
    setFormErrors(errors);
    return isValid;
  };

  const onSaveNewPassword = async () => {
    console.log(otpData);
    const formatData = {
      email: email,
      password: otpData.change_password,
    };
    if (validatePasswordForm()) {
      try {
        await requestApi("/auth/change-password", "PUT", formatData).then(
          (res) => {
            toast.success("Đổi mật khẩu thành công", {
              position: "top-right",
              autoClose: 3000,
            });
            setShowModal(false);
            navigate("/login");
          }
        );
      } catch (err) {
        handleRequestError(err);
      }
    }
  };

  const handleRequestError = (err) => {
    console.error("Error:", err);
    if (err.response && err.response.data && err.response.data.message) {
      toast.error(err.response.data.message, {
        position: "top-right",
        autoClose: 3000,
      });
    } else {
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleClose = () => {
    setTokenVerified(false);
    setShowModal(false); // Close the modal
  };

  return (
    <div>
      <div className={cx("wrapper")}>
        <div
          className={cx(
            "container",
            "d-flex algin-items-center justify-content-center row"
          )}
        >
          <div className={cx("form-login", "col-md-4")}>
            <div className={cx("welcome", "mb-4")}>
              <h1>Xác nhận OTP</h1>
              <h5 className={cx("", "text-opacity")}>
                Nhập mã otp đã gửi vào email để xác nhận
              </h5>
            </div>
            <form>
              <Input
                leftIcon={<FontAwesomeIcon icon={faKey} />}
                name="token"
                type="text"
                login
                placeholder="OTP..."
                onChange={onChange}
              />
              {formErrors.token && (
                <p style={{ color: "red" }}>{formErrors.token}</p>
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
                  onClick={onSubmitOTP}
                  className="mt-3"
                >
                  Nhận mã OTP
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Modal
        show={showModal}
        onHide={handleClose}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        dialogClassName="wrapper"
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <div>
            <h1>Đổi mật khẩu</h1>
            <p className="">Vui lòng nhập mật khẩu mới.</p>
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
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default VerifyOTP;
