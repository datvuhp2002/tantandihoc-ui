import React from "react";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import classNames from "classnames/bind";
import styles from "./defaultlayout.module.scss";
import HeaderProfile from "../components/HeaderProfile";
const cx = classNames.bind(styles);
const ProfileLayout = ({ children }) => {
  return (
    <div className={cx("wrapper")}>
      <HeaderProfile />
      <div className={cx("body")}>{children}</div>
    </div>
  );
};

export default ProfileLayout;
