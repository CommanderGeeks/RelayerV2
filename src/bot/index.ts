import { Bot } from "grammy";
import { ContextType } from "./plugins/types";
import { i18n } from "./plugins";
import { BOT_TOKEN, ERROR_BOT_TOKEN, DEV_CHATID } from "../config";
import { linksInline } from "./keyboards";
import { freezeTx, unFreezeTx } from "../database/wrapper";

export const bot = new Bot<ContextType>(BOT_TOKEN);
export const errBot = new Bot<ContextType>(ERROR_BOT_TOKEN);

export const sendMessage = async (key: string, data: any) =>
  await bot.api.sendMessage(DEV_CHATID, i18n.t("en", key, data), {
    parse_mode: "Markdown",
    reply_markup: linksInline(),
    link_preview_options: {
      is_disabled: true,
    },
  });

export const sendErrorMessage = async (key: string, data: any) =>
  await errBot.api.sendMessage(DEV_CHATID, i18n.t("en", key, data), {
    parse_mode: "Markdown",
    reply_markup: linksInline(),
    link_preview_options: {
      is_disabled: true,
    },
  });

bot.command("freeze", async (ctx) => {
  const txHash = ctx.match?.trim();
  if (!txHash) {
    return ctx.reply("Usage: /freeze {txHash}");
  }

  await freezeTx(txHash)
  await ctx.reply(`Transaction ${txHash} has been frozen.`);
});

bot.command("unfreeze", async (ctx) => {
  const txHash = ctx.match?.trim();
  if (!txHash) {
    return ctx.reply("Usage: /unfreeze {txHash}");
  }

  await unFreezeTx(txHash)
  await ctx.reply(`Transaction ${txHash} has been unfrozen.`);
});

bot.start();