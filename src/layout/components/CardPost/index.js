import React, { useEffect, useState } from "react";
import styles from "./card.module.scss";
import classNames from "classnames/bind";
import { Wrapper } from "../Popper";
import Image from "~/components/Image";
import images from "~/public/assets/images";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCoins,
  faCommentDollar,
  faMoneyBill,
  faMoneyBillWave,
  faPlay,
  faPlayCircle,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import Button from "~/components/Button";
import requestApi from "~/utils/api";
import { Link, useNavigate } from "react-router-dom";
import { LinearProgress } from "@mui/material";
import moment from "moment";
const cx = classNames.bind(styles);

const CardPost = ({ data, className }) => {
  const classes = cx("wrapper", {
    [className]: className,
  });
  const navigate = useNavigate();
  const onNavigate = async () => {
    navigate(`/blog/post-detail/${data.id}`);
  };

  useEffect(() => {}, []);

  return (
    <div className={classes}>
      <div
        className={cx(
          "thumbnail",
          "d-flex align-items-center w-100 justify-content-center"
        )}
        onClick={() => onNavigate()}
      >
        <Image
          courseImgDashboard
          src={`${process.env.REACT_APP_API_URL}/${data.thumbnail}`}
        ></Image>
      </div>
      <div
        className={cx(
          "content",
          "d-flex flex-column w-100 p-3 justify-content-between"
        )}
      >
        <h3 className="title_no_wrap" onClick={() => onNavigate()}>
          {data.title}
        </h3>
        <div
          className={cx(
            "footer",
            "d-flex align-items-center justify-content-between "
          )}
        >
          <Link
            to={`/info/${data.owner.username}`}
            className={cx("author_info", "d-flex align-items-center w-100")}
          >
            <div className={cx("author_avatar")}>
              <Image
                avatar
                src={`${process.env.REACT_APP_API_URL}/${data.owner.avatar}`}
                className="w-100"
              />
            </div>
            <div className={cx("author_name", "ms-2")}>
              {data.owner.username}
            </div>
          </Link>
          <div className={cx("createdAt", "ms-2")}>
            <span>{moment(data.createdAt).fromNow()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardPost;
