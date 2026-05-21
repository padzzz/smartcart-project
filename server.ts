import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./server/db.ts";
import productRoutes from "./server/routes/productRoutes.ts";
import userRoutes from "./server/routes/userRoutes.ts";
import orderRoutes from "./server/routes/orderRoutes.ts";
import Product from "./server/models/Product.ts";
import User from "./server/models/User.ts";
import { extendedProductsArray } from "./server/utils/extendedProducts.ts";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Connect to Database
  try {
    const isDBConnected = await connectDB();
    
    if (isDBConnected) {
      // Auto-seed/migrate if computers are missing or if we want to ensure latest images
      const computerCount = await Product.countDocuments({ category: "Computer" });
      if (computerCount === 0) {
        console.log("No Computer products found. Reseeding database with corrected images and Computer category...");
        await Product.deleteMany({});
        await User.deleteMany({});

        // Create Admin User
        const adminUser = await User.create({
          name: 'Admin User',
          email: 'admin@example.com',
          password: 'password123',
          isAdmin: true
        });

        const sampleProducts = extendedProductsArray.map(prod => ({
          ...prod,
          user: adminUser._id
        }));

        await Product.insertMany(sampleProducts);
        console.log("Database successfully seeded/updated with computers and fixed photo URLs!");
      } else {
        // Sync modern image URLs for all seed products in active DB to ensure fix is live immediately
        console.log("Syncing active product image URLs with latest verified assets...");
        for (const prod of extendedProductsArray) {
          await Product.updateOne(
            { name: prod.name },
            { $set: { image: prod.image } }
          );
        }
        console.log("Product image sync completed successfully.");
      }
    } else {
      console.log("Using local 'fallback_db_store.json' file-based database for products, users, and orders.");
    }
  } catch (err) {
    console.warn("DB seeding or verification during startup skipped:", (err as Error).message);
  }

  app.use(cors());
  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "SmartCart API is running" });
  });

  // Real Routes
  app.use("/api/products", productRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/orders", orderRoutes);

  // Temporary Seed Route (Delete this before production!)
  app.post("/api/seed", async (req, res) => {
    try {
      await Product.deleteMany({});
      await User.deleteMany({});
 
      // Create Admin User
      const adminUser = await User.create({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
        isAdmin: true
      });
 
      const sampleProducts = extendedProductsArray.map(prod => ({
        ...prod,
        user: adminUser._id
      }));
 
      const createdProducts = await Product.insertMany(sampleProducts);
      res.json({ message: "Seeded data successfully", products: createdProducts, admin: { email: 'admin@example.com', password: 'password123' } });
    } catch (error) {
      res.status(500).json({ message: "Seeding failed", error: (error as Error).message });
    }
  });

  // Vite Integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    
    // Serve static files from the dist directory
    app.use(express.static(distPath));

    // Handle SPA routing
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:3000:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
