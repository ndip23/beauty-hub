// server/config/db.js
const mongoose = require("mongoose");

const getMongoUri = () =>
  (process.env.MONGO_URI || process.env.MONGODB_URI || process.env.DATABASE_URL || "").trim();

const isServerlessRuntime = () =>
  Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);

const getConnectionCache = () => {
  if (!global.__BeautyhubMongooseCache) {
    global.__BeautyhubMongooseCache = { conn: null, promise: null };
  }
  return global.__BeautyhubMongooseCache;
};

const handleFatalDbError = (messageOrError) => {
  const message =
    typeof messageOrError === "string"
      ? messageOrError
      : `Error: ${messageOrError.message}`;

  if (isServerlessRuntime()) {
    throw new Error(message);
  }

  console.error(message);
  process.exit(1);
};

const connectDB = async () => {
  const mongoUri = getMongoUri();

  if (!mongoUri) {
    handleFatalDbError(
      "Missing MongoDB URI. Set MONGO_URI in Vercel Environment Variables (or MONGODB_URI / DATABASE_URL)."
    );
  }

  const cache = getConnectionCache();
  if (cache.conn) {
    return cache.conn;
  }

  if (!cache.promise) {
    cache.promise = mongoose.connect(mongoUri).then((conn) => {
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return conn;
    });
  }

  try {
    cache.conn = await cache.promise;
    return cache.conn;
  } catch (error) {
    cache.promise = null;
    handleFatalDbError(error);
  }
};

module.exports = connectDB;
