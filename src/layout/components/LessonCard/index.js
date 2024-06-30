import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import { NavLink, useParams, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";

import styles from "./LessonCard.module.scss";
import requestApi from "~/utils/api";

const cx = classNames.bind(styles);

const LessonCard = ({ data, className, index }) => {
  const { id: courseId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [isLearned, setIsLearned] = useState(false);
  const onCreateUserProgress = async (lesson_id) => {
    await requestApi(`/user-progress`, "POST", {
      course_id: courseId,
      lesson_id,
    })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const onNavigate = () => {
    navigate(`/course/learning/${courseId}?lesson=${data.id}`);
    if (!isLearned) {
      onCreateUserProgress(data.id);
    } else {
      console.log(data.id);
    }
  };

  const onShow = () => {
    setShow(!show);
  };

  useEffect(() => {
    const checkLearned = requestApi(
      `/user-progress/checkIsLearned/${courseId}?lesson_id=${data.id}`
    );
    Promise.all([checkLearned]).then((res) => {
      setIsLearned(res[0].data);
    });
  }, [location.search]);

  return (
    <div className={cx("wrapper")} key={index}>
      <div
        className={cx(
          "info_card",
          "d-flex align-items-center justify-content-between"
        )}
        onClick={onShow}
      >
        <h3 className="m-0">
          {index + 1}.{data.title}
        </h3>
        {show ? (
          <FontAwesomeIcon icon={faChevronUp} className="fs-3" />
        ) : (
          <FontAwesomeIcon icon={faChevronDown} className="fs-3" />
        )}
      </div>
      {show && (
        <div className={cx("info_card_item")} onClick={onNavigate}>
          <div className={cx("name")}>
            <h3 className="m-0">
              {0 + 1}.{data.title}
            </h3>
          </div>
          {isLearned ? (
            <div className={cx("icon")}>
              <FontAwesomeIcon icon={faCheckCircle} className="text-success" />
            </div>
          ) : (
            <></>
          )}
        </div>
      )}
    </div>
  );
};

export default LessonCard;
