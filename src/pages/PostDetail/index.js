import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import requestApi from "~/utils/api";
import { Link, useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./PostDetail.module.scss";
import Image from "~/components/Image";
import Button from "~/components/Button";
import { useDispatch } from "react-redux";
import * as actions from "~/redux/actions";
import { useParams } from "react-router-dom";
import DOMPurify from "dompurify";
import parse from "html-react-parser";
import Editor from "ckeditor5-custom-build/build/ckeditor";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowAltCircleUp,
  faComment,
  faComments,
} from "@fortawesome/free-solid-svg-icons";
import { faBookmark as faBookmarkSolid } from "@fortawesome/free-solid-svg-icons";
import { faBookmark } from "@fortawesome/fontawesome-free-regular";
import moment from "moment";
import PostCard from "~/layout/components/PostCard";
import Comment from "~/components/Comment";
const cx = classNames.bind(styles);
const PostDetail = () => {
  const [isSavedPost, setIsSavedPost] = useState(false);
  const dispatch = useDispatch();
  const [postDetailData, setPostDetailData] = useState({});
  const [listPostData, setListPostData] = useState({});
  const params = useParams();
  const [isShowComment, setShowComment] = useState(false);
  const [listsComment, setListsComment] = useState({});

  const onSetShowComment = () => {
    setShowComment(!isShowComment);
  };
  const OnSavedPost = async (post_id) => {
    await requestApi("/saved-post", "POST", { post_id }).then((res) => {
      if (res.data.statusCode == 200) {
        toast.success(`${res.data.message}`, {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        toast.info(`${res.data.message}`, {
          position: "top-right",
          autoClose: 3000,
        });
      }
      setIsSavedPost(!isSavedPost);
    });
  };
  const getPostsData = async () => {
    await requestApi(`/posts/${params.id}`, "GET")
      .then((res) => {
        console.log(res.data);
        setPostDetailData(res.data);
        requestApi(
          `/posts?category_id=${res.data.categoryId}&except=${params.id}&items_per_page=3`
        )
          .then((res) => {
            setListPostData(res.data);
          })
          .catch((err) => {
            console.log(err.message);
          });
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        dispatch(actions.controlLoading(false));
      });
  };
  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };
  const fetchComments = async () => {
    await requestApi(
      `/comment-posts/get-all-comments-in-posts/${params.id}`,
      "GET"
    )
      .then((res) => {
        setListsComment(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    scrollToTop();
    dispatch(actions.controlLoading(true));
    requestApi(`/saved-post/${params.id}`, "GET")
      .then((res) => {
        setIsSavedPost(res.data);
      })
      .catch((err) => {
        console.log(err.message);
      });
    getPostsData();
    fetchComments();
  }, [params.id]);
  return (
    <div
      className={cx(
        "wrapper",
        "d-flex pt-5 algin-items-center justify-content-center"
      )}
    >
      <div className={cx("wrapper_content")}>
        <h1
          className={cx(
            "title",
            "d-flex align-item-center justify-content-center mb-2"
          )}
        >
          <strong>{postDetailData.title}</strong>
        </h1>
        <div className={cx("post_info")}>
          {postDetailData.owner && (
            <Link
              to={`/info/${postDetailData.owner.username}`}
              className="w-100"
            >
              <div className={cx("author_info")}>
                <div className={cx("avatar")}>
                  <Image
                    avatar
                    src={`${process.env.REACT_APP_API_URL}/${postDetailData.owner.avatar}`}
                    className="h-100 w-100"
                  />
                </div>
                <div className={cx("detail")}>
                  <span className={cx("username", "p-0 m-0 ")}>
                    {postDetailData.owner.username}
                  </span>
                  <p className="p-0 m-0 text-dark">
                    {moment(postDetailData.createdAt).fromNow()}
                  </p>
                </div>
              </div>
            </Link>
          )}
          <div>
            <div className={cx("actions", "d-flex justify-content-end")}>
              <Button
                className="justify-content-end"
                saved
                onClick={() => OnSavedPost(postDetailData.id)}
                leftIcon={
                  isSavedPost ? (
                    <FontAwesomeIcon icon={faBookmarkSolid}></FontAwesomeIcon>
                  ) : (
                    <FontAwesomeIcon icon={faBookmark}></FontAwesomeIcon>
                  )
                }
              ></Button>
            </div>
          </div>
        </div>
        <div
          className={cx(
            "content",
            "w-100 d-flex flex-column align-item-center justify-content-center"
          )}
        />
        {postDetailData.content && (
          <CKEditor
            editor={Editor}
            className="border border-0"
            data={postDetailData.content}
            disabled={true}
            onInit={(editor) => {
              editor.ui.view.editable.element.parentElement.insertBefore(
                editor.ui.view.toolbar.element,
                editor.ui.view.editable.element
              );
            }}
            config={{
              toolbar: [],
              removePlugins: ["Heading", "Link"],
              isReadOnly: true,
            }}
          />
        )}
        <div className={cx("other", "")}>
          <h2 className={cx("heading")}>Bài viết cùng thể loại khác</h2>
          <div className={cx("post_item", "mt-5 w-100 row")}>
            {listPostData.data &&
              listPostData.data.map((item, index) => {
                return <PostCard key={index} data={item} className="w-100" />;
              })}
          </div>
        </div>
      </div>
      <div className={cx("comment", "d-flex")}>
        <Button
          rounded
          leftIcon={<FontAwesomeIcon icon={faComments} />}
          onClick={() => {
            onSetShowComment();
          }}
        >
          Bình luận
        </Button>
        <Button
          className="p-0 fs-1 m-0"
          scroll_to_top_btn
          onClick={() => {
            scrollToTop();
          }}
          leftIcon={<FontAwesomeIcon icon={faArrowAltCircleUp} />}
        />
      </div>
      {isShowComment && (
        <Comment
          onClick={onSetShowComment}
          location={params.id}
          isLesson={false}
          data={listsComment}
          fetchComments={fetchComments}
        />
      )}
    </div>
  );
};

export default PostDetail;
