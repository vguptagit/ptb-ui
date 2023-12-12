import { config } from "../../config/Constants";
import messagesKa from "./languages/ka.json";
import messagesAr from "./languages/ar.json";
import messagesEn from "./languages/en.json";
import messagesEsMx from "./languages/es-MX.json";

const DEFAULT_LOCALE = config.DEFAULT_LOCALE;

let initLocale = DEFAULT_LOCALE;
if (navigator.language === "es-MX") {
  initLocale = "es-MX";
} else if (navigator.language === "ar") {
  initLocale = "ar";
}

function loadMessages(locale) {
  switch (locale) {
    case "ka":
      return messagesKa;
    case "ar":
      return messagesAr;
    case "en":
      return messagesEn;
    case "es-MX":
      return messagesEsMx;
    default:
      return messagesEn;
  }
}
const localeMessages = loadMessages(initLocale);
export { initLocale, localeMessages, DEFAULT_LOCALE };