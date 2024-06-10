import React from "react";
import styles from "./Popper.module.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);
export function Wrapper({
  slide_card_money,
  chart,
  chart_data,
  manager_information,
  children,
  className,
  money,
}) {
  const classes = cx("wrapper", {
    money,
    slide_card_money,
    chart_data,
    chart,
    manager_information,
    [className]: className,
  });
  return <div className={classes}>{children}</div>;
}
