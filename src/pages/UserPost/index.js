import React, { useState, useEffect } from "react";
import styles from "./UserPost.module.scss";
import classNames from "classnames/bind";
import SlideCard from "~/layout/components/SlideCard";
import Input from "~/components/Input";
import Button from "~/components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button as BTN, Modal } from "react-bootstrap";
import {
  faBuildingColumns,
  faCartShopping,
  faEye,
  faPencil,
  faPhone,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import Card from "~/layout/components/Card";
import dayjs from "dayjs";
import * as actions from "~/redux/actions";
import requestApi from "~/utils/api";
import { useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import moment from "moment";
import "~/helpers/vi";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import PostCard from "~/layout/components/PostCard";
import { faComments } from "@fortawesome/fontawesome-free-regular";
const cx = classNames.bind(styles);

const UserPost = () => {
  const [numOfPage, setNumOfPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [postData, setPostData] = useState({});
  const [username, setUsername] = useState("");
  const location = useLocation();
  const dispatch = useDispatch();
  const renderPagination = () => {
    const pagination = [];
    const nextPage = currentPage + 1 > numOfPage ? null : currentPage + 1;
    const prevPage = currentPage - 1 < 1 ? null : currentPage - 1;
    pagination.push(
      <li key="prev" className={prevPage ? "page-item" : "page-item disabled"}>
        <button
          className="page-link p-4"
          onClick={() => setCurrentPage(prevPage)}
        >
          &laquo;
        </button>
      </li>
    );
    for (let i = 1; i <= numOfPage; i++) {
      pagination.push(
        <li
          key={i}
          className={currentPage === i ? "page-item active" : "page-item"}
        >
          <button className="page-link p-4" onClick={() => setCurrentPage(i)}>
            {i}
          </button>
        </li>
      );
    }
    pagination.push(
      <li key="next" className={nextPage ? "page-item" : "page-item disabled"}>
        <button
          className="page-link p-4"
          onClick={() => setCurrentPage(nextPage)}
        >
          &raquo;
        </button>
      </li>
    );
    return pagination;
  };
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const user = searchParams.get("user");
    setUsername(user);
    let query = `?items_per_page=${itemsPerPage}&page=${currentPage}`;
    dispatch(actions.controlLoading(true));
    requestApi(`/posts/get-all-user-post/${user}${query}`, "GET")
      .then((res) => {
        console.log("RES", res);
        setPostData(res.data);
        console.log(res.data);
        setNumOfPage(res.data.lastPage);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        dispatch(actions.controlLoading(false));
      });
  }, [currentPage, itemsPerPage, dispatch]);

  return (
    <div className={cx("wrapper", "row d-flex")}>
      <div className={cx("header")}>
        <h2 className="fw-2">
          <strong>Bài viết mới nhất {username} </strong>
        </h2>
      </div>
      {postData.data && postData.data.length > 0 ? (
        postData.data.map((item, index) => {
          return <PostCard key={index} data={item} />;
        })
      ) : (
        <p>No posts available</p>
      )}
      <div className="row mt-3">
        <div className="col-sm-12 col-md-7">
          <ul className="pagination justify-content-end">
            {renderPagination()}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserPost;
