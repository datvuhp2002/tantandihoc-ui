import React from "react";
import classNames from "classnames/bind";
import Styles from "./Input.module.scss";
const cx = classNames.bind(Styles);

export default function Input({
  text = false,
  data,
  file,
  transaction_information,
  login = false,
  className,
  leftIcon,
  rightIcon,
  children,
  onChange,
  register,
  error,
  keyName,
  ...passProps
}) {
  let Comp = "input";
  let _props = { onChange, ...passProps };
  if (text) {
    Comp = "h5";
  }
  const classes = cx("wrapper", {
    login,
    error,
    file,
    transaction_information,
    [className]: className,
  });
  return (
    <div className={classes}>
      {leftIcon && <span className={cx("Icon")}>{leftIcon}</span>}
      {Comp === "input" ? (
        <Comp {..._props} {...register} />
      ) : (
        <Comp {..._props}>{data ? data : children}</Comp>
      )}
      {rightIcon && <span className={cx("Icon")}>{rightIcon}</span>}
    </div>
  );
}
