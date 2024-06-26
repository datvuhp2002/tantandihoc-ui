import React, { useState, useEffect } from "react";
import styles from "./Blog.module.scss";
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
import { Link } from "react-router-dom";
import moment from "moment";
import "~/helpers/vi";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import PostCard from "~/layout/components/PostCard";
const cx = classNames.bind(styles);

const Blog = () => {
  const [postData, setPostData] = useState({ data: [] });
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.controlLoading(true));
    requestApi("/posts", "GET")
      .then((res) => {
        console.log(res.data);
        setPostData(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        dispatch(actions.controlLoading(false));
      });
  }, [dispatch]);

  return (
    <div className={cx("wrapper", "row d-flex")}>
      <div className={cx("header")}>
        <h2 className="fw-2">
          <strong>Bài viết mới nhất</strong>
        </h2>
      </div>
      {postData.data && postData.data.length > 0 ? (
        postData.data.map((item, index) => {
          return <PostCard key={index} data={item} />;
        })
      ) : (
        <p>No posts available</p>
      )}
    </div>
  );
};

export default Blog;
