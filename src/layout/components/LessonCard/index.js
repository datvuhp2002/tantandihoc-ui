import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faChevronDown,
  faChevronUp,
  faFileLines,
} from "@fortawesome/free-solid-svg-icons";
import { faLeanpub } from "@fortawesome/free-brands-svg-icons";

import styles from "./LessonCard.module.scss";
import requestApi from "~/utils/api";

const cx = classNames.bind(styles);

const LessonCard = ({ data, className, index }) => {
  const { id: courseId } = useParams();
  const location = useLocation();
  const [quiz, setQuiz] = useState([]);
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [isLearned, setIsLearned] = useState(false);
  const [quizCompletionStatus, setQuizCompletionStatus] = useState({});

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

  const onSelectedQuiz = (quiz_id) => {
    navigate(`/course/learning/${courseId}?lesson=${data.id}&quiz=${quiz_id}`);
    if (!isLearned) {
      onCreateUserProgress(data.id);
    } else {
      console.log(data.id);
    }
  };

  const fetchQuizCompletionStatus = async (quizzes) => {
    const statusPromises = quizzes.map(async (item) => {
      const result = await requestApi(
        `/user-progress/isDoneQuiz/${courseId}?lesson_id=${data.id}&quiz_id=${item.id}`,
        "GET"
      );
      return { id: item.id, isDone: result.data };
    });

    const statuses = await Promise.all(statusPromises);
    const statusMap = statuses.reduce((acc, curr) => {
      acc[curr.id] = curr.isDone;
      return acc;
    }, {});

    setQuizCompletionStatus(statusMap);
  };

  const onShow = () => {
    setShow(!show);
  };

  useEffect(() => {
    const checkLearned = requestApi(
      `/user-progress/checkIsLearned/${courseId}?lesson_id=${data.id}`
    );
    const fetchQuiz = requestApi(
      `/quiz/get-all-quiz-in-lesson/${data.id}`,
      "GET"
    );

    Promise.all([checkLearned, fetchQuiz]).then((res) => {
      setIsLearned(res[0].data);
      setQuiz(res[1].data);
      fetchQuizCompletionStatus(res[1].data);
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
        <div>
          <div className={cx("info_card_item")} onClick={onNavigate}>
            <div className={cx("name", "d-flex align-items-center")}>
              <h3 className="m-0 me-2">{data.title}</h3>
              <FontAwesomeIcon icon={faLeanpub} />
            </div>
            {isLearned ? (
              <div className={cx("icon")}>
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="text-success"
                />
              </div>
            ) : null}
          </div>
          {quiz &&
            quiz.length > 0 &&
            quiz.map((item, index) => (
              <div
                key={index}
                className={cx("info_card_item")}
                onClick={() => onSelectedQuiz(item.id)}
              >
                <div className={cx("name", "d-flex align-items-center")}>
                  <h3 className="m-0 me-2">{item.title}</h3>
                  <FontAwesomeIcon icon={faFileLines} />
                </div>
                {quizCompletionStatus[item.id] ? (
                  <div className={cx("icon")}>
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-success"
                    />
                  </div>
                ) : null}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default LessonCard;
