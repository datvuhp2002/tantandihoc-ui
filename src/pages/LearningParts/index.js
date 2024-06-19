import React, { useEffect, useState } from "react";
import styles from "./LearningParts.module.scss";
import classNames from "classnames/bind";
import SlideCard from "~/layout/components/SlideCard";
import Input from "~/components/Input";
import Button from "~/components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button as BTN, Modal } from "react-bootstrap";
import {
  faBuildingColumns,
  faCartShopping,
  faEye,
  faPhone,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import Card from "~/layout/components/Card";
import dayjs from "dayjs";
import * as actions from "~/redux/actions";
import requestApi from "~/utils/api";
import { useDispatch } from "react-redux";
import DataTable from "~/layout/common/DataTable";
import { Link } from "react-router-dom";
import moment from "moment";
import "~/helpers/vi";
const cx = classNames.bind(styles);
const LearningParts = () => {
  const dispatch = useDispatch();
  return <div>Lộ trình</div>;
};

export default LearningParts;
