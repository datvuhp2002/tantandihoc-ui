import React from "react";
import classNames from "classnames/bind";
import styles from "./Sidebar.module.scss";
import { privateRoutes } from "~/Route/Routes";
import Button from "~/components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faPenNib, faPlus } from "@fortawesome/free-solid-svg-icons";
const cx = classNames.bind(styles);
const Sidebar = () => {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("sidebar", "d-flex align-items-center")}>
        <Button
          sidebar
          rounded
          add_blog_icon
          white
          to="/create-post"
          leftIcon={<FontAwesomeIcon icon={faPenNib} />}
        />
        {privateRoutes.map((item, index) =>
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
