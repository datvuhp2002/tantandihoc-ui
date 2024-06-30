import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "./CommentInput.module.scss";
import Image from "../Image";
import Input from "../Input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import Button from "../Button";
import requestApi from "~/utils/api";
import { useDispatch } from "react-redux";
import * as actions from "~/redux/actions";
import { toast } from "react-toastify";

const cx = classNames.bind(styles);

const CommentInput = ({
  data,
  isLesson = false,
  isReply = false,
  reply_id,
  lesson,
  onCommentCreated,
  onReplyCreated,
}) => {
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState("");

  const handleClear = () => {
    setSearchValue("");
  };

  const handleChange = (e) => {
    const searchValue = e.target.value;
    if (!searchValue.startsWith(" ")) {
      setSearchValue(searchValue);
    }
  };

  const onSubmitLessonComment = async () => {
    dispatch(actions.controlLoading(true));
    const newComment = {
      lesson_id: Number(lesson),
      message: searchValue,
    };
    if (isReply) {
      newComment.reply = Number(reply_id);
    }
    await requestApi("/comment-lessons", "POST", newComment)
      .then((res) => {
        dispatch(actions.controlLoading(false));
        toast.success("Thêm bình luận thành công", {
          position: "top-right",
          autoClose: 3000,
        });
        handleClear();
        onCommentCreated();
        if (isReply) {
          onReplyCreated(
            { lesson_id: newComment.lesson_id, id: reply_id },
            true
          );
        }
      })
      .catch((err) => {
        console.log("err=>", err);
        dispatch(actions.controlLoading(false));
        toast.error("Thêm bình luận thất bại", {
          position: "top-right",
          autoClose: 3000,
        });
      });
  };

  return (
    <div className={cx("wrapper")}>
      <div className="d-flex">
        {data.avatar && (
          <div className={cx("avatar", "me-2")}>
            <Image
              avatar
              className="w-100"
              src={`${process.env.REACT_APP_API_URL}/${data.avatar}`}
            />
          </div>
        )}
        <Input
          rightIcon={<FontAwesomeIcon icon={faComment} />}
          className="w-100"
          placeholder="Nhập bình luận mới của bạn..."
          onChange={handleChange}
          value={searchValue}
        />
      </div>
      <div className="mt-2 d-flex align-item-center justify-content-end">
        {searchValue.length > 0 && (
          <Button rounded className="" onClick={() => handleClear()}>
            Hủy
          </Button>
        )}
        <Button rounded className="" onClick={onSubmitLessonComment}>
          Bình luận
        </Button>
      </div>
    </div>
  );
};

export default CommentInput;
