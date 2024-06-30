import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import requestApi from "~/utils/api";
import { Link, useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./MyCourses.module.scss";
import Image from "~/components/Image";
import Button from "~/components/Button";
import Input from "~/components/Input";
import { Wrapper } from "~/layout/components/Popper";
import { useDispatch } from "react-redux";
import * as actions from "~/redux/actions";
import { useForm } from "react-hook-form";
import moment from "moment";
import Card from "~/layout/components/Card";
const cx = classNames.bind(styles);
const MyCourses = () => {
  const [listCourses, setListCourses] = useState({});
  useEffect(() => {
    requestApi(`/user-progress/user-course`, "GET").then((res) => {
      setListCourses(res.data);
    });
  }, []);
  return (
    <div className={cx("wrapper")}>
      <div className="mb-5">
        <div className={cx("", "d-flex row mt-5 ")}>
          <h1 className="p-0">Khóa học của tôi</h1>
          <div className={cx("group-post")}>
            <h2>
              <strong>Khóa học ({listCourses.total})</strong>
            </h2>
          </div>
          <div className="row">
            {listCourses.data &&
              listCourses.data.map((item, index) => (
                <div key={index} className="col-3 mb-4">
                  <Card data={item} isUserCourses={true} />
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCourses;
