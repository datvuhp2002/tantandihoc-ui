import React from "react";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import classNames from "classnames/bind";
import styles from "./PostLayout.module.scss";
import Header from "../components/Header";
const cx = classNames.bind(styles);
const PostLayout = ({ children }) => {
  return (
    <div className={cx("wrapper")}>
      <Header isPublicRoute={false} />
      <div className={cx("body")}>{children}</div>
      {/* <Footer /> */}
    </div>
  );
};

export default PostLayout;
