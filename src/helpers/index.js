export const onHandleLogout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};
