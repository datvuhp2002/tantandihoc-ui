import React from "react";
import classNames from "classnames/bind";
import styles from "./Sidebar.module.scss";
import Button from "~/components/Button";
import { adminRoutes } from "~/Route/Routes";
const cx = classNames.bind(styles);
const Sidebar = () => {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("sidebar", "d-flex flex-column align-items-center ")}>
        {adminRoutes.map((item, index) =>
          item.name ? (
            <Button
              sidebar
              key={index}
              toActive={item.path}
              leftIcon={item.icon}
            >
              {item.name}
            </Button>
          ) : (
            ""
          )
        )}
      </div>
    </div>
  );
};

export default Sidebar;
