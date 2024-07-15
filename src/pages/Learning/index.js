import React, { useEffect, useState } from "react";
import requestApi from "~/utils/api";
import { useLocation, useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./Learning.module.scss";
import Button from "~/components/Button";
import { useDispatch } from "react-redux";
import * as actions from "~/redux/actions";
import { useParams } from "react-router-dom";
import moment from "moment";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import Editor from "ckeditor5-custom-build/build/ckeditor";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faBars,
  faChevronLeft,
  faChevronRight,
  faComments,
} from "@fortawesome/free-solid-svg-icons";
import LessonCard from "~/layout/components/LessonCard";
import Comment from "~/components/Comment";
import { toast } from "react-toastify";

const cx = classNames.bind(styles);

const Learning = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [courseData, setCourseData] = useState({});
  const [courseReceivedData, setCourseReceivedData] = useState([]);
  const [lessonData, setLessonData] = useState({});
  const [lesson, setLesson] = useState(1);
  const [detailLessonData, setDetailLessonData] = useState({});
  const [showLesson, setShowLesson] = useState(true);
  const [listsComment, setListsComment] = useState({});
  const [isShowComment, setShowComment] = useState(false);
  const [listLessonId, setListLessonId] = useState([]);
  const [quiz, setQuiz] = useState();
  const [isQuiz, setIsQuiz] = useState(false);
  const [quizData, setQuizData] = useState({});
  const [answer, setAnswer] = useState();
  const [showBorder, setShowBorder] = useState(false);
  const [isAnswer, setIsAnswer] = useState(false);
  const onUpdateUserProgress = async (quiz_id, score) => {
    await requestApi(`/user-progress/${params.id}?lesson_id=${lesson}`, "PUT", {
      quiz_id: Number(quiz_id),
      score: Number(score),
    });
  };
  const onSubmitQuiz = async () => {
    if (answer == "true") {
      toast.success("Câu trả lời chính xác!!!", {
        position: "top-right",
        autoClose: 3000,
      });
      await onUpdateUserProgress(quiz, 10);
    } else {
      toast.warning("Câu trả chưa chính xác!!!", {
        position: "top-right",
        autoClose: 3000,
      });
      await onUpdateUserProgress(quiz, 0);
    }
    setShowBorder(true);
  };
  const onNavigate = (i) => {
    navigate(`/course/learning/${params.id}?lesson=${i}`);
    fetchComments(i);
  };

  const onSetShowComment = () => {
    fetchComments();
    setShowComment(!isShowComment);
  };

  const fetchComments = async () => {
    await requestApi(
      `/comment-lessons/get-all-comments-in-lessons/${lesson}`,
      "GET"
    )
      .then((res) => {
        setListsComment(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const fetchQuiz = async (quiz_id) => {
    await requestApi(`/quiz/${quiz_id}`, "GET")
      .then((res) => {
        console.log(res.data);
        setQuizData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const onChangeAnswer = (e) => {
    setAnswer(e.target.value);
    setIsAnswer(true);
  };
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const lesson = searchParams.get("lesson");
    const quiz = searchParams.get("quiz");
    setLesson(lesson);
    if (quiz) {
      setQuiz(quiz);
      setIsQuiz(true);
      fetchQuiz(quiz);
    } else {
      setIsQuiz(false);
    }
    const promiseCourseData = requestApi(`/courses/${params.id}`, "GET");
    const promiseCourseReceivedData = requestApi(
      `/course-received/${params.id}?get_all=true&sort=asc`,
      "GET"
    );
    const promiseLessonData = requestApi(
      `/lessons/all-lesson?course_id=${params.id}`,
      "GET"
    );
    const detailLesson = requestApi(`/lessons/${lesson}`, "GET");
    const commentInLesson = requestApi(
      `/comment-lessons/get-all-comments-in-lessons/${lesson}`,
      "GET"
    );
    dispatch(actions.controlLoading(true));
    Promise.all([
      promiseCourseData,
      promiseCourseReceivedData,
      promiseLessonData,
      detailLesson,
      commentInLesson,
    ])
      .then((res) => {
        dispatch(actions.controlLoading(false));
        setCourseData(res[0].data);
        setCourseReceivedData(res[1].data.data);
        setLessonData(res[2].data);
        const lessonIdArray = res[2].data.data.map((item) => item.id);
        setListLessonId(lessonIdArray);
        setDetailLessonData(res[3].data);
        console("data", res[3].data);
        setListsComment(res[4].data);
      })
      .catch((err) => {
        dispatch(actions.controlLoading(false));
      });
  }, [location.search]);

  const currentLessonIndex = listLessonId.indexOf(parseInt(lesson));
  const previousLessonId =
    currentLessonIndex > 0 ? listLessonId[currentLessonIndex - 1] : null;
  const nextLessonId =
    currentLessonIndex < listLessonId.length - 1
      ? listLessonId[currentLessonIndex + 1]
      : null;

  return (
    <div className={cx("wrapper", `d-flex`)}>
      {!isQuiz ? (
        <div
          className={cx(
            "course",
            `${!showLesson ? "w-100" : ""} ${
              isShowComment ? "overflow-hidden" : ""
            }`
          )}
        >
          {(detailLessonData.videoFile || detailLessonData.videoUrl) && (
            <div className={cx("vid", "w-100")}>
              {detailLessonData.videoFile && (
                <video
                  className="w-100 h-100 bg-dark"
                  controls="controls autoplay"
                  controlsList="nodownload"
                >
                  <source
                    src={`${process.env.REACT_APP_API_URL}/${detailLessonData.videoFile}`}
                    type="video/mp4"
                  />
                </video>
              )}
              {detailLessonData.videoUrl && (
                <iframe
                  width="100%"
                  height="100%"
                  controls="controls autoplay"
                  src={`https://www.youtube.com/embed/${detailLessonData.videoUrl}?autoplay=1`}
                  allow="fullscreen;"
                />
              )}
            </div>
          )}
          {detailLessonData && (
            <div className={cx("content", "mt-5 container")}>
              <div className={cx("content_top")}>
                <h1>{detailLessonData.title}</h1>
                <p>Cập nhật {moment(detailLessonData.updatedAt).fromNow()}</p>
              </div>
              <CKEditor
                editor={Editor}
                className="border border-0 p-0"
                data={detailLessonData.content}
                disabled={true}
                onInit={(editor) => {
                  editor.ui.view.editable.element.parentElement.insertBefore(
                    editor.ui.view.toolbar.element,
                    editor.ui.view.editable.element
                  );
                }}
                config={{
                  style: { padding: "0" },
                  toolbar: [],
                  removePlugins: ["Heading", "Link"],
                  isReadOnly: true,
                }}
              />
              {/* Comment */}
              <div
                className={cx(
                  `${showLesson ? "comment-inside" : "comment-full"}`
                )}
              >
                <Button
                  showCommentButton
                  onClick={onSetShowComment}
                  rounded
                  leftIcon={<FontAwesomeIcon icon={faComments} />}
                  className="text-secondary"
                >
                  Hỏi đáp
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          className={cx(
            "course",
            `${!showLesson ? "w-100" : ""} ${
              isShowComment ? "overflow-hidden" : ""
            }`
          )}
        >
          <div className={cx("content", "mt-5 container")}>
            <div className={cx("content_top")}>
              <h1>{quizData.title}</h1>
              <p>Đã tạo {moment(quizData.createdAt).fromNow()}</p>
            </div>
            <div className={cx("content_body")}>
              <div className={cx("question")}>
                <span>{quizData.question}</span>
              </div>
              <div className={cx("answer")}>
                <select
                  multiple
                  className={cx("select_answer", "mt-3")}
                  onChange={(e) => {
                    onChangeAnswer(e);
                  }}
                >
                  {quizData.QuizAnswer &&
                    quizData.QuizAnswer.map((item, index) => (
                      <option
                        key={index}
                        value={item.correct}
                        className={cx(
                          "option_answer",
                          `${
                            showBorder
                              ? item.correct
                                ? "border-success"
                                : "border-danger"
                              : ""
                          }`
                        )}
                      >
                        {item.answer}
                      </option>
                    ))}
                </select>
              </div>
              <div
                className={cx(
                  "footer",
                  "d-flex align-items-center justify-content-end mt-2"
                )}
              >
                <Button
                  create
                  rounded
                  onClick={onSubmitQuiz}
                  disabled={!isAnswer}
                >
                  Trả lời
                </Button>
              </div>
            </div>
            <div
              className={cx(
                `${showLesson ? "comment-inside" : "comment-full"}`
              )}
            >
              <Button
                showCommentButton
                onClick={() => onSetShowComment()}
                rounded
                leftIcon={<FontAwesomeIcon icon={faComments} />}
                className="text-secondary"
              >
                Hỏi đáp
              </Button>
            </div>
          </div>
        </div>
      )}
      {showLesson && (
        <div className={cx("info", "pt-2")}>
          <header className="p-3 pt-4">
            <h2>Nội dung khóa học:</h2>
          </header>
          {lessonData.data &&
            lessonData.data.map((item, index) => {
              return <LessonCard key={index} index={index} data={item} />;
            })}
        </div>
      )}
      <div className={cx("action", "d-flex  justify-content-between")}>
        <div className={cx("visible-block", "col-1")}></div>
        <div>
          {showLesson ? (
            <button
              className={cx("menu", "p-0 w-0")}
              onClick={() => {
                setShowLesson(!showLesson);
              }}
            >
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          ) : (
            <button
              className={cx("menu", "p-0 w-0")}
              onClick={() => {
                setShowLesson(!showLesson);
              }}
            >
              <FontAwesomeIcon icon={faBars} />
            </button>
          )}
        </div>

        {lessonData.data && (
          <div className="d-flex align-items-center">
            <Button
              leftIcon={<FontAwesomeIcon icon={faChevronLeft} />}
              previous_lesson
              onClick={() => onNavigate(previousLessonId)}
              disabled={previousLessonId === null}
            >
              Bài trước
            </Button>
            <Button
              rightIcon={<FontAwesomeIcon icon={faChevronRight} />}
              next_lesson
              onClick={() => onNavigate(nextLessonId)}
              disabled={nextLessonId === null}
            >
              Bài tiếp theo
            </Button>
          </div>
        )}
        <div className="me-3">
          {showLesson ? (
            <Button
              className={cx("menu_btn", "p-0 w-0")}
              previous_lesson
              onClick={() => {
                setShowLesson(!showLesson);
              }}
              leftIcon={<FontAwesomeIcon icon={faArrowRight} />}
            ></Button>
          ) : (
            <Button
              className={cx("menu_btn", "p-0 w-0")}
              previous_lesson
              onClick={() => {
                setShowLesson(!showLesson);
              }}
              leftIcon={<FontAwesomeIcon icon={faBars} />}
            ></Button>
          )}
        </div>
      </div>
      {isShowComment && (
        <Comment
          onClick={onSetShowComment}
          location={location.search}
          data={listsComment}
          isLesson={true}
          fetchComments={fetchComments}
        />
      )}
    </div>
  );
};

export default Learning;
