import React from "react";
import classNames from "classnames/bind";
import styles from "./AdminLayout.module.scss";
import AdminHeader from "../components/AdminHeader";
const cx = classNames.bind(styles);
const AdminLayout = ({ children }) => {
  return (
    <div className={cx("wrapper")}>
      <AdminHeader navigator="/admin/dashboard" />
      <div className={cx("body")}>{children}</div>
    </div>
  );
};

export default AdminLayout;
