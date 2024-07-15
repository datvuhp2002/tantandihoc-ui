import React, { useEffect, useState } from "react";
import requestApi from "~/utils/api";
import classNames from "classnames/bind";
import styles from "./MyCourses.module.scss";
import Card from "~/layout/components/Card";

const cx = classNames.bind(styles);

const MyCourses = () => {
  const [listCourses, setListCourses] = useState({ total: 0, data: [] });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await requestApi("/user-progress/user-course", "GET");
        setListCourses(response.data);
      } catch (error) {
        console.error("Error fetching user courses:", error);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className={cx("wrapper")}>
      <div className="mb-5">
        <div className="d-flex align-items-center justify-content-between mt-5 mb-4">
          <h1 className="m-0">Khóa học của tôi</h1>
          <div className={cx("group-post")}>
            <h2>
              <strong>Khóa học ({listCourses.total})</strong>
            </h2>
          </div>
        </div>

        <div className="row">
          {listCourses.data.map((item, index) => (
            <div key={index} className="col-md-4 mb-4">
              <Card data={item} isUserCourses={true} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyCourses;
