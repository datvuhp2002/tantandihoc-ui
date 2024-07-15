import React, { useEffect, useState } from "react";
import styles from "./Home.module.scss";
import classNames from "classnames/bind";
import Card from "~/layout/components/Card";
import { useDispatch } from "react-redux";
import requestApi from "~/utils/api";
import * as actions from "~/redux/actions";
import CardPost from "~/layout/components/CardPost";
import Button from "~/components/Button";

const cx = classNames.bind(styles);

const Home = () => {
  const dispatch = useDispatch();
  const [coursesData, setCoursesData] = useState([]);
  const [postData, setPostData] = useState([]);

  useEffect(() => {
    dispatch(actions.controlLoading(true));

    // Fetch courses
    requestApi("/courses?items_per_page=4", "GET")
      .then((res) => {
        setCoursesData(res.data.data);
        dispatch(actions.controlLoading(false));
      })
      .catch((err) => {
        dispatch(actions.controlLoading(false));
        console.error("Failed to fetch courses:", err);
      });
    // Fetch posts
    requestApi("/posts?items_per_page=8", "GET")
      .then((res) => {
        setPostData(res.data.data);
      })
      .catch((err) => {
        console.error("Failed to fetch posts:", err);
      })
      .finally(() => {
        dispatch(actions.controlLoading(false));
      });
  }, []);

  return (
    <div className={cx("wrapper")}>
      <div className="mb-5">
        <div
          className={cx(
            "",
            "d-flex justify-content-between align-items-center mb-4"
          )}
        >
          <h2 className="fs-2">
            <strong>Khóa học mới</strong>
          </h2>
          <Button more to="/courses" className="fs-4">
            Xem thêm
          </Button>
        </div>
        <div className={cx("group-course", "row row-cols-1 row-cols-md-4 g-4")}>
          {coursesData && coursesData.length > 0 ? (
            coursesData.map((item, index) => (
              <div key={index} className="col mb-4">
                <Card data={item} />
              </div>
            ))
          ) : (
            <p>Không có khóa học nào.</p>
          )}
        </div>
      </div>

      {/* Recent posts section */}
      <div className="mb-5">
        <div
          className={cx(
            "",
            "d-flex justify-content-between align-items-center mb-4"
          )}
        >
          <h2 className="fs-2">
            <strong>Bài viết gần đây</strong>
          </h2>
          <Button more to="/blog" className="fs-4">
            Xem thêm
          </Button>
        </div>
        <div className={cx("post-course", "row row-cols-1 row-cols-md-4 g-4")}>
          {postData && postData.length > 0 ? (
            postData.map((item, index) => (
              <div key={index} className="col mb-4">
                <CardPost data={item} />
              </div>
            ))
          ) : (
            <p>Chưa có bài viết nào.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
