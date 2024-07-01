import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./Comment.module.scss";
import Button from "../Button";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import requestApi from "~/utils/api";
import ListComment from "../ListComment";
import CommentInput from "../CommentInput";

const cx = classNames.bind(styles);

const Comment = ({
  data,
  onClick,
  location,
  isLesson = true,
  fetchComments,
  fetchReplyComment,
  ...passProps
}) => {
  let _props = { ...passProps };
  const [userProfile, setUserProfile] = useState({});
  const [id, setId] = useState(0);
  useEffect(() => {
    console.log(location);
    if (isLesson) {
      const searchParams = new URLSearchParams(location);
      const lesson = searchParams.get("lesson");
      setId(lesson);
    } else {
      setId(location);
    }
    requestApi("/users/profile", "GET").then((res) => {
      setUserProfile(res.data);
    });
  }, [location]);
  return (
    <div className={cx("wrapper")} {..._props}>
      <div className={cx("overlay")} onClick={onClick}></div>
      <div className={cx("comment")}>
        <div className={cx("close-btn", "p-0")}>
          <Button
            onClick={onClick}
            more
            leftIcon={<FontAwesomeIcon icon={faClose} />}
            className="fs-2 p-0 align-items-end justify-content-end"
          />
        </div>
        <div className={cx("comment_modal", "mt-2")}>
          <CommentInput
            data={userProfile}
            id={id}
            isLesson={isLesson}
            onCommentCreated={fetchComments}
          />
          <div className={cx("comment-list", "mt-2")} {..._props}>
            <div className={cx("header")}>
              <h2 className={cx("comment-header-title")}>
                {data.total} bình luận
              </h2>
            </div>
            <div className={cx("content")}>
              {data.comments.map((item, index) => (
                <ListComment
                  isLesson={isLesson}
                  key={index}
                  profile={userProfile}
                  data={item}
                  onCommentCreated={fetchComments}
                ></ListComment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comment;
