import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./Header.module.scss";
import { privateRoutes } from "~/Route/Routes";
import Button from "~/components/Button";
import Logo from "~/public/assets/images/logo.png";
import Image from "~/components/Image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faChevronLeft,
  faSearch,
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
const cx = classNames.bind(styles);
const Header = ({ isPublicRoute = false }) => {
  const [userData, setUserData] = useState({});
  const location = useLocation();
  const navigate = useNavigate();
  const isLearningRoute = location.pathname.match("/course-detail");

  const handleBackClick = () => {
    navigate("./");
  };
  const Menu_item = [
    [{ title: "Trang cá nhân", path: "/info" }],
    [
      { title: "Bài viết đã lưu", path: "/saved-posts" },
      { title: "Bài viết của bạn", path: "/my-posts" },
    ],
    [
      { title: "cài đặt", path: "/caidat" },
      { title: "đăng xuất", onClick: onHandleLogout, path: "/login" },
    ],
  ];
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
      {isPublicRoute ? (
        <div
          className={cx(
            "content",
            "d-flex align-items-center justify-content-between container h-100"
          )}
        >
          <Button header className={cx("logo", "h-100 d-flex")} to="/">
            <div
              className={cx(
                "logo-components",
                "d-flex align-items-center justify-content-center"
              )}
            >
              <Image logo src={Logo}></Image>
              <h5 className="mx-2 text-dark opacity-100 bold fs-2">
                Tantandihoc
              </h5>
            </div>
          </Button>
        </div>
      ) : (
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
              className={cx("logo", "h-100 justify-content-start")}
              to="/"
            >
              <div
                className={cx(
                  "logo-components",
                  "d-flex align-items-center justify-content-center"
                )}
              >
                <Image logo src={Logo}></Image>
                {isLearningRoute ? (
                  <Button
                    back_button
                    onClick={handleBackClick}
                    className="mx-2 text-dark opacity-100 bold fs-2"
                    leftIcon={<FontAwesomeIcon icon={faChevronLeft} />}
                  >
                    Back
                  </Button>
                ) : (
                  <h5 className="mx-2 text-dark opacity-100 bold fs-2">
                    Tantandihoc
                  </h5>
                )}
              </div>
            </Button>
          </div>
          {/* search */}
          <div
            className={cx(
              "body",
              "d-flex justify-content-center align-items-center flex-grow-1"
            )}
          >
            <div
              className={cx(
                "SearchWrapper",
                "d-flex justify-content-start align-items-center"
              )}
            >
              <FontAwesomeIcon
                className={cx("SearchIcon", "")}
                icon={faMagnifyingGlass}
              />
              <input
                className={cx("SearchInput", "w-100")}
                type="text"
                placeholder="Tìm kiếm khóa học, bài viết, video, ..."
              />
            </div>
          </div>
          {/* action */}
          <div className={cx("action", "d-flex justify-content-end")}>
            <Menu items={Menu_item}>
              <Image avatar rounded alt="" src={images.logo} />
            </Menu>
          </div>
        </div>
      )}
    </div>
  );
};
export default Header;
