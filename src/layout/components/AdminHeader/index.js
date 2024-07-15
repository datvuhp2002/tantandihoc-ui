import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./AdminHeader.module.scss";
import Button from "~/components/Button";
import Logo from "~/public/assets/images/logo.png";
import Image from "~/components/Image";

import requestApi from "~/utils/api";
import { adminRoutes } from "~/Route/Routes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
const cx = classNames.bind(styles);
const AdminHeader = ({ navigator = "/" }) => {
  const [userData, setUserData] = useState({});
  const [searchValue, setSearchValue] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("./");
  };

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
              <Image logo src={Logo}></Image>
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
        <div className={cx("action", "")}>
          {adminRoutes.map((item, index) =>
            item.name ? (
              <Button
                className="m-0"
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
        <div></div>
        <div className={cx("openMenu")}>
          <Button sidebar leftIcon={<FontAwesomeIcon icon={faBars} />} />
        </div>
      </div>
    </div>
  );
};
export default AdminHeader;
