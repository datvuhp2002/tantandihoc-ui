import React, { useEffect, useState } from "react";
import styles from "./PostCard.module.scss";
import classNames from "classnames/bind";
import { Wrapper } from "../Popper";
import Image from "~/components/Image";
import images from "~/public/assets/images";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark as faBookmarkSolid } from "@fortawesome/free-solid-svg-icons";
import { faBookmark } from "@fortawesome/fontawesome-free-regular";
import Button from "~/components/Button";
import { Link } from "react-router-dom";
import requestApi from "~/utils/api";
import { toast } from "react-toastify";
const cx = classNames.bind(styles);
const PostCard = ({ data, className }) => {
  const [isSavedPost, setIsSavedPost] = useState(false);
  const classes = cx("wrapper", { [className]: className });
  const OnSavedPost = async (post_id) => {
    await requestApi("/saved-post", "POST", { post_id }).then((res) => {
      if (res.data.statusCode == 200) {
        toast.success(`${res.data.message}`, {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        toast.info(`${res.data.message}`, {
          position: "top-right",
          autoClose: 3000,
        });
      }
      setIsSavedPost(!isSavedPost);
    });
  };
  useEffect(() => {
    requestApi(`/saved-post/${data.id}`, "GET")
      .then((res) => {
        setIsSavedPost(res.data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, [data.id]);
  return (
    <div
      className={`${classes} 
        align-items-center justify-content-start d-flex col-md-5 col-sm-12
    `}
    >
      <div className={cx("header", "d-flex w-100")}>
        <div className={cx("author", "w-100 d-flex align-items-center")}>
          <Image
            className="w-100"
            post_avatar
            src={`${process.env.REACT_APP_API_URL}/${data.owner.avatar}`}
          ></Image>
          <h3 className="m-0 mx-2">{data.owner.username}</h3>
        </div>
        <div className={cx("actions", "d-flex justify-content-end")}>
          <Button
            className="justify-content-end"
            saved
            onClick={() => OnSavedPost(data.id)}
            leftIcon={
              isSavedPost ? (
                <FontAwesomeIcon icon={faBookmarkSolid}></FontAwesomeIcon>
              ) : (
                <FontAwesomeIcon icon={faBookmark}></FontAwesomeIcon>
              )
            }
          ></Button>
        </div>
      </div>
      <div
        className={cx("body", "w-100 d-flex justify-content-between mt-3 row")}
      >
        <div className={cx("info", "col-md-5 col-sm-12")}>
          <Button
            blog_navigate
            to={`/blog/post-detail/${data.id}`}
            className="justify-content-start"
          >
            <strong>{data.title}</strong>
          </Button>
          <p className={cx("summary")}>{data.summary}</p>
        </div>
        <div className={cx("thumbnail", "col-md-6 col-sm-12 mt-2")}>
          <Button
            blog_navigate
            to={`/blog/post-detail/${data.id}`}
            className="w-100 h-100"
          >
            <Image
              className="w-100 h-100"
              post_thumbnail
              src={`${process.env.REACT_APP_API_URL}/${data.thumbnail}`}
            />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
