import * as fs from "fs";
import notifyDevErr from "../bot/messages/notifyDevErr";

export const formatMoney = (num: number) => {
  return num.toLocaleString();
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  })
    .format(num)
    .replace("$", "");
};

export const logError = (msg: any) => {
  try {
    const time = new Date(Date.now()).toTimeString();
    const dateTime =
      time.split(" ")[0] +
      " " +
      new Date(Date.now()).toDateString() +
      " " +
      time.split(" ")[1];
    const todayErrorFile = `logs/${new Date(Date.now())
      .toDateString()
      .replace(/ /gi, "-")}.log`;
    fs.appendFileSync(todayErrorFile, time + " \n");
    fs.appendFileSync(todayErrorFile, msg.toString());
    fs.appendFileSync(todayErrorFile, "\n \n");
    console.log(`\x1b[31m${dateTime}\x1b[0m`);
    console.log(`\x1b[31m${msg.toString()}\x1b[0m`);
    notifyDevErr(msg);
  } catch (error) {
    console.error("Error writing to log file:", error);
  }
};
