const formatPrice = (amount) => {
  if (amount === "Miễn phí") return amount;
  amount = Number(amount);

  // Format the number with commas as thousands separators
  const formattedAmount = amount.toLocaleString("vi-VN");

  // Append " vnđ" to the formatted amount
  return `${formattedAmount} vnđ`;
};

export default formatPrice;
