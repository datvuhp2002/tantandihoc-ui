import React from "react";
import styles from "./MenuItem.module.scss";
import classNames from "classnames/bind";
import Button from "~/components/Button";
const cx = classNames.bind(styles);
const MenuItem = ({ data }) => {
  return (
    <li className={cx("wrapper")}>
      <Button
        menuItem
        to={data.path}
        className={cx("item")}
        onClick={data.onClick}
      >
        {data.title}
      </Button>
    </li>
  );
};
export default MenuItem;
