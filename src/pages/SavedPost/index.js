import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import requestApi from "~/utils/api";
import { Link, useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./SavedPost.module.scss";
import Image from "~/components/Image";
import Button from "~/components/Button";
import Input from "~/components/Input";
import { Wrapper } from "~/layout/components/Popper";
import { useDispatch } from "react-redux";
import * as actions from "~/redux/actions";
import { useForm } from "react-hook-form";
import moment from "moment";
const cx = classNames.bind(styles);
const SavedPost = () => {
  const [listPostSaved, setListPostSaved] = useState({});
  useEffect(() => {
    requestApi(`/saved-post`, "get").then((res) => {
      console.log(res.data);
      setListPostSaved(res.data);
    });
  }, []);
  return (
    <div className={cx("wrapper")}>
      <div className="mb-5">
        <div className={cx("", "d-flex row mt-5 col-8")}>
          <h1 className="p-0">Bài viết đã lưu</h1>
          <div className={cx("group-post")}>
            <h2>
              <strong>Bài viết ({listPostSaved.total})</strong>
            </h2>
          </div>
          {listPostSaved.data &&
            listPostSaved.data.map((item) => (
              <div className={cx("item")}>
                <Link key={item.id} to={`/blog/post-detail/${item.post_id}`}>
                  <h3>{item.ownership_post.title}</h3>
                  <div className={cx("author", "fs-4")}>
                    <span className={cx("time")}>
                      Thời gian lưu {moment(item.createdAt).fromNow()}
                    </span>
                    <span className={cx("dot")}>-</span>
                    <span className={cx("author_info")}>
                      Tác giả <strong>{item.author.username}</strong>
                    </span>
                  </div>
                </Link>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default SavedPost;
