import * as crypto from "crypto";
import { IBridgeData } from "../config/types";
import { HASH_SECRET } from "../config";

export const hashBridgeData = (data: IBridgeData): string => {
  if (!HASH_SECRET) throw new Error("Hash secret key not found");

  return crypto
    .createHmac("sha256", HASH_SECRET)
    .update(JSON.stringify(data))
    .digest("hex");
};
