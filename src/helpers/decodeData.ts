import { PublicKey, VersionedTransactionResponse } from "@solana/web3.js";
import { IBridgeData } from "../config/types";
import { program } from "../web3/solana";
import { BN } from "@coral-xyz/anchor";

export const decodeBridgeData = (event: any, web3: any): IBridgeData => {
  const rawData = event.raw.data;
  const data = web3.eth.abi.decodeParameters(
    ["address", "string", "address", "uint256", "uint256", "uint256"],
    rawData
  );

  const sender = data[0];
  const receiver = data[1];
  const amount = data[3];
  const fee = data[4];
  const inputTxHash = event.transactionHash;
  const inputBlockNumber = event.blockNumber;
  const toChainId = data[5];
  const inputTokenAddress = data[2];

  const decodeData: IBridgeData = {
    sender,
    receiver,
    inputTokenAddress,
    amount,
    fee,
    toChainId,
    inputTxHash,
    inputBlockNumber,
  };

  return decodeData;
};

export const decodeSolDepositTransaction = (tx: VersionedTransactionResponse, hash: string, inputBlockNumber: any) => {
  if (!tx.meta || !tx.meta.logMessages) return null;

  const logMessages = tx.meta.logMessages;
  let sender: PublicKey | null = null;
  let receiver: PublicKey | null = null;
  let token: PublicKey | null = null;
  let toChainId: BN | null = null;
  let amount: BN | null = null;
  let fee: BN | null = null;

  for (let log of logMessages) {
    if (log.startsWith("Program data:")) {
      console.log("📜 Found program data log:", log);

      // Extract base64 data from the log message
      const base64Data = log.split("Program data: ")[1].trim();

      try {
        // Deserialize using Anchor's BorshAccountsCoder
        const event = program.coder.events.decode(base64Data);

        if (event && event.name === 'depositEvent') {
          sender = event.data['sender'];
          receiver = event.data['receiver'];
          token = new PublicKey(event.data['token']);
          toChainId = new BN(event.data['destChainId']);
          amount = new BN(event.data['amount']);
          fee = new BN(event.data['fee']);

          const decodeData: IBridgeData = {
            sender: sender!.toString(),
            receiver: receiver!.toString(),
            inputTokenAddress: token.toString(),
            amount: Number(amount),
            fee: Number(fee),
            toChainId: Number(toChainId),
            inputTxHash: hash,
            inputBlockNumber,
          };

          return decodeData;
        }
      } catch (err) {
        console.error("❌ Failed to decode deposit event:", err);
      }
    }
  }

  return null;
}