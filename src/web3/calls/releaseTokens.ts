import BigNumber from "bignumber.js";
import { getChain } from "../../helpers";
import { getPortalContract } from "../contract";
import { web3ByChain } from "../provider";
import { IBridgeData, IToken } from "../../config/types";
import { RELAYER_ADDRESS, RELAYER_KEY } from "../../config/index";

const releaseTokens = async (
  fromChainId: number,
  bridgeData: IBridgeData,
  token: IToken,
  hash: string
) => {
  let receipt;
  const { amount, receiver, toChainId } = bridgeData;
  const toChain = getChain(toChainId)!;
  const web3 = web3ByChain(toChain);
  const contract = getPortalContract(web3, toChain.portalAddress);

  const trx = contract.methods.withdraw(
    receiver,
    new BigNumber(amount),
    token.address,
    fromChainId,
    hash
  );
  const gas = await trx.estimateGas({ from: RELAYER_ADDRESS });
  console.log("gas :>> ", gas);
  const gasPrice = await web3.eth.getGasPrice();
  console.log("gasPrice :>> ", gasPrice);
  const data = trx.encodeABI();
  console.log("data :>> ", data);
  const nonce = await web3.eth.getTransactionCount(RELAYER_ADDRESS, "pending");
  console.log("nonce :>> ", nonce);

  const trxData = {
    from: RELAYER_ADDRESS,
    to: toChain.portalAddress,
    data,
    gas,
    gasPrice,
    nonce,
  };
  const signedTrx = await web3.eth.accounts.signTransaction(
    trxData,
    RELAYER_KEY
  );
  console.log("Transaction ready to be sent");
  receipt = await web3.eth.sendSignedTransaction(signedTrx.rawTransaction!);
  console.log(`Transaction sent, hash is ${receipt.transactionHash}`);
  return receipt.transactionHash;
};

export default releaseTokens;