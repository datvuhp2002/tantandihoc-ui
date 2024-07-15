import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames/bind";
import moment from "moment";
import requestApi from "~/utils/api";
import styles from "./SavedPost.module.scss";

const cx = classNames.bind(styles);

const SavedPost = () => {
  const [listPostSaved, setListPostSaved] = useState({ total: 0, data: [] });

  useEffect(() => {
    const fetchSavedPosts = async () => {
      try {
        const response = await requestApi("/saved-post", "GET");
        setListPostSaved(response.data);
      } catch (error) {
        console.error("Error fetching saved posts:", error);
      }
    };

    fetchSavedPosts();
  }, []);

  return (
    <div className={cx("wrapper")}>
      <div className="mx-2 mb-5">
        <div className={cx("d-flex", "row", "mt-5")}>
          <h1 className="p-0">Bài viết đã lưu</h1>
          <div className={cx("group-post")}>
            <h2>
              <strong>Bài viết ({listPostSaved.total})</strong>
            </h2>
          </div>
          {listPostSaved.data &&
            listPostSaved.data.map((item) => (
              <div key={item.id} className={cx("item")}>
                <Link to={`/blog/post-detail/${item.post_id}`}>
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
