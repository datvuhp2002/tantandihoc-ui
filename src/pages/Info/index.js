import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import requestApi from "~/utils/api";
import { Link, useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./Info.module.scss";
import Image from "~/components/Image";
import Button from "~/components/Button";
import Input from "~/components/Input";
import { Wrapper } from "~/layout/components/Popper";
import { useDispatch } from "react-redux";
import * as actions from "~/redux/actions";
import images from "../../public/assets/images";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserGroup } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
const cx = classNames.bind(styles);
const Info = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [userData, setUserData] = useState({});
  const [listCourses, setListCourses] = useState({});
  const [myPosts, setMyPosts] = useState({});
  useEffect(() => {
    try {
      requestApi(`/posts/get-all-my-post?items_per_page=5`, "GET").then(
        (res) => {
          console.log(res.data);
          setMyPosts(res.data);
        }
      );
      requestApi(`/user-progress/user-course`, "GET").then((res) => {
        setListCourses(res.data);
      });
      requestApi("/users/profile", "GET")
        .then((res) => {
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
    <div className={cx("wrapper", "d-flex row w-100 m-0 pb-5")}>
      <div
        className={cx("avatar", "d-flex flex-column align-items-start mb-5")}
      >
        <div className={cx("avatar-item")}>
          <div className={cx("avatar-img")}>
            <Image avatar_profile rounded src={userData.avatar}></Image>
          </div>
          <div className={cx("username", "m-0")}>
            <h1 className="m-0">{userData.username}</h1>
          </div>
        </div>
      </div>
      <div className="d-flex align-items-center justify-content-center">
        <div
          className={cx(
            "content-left",
            "col-md-5 h-100 d-flex flex-column mt-2"
          )}
        >
          <div className={cx("information")}>
            <h2>Giới thiệu</h2>
            <div className={cx("group-item", "d-flex")}>
              <FontAwesomeIcon icon={faUserGroup} />{" "}
              <p className="ms-3">
                Thành viên của <strong>Tantandihoc</strong> vào{" "}
                {moment(userData.createdAt).fromNow()}
              </p>
            </div>
          </div>
          <div className={cx("information")}>
            <div className="d-flex align-item-center justify-content-between">
              <h2>Bài viết của bạn</h2>
              <Button
                more
                to={`/my-posts`}
                className="d-flex align-item-end justify-content-end"
              >
                Xem thêm
              </Button>
            </div>
            <div className={cx("group-item", "")}>
              {myPosts.data &&
                myPosts.data.map((item, index) => (
                  <div key={index} className={cx("my-courses-card")}>
                    <Link
                      to={`/blog/post-detail/${item.id}`}
                      className={cx("img")}
                    >
                      <Image
                        src={`${process.env.REACT_APP_API_URL}/${item.thumbnail}`}
                      />
                    </Link>
                    <div className={cx("info")}>
                      <Link
                        to={`/blog/post-detail/${item.id}`}
                        className={cx("img")}
                      >
                        <h3>{item.title}</h3>
                      </Link>
                      <p>{item.summary}</p>
                    </div>
                    <div className={cx("created-at")}>
                      <p>
                        Ngày viết -{" "}
                        {moment(item.createdAt).format("MM/DD/YYYY")}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div
          className={cx(
            "content-right",
            "col-md-7 ms-3 h-100 d-flex flex-column mt-2 justify-content-start"
          )}
        >
          <div className={cx("information")}>
            <div className="d-flex align-item-center justify-content-between">
              <h2>Khoá học đã tham gia</h2>
              <Button
                more
                to={`/my-courses`}
                className="d-flex align-item-end justify-content-end"
              >
                Xem thêm
              </Button>
            </div>
            <div className={cx("group-item", "")}>
              {listCourses.data &&
                listCourses.data.map((item, index) => (
                  <div key={index} className={cx("my-courses-card")}>
                    <Link
                      to={`/course-detail/${item.id}`}
                      className={cx("img")}
                    >
                      <Image
                        src={`${process.env.REACT_APP_API_URL}/${item.thumbnail}`}
                      />
                    </Link>
                    <div className={cx("info")}>
                      <Link
                        to={`/course-detail/${item.id}`}
                        className={cx("img")}
                      >
                        <h3>{item.name}</h3>
                      </Link>
                      <p>{item.description}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Info;
