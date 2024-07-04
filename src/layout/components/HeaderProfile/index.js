import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./HeaderProfile.module.scss";
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
const HeaderProfile = ({ navigator = "/" }) => {
  const [userData, setUserData] = useState({});
  const [searchValue, setSearchValue] = useState("");
  const [showResult, setShowResult] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isLearningRoute = location.pathname.match("/course-detail");

  const handleBackClick = () => {
    navigate("./");
  };
  const Menu_item = [
    [{ title: "Trang cá nhân", path: `/info/${userData.username}` }],
    [{ title: "Khoá học của tôi", path: "/my-courses" }],
    [
      { title: "Bài viết đã lưu", path: "/saved-posts" },
      { title: "Bài viết của bạn", path: "/my-posts" },
    ],
    [
      { title: "cài đặt", path: `/setting` },
      { title: "đăng xuất", onClick: onHandleLogout, path: "/login" },
    ],
  ];
  const handleChange = (e) => {
    const searchValue = e.target.value;
    if (!searchValue.startsWith(" ")) {
      setSearchValue(searchValue);
    }
  };
  useEffect(() => {
    try {
      requestApi("/users/profile", "GET")
        .then((res) => {
          setUserData({
            ...res.data,
            avatar: `${process.env.REACT_APP_API_URL}/${res.data.avatar}`,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  }, []);
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
            leftIcon={<FontAwesomeIcon icon={faArrowLeft} />}
          >
            <div
              className={cx(
                "logo-components",
                "d-flex align-items-center justify-content-center"
              )}
            >
              <Image logo src={Logo}></Image>
            </div>
          </Button>
        </div>

        {/* action */}
        <div className={cx("action", "d-flex justify-content-end")}>
          <Menu items={Menu_item}>
            {userData.avatar ? (
              <Image avatar rounded alt="" src={userData.avatar} />
            ) : (
              <Image avatar rounded alt="" src={Logo} />
            )}
          </Menu>
        </div>
      </div>
    </div>
  );
};
export default HeaderProfile;
