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
import { useNavigate } from "react-router-dom";
import { LinearProgress } from "@mui/material";
const cx = classNames.bind(styles);

const Card = ({ data, className, isUserCourses = false }) => {
  const classes = cx("wrapper", {
    [className]: className,
  });
  const navigate = useNavigate();
  const [userProgress, setUserProgress] = useState({});
  const [isRegisterCourse, setIsRegisterCourse] = useState(false);
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

  const onNavigate = async () => {
    navigate(`/course/learning/${data.id}?lesson=${userProgress.lesson_id}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userProgressRes = await requestApi(
          `/user-progress/${data.id}`,
          "GET"
        );
        const totalLessonRes = await requestApi(
          `/lessons/all-lesson?get_all=All&course_id=${data.id}`,
          "GET"
        );
        const totalUserRegisteredRes = await requestApi(
          `/user-progress/get-total-user-register-course/${data.id}`,
          "GET"
        );

        setIsRegisterCourse(userProgressRes.data);
        setTotalLessonData(totalLessonRes.data.total);
        setTotalUserRegistered(totalUserRegisteredRes.data);

        if (userProgressRes.data === true) {
          await getUserProgress();
          const calPercentage =
            (totalLessonHasBeenLearned / totalLessonRes.data.total) * 100;
          setPercentage(calPercentage);
        }
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
        {isRegisterCourse ? (
          <Button rounded onClick={onNavigate} className={cx("courseBtn")}>
            Tiếp tục học
          </Button>
        ) : (
          <Button
            rounded
            to={`/course-detail/${data.id}`}
            className={cx("courseBtn")}
          >
            Xem khóa học
          </Button>
        )}

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
            <span className="col-4 p-0 w-100">Miễn phí</span>
          </div>
          <div className="d-flex">
            <FontAwesomeIcon icon={faPlayCircle} className="me-2" />
            <span className="col-4 p-0">{totalLesson}</span>
          </div>
        </div>
        {isUserCourses && (
          <LinearProgress
            value={percentage}
            color="success"
            variant="determinate"
            className={cx("progress", "w-100")}
          />
        )}
      </div>
    </div>
  );
};

export default Card;
