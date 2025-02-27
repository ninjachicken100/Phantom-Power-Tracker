import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

// Use a global variable to cache the connection in development mode
let cached = global.mongoose || { conn: null, promise: null };

async function dbConnect() {
  if (cached.conn) {
    console.log("✅ Using existing MongoDB connection");
    return cached.conn;
  }

  if (!cached.promise) {
    console.log("🟡 Establishing a new MongoDB connection...");
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    try {
      cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
        console.log("✅ MongoDB connection established!");
        return mongoose;
      });
    } catch (error) {
      console.error("❌ MongoDB connection error:", error);
      throw new Error("Failed to connect to MongoDB");
    }
  }

  cached.conn = await cached.promise;
  global.mongoose = cached; // Ensure global caching
  return cached.conn;
}

export default dbConnect;
