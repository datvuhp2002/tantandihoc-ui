import React from "react";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import classNames from "classnames/bind";
import styles from "./defaultlayout.module.scss";
import HeaderLesson from "../components/HeaderLesson";
const cx = classNames.bind(styles);
const LessonLayout = ({ children }) => {
  return (
    <div className={cx("wrapper")}>
      <HeaderLesson isPublicRoute={false} />
      <div className={cx("body")}>{children}</div>
      {/* <Footer /> */}
    </div>
  );
};

export default LessonLayout;
