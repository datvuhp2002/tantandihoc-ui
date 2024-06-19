import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import requestApi from "~/utils/api";
import { useNavigate } from "react-router-dom";
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
const cx = classNames.bind(styles);
const PostDetail = () => {
  const dispatch = useDispatch();
  const [postDetailData, setPostDetailData] = useState({});
  const [listPostData, setListPostData] = useState({});
  const params = useParams();
  useEffect(() => {
    dispatch(actions.controlLoading(true));
    requestApi(`/posts/${params.id}`, "GET")
      .then((res) => {
        console.log(res.data);
        setPostDetailData(res.data);
        requestApi(
          `/posts?category_id=${res.data.categoryId}&except=${params.id}`
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
  }, []);
  return (
    <div className={cx("wrapper", "d-flex row")}>
      <div className="col-8">
        <h1
          className={cx(
            "title",
            "d-flex align-item-center justify-content-center mb-2"
          )}
        >
          <strong>{postDetailData.title}</strong>
        </h1>
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
            disabled={true} // Không cho phép chỉnh sửa
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
      </div>
      <div className={cx("other", "col-3")}>
        <h1>Có thể bạn sẽ thích</h1>
        <div className={cx("post_item")}>
          {listPostData.data &&
            listPostData.data.map((item, index) => {
              return (
                <div
                  key={index}
                  className={cx(
                    "item",
                    "d-flex justify-content-start align-item-start mt-2"
                  )}
                >
                  <Button
                    blog_navigate
                    className="d-flex justify-content-start align-item-start"
                    href={`/blog/post-detail/${item.id}`}
                  >
                    <Image
                      post_thumbnail_other
                      src={`${process.env.REACT_APP_API_URL}/${item.thumbnail}`}
                    />
                    {item.title}
                  </Button>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
