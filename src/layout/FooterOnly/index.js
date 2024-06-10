import React from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
const FooterOnly = ({ children }) => {
  return (
    <div>
      <Header isPublicRoute={true} />
      <div className="body my-5">{children}</div>
      <Footer />
    </div>
  );
};

export default FooterOnly;
