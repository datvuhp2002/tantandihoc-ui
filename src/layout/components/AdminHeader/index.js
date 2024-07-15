import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./AdminHeader.module.scss";
import Button from "~/components/Button";
import Logo from "~/public/assets/images/logo.png";
import Image from "~/components/Image";
import { adminRoutes } from "~/Route/Routes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faClose } from "@fortawesome/free-solid-svg-icons";
import requestApi from "~/utils/api";

const cx = classNames.bind(styles);

const AdminHeader = ({ navigator }) => {
  const [userData, setUserData] = useState({});
  const [menuOpen, setMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

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

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleOverlayClick = () => {
    if (menuOpen) {
      closeMenu();
    }
  };

  return (
    <div className={cx("wrapper")}>
      {menuOpen && (
        <div className={cx("overlay")} onClick={handleOverlayClick} />
      )}
      <div
        className={cx(
          "content",
          "d-flex align-items-center justify-content-between container h-100"
        )}
      >
        <div className={cx("logo", "d-flex")}>
          <Button
            header
            className={cx("logo", "h-100 justify-content-start")}
            to={`${navigator}`}
          >
            <div
              className={cx(
                "logo-components",
                "d-flex align-items-center justify-content-center"
              )}
            >
              <Image logo src={Logo} />
              <h5
                className={cx(
                  "web-name",
                  "mx-2 text-dark opacity-100 bold fs-2"
                )}
              >
                Tantandihoc
              </h5>
            </div>
          </Button>
        </div>
        <div className={cx("action")}>
          {adminRoutes.map(
            (item, index) =>
              item.name && (
                <Button
                  key={index}
                  className="m-0"
                  sidebar
                  toActive={item.path}
                  leftIcon={item.icon}
                >
                  {item.name}
                </Button>
              )
          )}
        </div>
        <div className={cx("openMenu")}>
          <Button
            sidebar
            leftIcon={<FontAwesomeIcon icon={faBars} />}
            onClick={toggleMenu}
          />
          {menuOpen && (
            <div className={cx("sidebar", "open")}>
              <div className={cx("sidebar-content")}>
                <div
                  className={cx(
                    "sidebar-header",
                    "d-flex align-items-center justify-content-end"
                  )}
                >
                  <Button
                    more
                    className={cx("close-button", "fs-4 d-flex")}
                    leftIcon={<FontAwesomeIcon icon={faClose} />}
                    onClick={closeMenu}
                  >
                    Đóng
                  </Button>
                </div>
                <div className={cx("sidebar-links")}>
                  {adminRoutes.map(
                    (item, index) =>
                      item.name && (
                        <Button
                          key={index}
                          sidebar
                          toActive={item.path}
                          onClick={closeMenu}
                        >
                          {item.name}
                        </Button>
                      )
                  )}
                </div>
              </div>
              <div className={cx("overlay")} onClick={closeMenu} />{" "}
              {/* Overlay for sidebar */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
