import React, { useState, useEffect } from "react";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { Wrapper as PopperWrapper } from "..";
import styles from "./Menu.module.scss";
import MenuItem from "./MenuItem";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);
const Menu = ({ children, items }) => {
  const render_Items = () => {
    return items?.map((group, index) => (
      <ul key={index} className={cx("item")}>
        {group.map((item, idx) => (
          <MenuItem key={idx} data={item} />
        ))}
      </ul>
    ));
  };
  const renderResult = (attrs) => (
    <div className={cx("content")} tabIndex={-1} {...attrs}>
      <PopperWrapper>{render_Items()}</PopperWrapper>
    </div>
  );
  return (
    <Tippy
      interactive
      zIndex
      animation={false}
      placement={"bottom-end"}
      render={renderResult}
    >
      <div className={cx("user", "h-100 d-flex align-items-center p-1")}>
        {children}
      </div>
    </Tippy>
  );
};

export default Menu;
