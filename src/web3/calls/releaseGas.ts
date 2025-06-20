import { RELAYER_ADDRESS, RELAYER_KEY } from "../../config";

const releaseGas = async (
  nonce: Number,
  receiver: string,
  gas: any,
  gasPrice: any,
  bridgeProvider: any
) => {
  const balance = await bridgeProvider.eth.getBalance(receiver);
  if (Number(balance) > 0.01) return;

  const rawTransaction = {
    from: RELAYER_ADDRESS,
    nonce,
    gasPrice,
    gas,
    to: receiver,
    value: bridgeProvider.utils.toWei("0.01", "ether"),
    chainId: 10201,
  };

  const signedTx = await bridgeProvider.eth.accounts.signTransaction(
    rawTransaction,
    RELAYER_KEY
  );
  return bridgeProvider.eth.sendSignedTransaction(signedTx.rawTransaction);
};

export default releaseGas;
