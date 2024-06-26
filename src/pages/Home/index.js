import React, { useEffect, useState } from "react";
import styles from "./Home.module.scss";
import classNames from "classnames/bind";
import Card from "~/layout/components/Card";
import { useDispatch } from "react-redux";
import requestApi from "~/utils/api";
import * as actions from "~/redux/actions";
const cx = classNames.bind(styles);
const Home = () => {
  const dispatch = useDispatch();
  const [coursesData, setCoursesData] = useState([]);
  useEffect(() => {
    dispatch(actions.controlLoading(true));
    requestApi("/courses", "GET")
      .then((res) => {
        setCoursesData(res.data.data);
        dispatch(actions.controlLoading(false));
      })
      .catch((err) => {
        dispatch(actions.controlLoading(false));
      });
  }, []);
  return (
    <div className={cx("wrapper")}>
      <div className="mb-5">
        <div className={cx("", "d-flex row mt-5")}>
          <h1>Khóa học miễn phí</h1>
          <div className={cx("group-corse")}>
            {coursesData && coursesData.length > 0 ? (
              coursesData.map((item, index) => {
                return <Card key={index} data={item} />;
              })
            ) : (
              <p>No posts available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
