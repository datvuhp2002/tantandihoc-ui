import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import requestApi from "~/utils/api";
import { useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./ViewCourseInfo.module.scss";
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
import calPrice from "~/utils/calPrice";
import formatPrice from "~/utils/formatPrice";
import LessonFromCourse from "../LessonFromCourse";
import CourseReceived from "../../CourseReceived";

const cx = classNames.bind(styles);

const ViewCourseInfo = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState({});
  const [courseReceivedData, setCourseReceivedData] = useState([]);
  const [lessonData, setLessonData] = useState({});
  const [isRegisterCourseData, setIsRegisterCourseData] = useState(false);
  const [userProgress, setUserProgress] = useState({});
  const [finalPrice, setFinalPrice] = useState(0);
  const [totalUser, setTotalUser] = useState(0);
  const getUserProgress = async () => {
    await requestApi(`/user-progress/detail/${params.id}`, "GET")
      .then((res) => {
        setUserProgress(res.data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const onNavigate = () => {
    navigate(`/course/learning/${params.id}?lesson=${userProgress.lesson_id}`);
  };

  const renderPrice = () => {
    if (finalPrice === 0 || typeof finalPrice !== "number") return "Miễn phí";
    if (finalPrice === courseData.price) return formatPrice(finalPrice);
    return (
      <span>
        <span className="text-decoration-line-through">
          {formatPrice(courseData.price)}
        </span>{" "}
        - {formatPrice(finalPrice)}
      </span>
    );
  };
  useEffect(() => {
    const calculateFinalPrice = () => {
      if (courseData.price === 0) {
        setFinalPrice(0);
      } else {
        const calculatedFinalPrice = calPrice(
          courseData.price,
          courseData.ownership_discount
        );
        setFinalPrice(calculatedFinalPrice);
      }
    };

    calculateFinalPrice();
  }, [courseData]);

  useEffect(() => {
    const fetchData = async () => {
      dispatch(actions.controlLoading(true));
      try {
        const [courseResponse, courseReceivedResponse, totalUserRegisteredRes] =
          await Promise.all([
            requestApi(`/courses/${params.id}`, "GET"),
            requestApi(
              `/course-received/${params.id}?get_all=true&sort=asc`,
              "GET"
            ),
            requestApi(
              `/user-progress/get-total-user-register-course/${params.id}`,
              "GET"
            ),
          ]);
        setCourseData(courseResponse.data);
        setCourseReceivedData(courseReceivedResponse.data.data);
        setTotalUser(totalUserRegisteredRes.data);
        console.log(totalUserRegisteredRes.data);
      } catch (error) {
        console.error(error);
      } finally {
        dispatch(actions.controlLoading(false));
      }
    };
    fetchData();
  }, [dispatch, params.id]);

  return (
    <div className={cx("wrapper", "")}>
      {courseData && (
        <div className={cx("content", "d-flex row")}>
          <div className={cx("info", "col-8")}>
            <div className="mb-5">
              <h1 className="my-2">{courseData.name}</h1>
              <p>{courseData.description}</p>
            </div>

            <div>
              <h1>Khóa học mang lại</h1>
              <CourseReceived />
            </div>
            <div>
              <h1 className="me-3">Bài học</h1>
              <LessonFromCourse />
            </div>
          </div>
          <div
            className={cx(
              "actions",
              "col-4 d-flex flex-column align-items-center justify-content-center h-100"
            )}
          >
            {courseData.thumbnail && (
              <Image
                courseImg
                src={`${process.env.REACT_APP_API_URL}/${courseData.thumbnail}`}
              />
            )}
            <h1 className={cx("course-money", "mt-3")}>{renderPrice()}</h1>
            <div className="mb-5">
              <h2 className="my-2">
                <span>Số người học: {totalUser}</span>
              </h2>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewCourseInfo;
