const calPrice = (price, discount) => {
  if (price === 0) {
    return "Miễn phí";
  }
  if (discount == null) {
    return Math.ceil(price); // Làm tròn lên
  }
  switch (discount.type) {
    case "percentage":
      return Math.ceil(price * (1 - discount.value / 100)); // Làm tròn lên
    case "fixed":
      const finalPrice = price - discount.value;
      if (finalPrice == 0) {
        return "Miễn phí";
      }
      return Math.ceil(finalPrice); // Làm tròn lên
    default:
      return Math.ceil(price); // Làm tròn lên
  }
};

export default calPrice;
