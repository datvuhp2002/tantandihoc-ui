import React, { useEffect, useState } from "react";
import styles from "./Home.module.scss";
import classNames from "classnames/bind";
import Card from "~/layout/components/Card";
import { useDispatch } from "react-redux";
import requestApi from "~/utils/api";
import * as actions from "~/redux/actions";
import CardPost from "~/layout/components/CardPost";
import Button from "~/components/Button";
import CodeEditor from "~/components/CodeEditor";
const cx = classNames.bind(styles);
const Home = () => {
  const dispatch = useDispatch();
  const [coursesData, setCoursesData] = useState([]);
  const [coursesFreeData, setCoursesFreeData] = useState([]);
  const [postData, setPostData] = useState([]);
  useEffect(() => {
    dispatch(actions.controlLoading(true));
    requestApi("/courses?items_per_page=8", "GET")
      .then((res) => {
        setCoursesData(res.data.data);
        dispatch(actions.controlLoading(false));
      })
      .catch((err) => {
        dispatch(actions.controlLoading(false));
      });
    requestApi("/courses?items_per_page=8&isFree=true", "GET")
      .then((res) => {
        setCoursesFreeData(res.data.data);
        dispatch(actions.controlLoading(false));
      })
      .catch((err) => {
        dispatch(actions.controlLoading(false));
      });
    requestApi(`/posts?item_per_page=8`, "GET")
      .then((res) => {
        setPostData(res.data.data);
        console.log(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        dispatch(actions.controlLoading(false));
      });
  }, []);
  return (
    <div className={cx("wrapper")}>
      <div className="mb-5">
        <div className={cx("", "d-flex row mt-5")}>
          <div className="d-flex align-items-center justify-content-between">
            <h2 className="fs-2">
              <strong>Khóa học mới</strong>
            </h2>
            <Button more to="/courses" className="fs-4">
              Xem thêm
            </Button>
          </div>
          <div className={cx("group-corse", "row mt-2")}>
            {coursesData && coursesData.length > 0 ? (
              coursesData.map((item, index) => {
                return (
                  <div key={index} className="col-3 mb-4">
                    <Card data={item} />
                  </div>
                );
              })
            ) : (
              <p>Không có khóa học nào.</p>
            )}
          </div>
        </div>
        <div className={cx("", "d-flex row mt-5")}>
          <div className="d-flex align-items-center justify-content-between">
            <h2 className="fs-2">
              <strong>Bài viết gần đây</strong>
            </h2>
            <Button more to="/blog" className="fs-4">
              Xem thêm
            </Button>
          </div>
          <div className={cx("post-corse", "row mt-2")}>
            {postData && postData.length > 0 ? (
              postData.map((item, index) => {
                return (
                  <div key={index} className="col-3 mb-4">
                    <CardPost data={item} />
                  </div>
                );
              })
            ) : (
              <p>Chưa có bài viết nào.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
