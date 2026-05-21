import { Request, Response } from "express";
import mongoose from "mongoose";
import Order from "../models/Order.ts";
import { fallbackOrders, syncFallbackToDisk } from "../utils/fallbackDb.ts";

// @desc    Create new order
// @route   POST /api/orders
export const addOrderItems = async (req: Request, res: Response) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400).json({ message: "No order items" });
    return;
  } else {
    // --- Fallback check for offline/disconnected DB sandbox mode ---
    if (mongoose.connection.readyState !== 1) {
      const createdOrder = {
        _id: "fb_o_" + Date.now().toString(),
        orderItems,
        user: req.user._id,
        shippingAddress,
        paymentMethod,
        totalPrice,
        createdAt: new Date().toISOString(),
      };
      fallbackOrders.push(createdOrder);
      syncFallbackToDisk();
      return res.status(201).json(createdOrder);
    }

    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
export const getOrderById = async (req: Request, res: Response) => {
  // --- Fallback check for offline/disconnected DB sandbox mode ---
  if (mongoose.connection.readyState !== 1) {
    const order = fallbackOrders.find((o) => o._id === req.params.id);
    if (order) {
      return res.json(order);
    } else {
      return res.status(404).json({ message: "Order not found" });
    }
  }

  const order = await Order.findById(req.params.id).populate("user", "name email");

  if (order) {
    res.json(order);
  } else {
    res.status(404).json({ message: "Order not found" });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
export const getMyOrders = async (req: Request, res: Response) => {
  // --- Fallback check for offline/disconnected DB sandbox mode ---
  if (mongoose.connection.readyState !== 1) {
    const orders = fallbackOrders.filter((o) => o.user === req.user._id);
    return res.json(orders);
  }

  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
};

// @desc    Get all orders
// @route   GET /api/orders
export const getOrders = async (req: Request, res: Response) => {
  // --- Fallback check for offline/disconnected DB sandbox mode ---
  if (mongoose.connection.readyState !== 1) {
    return res.json(fallbackOrders);
  }

  const orders = await Order.find({}).populate("user", "id name");
  res.json(orders);
};
