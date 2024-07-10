import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import requestApi from "~/utils/api";
import { useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./CourseDetail.module.scss";
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

const cx = classNames.bind(styles);

const CourseDetail = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState({});
  const [courseReceivedData, setCourseReceivedData] = useState([]);
  const [lessonData, setLessonData] = useState({});
  const [isRegisterCourseData, setIsRegisterCourseData] = useState(false);
  const [userProgress, setUserProgress] = useState({});
  const [finalPrice, setFinalPrice] = useState(0);

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

  const OnRegisterCourse = async () => {
    if (lessonData.data.length > 0) {
      await requestApi("/user-progress", "POST", {
        course_id: params.id,
        lesson_id: lessonData.data[0].id,
      })
        .then((res) => {
          console.log(res.data);
          toast.success("Đăng ký học thành công", {
            position: "top-right",
            autoClose: 3000,
          });
          setIsRegisterCourseData(true);
          setUserProgress(res.data);
        })
        .catch((err) => {
          toast.error(err.response.data.message, {
            position: "top-right",
            autoClose: 3000,
          });
        });
    } else {
      toast.warning("Khoá học này đang được phát triển hãy quay lại sau", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };
  const OnBuyCourse = async () => {
    const formatData = {
      name: `Mua khóa học ${courseData.name}`,
      amount: finalPrice,
      course_id: params.id,
    };
    const transactionResponse = await requestApi(
      "/transaction",
      "POST",
      formatData
    ).then(async (res) => {
      const order = {
        amount: formatData.amount,
        description: `mã khóa học ${courseData.id}`,
        orderCode: res.data.id,
        returnUrl: `http://localhost:3000/payment-success`,
        cancelUrl: `http://localhost:3000/payment-error`,
      };
      await requestApi("/payos/create-payment-link", "POST", order)
        .then((res) => {
          window.open(res.data.paymentLink, "_blank");
        })
        .catch((err) => console.log(err));
    });
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
        const [
          courseResponse,
          courseReceivedResponse,
          lessonResponse,
          isRegisterCourseResponse,
        ] = await Promise.all([
          requestApi(`/courses/${params.id}`, "GET"),
          requestApi(
            `/course-received/${params.id}?get_all=true&sort=asc`,
            "GET"
          ),
          requestApi(
            `/lessons/all-lesson?get_all=All&course_id=${params.id}`,
            "GET"
          ),
          requestApi(`/user-progress/${params.id}`, "GET"),
        ]);

        setCourseData(courseResponse.data);
        setCourseReceivedData(courseReceivedResponse.data.data);
        setLessonData(lessonResponse.data);
        console.log(lessonResponse.data);
        setIsRegisterCourseData(isRegisterCourseResponse.data);

        if (isRegisterCourseResponse.data === true) {
          getUserProgress();
        }
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
              <h2>Bạn sẽ học được gì?</h2>
              <ul className="d-flex flex-wrap align-content-start">
                {courseReceivedData.map((item, index) => (
                  <li key={index} className="col-6 my-2">
                    <FontAwesomeIcon className="me-2 fs-2" icon={faCheck} />
                    <span>{item.name}</span>
                  </li>
                ))}
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
                  lessonData.data.map((item, index) => (
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
                  ))}
              </ul>
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
            {isRegisterCourseData ? (
              <Button onClick={onNavigate} rounded>
                Tiếp tục học
              </Button>
            ) : finalPrice === "Miễn phí" || finalPrice === 0 ? (
              <Button onClick={OnRegisterCourse} rounded>
                Đăng ký học
              </Button>
            ) : (
              <Button onClick={OnBuyCourse} rounded>
                Mua khóa học
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetail;
