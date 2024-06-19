import React from "react";
import "react-toastify/dist/ReactToastify.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import ReactDOM from "react-dom/client";
import "~/index.css";
import "~/content-style.css";
import App from "~/App";
import reportWebVitals from "~/reportWebVitals";
import GlobalStyles from "~/components/GlobalStyles";
import { Provider } from "react-redux";

import store from "./store";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <GlobalStyles>
    <Provider store={store}>
      <App />
    </Provider>
  </GlobalStyles>
);

reportWebVitals();
