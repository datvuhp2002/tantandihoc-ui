import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./HeaderSetting.module.scss";
import { privateRoutes } from "~/Route/Routes";
import Button from "~/components/Button";
import Logo from "~/public/assets/images/logo.png";
import Image from "~/components/Image";
import HeadlessTippy from "@tippyjs/react/headless";
import { useDebounce } from "~/hooks/useDebounce";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faChevronLeft,
  faSearch,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import Tippy from "@tippyjs/react";
import {
  faMagnifyingGlass,
  faSpinner,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { Wrapper as PopperWrapper } from "../Popper";
import requestApi from "~/utils/api";
import Menu from "../Popper/Menu";
import { onHandleLogout } from "~/helpers";
import images from "~/public/assets/images";
import Search from "../Search";
const cx = classNames.bind(styles);
const HeaderSetting = ({ navigator = "/" }) => {
  const [userData, setUserData] = useState({});
  const location = useLocation();
  const navigate = useNavigate();
  const handleBackClick = () => {
    navigate("./");
  };

  useEffect(() => {}, []);
  return (
    <div className={cx("wrapper")}>
      <div
        className={cx(
          "content",
          "d-flex align-items-center justify-content-between container h-100"
        )}
      >
        {/* logo */}
        <div className={cx("logo", "d-flex")}>
          <Button
            header
            className={cx(
              "logo-link",
              "h-100 justify-content-start fs-2 text-dark"
            )}
            to={`${navigator}`}
          >
            <div
              className={cx(
                "logo-components",
                "d-flex align-items-center justify-content-center"
              )}
            >
              <Image logo src={Logo}></Image>
              <h2 className="p-0 m-0 ms-2">Cài đặt tài khoản</h2>
            </div>
          </Button>
        </div>

        {/* action */}
        <div className={cx("action", "d-flex justify-content-end")}>X</div>
      </div>
    </div>
  );
};
export default HeaderSetting;
