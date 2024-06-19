import { useState } from "react";
import images from "../../public/assets/images";
import styles from "./Image.module.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);
const Image = ({
  src,
  alt,
  logo,
  className,
  avatar,
  background,
  avatar_profile,
  fallback: customFallback = images.logo,
  w100,
  rounded,
  w50,
  minw30,
  post_thumbnail,
  post_avatar,
  post_thumbnail_other,
  h100,
  h50,
  minh30,
  courseImg,
  courseImgDashboard,
  ...props
}) => {
  const [fallback, setFallback] = useState("");
  const Loading = () => <div className={cx("lds-dual-ring")}></div>;
  function handleError() {
    setFallback(customFallback);
  }
  const classes = cx("wrapper", {
    logo,
    w100,
    w50,
    background,
    avatar,
    rounded,
    minw30,
    h100,
    post_thumbnail,
    post_thumbnail_other,
    post_avatar,
    avatar_profile,
    h50,
    minh30,
    courseImg,
    courseImgDashboard,
    [className]: className,
  });
  return (
    <img
      className={cx("wrapper", classes)}
      src={fallback || src}
      alt={alt}
      {...props}
      onError={handleError}
    />
  );
};

export default Image;
