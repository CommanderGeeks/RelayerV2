import BigNumber from "bignumber.js";
import { IBridgeData } from "../config/types";
import { EState } from "../database/types";
import {
  findTxs,
  getWorker,
  updateTx,
  updateWorker,
} from "../database/wrapper";
import { getChain, getToken } from "../helpers";
import Notify from "../helpers/notify";
import { logError } from "../helpers/utils";
import releaseTokens from "../web3/calls/releaseTokens";
import { getPortalContract } from "../web3/contract";
import { web3ByChain } from "../web3/provider";
import { PADDED_DECIMALS } from "../config";

const processPayouts = async (chainId: number) => {
  try {
    const worker = await getWorker(chainId);
    if (worker) return;
    await updateWorker(chainId, true);

    const txs = await findTxs({
      to_chain_id: chainId,
      state: EState.processing,
    });

    const toChain = getChain(chainId);
    if (!toChain) return;

    if (!toChain.isActive) {
      await updateWorker(chainId, false);
      return;
    }

    for (let index = 0; index < txs.length; index++) {
      const tx = txs[index];
      const token = getToken(tx.output_token, toChain.chainId);
      if (!token) continue;

      const outPutDecimals = 10 ** tx.output_token_decimals;
      const amount = new BigNumber(tx.amountOut).div(PADDED_DECIMALS)
      const data: IBridgeData = {
        sender: tx.sender,
        receiver: tx.receiver,
        inputTokenAddress: tx.input_token,
        amount: amount.times(outPutDecimals).toNumber(),
        fee: tx.fee,
        toChainId: tx.to_chain_id,
        inputTxHash: tx.input_hash,
        inputBlockNumber: tx.input_block_number,
      };

      try {
        const portalContract = getPortalContract(
          web3ByChain(toChain),
          toChain.portalAddress
        );
        const onChainHash = await portalContract.methods
          .getTxHash(tx.bridge_data_hash)
          .call();

        if (onChainHash) {
          await updateTx(tx.input_hash, {
            state: EState.released,
          });
          continue;
        }

        const payoutTxHash = await releaseTokens(
          tx.from_chain_id,
          data,
          token,
          tx.bridge_data_hash
        );

        const newTx = await updateTx(tx.input_hash, {
          output_hash: payoutTxHash,
          state: EState.released,
        });

        await Notify(newTx!);
      } catch (error: any) {
        // await updateTx(tx.input_hash, {
        //   state: EState.failed,
        // });
        logError(`Processing payout ${error.toString()}`);
      } finally {
        await updateWorker(chainId, false);
      }
    }
  } catch (error: any) {
    logError(error);
  } finally {
    await updateWorker(chainId, false);
  }
};

export default processPayouts;