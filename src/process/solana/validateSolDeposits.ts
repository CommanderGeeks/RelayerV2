import { PublicKey } from "@solana/web3.js";
import { dummyToken, PADDED_DECIMALS } from "../../config";
import { CONFIG_ACCOUNT } from "../../config/solana";
import { EState } from "../../database/types";
import { findTxs, updateTx } from "../../database/wrapper";
import { getChain } from "../../helpers";
import { getTokenAccountBalance, vaultTokenAccount } from "../../helpers/solana";
import { program } from "../../web3/solana";
import { logError } from "../../helpers/utils";
import BigNumber from "bignumber.js";


const validateSolDeposits = async (chainId: Number) => {
  try {
    const txs = await findTxs({
      to_chain_id: chainId,
      state: EState.validating,
    });
    if (txs.length === 0) return;

    for (let index = 0; index < txs.length; index++) {
      const tx = txs[index];
      const fromnChain = getChain(tx.from_chain_id);
      if (!fromnChain) continue;
      if (!fromnChain.isActive) continue;

      try {
        const txHashExists = await program.account.config.fetch(CONFIG_ACCOUNT)
          .then((config: any) => config.txHashes.includes(tx.bridge_data_hash))
          .catch(() => false);

        if (txHashExists) {
          await updateTx(tx.input_hash, {
            state: EState.released,
          });
          continue;
        }

        if (tx.output_token === dummyToken.address) {
          continue;
        }

        const mintAddress = new PublicKey(tx.output_token)
        // check balance/mintable 
        const vaultBalance = await getTokenAccountBalance((await vaultTokenAccount(mintAddress)).address);

        const tokenData = await program.account.config.fetch(CONFIG_ACCOUNT)
          .then(config => config.tokens.find(t => t.mint.toString() === tx.output_token))
          .catch(() => null);

        if (!tokenData) {
          console.warn(`⚠️ Token data not found for ${tx.output_token}`);
          continue;
        }

        const isMintable = !tokenData.isOriginChain;

        const txAmountOut = new BigNumber(tx.amountOut).div(10 ** PADDED_DECIMALS).times(10 ** tx.output_token_decimals)
        if (new BigNumber(vaultBalance).lt(txAmountOut) && !isMintable) {
          console.log(`⏳ Insufficient funds for Tx ${tx.input_hash}.`);
          continue;
        }

        console.log(`✅ Valid Tx: ${tx.input_hash}, moving to processing.`);

        await updateTx(tx.input_hash, {
          state: EState.processing,
        });
      } catch (error: any) {
        logError(`Validating Sol ${error.toString()}`);
      }
    }
  } catch (error: any) {
    logError(error);
  }
};

export default validateSolDeposits;