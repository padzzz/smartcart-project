import { Request, Response } from "express";
import mongoose from "mongoose";
import User from "../models/User.ts";
import generateToken from "../utils/generateToken.ts";
import { fallbackUsers, comparePassword, syncFallbackToDisk } from "../utils/fallbackDb.ts";
import bcrypt from "bcryptjs";

// @desc    Auth user & get token
// @route   POST /api/users/login
export const authUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // --- Fallback check for offline/disconnected DB sandbox mode ---
    if (mongoose.connection.readyState !== 1) {
      const user = fallbackUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (user && (await comparePassword(password, user.passwordHash))) {
        return res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user._id),
        });
      } else {
        return res.status(401).json({ message: "Invalid email or password" });
      }
    }

    const user = await User.findOne({ email });

    if (user && (await (user as any).matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id.toString()),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Auth user error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Register a new user
// @route   POST /api/users
export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    // --- Fallback check for offline/disconnected DB sandbox mode ---
    if (mongoose.connection.readyState !== 1) {
      const userExists = fallbackUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (userExists) {
        return res.status(400).json({ message: "User already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = {
        _id: "fb_u_" + Date.now().toString(),
        name,
        email,
        passwordHash: hashedPassword,
        isAdmin: false,
      };

      fallbackUsers.push(newUser);
      syncFallbackToDisk();

      return res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
        token: generateToken(newUser._id),
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id.toString()),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error("Register user error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
export const getUserProfile = async (req: Request, res: Response) => {
  // --- Fallback check for offline/disconnected DB sandbox mode ---
  if (mongoose.connection.readyState !== 1) {
    const user = fallbackUsers.find((u) => u._id === req.user._id);
    if (user) {
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  }

  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    if (mongoose.connection.readyState !== 1) {
      const userIndex = fallbackUsers.findIndex((u) => u._id === req.user._id);
      if (userIndex !== -1) {
        if (name) fallbackUsers[userIndex].name = name;
        if (email) fallbackUsers[userIndex].email = email;
        if (password) {
          const salt = await bcrypt.genSalt(10);
          fallbackUsers[userIndex].passwordHash = await bcrypt.hash(password, salt);
        }
        syncFallbackToDisk();
        return res.json({
          _id: fallbackUsers[userIndex]._id,
          name: fallbackUsers[userIndex].name,
          email: fallbackUsers[userIndex].email,
          isAdmin: fallbackUsers[userIndex].isAdmin,
          token: generateToken(fallbackUsers[userIndex]._id),
        });
      } else {
        return res.status(404).json({ message: "User not found" });
      }
    }

    const user = await User.findById(req.user._id);

    if (user) {
      user.name = name || user.name;
      user.email = email || user.email;
      if (password) {
        user.password = password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser._id.toString()),
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error: any) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
};
