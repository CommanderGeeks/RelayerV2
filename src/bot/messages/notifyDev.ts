import { IChain, IToken } from "../../config/types";
import { ITxData } from "../../database/types";
import { logError } from "../../helpers/utils";
import { sendMessage } from "..";
import { INotifyData } from "../types";
import BigNumber from "bignumber.js";
import { PADDED_DECIMALS } from "../../config";

const notifyDev = async (
  tx: ITxData,
  token: IToken,
  fromChain: IChain,
  toChain: IChain
) => {
  try {
    const amountIn = new BigNumber(tx.amountIn).div(PADDED_DECIMALS);
    const amountOut = new BigNumber(tx.amountOut).div(PADDED_DECIMALS);

    const data: INotifyData = {
      // status: "Released",
      deposited: `${amountIn.toFixed()} ${token.symbol}`,
      received: `${amountOut.toFixed()} ${token.symbol}`,
      fromChainName: fromChain.name,
      toChainName: toChain.name,
      // message: "Transaction Completed",
      inputTx: `[Input Tx](${fromChain.explorer}/tx/${tx.input_hash})`,
      outputTx: `[Output Tx](${toChain.explorer}/tx/${tx?.output_hash})`,
    };

    await sendMessage("bridge", data);
  } catch (error: any) {
    logError(error);
  }
};

export default notifyDev;