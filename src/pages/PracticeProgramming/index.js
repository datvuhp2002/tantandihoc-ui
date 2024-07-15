import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import requestApi from "~/utils/api";
import { Link, useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./PracticeProgramming.module.scss";
import Image from "~/components/Image";
import Button from "~/components/Button";
import Input from "~/components/Input";
import { Wrapper } from "~/layout/components/Popper";
import { useDispatch } from "react-redux";
import * as actions from "~/redux/actions";
import { useForm } from "react-hook-form";
import Card from "~/layout/components/Card";
import moment from "moment";
import CodeEditor from "~/components/CodeEditor";
const cx = classNames.bind(styles);
const PracticeProgramming = () => {
  useEffect(() => {}, []);
  return (
    <div className={cx("wrapper")}>
      <div className="mb-5">
        <div className={cx("", "d-flex row mt-5")}>
          <CodeEditor />
        </div>
      </div>
    </div>
  );
};

export default PracticeProgramming;
