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

const Card = ({ data, name, currency, amount }) => {
  useEffect(() => {
    console.log(data);
  }, []);

  // Sử dụng giá trị từ prop hoặc từ data nếu prop không tồn tại
  const cardName = data ? data.name : name;
  const cardCurrency = data ? data.currency : currency;
  const cardAmount = data ? data.amount : amount;

  return (
    <div className={cx("wrapper")}>
      <div
        className={cx(
          "thumbnail",
          "d-flex aligin-items-center w-100 justify-content-center"
        )}
      >
        <Button rounded to="/course-detail/1" className={cx("courseBtn")}>
          Xem khóa học
        </Button>
        <Image courseImg src={images.background}></Image>
      </div>
      <div className="d-flex flex-column aligin-items-center w-100 justify-content-center">
        {/* Sử dụng giá trị đã xác định ở trên */}
        <h2>Kiến thức nhập môn</h2>
        <div className={cx("title", "d-flex align-item-start")}>
          {/* Sử dụng giá trị đã xác định ở trên */}
          <FontAwesomeIcon icon={faMoneyBillWave} />
          <h4 className="col-4 p-0 mx-2">30000</h4>
        </div>
      </div>
    </div>
  );
};

export default Card;
