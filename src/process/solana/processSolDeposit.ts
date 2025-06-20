import BigNumber from 'bignumber.js';
import {
    createOrUpdateGlobal,
    getLastBlock,
    getTxByHash,
    getWorker,
    saveTx,
    updateWorker,
} from "../../database/wrapper";
import { logError } from "../../helpers/utils";
import { decodeSolDepositTransaction, } from "../../helpers/decodeData";
import { dummyToken, PADDED_DECIMALS } from "../../config";
import { hashBridgeData } from '../../helpers/hashing';
import { getChain, getToken, getTokenByKey } from '../../helpers';
import { connection } from '../../web3/solana';
import { PROGRAM_ID, SOLANA_CHAIN_ID } from '../../config/solana';
import { EState } from '../../database/types';

const processSolDeposit = async (chainId: number) => {
    let lastSlot, targetSlot, latestSlot = 0;
    let toSlot: number = 0
    const chain = getChain(chainId)

    try {
        const worker = await getWorker(chainId);
        if (worker) return;
        await updateWorker(chainId, true);

        if (!chain?.isActive) {
            await updateWorker(chainId, false);
            return;
        }

        latestSlot = await connection.getSlot();
        lastSlot = await getLastBlock(Number(chainId));
        if (!lastSlot || lastSlot === null) {
            lastSlot = chain.startBlock;
            await createOrUpdateGlobal(Number(chainId), lastSlot);
        }

        console.log(`Last Slot: ${lastSlot}`);
        console.log(`Latest Slot: ${latestSlot}`);

        const isSynced = latestSlot - lastSlot <= 5;
        if (isSynced) {
            console.log("Synced--------", chainId);
            await updateWorker(chainId, false);
            return;
        }

        const chunkSize = 1000;
        targetSlot = lastSlot + chunkSize;
        toSlot = Math.min(targetSlot, latestSlot);

        console.log(`CHAIN ID: ${chainId}`);
        console.log(`Processing from Slot: ${lastSlot} to Slot: ${toSlot}`);

        const signatures = await connection.getSignaturesForAddress(PROGRAM_ID, {
            limit: toSlot - lastSlot,
            minContextSlot: lastSlot
        });

        for (const sig of signatures) {
            const tx = await connection.getTransaction(sig.signature, {
                commitment: "confirmed",
                maxSupportedTransactionVersion: 0,
            });

            if (!tx) continue
            const txHash = tx.transaction.signatures[0];
            const slot = tx.slot

            // Check for duplicate transaction hash
            if (await getTxByHash(txHash)) continue;

            // Decode logs to extract deposit details // tx.blockTime, logs.signature
            const data = decodeSolDepositTransaction(tx, txHash, slot);
            if (!data) continue;

            console.log("✅ Deposit detected:", txHash);
            const hash = hashBridgeData(data);
            const sender = data.sender;
            const receiver = data.receiver;
            const toChainId = data.toChainId;
            const inputToken =
                getToken(data.inputTokenAddress, chainId) || dummyToken;
            const outputToken =
                getTokenByKey(inputToken.key, toChainId) || dummyToken;
            console.log(data, hash);

            if (outputToken.address === dummyToken.address)
                throw new Error("Can't find matching token");

            const amount = new BigNumber(data.amount).plus(data.fee);
            const amountIn = amount.div(10 ** inputToken.decimals);
            const amountOut = new BigNumber(data.amount)
                .div(10 ** inputToken.decimals)
                .times(PADDED_DECIMALS)
                .toNumber();
            const fee = new BigNumber(data.fee)
                .div(10 ** inputToken.decimals)
                .times(PADDED_DECIMALS)
                .toNumber();

            const txData = {
                bridge_data_hash: hash,
                sender,
                receiver,
                amountIn: amountIn.times(PADDED_DECIMALS).toNumber(),
                amountOut,
                fee,
                input_token: inputToken.address,
                input_token_decimals: inputToken.decimals,
                output_token: outputToken.address,
                output_token_decimals: outputToken.decimals,
                from_chain_id: SOLANA_CHAIN_ID,
                to_chain_id: data.toChainId,
                input_hash: data.inputTxHash,
                input_block_number: data.inputBlockNumber,
                state: EState.validating,
            };

            await saveTx(txData);
        }
    } catch (error) {
        let err = `- Chain ID: ${chainId}\n`;

        if (lastSlot)
            err += `- Last Slot: ${lastSlot}\n`;
        if (toSlot)
            err += `- Target Slot: ${toSlot}\n`;
        if (latestSlot)
            err += `- Latest Slot: ${latestSlot}\n`;

        err += `\n${error}`;
        logError(err);
    } finally {
        await createOrUpdateGlobal(Number(chainId), toSlot);
        await updateWorker(chainId, false);
    }
};

export default processSolDeposit;