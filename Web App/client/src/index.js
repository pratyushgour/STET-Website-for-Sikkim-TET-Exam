import React from "react";
import ReactDOM from "react-dom";
import App from "./app/App";
import { I18nextProvider } from "react-i18next";
import i18next from "i18next";
import common_hi from "./translations/hi/common.json";
import common_en from "./translations/en/common.json";
import common_ne from "./translations/ne/common.json";

i18next.init({
  interpolation: { escapeValue: false },
  lng: "en",
  resources: {
    en: {
      common: common_en,
    },
    hi: {
      common: common_hi,
    },
    ne: {
      common: common_ne,
    },
  },
});

ReactDOM.render(
  <I18nextProvider i18n={i18next}>
    <App />
  </I18nextProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
