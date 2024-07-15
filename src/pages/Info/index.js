import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import requestApi from "~/utils/api";
import { Link, useParams } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./Info.module.scss";
import Image from "~/components/Image";
import Button from "~/components/Button";
import { useDispatch } from "react-redux";
import * as actions from "~/redux/actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserGroup } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import { useForm } from "react-hook-form";

const cx = classNames.bind(styles);

const Info = () => {
  const dispatch = useDispatch();
  const params = useParams();
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
    const username = params.username;

    // Fetch user profile, user posts, and user courses
    const fetchData = async () => {
      try {
        const userProfile = await requestApi(
          `/users/profile/${username}`,
          "GET"
        );
        setUserData({
          ...userProfile.data,
          avatar: `${process.env.REACT_APP_API_URL}/${userProfile.data.avatar}`,
        });
        Object.keys(userProfile.data).forEach((key) => {
          setValue(key, userProfile.data[key]);
        });

        const userPosts = await requestApi(
          `/posts/get-all-user-post/${username}?items_per_page=5`,
          "GET"
        );
        setMyPosts(userPosts.data);

        const userCourses = await requestApi(
          `/user-progress/user-course`,
          "GET"
        );
        setListCourses(userCourses.data);
      } catch (error) {
        console.error("Error fetching user info:", error);
        toast.error("Failed to fetch user information.");
      }
    };

    fetchData();
  }, [params.username]);

  return (
    <div className={cx("wrapper", "row", "w-100", "m-0", "pb-5")}>
      <div
        className={cx(
          "avatar",
          "col-12",
          "d-flex",
          "flex-column",
          "align-items-start",
          "mb-5"
        )}
      >
        <div className={cx("avatar-item")}>
          <div className={cx("avatar-img")}>
            <Image avatar_profile rounded src={userData.avatar} />
          </div>
          <div className={cx("username", "m-0")}>
            <h1 className="m-0">{userData.username}</h1>
          </div>
        </div>
      </div>
      <div
        className={cx(
          "d-flex",
          "align-items-start",
          "justify-content-between",
          "row",
          "w-100"
        )}
      >
        <div className={cx("content-left", "col-md-5", "col-sm-12", "mt-4")}>
          <div className={cx("information")}>
            <h2>Giới thiệu</h2>
            <div className={cx("group-item", "d-flex")}>
              <FontAwesomeIcon icon={faUserGroup} />
              <p className="ms-3">
                Thành viên của <strong>Tantandihoc</strong> vào{" "}
                {moment(userData.createdAt).fromNow()}
              </p>
            </div>
          </div>
          <div className={cx("information")}>
            <div className="d-flex align-items-center justify-content-between">
              <h2>Bài viết của {params.username}</h2>
              {myPosts.total > 4 && (
                <Button
                  more
                  to={`/blog/user-posts?user=${params.username}`}
                  className={cx(
                    "d-flex",
                    "align-items-end",
                    "justify-content-end"
                  )}
                >
                  Xem thêm
                </Button>
              )}
            </div>
            <div className={cx("group-item")}>
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
                    <div className={cx("info", "pb-3")}>
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
        <div className={cx("content-right", "col-md-7", "col-sm-12", "mt-4")}>
          <div className={cx("information")}>
            <div className="d-flex align-items-center justify-content-between">
              <h2>Khoá học đã tham gia</h2>
            </div>
            <div className={cx("group-item")}>
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
