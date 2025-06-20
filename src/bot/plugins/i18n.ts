import { I18n } from "@grammyjs/i18n";

import { ContextType } from "./types";

export const i18n = new I18n<ContextType>({
  defaultLocale: "en",
  directory: "src/bot/locales",
});
