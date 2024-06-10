import React, { useEffect } from "react";
import Carousel from "react-bootstrap/Carousel";
import Card from "../Card";
import "./slider.scss";
const SlideCard = ({ data }) => {
  useEffect(() => {
    console.log(data);
  }, []);
  const renderData = () => {
    return data.map((item, index) => {
      if (!item.isDefault) {
        return (
          <Carousel.Item key={index}>
            <Card data={item} />
          </Carousel.Item>
        );
      }
    });
  };
  return (
    <div className="w-100">
      <Carousel data-bs-theme="dark" interval={null}>
        {renderData()}
      </Carousel>
    </div>
  );
};

export default SlideCard;
