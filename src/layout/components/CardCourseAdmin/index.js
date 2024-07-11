import React, { useEffect, useState } from "react";
import styles from "./CardCourseAdmin.module.scss";
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
import { useNavigate } from "react-router-dom";
import calPrice from "~/utils/calPrice";
import formatPrice from "~/utils/formatPrice";
const cx = classNames.bind(styles);
const CardCourseAdmin = ({
  data,
  revenue,
  className,
  isUserCourses = false,
}) => {
  const classes = cx("wrapper", {
    [className]: className,
  });
  const navigate = useNavigate();
  const [userProgress, setUserProgress] = useState({});
  const [totalLessonHasBeenLearned, setTotalLessonHasBeenLearned] = useState(0);
  const [totalLesson, setTotalLessonData] = useState(0);
  const [totalUserRegistered, setTotalUserRegistered] = useState(0);
  const [percentage, setPercentage] = useState(0);

  const getUserProgress = async () => {
    try {
      const res = await requestApi(`/user-progress/detail/${data.id}`, "GET");
      setUserProgress(res.data);

      const learnedLessonsRes = await requestApi(
        `/user-progress/getAllLessonUserHasLearned/${data.id}`,
        "GET"
      );
      setTotalLessonHasBeenLearned(learnedLessonsRes.data.total);

      if (totalLesson > 0) {
        const calPercentage =
          (learnedLessonsRes.data.total / totalLesson) * 100;
        setPercentage(calPercentage);
      }
    } catch (err) {
      console.log(err.message);
    }
  };
  const calculatorPrice = () => {
    if (data.price === 0) return "Miễn phí";
    if (!data.ownership_discount)
      return (
        <span>
          <span>{formatPrice(data.price)}</span>
        </span>
      );
    const finalPrice = calPrice(data.price, data.ownership_discount);
    if (finalPrice === "Miễn phí") return "Miễn phí";
    if (finalPrice === data.price) return formatPrice(finalPrice);
    return (
      <span>
        <span className="text-decoration-line-through">
          {formatPrice(data.price)}
        </span>{" "}
        - {formatPrice(finalPrice)}
      </span>
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const totalLessonRes = await requestApi(
          `/lessons/all-lesson?get_all=All&course_id=${data.id}`,
          "GET"
        );
        const totalUserRegisteredRes = await requestApi(
          `/user-progress/get-total-user-register-course/${data.id}`,
          "GET"
        );

        setTotalLessonData(totalLessonRes.data.total);
        setTotalUserRegistered(totalUserRegisteredRes.data);
      } catch (err) {
        console.log(err.response.data.message);
      }
    };

    fetchData();
  }, [data.id, totalLessonHasBeenLearned]);

  return (
    <div className={classes}>
      <div
        className={cx(
          "thumbnail",
          "d-flex align-items-center w-100 justify-content-center"
        )}
      >
        <Button
          rounded
          to={`/admin/course/view/${data.id}`}
          className={cx("courseBtn")}
        >
          Chi tiết
        </Button>

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
        <h3>{data.name}</h3>
        <span>
          Tổng doanh thu{" "}
          <strong className="fs-3">{formatPrice(revenue)}</strong>
        </span>
        <div
          className={cx(
            "title",
            "d-flex align-items-start w-100 justify-content-between p-3"
          )}
        >
          <div className="d-flex">
            <FontAwesomeIcon icon={faUserGroup} className="me-2" />
            <span className="col-4 p-0 w-100">{totalUserRegistered}</span>
          </div>
          <div className="d-flex">
            <FontAwesomeIcon icon={faCommentDollar} className="me-2" />
            <span className="col-4 p-0 w-100">{calculatorPrice()}</span>
          </div>
          <div className="d-flex">
            <FontAwesomeIcon icon={faPlayCircle} className="me-2" />
            <span className="col-4 p-0">{totalLesson}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardCourseAdmin;
