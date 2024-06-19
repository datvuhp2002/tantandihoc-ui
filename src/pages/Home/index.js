import React, { useEffect, useState } from "react";
import styles from "./Home.module.scss";
import classNames from "classnames/bind";
import SlideCard from "~/layout/components/SlideCard";
import Input from "~/components/Input";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Card from "~/layout/components/Card";
import { capitalize } from "lodash";
import * as logo from "@fortawesome/free-solid-svg-icons";
import Button from "~/components/Button";
import { useDispatch } from "react-redux";
import requestApi from "~/utils/api";
import * as actions from "~/redux/actions";
import moment from "moment";
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
