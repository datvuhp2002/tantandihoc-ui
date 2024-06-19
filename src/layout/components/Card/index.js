import React, { useEffect } from "react";
import styles from "./card.module.scss";
import classNames from "classnames/bind";
import { Wrapper } from "../Popper";
import Image from "~/components/Image";
import images from "~/public/assets/images";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoneyBill,
  faMoneyBillWave,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import Button from "~/components/Button";
const cx = classNames.bind(styles);

const Card = ({ data }) => {
  return (
    <div className={cx("wrapper")}>
      <div
        className={cx(
          "thumbnail",
          "d-flex aligin-items-center w-100 justify-content-center"
        )}
      >
        <Button
          rounded
          to={`/course-detail/${data.id}`}
          className={cx("courseBtn")}
        >
          Xem khóa học
        </Button>
        <Image
          courseImgDashboard
          src={`${process.env.REACT_APP_API_URL}/${data.thumbnail}`}
        ></Image>
      </div>
      <div className="d-flex flex-column aligin-items-center w-100 justify-content-center">
        {/* Sử dụng giá trị đã xác định ở trên */}
        <h2>{data.name}</h2>
        <div className={cx("title", "d-flex align-item-start")}>
          {/* Sử dụng giá trị đã xác định ở trên */}
          <FontAwesomeIcon icon={faMoneyBillWave} />
          <h4 className="col-4 p-0 mx-2">free</h4>
        </div>
      </div>
    </div>
  );
};

export default Card;
