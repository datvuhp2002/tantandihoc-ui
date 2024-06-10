import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import classNames from "classnames/bind";
import styles from "./defaultlayout.module.scss";
const cx = classNames.bind(styles);
const DefaultLayout = ({ children }) => {
  return (
    <div className={cx("wrapper")}>
      <Header isPublicRoute={false} />
      <Sidebar />
      <div className={cx("body")}>{children}</div>
      <Footer />
    </div>
  );
};

export default DefaultLayout;
