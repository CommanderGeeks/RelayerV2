import mongoose from "mongoose";

const { MONGODB_URI } = process.env;

export const connectMongoose = async () => {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is missing");
  }

  return await mongoose.connect(MONGODB_URI);
};
