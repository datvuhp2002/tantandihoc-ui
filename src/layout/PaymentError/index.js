import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const PaymentError = () => {
  const location = useLocation();
  useEffect(() => {});
  return <div className="text-danger">Payment Error</div>;
};

export default PaymentError;
