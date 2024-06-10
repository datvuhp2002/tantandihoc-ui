import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import requestApi from "~/utils/api";
import { useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./ThemGiaoDich.module.scss";
import Image from "~/components/Image";
import Button from "~/components/Button";
import Input from "~/components/Input";
import { useDispatch } from "react-redux";
import * as actions from "~/redux/actions";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
const cx = classNames.bind(styles);
const CourseDetail = () => {
  const params = useParams();
  const dispath = useDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [transactionData, setTransactionData] = useState({});
  const [allCategoryGroupData, setAllCategoryGroupData] = useState([]);
  const [allCategoryData, setAllCategoryData] = useState([]);
  const [allCurrencyData, setAllCurrencyData] = useState([]);
  const [allWalletData, setAllWalletData] = useState([]);
  const [paymentImage, setPaymentImage] = useState("");
  const onImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (e) => {
        setPaymentImage(reader.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  const onChangeCategoriesGroup = (e) => {
    console.log();
    requestCategory(e.target.value);
  };
  const requestCategory = async (id) => {
    await requestApi(`/category/getAll?categoriesGroup_id=${id}`, "GET")
      .then((res) => {
        setAllCategoryData(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onSubmit = async (data) => {
    data.recordDate = dayjs(data.recordDate).format();
    let formData = new FormData();
    for (let key in data) {
      if (key === "paymentImage") {
        formData.append(key, data[key][0]);
      } else {
        formData.append(key, data[key]);
      }
    }
    dispath(actions.controlLoading(true));
    try {
      await requestApi(
        `/transaction`,
        "POST",
        formData,
        "json",
        "multipart/form-data"
      )
        .then((res) => {
          dispath(actions.controlLoading(false));
          toast.success("cập nhật thành công", {
            position: "top-right",
          });
          setTransactionData(data);
        })
        .catch((err) => {
          dispath(actions.controlLoading(false));
          console.log("Err", err);
          if (typeof err.response !== "undefined") {
            if (err.response.status !== 201) {
              toast.error(err.response.data.message, {
                position: "top-right",
              });
            }
          } else {
            toast.error("Server is down, please try again", {
              position: "top-right",
            });
          }
        });
    } catch (err) {}
  };
  useEffect(() => {
    const promiseGetAllWallet = requestApi(`/wallet/getAll`, "GET");
    const promiseGetAllCategoriesGroup = requestApi(`/category-group/getAll`);
    const promiseGetAllCurrency = requestApi(`/currency`);
    try {
      Promise.all([
        promiseGetAllCurrency,
        promiseGetAllCategoriesGroup,
        promiseGetAllWallet,
      ])
        .then((res) => {
          setAllCurrencyData(res[0].data.data);
          console.log(res[0].data.data);
          setAllCategoryGroupData(res[1].data.data);
          setAllWalletData(res[2].data.data);
          requestCategory(res[1].data.data[0].id);
        })
        .catch((err) => {
          console.log(err.message);
        });
    } catch (err) {
      console.log(err);
    }
  }, []);

  return <div className={cx("wrapper", "d-flex row ")}>CourseDetail</div>;
};

export default CourseDetail;
