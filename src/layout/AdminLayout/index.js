import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import classNames from "classnames/bind";
import styles from "./AdminLayout.module.scss";
import Sidebar from "~/components/ADMIN/Sidebar";
const cx = classNames.bind(styles);
const AdminLayout = ({ children }) => {
  return (
    <div className={cx("wrapper")}>
      <Header isPublicRoute={false} navigator="/admin/dashboard" />
      <Sidebar />
      <div className={cx("body")}>{children}</div>
    </div>
  );
};

export default AdminLayout;
