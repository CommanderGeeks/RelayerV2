import { Transaction } from "./transaction.model";
import { Nonce } from "./nonce.model";
import { Global } from "./global.model";
import { ITxData } from "./types";

export const getNonce = async (chainId: number) => {
  const doc = await Nonce.findOne({ chain_id: chainId });
  if (!doc) return null;
  return doc.count;
};

export const createNonce = async (chainId: number, count: number) => {
  await Nonce.create({ chain_id: chainId, count });
};

export const updateNonce = async (chainId: number, count: number) => {
  return Nonce.findOneAndUpdate(
    { chain_id: chainId },
    { count },
    { returnOriginal: false }
  );
};

export const getLastBlock = async (chainId: number) => {
  const doc = await Global.findOne({ chain_id: chainId });
  if (!doc) return null;
  return doc.last_processed_block;
};

export const createOrUpdateGlobal = async (
  chainId: number,
  blockNumber: number
) => {
  const doc = await Global.findOne({ chain_id: chainId });
  if (doc) {
    return Global.findOneAndUpdate(
      { chain_id: chainId },
      { last_processed_block: blockNumber },
      { returnOriginal: false }
    );
  }

  return await Global.create({
    chain_id: chainId,
    last_processed_block: blockNumber,
  });
};

export const updateWorker = async (chainId: number, working: boolean) => {
  const doc = await Global.findOne({ chain_id: chainId });
  if (doc) {
    return Global.findOneAndUpdate(
      { chain_id: chainId },
      { processing: working },
      { returnOriginal: false }
    );
  }

  return await Global.create({ chain_id: chainId, processing: working });
};

export const getWorker = async (chainId: number) => {
  const doc = await Global.findOne({ chain_id: chainId });
  if (!doc) return null;
  return doc.processing;
};

export const saveTx = async (data: ITxData) => {
  await Transaction.create(data);
};

export const updateTx = async (input_hash: string, data: any = {}) => {
  return Transaction.findOneAndUpdate({ input_hash }, data, {
    returnOriginal: false,
  });
};

export const getTxs = async () => {
  return Transaction.find();
};

export const findTxs = async (data: any) => {
  return Transaction.find(data).sort({ input_block_number: 1 }).limit(10);
};

export const getFailedTxs = async () => {
  return Transaction.find({ output_hash: null });
};

export const getTxByHash = async (hash: string) => {
  return Transaction.findOne({ input_hash: hash });
};

export const freezeTx = async (input_hash: string,) => {

  return Transaction.findOneAndUpdate({ input_hash }, { freeze: true }, {

    returnOriginal: false,

  });

};

export const unFreezeTx = async (input_hash: string,) => {

  return Transaction.findOneAndUpdate({ input_hash }, { freeze: false }, {

    returnOriginal: false,

  });

};