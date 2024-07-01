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
    let i = 1;
    console.log(i++);
    requestApi("/courses?items_per_page=8", "GET")
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
          <h2 className="fs-2">
            <strong>Khóa học mới</strong>
          </h2>
          <div className={cx("group-corse", "row")}>
            {coursesData && coursesData.length > 0 ? (
              coursesData.map((item, index) => {
                return (
                  <div key={index} className="col-3 mb-4">
                    <Card data={item} />
                  </div>
                );
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
