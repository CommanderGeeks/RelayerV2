import { BigNumber } from 'bignumber.js';
import * as dotenv from "dotenv";
import { dummyToken, PADDED_DECIMALS } from "../../config";
import { connection } from '../../web3/solana';
import { getTxByHash, saveTx } from '../../database/wrapper';
import { getToken, getTokenByKey } from '../../helpers';
import { EState, ITxData } from '../../database/types';
import { decodeSolDepositTransaction } from '../../helpers/decodeData';
import { hashBridgeData } from '../../helpers/hashing';
import { PROGRAM_ID, SOLANA_CHAIN_ID } from '../../config/solana';

dotenv.config();

/**
 * Listen for new deposit transactions
 */
export async function processSolDeposit() {
    console.log(`Listening for deposits on program: ${PROGRAM_ID.toBase58()}`);

    connection.onLogs(PROGRAM_ID, async (logs: any, context: any) => {
        try {
            console.log("\n🔍 New transaction detected:", logs.signature);

            // Fetch transaction details
            const tx = await connection.getTransaction(logs.signature, {
                commitment: "confirmed",
                maxSupportedTransactionVersion: 0,
            });

            if (!tx || !tx.meta) {
                console.log("⚠️ Transaction not found or not confirmed yet.");
                return;
            }

            if (await getTxByHash(logs.signature)) return;

            // Decode logs to extract deposit details // tx.blockTime, logs.signature
            const depositData = decodeSolDepositTransaction(tx, logs.signature, tx.blockTime);

            if (depositData) {
                const hash = hashBridgeData(depositData);
                console.log("✅ Deposit detected:");

                const inputToken =
                    getToken(depositData.inputTokenAddress, SOLANA_CHAIN_ID) || dummyToken;

                const outputToken =
                    getTokenByKey(inputToken.key, depositData.toChainId) || dummyToken;

                if (outputToken.address === dummyToken.address)
                    throw new Error("Can't find matching token");

                if (inputToken.decimals !== outputToken.decimals)
                    if (!inputToken?.diffDecimals && !outputToken?.diffDecimals)
                        throw new Error("Decimials mismatch");

                const amount = new BigNumber(depositData.amount).plus(depositData.fee);
                const amountIn = amount.div(10 ** inputToken.decimals)
                const amountOut = new BigNumber(depositData.amount)
                    .div(10 ** inputToken.decimals).times(PADDED_DECIMALS)
                    .toNumber();
                const fee = new BigNumber(depositData.fee)
                    .div(10 ** inputToken.decimals).times(PADDED_DECIMALS)
                    .toNumber();

                const txData: ITxData = {
                    bridge_data_hash: hash,
                    sender: depositData.sender,
                    receiver: depositData.receiver,
                    amountIn: amountIn.times(PADDED_DECIMALS).toNumber(),
                    amountOut,
                    fee,
                    input_token: inputToken.address,
                    input_token_decimals: inputToken.decimals,
                    output_token: outputToken.address,
                    output_token_decimals: outputToken.decimals,
                    from_chain_id: SOLANA_CHAIN_ID,
                    to_chain_id: depositData.toChainId,
                    input_hash: depositData.inputTxHash,
                    input_block_number: depositData.inputBlockNumber,
                    state: EState.validating,
                };

                await saveTx(txData);
            } else {
                console.log("❌ Failed to decode deposit transaction.");
            }
        } catch (error) {
            console.error("❌ Error processing transaction:", error);
        }
    }, "confirmed");
}