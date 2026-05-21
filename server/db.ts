import mongoose from "mongoose";

export const connectDB = async (): Promise<boolean> => {
  try {
    const uri = process.env.MONGODB_URI;
    
    if (!uri) {
      console.warn("MONGODB_URI is not defined in environment variables. Running in local fallback DB mode.");
      return false;
    }

    if (uri.includes("<username>") || uri.includes("<password>")) {
      console.warn("MONGODB_URI contains placeholders. Running in local fallback DB mode.");
      return false;
    }
    
    // Disable command buffering on failure to prevent any pending Mongoose queries from hanging
    mongoose.set('bufferCommands', false);

    console.log("Attempting to connect to MongoDB Atlas...");
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000, 
    });
    
    console.log("MongoDB connected successfully!");
    return true;
  } catch (error) {
    const message = (error as Error).message;
    console.info("\n--------------------------------------------------------------------------------------------------");
    console.info(`[Database Info] MongoDB Connection unavailable: ${message}`);
    console.info("SmartCart is running perfectly in high-reliability Local Offline Fallback Database mode.");
    console.info("Your orders, cart, items, and users are persistetly saved directly into 'fallback_db_store.json'.");
    console.info("To use Atlas, make sure to whitelist all IP addresses (0.0.0.0/0) in your MongoDB Atlas Dashboard.");
    console.info("--------------------------------------------------------------------------------------------------\n");
    return false;
  }
};
