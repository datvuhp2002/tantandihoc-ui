import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import requestApi from "~/utils/api";
import { useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./ChiTietGiaoDich.module.scss";
import Image from "~/components/Image";
import Button from "~/components/Button";
import Input from "~/components/Input";
import { useDispatch } from "react-redux";
import * as actions from "~/redux/actions";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
const cx = classNames.bind(styles);
const ChiTietGiaoDich = () => {
  const params = useParams();
  const dispath = useDispatch();
  const [showForm, setShowForm] = useState(true);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [transactionData, setTransactionData] = useState({});
  const [categoryGroupData, setCategoryGroupData] = useState({});
  const [categoryData, setCategoryData] = useState({});
  const [currencyData, setCurrencyData] = useState({});
  const [walletData, setWalletData] = useState({});
  const [allCategoryGroupData, setAllCategoryGroupData] = useState([]);
  const [allCategoryData, setAllCategoryData] = useState([]);
  const [allCurrencyData, setAllCurrencyData] = useState([]);
  const [allWalletData, setAllWalletData] = useState([]);
  const onHandleShowForm = () => {
    Object.keys(transactionData).map((key) => {
      if (key !== "recordDate") {
        setValue(key, transactionData[key]);
      } else {
        setValue(key, dayjs(transactionData.recordDate).format("YYYY-MM-DD"));
      }
    });
    setShowForm(!showForm);
  };
  const onImageChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      let reader = new FileReader();
      reader.onload = (e) => {
        setTransactionData({
          ...transactionData,
          paymentImage: reader.result,
        });
      };
      reader.readAsDataURL(file);
      try {
        let formData = new FormData();
        formData.append("paymentImage", file);
        dispath(actions.controlLoading(true));
        requestApi(
          `/transaction/upload-paymentImage/${params.id}`,
          "PUT",
          formData,
          "json",
          "multipart/form-data"
        ).then((res) => {
          console.log(res);
          dispath(actions.controlLoading(false));
          toast.success("Thay đổi ảnh giao dịch thành công thành công", {
            position: "top-right",
          });
        });
      } catch (err) {
        console.log(err.message);
        toast.success(err.response.data.message, {
          position: "top-right",
        });
        dispath(actions.controlLoading(false));
      }
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
    try {
      const recordDateFormat = dayjs(data.recordDate).format();
      const {
        paymentImage,
        ownership_categoriesGroup,
        ownership_category,
        ownership_currency,
        ownership_wallet,
        ...transactionDataWithoutPaymentImage
      } = data;
      transactionDataWithoutPaymentImage.recordDate = recordDateFormat;
      console.log(transactionDataWithoutPaymentImage);
      await requestApi(
        `/transaction/${params.id}`,
        "PUT",
        transactionDataWithoutPaymentImage
      )
        .then((res) => {
          toast.success("cập nhật thành công", {
            position: "top-right",
          });
          setTransactionData(data);
          setShowForm(!showForm);
        })
        .catch((err) => {
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
    const promiseDetailTransactionData = requestApi(
      `/transaction/detail/${params.id}`,
      "GET"
    );
    try {
      Promise.all([
        promiseDetailTransactionData,
        promiseGetAllCurrency,
        promiseGetAllCategoriesGroup,
        promiseGetAllWallet,
      ])
        .then((res) => {
          setTransactionData({
            ...res[0].data,
            recordDate: res[0].recordDate,
            paymentImage: `${process.env.REACT_APP_API_URL}/${res[0].data.paymentImage}`,
          });
          setCategoryGroupData(res[0].data.ownership_categoriesGroup);
          setCategoryData(res[0].data.ownership_category);
          setCurrencyData(res[0].data.ownership_currency);
          setWalletData(res[0].data.ownership_wallet);
          setAllCurrencyData(res[1].data.data);
          setAllCategoryGroupData(res[2].data.data);
          setAllWalletData(res[3].data.data);
          requestCategory(res[1].data.data[0].id);
        })
        .catch((err) => {
          console.log(err.message);
        });
    } catch (err) {
      console.log(err);
    }
  }, []);

  return (
    <div className={cx("wrapper", "d-flex row ")}>
      <div
        className={cx(
          "avatar",
          "col-md-6 d-flex flex-column align-items-center mb-5"
        )}
      >
        <h1>Ảnh giao dịch</h1>
        <Image
          avatar_profile
          rounded
          src={transactionData.paymentImage}
          className={cx("avatar-img")}
        />
        <div className="d-flex align-items-center w-100 justify-content-center mt-4">
          <label htmlFor="file" className={cx("btn_changeAvatar")}>
            Thay đổi ảnh giao dịch
          </label>
          <Input
            file
            id="file"
            type="file"
            accept="image/*"
            onChange={onImageChange}
          />
        </div>
      </div>
      <div className="col-md-6 h-100 d-flex flex-column">
        <h1>Thông tin giao dịch</h1>
        <form className={cx("information")}>
          <div className="d-flex w-100 justify-content-between">
            <div className={cx("user-information", "w-50")}>
              <div>
                <h3 className="mt-3">Hoá đơn</h3>
                <div>
                  <Input
                    register={{
                      ...register(`bill`, {
                        required: `Hoá đơn không được để trống`,
                      }),
                    }}
                    text={showForm}
                    data={transactionData.bill}
                    keyName="bill"
                    placeholder="hoá đơn"
                  />
                  {errors[`bill`] && (
                    <p style={{ color: "red" }}>{errors[`bill`].message}</p>
                  )}
                </div>
              </div>
              <div className="mt-3">
                <h3 className="w-40">Ghi chú</h3>
                <div>
                  <Input
                    register={{
                      ...register(`note`, {
                        required: `Hoá đơn không được để trống`,
                      }),
                    }}
                    text={showForm}
                    data={transactionData.note}
                    keyName="note"
                    placeholder="ghi chú"
                  />
                  {errors[`note`] && (
                    <p style={{ color: "red" }}>{errors[`note`].message}</p>
                  )}
                </div>
              </div>
              <div className=" mt-3">
                <h3 className="w-40">Ngày giao dịch</h3>
                <div>
                  <Input
                    type="date"
                    text={showForm}
                    data={transactionData.recordDate}
                    register={{
                      ...register(`recordDate`, {
                        required: `Ngày giao dịch không được để trống`,
                        validate: {
                          validFormat: (value) =>
                            dayjs(value, "YYYY-MM-DD", true).isValid() ||
                            "Định dạng ngày không hợp lệ",
                        },
                      }),
                    }}
                  />
                  {errors[`recordDate`] && (
                    <p style={{ color: "red" }}>
                      {errors[`recordDate`].message}
                    </p>
                  )}
                </div>
              </div>
              <div className=" mt-3">
                <h3 className="w-40">Tiền tệ</h3>
                <div>
                  <select {...register(`currency_id`)}>
                    {allCurrencyData.map((item, index) => {
                      return (
                        <option value={item.id} key={index}>
                          {item.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
            </div>
            <div className={cx("user-information", "w-50 ms-4")}>
              <div className="mt-3">
                <h3 className="w-40">Loại giao dịch</h3>
                <div>
                  <select {...register(`transactionType`)}>
                    <option value="Revenue">Thu</option>
                    <option value="Expense">Chi</option>
                  </select>
                </div>
              </div>
              <div className="mt-3">
                <h3 className="w-40">Thể loại giao dịch</h3>
                <div>
                  <select
                    {...register(`categoriesGroup_id`)}
                    onChange={onChangeCategoriesGroup}
                  >
                    {allCategoryGroupData.map((item, index) => {
                      return (
                        <option value={item.id} key={index}>
                          {item.note}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
              <div className="mt-3">
                <h3 className="w-40">Thể loại</h3>
                <div>
                  <select {...register(`category_id`)}>
                    {allCategoryData.map((item, index) => {
                      return (
                        <option value={item.id} key={index}>
                          {item.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
              <div className="mt-3">
                <h3 className="w-40">Ví</h3>
                <div>
                  <select {...register(`wallet_id`)}>
                    {allWalletData.map((item, index) => {
                      return (
                        <option value={item.id} key={index}>
                          {item.name}
                        </option>
                      );
                    })}
                  </select>
                  {errors[`wallet_id`] && (
                    <p style={{ color: "red" }}>
                      {errors[`wallet_id`].message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex align-items-center justify-content-end mt-3">
            {showForm ? (
              <Button register rounded onClick={onHandleShowForm}>
                Chỉnh sửa
              </Button>
            ) : (
              <div className="d-flex">
                <Button register rounded onClick={handleSubmit(onSubmit)}>
                  Lưu
                </Button>
                <Button register rounded onClick={onHandleShowForm}>
                  huỷ
                </Button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChiTietGiaoDich;
