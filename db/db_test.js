const mongoose = require("mongoose");

const dbHost = process.env.TEST_DB_HOST;
const dbPort = process.env.TEST_DB_PORT;
const dbName = process.env.TEST_DB_NAME;

async function main() {
  const mongoURL = `mongodb://${dbHost}:${dbPort}/${dbName}`;
  try {
    console.log("test ", dbPort);
    await mongoose.connect(mongoURL);
    console.log("connected DB successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}

main();
