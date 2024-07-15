import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import requestApi from "~/utils/api";
import { Link } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./MyPost.module.scss";
import Button from "~/components/Button";
import { useDispatch } from "react-redux";
import * as actions from "~/redux/actions";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Modal from "react-bootstrap/Modal";

const cx = classNames.bind(styles);

const MyPostPublished = () => {
  const dispatch = useDispatch();
  const [listPostSaved, setListPostSaved] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [refresh, setRefresh] = useState(Date.now());

  useEffect(() => {
    fetchMyPublishedPosts();
  }, [refresh]);

  const fetchMyPublishedPosts = async () => {
    try {
      const response = await requestApi(
        `/posts/get-all-my-post?isPublished=true`,
        "GET"
      );
      setListPostSaved(response.data);
    } catch (error) {
      console.error("Error fetching published posts:", error);
    }
  };

  const requestDeleteApi = (deleteItem) => {
    dispatch(actions.controlLoading(true));
    requestApi(`/posts/${deleteItem}`, "DELETE")
      .then((response) => {
        setShowModal(false);
        setRefresh(Date.now());
        dispatch(actions.controlLoading(false));
        toast.success("Bài viết đã được xóa thành công!");
      })
      .catch((err) => {
        console.error("Delete post error:", err);
        setShowModal(false);
        dispatch(actions.controlLoading(false));
        toast.error("Xóa bài viết không thành công!");
      });
  };

  const handleDeleteClick = (id) => {
    setDeleteItemId(id);
    setShowModal(true);
  };

  return (
    <div className={cx("wrapper")}>
      <div className=" mb-5">
        <div className={cx("", "d-flex", "flex-column", "mt-5")}>
          <h1 className={cx("p-0", "mb-4")}>Bài viết của bạn</h1>
          <div className={cx("group-post", "mb-3")}>
            <Button toActive="/my-posts" more className={cx("fs-2", "p-3")}>
              <strong>Bài viết</strong>
            </Button>
            <Button
              toActive="/my-posts-published"
              more
              className={cx("fs-2", "p-3", "active")}
            >
              <strong>Đã xuất bản ({listPostSaved.total})</strong>
            </Button>
            <Button
              toActive="/my-posts-unpublished"
              more
              className={cx("fs-2", "p-3")}
            >
              <strong>Đang đợi duyệt</strong>
            </Button>
          </div>
          {listPostSaved.data &&
            listPostSaved.data.map((item) => (
              <div key={item.id} className={cx("item", "mb-4")}>
                <div className="d-flex align-items-center justify-content-between">
                  <Link to={`/blog/post-detail/${item.id}`}>
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
                  <Button
                    remove
                    rounded
                    onClick={() => handleDeleteClick(item.id)}
                    leftIcon={<FontAwesomeIcon icon={faTrash} />}
                  >
                    Xoá
                  </Button>
                </div>
              </div>
            ))}
        </div>
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận</Modal.Title>
        </Modal.Header>
        <Modal.Body>Bạn có chắc chắn muốn xóa bài viết này?</Modal.Body>
        <Modal.Footer>
          <Button
            update
            onClick={() => setShowModal(false)}
            className={cx("p-2", "fs-5")}
          >
            Đóng
          </Button>
          <Button
            remove
            className={cx("btn-danger", "p-2", "fs-5")}
            onClick={() => requestDeleteApi(deleteItemId)}
          >
            Xóa
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MyPostPublished;
