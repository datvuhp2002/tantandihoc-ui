import React from "react";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import classNames from "classnames/bind";
import styles from "./SettingLayout.module.scss";
import HeaderSetting from "../components/HeaderSetting";
const cx = classNames.bind(styles);
const SettingLayout = ({ children }) => {
  return (
    <div className={cx("wrapper")}>
      <HeaderSetting />
      <div className={cx("body")}>{children}</div>
    </div>
  );
};

export default SettingLayout;
