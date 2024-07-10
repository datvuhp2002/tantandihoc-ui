import React, { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import requestApi from "~/utils/api";

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const orderCode = searchParams.get("orderCode");
    requestApi(`/transaction/success-payment/${orderCode}`, "PUT")
      .then((res) => {
        setInterval(navigate("/"), 3000);
        toast.success("Cảm ơn bạn đã ủng hộ", {
          position: "top-right",
          autoClose: 3000,
        });
      })
      .catch((err) => console.error(err));
  });
  return <div>PaymentSuccess</div>;
};

export default PaymentSuccess;
