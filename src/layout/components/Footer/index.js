import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faStore,
  faWallet,
  faGear,
  faSquarePhone,
} from "@fortawesome/free-solid-svg-icons";
import Logo from "~/public/assets/images/logo.png";
import Image from "~/components/Image";
import styles from "./footer.module.scss";
import classNames from "classnames/bind";
import { Link } from "react-router-dom";

const cx = classNames.bind(styles);

const Footer = () => (
  <footer className={cx("footer", "text-light py-4 px-5")}></footer>
);

export default Footer;
