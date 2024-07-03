import React, { useEffect, useState, useCallback } from "react";
import styles from "./Setting.module.scss";
import classNames from "classnames/bind";
import Button from "~/components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAlignLeft,
  faChevronRight,
  faEye,
  faEyeSlash,
  faEyedropper,
} from "@fortawesome/free-solid-svg-icons";
import requestApi from "~/utils/api";
import Image from "~/components/Image";
import Logo from "~/public/assets/images/logo.png";
import Modal from "react-bootstrap/Modal";
import Input from "~/components/Input";
import { useDispatch } from "react-redux";
import * as actions from "~/redux/actions";
import { toast } from "react-toastify";
const cx = classNames.bind(styles);

const Setting = () => {
  const dispatch = useDispatch();
  const [userData, setUserData] = useState({});
  const [fullnameValue, setFullnameValue] = useState("");
  const [usernameValue, setUserNameValue] = useState("");
  const [oldPasswordValue, setOldPasswordValue] = useState("");
  const [newPasswordValue, setNewPasswordValue] = useState("");
  const [repeatNewPasswordValue, setRepeatNewPasswordValue] = useState("");
  const [modalUsernameShow, setModalUsernameShow] = useState(false);
  const [modalFullnameShow, setModalFullnameShow] = useState(false);
  const [modalAvatarShow, setModalAvatarShow] = useState(false);
  const [modalPasswordShow, setModalPasswordShow] = useState(false);
  const [isPasswordEqual, setIsPasswordEqual] = useState(true);
  const [isEqualToOldPassword, setIsEqualToOldPassword] = useState(false);
  const [isShowOldPassword, setIsShowOldPassword] = useState(false);
  const [isShowNewPassword, setIsShowNewPassword] = useState(false);
  const [isShowRepeatPassword, setIsShowRepeatPassword] = useState(false);
  const [isFullnameEmpty, setIsFullnameEmpty] = useState(false);
  const [isUsernameEmpty, setIsUsernameEmpty] = useState(false);
  const [isOldPasswordEmpty, setIsOldPasswordEmpty] = useState(false);
  const [isRepeatPasswordEmpty, setIsRepeatPasswordEmpty] = useState(false);
  const [isNewPasswordEmpty, setIsNewPasswordEmpty] = useState(false);
  const onCloseModalUsernameShow = () => {
    setUserNameValue(userData.username);
    setModalUsernameShow(false);
    setIsUsernameEmpty(false);
  };
  const onCloseModalFullnameShow = () => {
    setFullnameValue(userData.fullname);
    setModalFullnameShow(false);
    setIsFullnameEmpty(false);
  };
  const onCloseModalAvatarShow = () => {
    setModalAvatarShow(false);
  };
  const onCloseModalPasswordShow = () => {
    setOldPasswordValue("");
    setNewPasswordValue("");
    setRepeatNewPasswordValue("");
    setModalPasswordShow(false);
    setIsPasswordEqual(true);
    setIsShowNewPassword(false);
    setIsShowOldPassword(false);
    setIsShowRepeatPassword(false);
    setIsOldPasswordEmpty(false);
    setIsNewPasswordEmpty(false);
    setIsRepeatPasswordEmpty(false);
  };
  const handleChangeUsername = useCallback((e) => {
    const username = e.target.value;
    if (username == "") {
      setIsUsernameEmpty(true);
    } else {
      setIsUsernameEmpty(false);
    }
    if (!username.startsWith(" ")) {
      setUserNameValue(username);
    }
  }, []);
  const handleChangeFullname = useCallback((e) => {
    const fullnameValue = e.target.value;
    if (fullnameValue == "") {
      setIsFullnameEmpty(true);
    } else {
      setIsFullnameEmpty(false);
    }
    if (!fullnameValue.startsWith(" ")) {
      setFullnameValue(fullnameValue);
    }
  }, []);
  const onImageChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      let reader = new FileReader();
      reader.onload = (e) => {
        setUserData({
          ...userData,
          avatar: reader.result,
        });
      };
      reader.readAsDataURL(file);
      try {
        let formData = new FormData();
        formData.append("avatar", file);
        dispatch(actions.controlLoading(true));
        requestApi(
          "/users/upload-avatar",
          "POST",
          formData,
          "json",
          "multipart/form-data"
        ).then((res) => {
          console.log(res);
          dispatch(actions.controlLoading(false));
          toast.success("Thay avatar thành công", {
            position: "top-right",
          });
        });
      } catch (err) {
        console.log(err);
        toast.success(err.response.data.message, {
          position: "top-right",
        });
        dispatch(actions.controlLoading(false));
      }
    }
  };
  const handleChangeOldPassword = useCallback((e) => {
    const oldPassword = e.target.value;
    if (oldPassword === "") {
      setIsOldPasswordEmpty(true);
    } else {
      setIsOldPasswordEmpty(false);
    }
    if (!oldPassword.startsWith(" ")) {
      setOldPasswordValue(oldPassword);
    }
  }, []);
  const handleChangeNewPassword = useCallback(
    (e) => {
      const newPassword = e.target.value;
      if (newPassword === "") {
        setIsNewPasswordEmpty(true);
      } else {
        setIsNewPasswordEmpty(false);
      }
      if (!newPassword.startsWith(" ")) {
        setNewPasswordValue(newPassword);
      }
      if (
        repeatNewPasswordValue !== "" &&
        newPassword !== repeatNewPasswordValue
      ) {
        setIsPasswordEqual(false);
      } else {
        setIsPasswordEqual(true);
      }
      if (oldPasswordValue !== "" && newPassword === oldPasswordValue) {
        setIsEqualToOldPassword(true);
      } else {
        setIsEqualToOldPassword(false);
      }
    },
    [repeatNewPasswordValue, oldPasswordValue]
  );
  const handleChangeRepeatPassword = useCallback(
    (e) => {
      const repeatPassword = e.target.value;
      if (repeatPassword === "") {
        setIsRepeatPasswordEmpty(true);
      } else {
        setIsRepeatPasswordEmpty(false);
      }
      if (!repeatPassword.startsWith(" ")) {
        setRepeatNewPasswordValue(repeatPassword);
        if (repeatPassword !== newPasswordValue) {
          setIsPasswordEqual(false);
        } else {
          setIsPasswordEqual(true);
        }
      }
    },
    [newPasswordValue]
  );
  const onSubmitUpdate = async (data) => {
    dispatch(actions.controlLoading(true));
    await requestApi(`/users/update`, "PUT", data)
      .then((res) => {
        requestUserProfile();
        dispatch(actions.controlLoading(false));
        toast.success("Cập nhật thông tin thành công", {
          position: "top-right",
          autoClose: 3000,
        });
        onCloseModalFullnameShow();
        onCloseModalUsernameShow();
      })
      .catch((error) => {
        dispatch(actions.controlLoading(false));
        if (error.response && error.response.data) {
          toast.error(`${error.response.data.message}`, {
            position: "top-right",
            autoClose: 3000,
          });
        } else {
          toast.error("Cập nhật thông tin không thành công", {
            position: "top-right",
            autoClose: 3000,
          });
        }
      });
  };
  const onSubmitUpdatePassword = async (data) => {
    if (data.newPassword === data.oldPassword) {
      toast.error("Mật khẩu mới và mật khẩu cũ không được trùng nhau", {
        position: "top-right",
        autoClose: 3000,
      });
      setIsEqualToOldPassword(true);
      return;
    }
    if (data.newPassword !== data.repeatPassword) {
      toast.error("Mật khẩu mới và xác nhận mật khẩu mới không trùng nhau", {
        position: "top-right",
        autoClose: 3000,
      });
      setIsPasswordEqual(false);
      return;
    }

    dispatch(actions.controlLoading(true));
    await requestApi(`/users/update-password`, "PUT", {
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
    })
      .then((res) => {
        dispatch(actions.controlLoading(false));
        toast.success("Cập nhật mật khẩu thành công", {
          position: "top-right",
          autoClose: 3000,
        });
        onCloseModalPasswordShow();
      })
      .catch((error) => {
        dispatch(actions.controlLoading(false));
        if (error.response && error.response.data) {
          toast.error(`${error.response.data.message}`, {
            position: "top-right",
            autoClose: 3000,
          });
        } else {
          toast.error("Đổi mật khẩu không thành công, vui lòng thử lại", {
            position: "top-right",
            autoClose: 3000,
          });
        }
      });
  };
  const requestUserProfile = async () => {
    dispatch(actions.controlLoading(true));
    await requestApi("/users/profile", "GET")
      .then((res) => {
        dispatch(actions.controlLoading(false));
        setUserData({
          ...res.data,
          avatar: `${process.env.REACT_APP_API_URL}/${res.data.avatar}`,
        });
        setFullnameValue(res.data.fullname);
        setUserNameValue(res.data.username);
      })
      .catch((err) => {
        console.error(err);
        dispatch(actions.controlLoading(false));
        toast.error("Lỗi khi lấy thông tin người dùng", {
          position: "top-right",
          autoClose: 3000,
        });
      });
  };
  useEffect(() => {
    requestUserProfile();
  }, []);

  return (
    <div className={cx("wrapper", "pt-4")}>
      <div className={cx("wrapper_children")}>
        <div className={cx("personal-info")}>
          <div className={cx("header")}>
            <h1 className="fw-bolder">Thông tin cá nhân</h1>
            <p>Quản lý thông tin cá nhân của bạn</p>
          </div>
          <div className={cx("body", "pt-4")}>
            <div className={cx("header", "mb-5")}>
              <h2>Thông tin cơ bản</h2>
              <p>Quản lý tên hiển thị, tên người dùng và avatar của bạn</p>
            </div>
            <div className={cx("wrapper-content")}>
              <div
                className={cx("content", "d-flex justify-content-between")}
                onClick={() => setModalFullnameShow(true)}
              >
                <div className={cx("info")}>
                  <h4 className="fw-bolder m-0">Họ và tên</h4>
                  <p className={cx("value", "m-0")}>
                    {userData.fullname ? userData.fullname : "Còn trống..."}
                  </p>
                </div>
                <div className={cx("actions")}>
                  <Button
                    className="d-flex align-items-center justify-content-end fs-2"
                    more
                    leftIcon={<FontAwesomeIcon icon={faChevronRight} />}
                  />
                </div>
              </div>
              <div
                className={cx("content", "d-flex justify-content-between")}
                onClick={() => setModalUsernameShow(true)}
              >
                <div className={cx("info")}>
                  <h4 className="fw-bolder m-0">Tên người dùng</h4>
                  <p className={cx("value", "m-0")}>
                    {userData.username ? userData.username : "Còn trống..."}
                  </p>
                </div>
                <div className={cx("actions")}>
                  <Button
                    className="d-flex align-items-center justify-content-end fs-2"
                    more
                    leftIcon={<FontAwesomeIcon icon={faChevronRight} />}
                  />
                </div>
              </div>
              <div
                className={cx(
                  "content_hasImg",
                  "d-flex justify-content-between"
                )}
                onClick={() => setModalAvatarShow(true)}
              >
                <div className={cx("info")}>
                  <h4 className="fw-bolder m-0">Ảnh đại diện</h4>
                  <div className={cx("avatar", "m-0")}>
                    {userData.avatar ? (
                      <Image avatar_setting alt="" src={userData.avatar} />
                    ) : (
                      <Image avatar_setting alt="" src={Logo} />
                    )}
                  </div>
                </div>
                <div className={cx("actions")}>
                  <Button
                    className="d-flex align-items-center justify-content-end fs-2"
                    more
                    leftIcon={<FontAwesomeIcon icon={faChevronRight} />}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className={cx("body", "pt-5 ")}>
            <div className={cx("header", "mb-5")}>
              <h2>Thông tin và bảo mật</h2>
              <p>Quản lý mật khẩu</p>
            </div>
            <div className={cx("wrapper-content")}>
              <div
                className={cx("content", "d-flex justify-content-between")}
                onClick={() => setModalPasswordShow(true)}
              >
                <div className={cx("info")}>
                  <h4 className="fw-bolder m-0">Đổi mật khẩu</h4>
                  {/* <p className={cx("value", "m-0")}>
                    {userData.fullname ? userData.fullname : "Còn trống..."}
                  </p> */}
                </div>
                <div className={cx("actions")}>
                  <Button
                    className="d-flex align-items-center justify-content-end fs-2"
                    more
                    leftIcon={<FontAwesomeIcon icon={faChevronRight} />}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <UpdateUserName
        isUsernameEmpty={isUsernameEmpty}
        setIsUsernameEmpty={setIsUsernameEmpty}
        show={modalUsernameShow}
        onHide={() => onCloseModalUsernameShow()}
        onSubmitUpdate={onSubmitUpdate}
        value={usernameValue}
        handleChange={handleChangeUsername}
      />
      <UpdateFullname
        isFullnameEmpty={isFullnameEmpty}
        setIsFullnameEmpty={setIsFullnameEmpty}
        show={modalFullnameShow}
        onHide={() => onCloseModalFullnameShow()}
        onSubmitUpdate={onSubmitUpdate}
        value={fullnameValue}
        handleChange={handleChangeFullname}
      />
      <UpdatePassword
        isOldPasswordEmpty={isOldPasswordEmpty}
        isNewPasswordEmpty={isNewPasswordEmpty}
        isRepeatPasswordEmpty={isRepeatPasswordEmpty}
        isPasswordEqual={isPasswordEqual}
        show={modalPasswordShow}
        oldPassword={oldPasswordValue}
        newPassword={newPasswordValue}
        repeatPassword={repeatNewPasswordValue}
        isEqualToOldPassword={isEqualToOldPassword}
        onHide={() => onCloseModalPasswordShow()}
        onSubmitUpdate={onSubmitUpdatePassword}
        handleChangeOldPassword={handleChangeOldPassword}
        handleChangeNewPassword={handleChangeNewPassword}
        handleChangeRepeatPassword={handleChangeRepeatPassword}
        isShowOldPassword={isShowOldPassword}
        setIsShowOldPassword={setIsShowOldPassword}
        isShowNewPassword={isShowNewPassword}
        setIsShowNewPassword={setIsShowNewPassword}
        isShowRepeatPassword={isShowRepeatPassword}
        setIsShowRepeatPassword={setIsShowRepeatPassword}
      />
      <UpdateAvatar
        show={modalAvatarShow}
        onHide={() => onCloseModalAvatarShow()}
        onSubmitUpdate={onSubmitUpdate}
        value={userData.avatar}
        onImageChange={onImageChange}
      />
    </div>
  );
};

