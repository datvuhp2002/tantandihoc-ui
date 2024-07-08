import React from "react";
import classNames from "classnames/bind";
import { Link, NavLink } from "react-router-dom";
import Styles from "./Button.module.scss";
const cx = classNames.bind(Styles);
export default function Button({
  to,
  toActive,
  href,
  ref,
  fix,
  more,
  deleteBtn,
  add_blog_icon,
  lesson,
  back_button,
  x_button,
  blog_navigate,
  header_lesson,
  next_lesson,
  previous_lesson,
  scroll_to_top_btn,
  btnAdminCreate,
  reply,
  play = false,
  primary = false,
  outline = false,
  disabled = false,
  rounded = false,
  text = false,
  small = false,
  large = false,
  active = false,
  saved,
  login,
  navLink,
  sidebar,
  avatar,
  menuItem,
  courseBtn,
  header,
  isActive,
  btnContinue,
  register,
  forgetPassword,
  className,
  leftIcon,
  rightIcon,
  children,
  white,
  onClick,
  ...passProps
}) {
  let Comp = "button";
  let _props = { onClick, ...passProps };
  if (disabled) {
    Object.keys(_props).forEach((key) => {
      if (key.startsWith("on") && _props[key] === "function") {
        delete _props[key];
      }
    });
  }
  if (to) {
    _props.to = to;
    Comp = Link;
  } else if (toActive) {
    _props.to = toActive;
    Comp = NavLink;
  } else if (href) {
    _props.href = href;
    Comp = "a";
  }
  const classes = cx("wrapper", {
    active,
    login,
    deleteBtn,
    fix,
    header,
    navLink,
    scroll_to_top_btn,
    btnAdminCreate,
    sidebar,
    btnContinue,
    next_lesson,
    previous_lesson,
    x_button,
    back_button,
    forgetPassword,
    add_blog_icon,
    blog_navigate,
    white,
    more,
    reply,
    register,
    header_lesson,
    outline,
    menuItem,
    disabled,
    rounded,
    courseBtn,
    lesson,
    avatar,
    text,
    saved,
    [className]: className,
    small,
    large,
  });
  return (
    <Comp className={classes} {..._props}>
      {leftIcon && <span className={cx("Icon")}>{leftIcon}</span>}
      <span className={cx("title")}>{children}</span>
      {rightIcon && <span className={cx("Icon")}>{rightIcon}</span>}
    </Comp>
  );
}
