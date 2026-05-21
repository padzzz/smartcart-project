import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/User.ts";
import { fallbackUsers, syncFallbackToDisk } from "../utils/fallbackDb.ts";

interface DecodedToken {
  id: string;
}

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret") as DecodedToken;

      // Check for standalone database fallback mode
      if (mongoose.connection.readyState !== 1) {
        let foundUser = fallbackUsers.find((u) => u._id === decoded.id);
        if (!foundUser) {
          // Dynamically heal/restore user session so user remains logged in after dev server restarts
          foundUser = {
            _id: decoded.id,
            name: decoded.id === "fb_u1" ? "Admin User" : "Valued Customer",
            email: decoded.id === "fb_u1" ? "admin@example.com" : "customer@example.com",
            passwordHash: "",
            isAdmin: decoded.id === "fb_u1",
          };
          fallbackUsers.push(foundUser);
          syncFallbackToDisk();
          console.log(`Re-established missing fallback user session on-the-fly: ${decoded.id}`);
        }

        req.user = {
          _id: foundUser._id,
          name: foundUser.name,
          email: foundUser.email,
          isAdmin: foundUser.isAdmin,
        };
        return next();
      }

      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

export const admin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).json({ message: "Not authorized as an admin" });
  }
};
