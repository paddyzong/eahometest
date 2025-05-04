import mongoose from 'mongoose';

export const connect = async () => {
  if (mongoose.connection.readyState === 0) {
    if (!process.env.MONGODB_URI) throw new Error("Missing MONGODB_URI");
    await mongoose.connect(process.env.MONGODB_URI);
  }
};