function UpdateUserName({
  value,
  isUsernameEmpty,
  onSubmitUpdate,
  handleChange,
  setIsUsernameEmpty,
  ...props
}) {
  const checkIsNull = (data) => {
    if (data == "") {
      setIsUsernameEmpty(true);
      toast.error("Không được bỏ trống tên người dùng!!!", {
        position: "top-right",
        autoClose: 3000,
      });
    } else {
      setIsUsernameEmpty(false);
      onSubmitUpdate({ username: data });
    }
  };
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>
        <h2>Cập nhật tên người dùng</h2>
        <p>
          Tên người dùng của bạn là duy nhất và đường dẫn đến trang cá nhân của
          bạn sẽ thay đổi.
        </p>
        <div className="modal-wrapper">
          <div className="modal-wrapper-item">
            <div className="modal-wrapper-item-label">
              <label className="modal-item-label">Họ và tên</label>
            </div>
            <div>
              <Input
                error={isUsernameEmpty}
                placeholder="Nhập họ và tên của bạn..."
                value={value}
                onChange={handleChange}
              />
              {isUsernameEmpty ? (
                <p className="text-danger mt-2">
                  Không được để trống tên người dùng
                </p>
              ) : (
                ""
              )}
            </div>
          </div>
          <div className="w-100 my-3">
            <Button
              className="w-100"
              rounded
              onClick={() => checkIsNull(value)}
            >
              Lưu lại
            </Button>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
}
function UpdateFullname({
  isFullnameEmpty,
  setIsFullnameEmpty,
  value,
  onSubmitUpdate,
  handleChange,
  ...props
}) {
  const checkIsNull = (data) => {
    if (data == "") {
      setIsFullnameEmpty(true);
      toast.error("Không được bỏ trống tên người dùng!!!", {
        position: "top-right",
        autoClose: 3000,
      });
    } else {
      setIsFullnameEmpty(false);
      onSubmitUpdate({ fullname: value });
    }
  };
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>
        <h2>Cập nhật họ và tên của bạn</h2>
        <p>
          Tên sẽ được hiển thị trên trang cá nhân, trong các bình luận và bài
          viết của bạn.
        </p>
        <div className="modal-wrapper">
          <div className="modal-wrapper-item">
            <div className="modal-wrapper-item-label">
              <label className="modal-item-label">Họ và tên</label>
            </div>
            <div>
              <Input
                error={isFullnameEmpty}
                placeholder="Nhập họ và tên của bạn..."
                value={value}
                onChange={handleChange}
              />
              {isFullnameEmpty ? (
                <p className="text-danger mt-2">
                  Không được để trống họ và tên người dùng
                </p>
              ) : (
                ""
              )}
            </div>
          </div>
          <div className="w-100 my-3">
            <Button
              className="w-100"
              rounded
              onClick={() => checkIsNull(value)}
            >
              Lưu lại
            </Button>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
}
function UpdateAvatar({ value, onSubmitUpdate, onImageChange, ...props }) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>
        <h2>Cập nhật ảnh đại diện của bạn</h2>
        <p>
          Ảnh đại diện giúp mọi người nhận biết bạn dễ dàng hơn qua các bài
          viết, bình luận...
        </p>
        <div className="modal-wrapper">
          <div className="modal-wrapper-item w-100">
            <div className={cx("modal-wrapper-avatar")}>
              <Image
                avatar
                rounded
                src={value}
                className={cx("avatar-img", "w-100 h-100")}
              ></Image>
            </div>
          </div>
          <div className="w-100 my-3">
            <label htmlFor="file" className={cx("btn_changeAvatar")}>
              Thay đổi avatar
            </label>
            <Input
              file
              id="file"
              type="file"
              accept="image/*"
              onChange={onImageChange}
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
}
function UpdatePassword({
  isOldPasswordEmpty,
  isNewPasswordEmpty,
  isRepeatPasswordEmpty,
  isPasswordEqual,
  isEqualToOldPassword,
  oldPassword,
  newPassword,
  repeatPassword,
  onSubmitUpdate,
  handleChangeNewPassword,
  handleChangeRepeatPassword,
  handleChangeOldPassword,
  isShowOldPassword,
  setIsShowOldPassword,
  isShowNewPassword,
  setIsShowNewPassword,
  isShowRepeatPassword,
  setIsShowRepeatPassword,
  ...props
}) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>
        <h2>Đổi mật khẩu</h2>
        <p>Mật khẩu của bạn phải có tối thiểu 6 ký tự.</p>
        <div className="modal-wrapper">
          <div className="modal-wrapper-item">
            <div className="modal-wrapper-item-label">
              <label className="modal-item-label">Mật khẩu hiện tại</label>
            </div>
            <div>
              <Input
                error={isOldPasswordEmpty}
                placeholder="Nhập mật khẩu cũ của bạn..."
                value={oldPassword}
                onChange={handleChangeOldPassword}
                type={!isShowOldPassword ? "password" : ""}
                rightIcon={
                  <FontAwesomeIcon
                    icon={!isShowOldPassword ? faEye : faEyeSlash}
                    onClick={() => setIsShowOldPassword(!isShowOldPassword)}
                  />
                }
              />
              {isOldPasswordEmpty ? (
                <p className="text-danger mt-2">Không được để trống mật khẩu</p>
              ) : (
                ""
              )}
            </div>
          </div>
          <div className="modal-wrapper-item">
            <div className="modal-wrapper-item-label">
              <label className="modal-item-label">Mật khẩu mới</label>
            </div>
            <div>
              <Input
                placeholder="Nhập mật khẩu mới của bạn..."
                value={newPassword}
                error={isEqualToOldPassword || isNewPasswordEmpty}
                onChange={handleChangeNewPassword}
                type={!isShowNewPassword ? "password" : ""}
                rightIcon={
                  <FontAwesomeIcon
                    icon={!isShowNewPassword ? faEye : faEyeSlash}
                    onClick={() => setIsShowNewPassword(!isShowNewPassword)}
                  />
                }
              />
              {!isEqualToOldPassword ? (
                <div className="mt-2"></div>
              ) : (
                <p className="text-danger mt-2">
                  Mật khẩu mới không được trùng với mật khẩu cũ
                </p>
              )}
              {isNewPasswordEmpty ? (
                <p className="text-danger mt-2">Không được để trống mật khẩu</p>
              ) : (
                ""
              )}
            </div>
          </div>
          <div className="modal-wrapper-item">
            <div className="modal-wrapper-item-label">
              <label className="modal-item-label">Nhập lại mật khẩu</label>
            </div>
            <div>
              <Input
                placeholder="Nhập lại mật khẩu mới của bạn..."
                value={repeatPassword}
                error={!isPasswordEqual || isRepeatPasswordEmpty}
                onChange={handleChangeRepeatPassword}
                type={!isShowRepeatPassword ? "password" : ""}
                rightIcon={
                  <FontAwesomeIcon
                    icon={!isShowRepeatPassword ? faEye : faEyeSlash}
                    onClick={() =>
                      setIsShowRepeatPassword(!isShowRepeatPassword)
                    }
                  />
                }
              />
              {isRepeatPasswordEmpty ? (
                <p className="text-danger mt-2">Không được để trống mật khẩu</p>
              ) : (
                ""
              )}
              {isPasswordEqual ? (
                <div className="mt-2"></div>
              ) : (
                <p className="text-danger mt-2">Mật khẩu không khớp</p>
              )}
            </div>
          </div>
          <div className="w-100 my-3">
            <Button
              className="w-100"
              rounded
              onClick={() =>
                onSubmitUpdate({ oldPassword, newPassword, repeatPassword })
              }
            >
              Đổi mật khẩu
            </Button>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
}
export default Setting;
