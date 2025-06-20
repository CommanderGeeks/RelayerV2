import { sendErrorMessage } from "..";

const notifyDevErr = async (error: any) => {
  try {
    const data = {
      message: error
        .toString()
        .replace(/_/gi, "\\_")
        .replace(/-/gi, "\\-")
        .replace("~", "\\~")
        .replace(/`/gi, "\\`")
        .replace(/\*/gi, "\\*")
        .replace(/\+/gi, "\\+")
        .replace(/\./g, "\\."),
    };

    await sendErrorMessage("error", data);
  } catch (error: any) {
    console.log(error);
  }
};

export default notifyDevErr;
