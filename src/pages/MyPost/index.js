import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import requestApi from "~/utils/api";
import { Link, useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./MyPost.module.scss";
import Image from "~/components/Image";
import Button from "~/components/Button";
import Input from "~/components/Input";
import { Wrapper } from "~/layout/components/Popper";
import { useDispatch } from "react-redux";
import * as actions from "~/redux/actions";
import { useForm } from "react-hook-form";
import Card from "~/layout/components/Card";
import moment from "moment";
const cx = classNames.bind(styles);
const MyPost = () => {
  const [listPostSaved, setListPostSaved] = useState({});
  useEffect(() => {
    requestApi(`/posts/get-all-my-post`, "get").then((res) => {
      console.log(res.data);
      setListPostSaved(res.data);
    });
  }, []);
  return (
    <div className={cx("wrapper")}>
      <div className="mb-5 mx-2">
        <div className={cx("", "d-flex row mt-5 ")}>
          <h1 className="p-0">Bài viết của bạn</h1>
          <div className={cx("group-post")}>
            <Button toActive="/my-posts" more className="fs-2 p-3">
              <strong>Bài viết ({listPostSaved.total})</strong>
            </Button>

            <Button toActive="/my-posts-published" more className="fs-2 p-3">
              <strong>Đã xuất bản </strong>
            </Button>
            <Button toActive="/my-posts-unpublished" more className="fs-2 p-3">
              <strong>Đang đợi duyệt</strong>
            </Button>
          </div>
          {listPostSaved.data &&
            listPostSaved.data.map((item) => (
              <div className={cx("item")}>
                <Link key={item.id} to={`/blog/post-detail/${item.id}`}>
                  <h3>{item.title}</h3>
                  <div className={cx("author", "fs-4")}>
                    <span className={cx("time")}>
                      Đã viết {moment(item.createdAt).fromNow()}
                    </span>
                    <span className={cx("dot")}>-</span>
                    <span className={cx("author_info")}>
                      Tác giả <strong>{item.owner.username}</strong>
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

export default MyPost;
