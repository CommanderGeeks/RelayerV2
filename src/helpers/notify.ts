import notifyDev from "../bot/messages/notifyDev";
import { ITxData } from "../database/types";
import { getTxByHash, updateTx } from "../database/wrapper";
import { getChain, getToken } from "../helpers";
import { logError } from "../helpers/utils";

const Notify = async (tx: ITxData) => {
  const checkTx = await getTxByHash(tx.input_hash);
  if (checkTx?.notified === true) return;

  const fromChain = getChain(tx.from_chain_id)!;
  const toChain = getChain(tx.to_chain_id)!;
  const inputToken = getToken(tx.input_token, fromChain.chainId)!;
  const outPutToken = getToken(tx.output_token, toChain.chainId)!;

  try {
    await notifyDev(tx, inputToken, fromChain, toChain);
    await updateTx(tx.input_hash, {
      notified: true,
    });
  } catch (error: any) {
    logError(error.toString());
  }
};

export default Notify;
