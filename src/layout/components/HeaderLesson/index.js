import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./Header.module.scss";
import { privateRoutes } from "~/Route/Routes";
import Button from "~/components/Button";
import Logo from "~/public/assets/images/logo.png";
import Image from "~/components/Image";
import HeadlessTippy from "@tippyjs/react/headless";
import { useDebounce } from "~/hooks/useDebounce";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faChevronLeft,
  faSearch,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import Tippy from "@tippyjs/react";
import {
  faMagnifyingGlass,
  faSpinner,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { Wrapper as PopperWrapper } from "../Popper";
import requestApi from "~/utils/api";
import Menu from "../Popper/Menu";
import { onHandleLogout } from "~/helpers";
import images from "~/public/assets/images";
import Search from "../Search";
import { CircularProgress } from "@mui/material";
import CircularWithValueLabel from "~/components/CircularProgressWithLabel";
const cx = classNames.bind(styles);
const HeaderLesson = ({ navigator = "/" }) => {
  const location = useLocation();
  const [courseData, setCourseData] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [totalLessonHasBeenLearned, setTotalLessonHasBeenLearned] = useState(0);
  const [progress, setProgress] = useState(0);
  const [totalLessonData, setTotalLessonData] = useState(0);
  const params = useParams();
  useEffect(() => {
    try {
      const courses = requestApi(`/courses/${params.id}`, "GET");
      const promiseLessonData = requestApi(
        `/lessons/all-lesson?get_all=All&course_id=${params.id}`,
        "GET"
      );
      const promiseUserProgressListLessonHasBeenLearned = requestApi(
        `/user-progress/getAllLessonUserHasLearned/${params.id}`,
        "GET"
      );
      Promise.all([
        courses,
        promiseLessonData,
        promiseUserProgressListLessonHasBeenLearned,
      ])
        .then((res) => {
          setCourseData(res[0].data);
          setTotalLessonData(res[1].data.total);
          setTotalLessonHasBeenLearned(res[2].data.total);
          const calculatePercentage =
            (res[2].data.total / res[1].data.total) * 100;
          setProgress(calculatePercentage);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  }, [location.search]);
  return (
    <div className={cx("wrapper")}>
      <div
        className={cx(
          "content",
          "d-flex align-items-center justify-content-between container h-100"
        )}
      >
        {/* logo */}
        <div className={cx("logo", "d-flex")}>
          <Button
            header_lesson
            className={cx("logo_btn", "h-100 justify-content-start text-light")}
            to={`${navigator}`}
          >
            <div
              className={cx(
                "logo-components",
                "d-flex align-items-center justify-content-center"
              )}
            >
              <FontAwesomeIcon icon={faChevronLeft} className="fs-2 me-4" />
              <h5 className="mx-2 text-dark opacity-100 bold fs-2">
                {courseData && courseData.name}
              </h5>
            </div>
          </Button>
        </div>
        {/* action */}
        <div
          className={cx(
            "action",
            "d-flex justify-content-end h-100 align-items-center"
          )}
        >
          {totalLessonData && (
            <div className="text-white d-flex align-items-center">
              <CircularWithValueLabel
                variant="determinate"
                targetProgress={progress}
                color="success"
              />
              <p className="m-0 ms-2">
                Đã học {totalLessonHasBeenLearned}/{totalLessonData}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default HeaderLesson;
