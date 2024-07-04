import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./ListComment.module.scss";
import Button from "../Button";
import { faClose, faComment } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Input from "../Input";
import requestApi from "~/utils/api";
import Image from "../Image";
import moment from "moment";
import CommentInput from "../CommentInput";
import { Link } from "react-router-dom";
const cx = classNames.bind(styles);
const ListComment = ({
  data,
  profile,
  isLesson = true,
  onClick,
  location,
  replyMode,
  onCommentCreated,
  ...passProps
}) => {
  let _props = { ...passProps };
  const [isReply, setIsReply] = useState(false);
  const [replyData, setReplyData] = useState({});
  const [isShowReplyComments, setIsShowReplyComments] = useState(false);
  const fetchReplyComment = async (data, isReply) => {
    if (isLesson == true) {
      await requestApi(
        `/comment-lessons/get-all-reply-comments/${data.lesson_id}?reply=${data.id}`
      ).then((res) => {
        setReplyData(res.data);
      });
      if (replyMode || isReply) {
        setIsShowReplyComments(true);
      }
    } else if (isLesson == false) {
      await requestApi(
        `/comment-posts/get-all-reply-comments/${data.post_id}?reply=${data.id}`
      ).then((res) => {
        setReplyData(res.data);
      });
      if (replyMode || isReply) {
        setIsShowReplyComments(true);
      }
    }
  };

  useEffect(() => {
    fetchReplyComment(data, false);
    if (!isLesson) console.log(data);
  }, []);
  return (
    <div
      className={cx("wrapper", ` ${replyMode ? "px-3 pb-3 mx-3" : "my-4"}`)}
      {..._props}
    >
      <Link to={`/info/${data.author.username}`}>
        <div className={cx("author", "d-flex align-items-center ")}>
          <div className={cx("avatar")}>
            <Image
              avatar
              className="w-100"
              src={`${process.env.REACT_APP_API_URL}/${data.author.avatar}`}
            />
          </div>
          <span className={cx("username", "ms-2")}>{data.author.fullname}</span>
          <span
            className={cx(
              "time",
              "d-flex align-items-end justify-content-end ms-2"
            )}
          >
            {moment(data.createdAt).fromNow()}
          </span>
        </div>
      </Link>
      <div className={cx("body")}>
        <div className={cx("content")}>
          <p>{data.message}</p>
        </div>
      </div>
      <div className={cx("reaction-bar", "")}>
        <Button
          reply
          className="p-0 d-flex align-items-start justify-content-start fs-5"
          onClick={() => {
            setIsReply(!isReply);
          }}
        >
          {!isReply ? "Phản hồi" : "Hủy"}
        </Button>
      </div>
      {isReply ? (
        <div className={cx("reply-input", "ms-4 mt-2")}>
          <CommentInput
            data={profile}
            isReply={true}
            isLesson={isLesson}
            reply_id={data.id}
            id={isLesson ? data.lesson_id : data.post_id}
            onCommentCreated={onCommentCreated}
            onReplyCreated={fetchReplyComment}
          />
        </div>
      ) : (
        ""
      )}
      {replyData.total > 0 && (
        <div>
          {!isShowReplyComments && (
            <Button
              more
              className="p-0 d-flex align-items-start justify-content-start fs-5"
              onClick={() => setIsShowReplyComments(true)}
            >
              Xem {replyData.total} câu trả lời
            </Button>
          )}
          {isShowReplyComments && (
            <div className={cx("reply-comments")}>
              {replyData.comments.map((item, index) => (
                <ListComment
                  key={index}
                  data={item}
                  isLesson={isLesson}
                  profile={profile}
                  onCommentCreated={onCommentCreated}
                  replyMode
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ListComment;
