import React, { useEffect } from "react";
import styles from "./PostCard.module.scss";
import classNames from "classnames/bind";
import { Wrapper } from "../Popper";
import Image from "~/components/Image";
import images from "~/public/assets/images";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookmark as faBookmarkSolid,
  faMoneyBill,
  faMoneyBillWave,
  faSave,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import { faBookmark } from "@fortawesome/fontawesome-free-regular";
import Button from "~/components/Button";
import { Link } from "react-router-dom";
const cx = classNames.bind(styles);
const PostCard = ({ data }) => {
  useEffect(() => {
    console.log(data);
  }, []);
  return (
    <div
      className={cx(
        "wrapper",
        "align-items-center justify-content-start d-flex col-5"
      )}
    >
      <div className={cx("header", "d-flex w-100")}>
        <div className={cx("author", "w-100 d-flex align-items-center")}>
          <Image
            post_avatar
            src={`${process.env.REACT_APP_API_URL}/${data.owner.avatar}`}
          ></Image>
          <h3 className="m-0 mx-2">{data.owner.username}</h3>
        </div>
        <div className={cx("actions", "d-flex justify-content-end")}>
          <Button
            className="justify-content-end"
            saved
            leftIcon={<FontAwesomeIcon icon={faBookmark}></FontAwesomeIcon>}
          ></Button>
        </div>
      </div>
      <div className={cx("body", "w-100 d-flex justify-content-between mt-3")}>
        <div className={cx("info", "pe-3 col-8")}>
          <Button
            blog_navigate
            to={`post-detail/${data.id}`}
            className="justify-content-start"
          >
            <strong>{data.title}</strong>
          </Button>
          <p className={cx("summary")}>{data.summary}</p>
        </div>
        <div className={cx("thumbnail", "col-4")}>
          <Button blog_navigate to={`post-detail/${data.id}`}>
            <Image
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
