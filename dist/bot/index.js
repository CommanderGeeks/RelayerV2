"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendErrorMessage = exports.sendMessage = exports.errBot = exports.bot = void 0;
const grammy_1 = require("grammy");
const plugins_1 = require("./plugins");
const config_1 = require("../config");
const keyboards_1 = require("./keyboards");
const wrapper_1 = require("../database/wrapper");
exports.bot = new grammy_1.Bot(config_1.BOT_TOKEN);
exports.errBot = new grammy_1.Bot(config_1.ERROR_BOT_TOKEN);
const sendMessage = async (key, data) => await exports.bot.api.sendMessage(config_1.DEV_CHATID, plugins_1.i18n.t("en", key, data), {
    parse_mode: "Markdown",
    reply_markup: (0, keyboards_1.linksInline)(),
    link_preview_options: {
        is_disabled: true,
    },
});
exports.sendMessage = sendMessage;
const sendErrorMessage = async (key, data) => await exports.errBot.api.sendMessage(config_1.DEV_CHATID, plugins_1.i18n.t("en", key, data), {
    parse_mode: "Markdown",
    reply_markup: (0, keyboards_1.linksInline)(),
    link_preview_options: {
        is_disabled: true,
    },
});
exports.sendErrorMessage = sendErrorMessage;
exports.bot.command("freeze", async (ctx) => {
    const txHash = ctx.match?.trim();
    if (!txHash) {
        return ctx.reply("Usage: /freeze {txHash}");
    }
    await (0, wrapper_1.freezeTx)(txHash);
    await ctx.reply(`Transaction ${txHash} has been frozen.`);
});
exports.bot.command("unfreeze", async (ctx) => {
    const txHash = ctx.match?.trim();
    if (!txHash) {
        return ctx.reply("Usage: /unfreeze {txHash}");
    }
    await (0, wrapper_1.unFreezeTx)(txHash);
    await ctx.reply(`Transaction ${txHash} has been unfrozen.`);
});
exports.bot.start();
