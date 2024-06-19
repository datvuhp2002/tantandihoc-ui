import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import requestApi from "~/utils/api";
import { useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./ThemGiaoDich.module.scss";
import Image from "~/components/Image";
import Button from "~/components/Button";
import Input from "~/components/Input";
import { useDispatch } from "react-redux";
import * as actions from "~/redux/actions";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
const cx = classNames.bind(styles);
const CourseDetail = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const [courseData, setCourseData] = useState({});
  const [courseReceivedData, setCourseReceivedData] = useState([]);
  const [lessonData, setLessonData] = useState({});
  useEffect(() => {
    const promiseCourseData = requestApi(`/courses/${params.id}`, "GET");
    const promiseCourseReceivedData = requestApi(
      `/course-received/${params.id}?get_all=true&sort=asc`,
      "GET"
    );
    const promiseLessonData = requestApi(`/lessons?get_all=All`, "GET");
    dispatch(actions.controlLoading(true));
    Promise.all([
      promiseCourseData,
      promiseCourseReceivedData,
      promiseLessonData,
    ])
      .then((res) => {
        dispatch(actions.controlLoading(false));
        setCourseData(res[0].data);
        setCourseReceivedData(res[1].data.data);
        setLessonData(res[2].data);
        console.log(res[2].data);
      })
      .catch((err) => {
        dispatch(actions.controlLoading(false));
      });
  }, []);
  return (
    <div className={cx("wrapper", "")}>
      {courseData !== null && (
        <div className={cx("content", "d-flex row")}>
          <div className={cx("info", "col-8")}>
            <div className="mb-5">
              <h1 className="my-2">{courseData.name}</h1>
              <p>{courseData.description}</p>
            </div>
            <div>
              <h2>Bạn sẽ học được gì?</h2>
              <ul className="d-flex flex-wrap align-content-start">
                {courseReceivedData.map((item, index) => {
                  return (
                    <li key={index} className="col-6 my-2">
                      <FontAwesomeIcon className=" me-2 fs-2" icon={faCheck} />
                      <span>{item.name}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div>
              <div>
                <h2 className="me-3">Nội dung bài học</h2>
                <p className="m-0 mt-2 fs-5">
                  Số lượng bài học:
                  <strong className="ms-2">{lessonData.total}</strong>
                </p>
              </div>
              <ul className="d-flex flex-column align-content-start">
                {lessonData.data &&
                  lessonData.data.map((item, index) => {
                    return (
                      <li key={index} className="my-3">
                        <Button
                          lesson
                          leftIcon={
                            <FontAwesomeIcon className="me-2" icon={faMinus} />
                          }
                        >
                          <span>
                            <strong className="me-2 fs-3">{index + 1}.</strong>
                            {item.title}
                          </span>
                        </Button>
                      </li>
                    );
                  })}
              </ul>
            </div>
          </div>
          <div
            className={cx(
              "actions",
              "col-4 d-flex flex-column align-items-center justify-content-center"
            )}
          >
            {courseData.thumbnail !== undefined ? (
              <Image
                courseImg
                src={`${process.env.REACT_APP_API_URL}/${courseData.thumbnail}`}
              ></Image>
            ) : (
              <div></div>
            )}
            <h1 className={cx("course-money")}>Miễn phí</h1>
            <Button rounded>Đăng ký học</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetail;
