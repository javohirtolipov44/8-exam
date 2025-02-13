import mongoose from "mongoose";

const database = async () => {
  const url = process.env.DB_URL;
  await mongoose.connect(url, {
    dbName: "exam",
  });
};

export default database;
