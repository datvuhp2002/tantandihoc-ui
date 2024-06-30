import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import requestApi from "~/utils/api";
import { useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./Profile.module.scss";
import Image from "~/components/Image";
import Button from "~/components/Button";
import Input from "~/components/Input";
import { Wrapper } from "~/layout/components/Popper";
import { useDispatch } from "react-redux";
import * as actions from "~/redux/actions";
import { useForm } from "react-hook-form";
import ProfileLayout from "~/layout/ProfileLayout";
const cx = classNames.bind(styles);
const ProfileLayout = () => {
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
  const renderInput = () => {
    return Object.keys(userData).map((key, index) => {
      {
        if (key !== "avatar")
          return (
            <div
              key={index}
              className={cx(
                "user-information",
                "d-flex align-items-center w-100 justify-content-between"
              )}
            >
              <h2 className="mx-3 w-35">{key}</h2>
              <div className="w-75">
                <Input
                  register={{
                    ...register(`${key}`, {
                      required:
                        key !== "note"
                          ? `${key} không được để trống`
                          : undefined,
                    }),
                  }}
                  key={index}
                  text={showForm}
                  data={userData[key]}
                  name={key}
                  keyName={key}
                  placeholder={key}
                />
                {errors[`${key}`] && (
                  <p style={{ color: "red" }}>{errors[`${key}`].message}</p>
                )}
              </div>
            </div>
          );
      }
    });
  };
  const onHandleShowForm = () => {
    Object.keys(userData).map((key) => {
      setValue(key, userData[key]);
    });
    setShowForm(!showForm);
  };
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
  const onSubmit = async (data) => {
    try {
      const { avatar, ...userDataWithoutAvatar } = data;
      await requestApi("/users/update", "PUT", userDataWithoutAvatar)
        .then((res) => {
          toast.success("cập nhật thành công", {
            position: "top-right",
          });
          setUserData(data);
          console.log(userData);
          setShowForm(!showForm);
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
    } catch (err) {}
  };
  useEffect(() => {
    try {
      requestApi("/users/profile", "GET")
        .then((res) => {
          console.log("data::", res.data);
          setUserData({
            ...res.data,
            avatar: `${process.env.REACT_APP_API_URL}/${res.data.avatar}`,
          });
          Object.keys(res.data).map((key) => {
            setValue(key, res.data[key]);
          });
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  }, []);
  return (
    <div className={cx("wrapper", "d-flex row ")}>
      <div
        className={cx(
          "avatar",
          "col-md-6 d-flex flex-column align-items-center mb-5"
        )}
      >
        <h1>Ảnh đại diện</h1>
        <Image
          avatar_profile
          rounded
          src={userData.avatar}
          className={cx("avatar-img")}
        ></Image>
        <div className="d-flex align-items-center w-100 justify-content-center mt-4">
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
      <div className="col-md-6 h-100 d-flex flex-column">
        <h1>Tài khoản của bạn</h1>
        <form className={cx("information")}>
          {renderInput()}
          <div className="d-flex align-items-center justify-content-end mt-3">
            {showForm ? (
              <Button register rounded onClick={onHandleShowForm}>
                Chỉnh sửa
              </Button>
            ) : (
              <div className="d-flex">
                <Button register rounded onClick={handleSubmit(onSubmit)}>
                  Lưu
                </Button>
                <Button register rounded onClick={onHandleShowForm}>
                  huỷ
                </Button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileLayout;
