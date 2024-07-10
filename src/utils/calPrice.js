const calPrice = (price, discount) => {
  if (price === 0) {
    return "Miễn phí";
  }

  const currentDate = new Date();

  if (!discount) {
    return Math.ceil(price); // Làm tròn lên
  }

  console.log(discount.start_date);
  if (discount.start_date && currentDate < new Date(discount.start_date)) {
    return price;
  }

  if (discount.end_date && currentDate > new Date(discount.end_date)) {
    return price;
  }
  switch (discount.type) {
    case "percentage":
      return Math.ceil(price * (1 - discount.value / 100)); // Làm tròn lên
    case "fixed":
      const finalPrice = price - discount.value;
      if (finalPrice <= 0) {
        return "Miễn phí";
      }
      return Math.ceil(finalPrice); // Làm tròn lên
    default:
      return Math.ceil(price); // Làm tròn lên
  }
};

export default calPrice;
