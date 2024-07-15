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
import { faPenAlt, faTrash } from "@fortawesome/free-solid-svg-icons";
import Modal from "react-bootstrap/Modal";

const cx = classNames.bind(styles);

const MyPostUnPublished = () => {
  const dispatch = useDispatch();
  const [listPostSaved, setListPostSaved] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null); // State to store the ID of the post to delete
  const [refresh, setRefresh] = useState(Date.now());

  useEffect(() => {
    fetchUnpublishedPosts();
  }, [refresh]);

  const fetchUnpublishedPosts = async () => {
    try {
      const response = await requestApi(
        `/posts/get-all-my-post?isPublished=false`,
        "GET"
      );
      setListPostSaved(response.data);
    } catch (error) {
      console.error("Error fetching unpublished posts:", error);
    }
  };

  const requestDeleteApi = (deleteItem) => {
    dispatch(actions.controlLoading(true));
    requestApi(`/posts/${deleteItem}`, "DELETE")
      .then((response) => {
        setShowModal(false);
        setRefresh(Date.now()); // Refresh list after successful deletion
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
    setShowModal(true); // Show confirmation modal when delete button is clicked
  };

  return (
    <div className={cx("wrapper")}>
      <div className="mb-5 mx-2">
        <div className={cx("", "d-flex", "row", "mt-5")}>
          <h1 className={cx("p-0")}>Bài viết của bạn</h1>
          <div className={cx("group-post")}>
            <Button toActive="/my-posts" more className={cx("fs-2", "p-3")}>
              <strong>Bài viết</strong>
            </Button>
            <Button
              toActive="/my-posts-published"
              more
              className={cx("fs-2", "p-3")}
            >
              <strong>Đã xuất bản</strong>
            </Button>
            <Button
              toActive="/my-posts-unpublished"
              more
              className={cx("fs-2", "p-3", "active")}
            >
              <strong>Đang đợi duyệt ({listPostSaved.total})</strong>
            </Button>
          </div>
          {listPostSaved.data &&
            listPostSaved.data.map((item) => (
              <div key={item.id} className={cx("item")}>
                <div
                  className={cx(
                    "d-flex",
                    "align-items-center",
                    "justify-content-between"
                  )}
                >
                  <div>
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
                  </div>
                  <div className={cx("actions")}>
                    <Button
                      update
                      to={`/blog/update-post/${item.id}`}
                      rounded
                      leftIcon={<FontAwesomeIcon icon={faPenAlt} />}
                      className="mt-2"
                    >
                      Sửa
                    </Button>
                    <Button
                      remove
                      rounded
                      onClick={() => handleDeleteClick(item.id)} // Call handleDeleteClick with post ID
                      leftIcon={<FontAwesomeIcon icon={faTrash} />}
                      className="mt-2"
                    >
                      Xoá
                    </Button>
                  </div>
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

export default MyPostUnPublished;
