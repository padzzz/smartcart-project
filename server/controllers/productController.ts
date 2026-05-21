import { Request, Response } from "express";
import Product from "../models/Product.ts";
import mongoose from "mongoose";
import { extendedProductsArray } from "../utils/extendedProducts.ts";

// Fallback data in case DB is not connected
const fallbackProducts = extendedProductsArray.map((prod, idx) => ({
  _id: prod._id || `fb_ext_${idx + 1}`,
  ...prod
}));

// @desc    Fetch all products
// @route   GET /api/products
export const getProducts = async (req: Request, res: Response) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.warn("DB not connected, serving fallback products");
      return res.json(fallbackProducts);
    }

    const products = await Product.find({});
    
    // If DB is empty, return fallback as well to avoid empty screen
    if (products.length === 0) {
      return res.json(fallbackProducts);
    }

    res.json(products);
  } catch (error) {
    console.error("GET /api/products error:", error);
    // Even on error, try to serve fallback data
    res.json(fallbackProducts);
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
export const getProductById = async (req: Request, res: Response) => {
  try {
    // --- Fallback check for offline/disconnected DB sandbox mode ---
    if (mongoose.connection.readyState !== 1) {
      const product = fallbackProducts.find((p) => p._id === req.params.id);
      if (product) {
        return res.json(product);
      } else {
        return res.status(404).json({ message: "Product not found" });
      }
    }

    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      // Direct lookup auxiliary fallback
      const fbProd = fallbackProducts.find((p) => p._id === req.params.id);
      if (fbProd) {
        res.json(fbProd);
      } else {
        res.status(404).json({ message: "Product not found" });
      }
    }
  } catch (error) {
    console.error(`GET /api/products/${req.params.id} error:`, error);
    // On lookup error (e.g. invalid MongoDB ObjectId format for fallback prefix ids like fb_ext_X), match from fallback products
    const fbProd = fallbackProducts.find((p) => p._id === req.params.id);
    if (fbProd) {
      return res.json(fbProd);
    }
    res.status(500).json({ message: "Server Error", error: (error as Error).message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const index = fallbackProducts.findIndex((p) => p._id === req.params.id);
      if (index !== -1) {
        fallbackProducts.splice(index, 1);
        return res.json({ message: "Product removed" });
      } else {
        return res.status(404).json({ message: "Product not found" });
      }
    }

    const product = await Product.findById(req.params.id);
    if (product) {
      await product.deleteOne();
      res.json({ message: "Product removed" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Create a product
// @route   POST /api/products
export const createProduct = async (req: Request, res: Response) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const newProduct = {
        _id: "fb_p_" + Date.now().toString(),
        name: "Sample name",
        price: 0,
        user: req.user._id,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
        category: "Sample category",
        countInStock: 0,
        numReviews: 0,
        description: "Sample description",
        reviews: []
      };
      fallbackProducts.push(newProduct as any);
      return res.status(201).json(newProduct);
    }

    const product = new Product({
      name: "Sample name",
      price: 0,
      user: req.user._id,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
      category: "Sample category",
      countInStock: 0,
      numReviews: 0,
      description: "Sample description",
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
export const updateProduct = async (req: Request, res: Response) => {
  const { name, price, description, image, category, countInStock } = req.body;

  try {
    if (mongoose.connection.readyState !== 1) {
      const product = fallbackProducts.find((p) => p._id === req.params.id);
      if (product) {
        if (name !== undefined) product.name = name;
        if (price !== undefined) product.price = price;
        if (description !== undefined) product.description = description;
        if (image !== undefined) product.image = image;
        if (category !== undefined) product.category = category;
        if (countInStock !== undefined) product.countInStock = countInStock;
        return res.json(product);
      } else {
        return res.status(404).json({ message: "Product not found" });
      }
    }

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name;
      product.price = price;
      product.description = description;
      product.image = image;
      product.category = category;
      product.countInStock = countInStock;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
export const createProductReview = async (req: Request, res: Response) => {
  const { rating, comment } = req.body;

  try {
    const ratingNum = Number(rating);
    if (!rating || !comment) {
      return res.status(400).json({ message: "Rating and comment are required" });
    }

    if (mongoose.connection.readyState !== 1) {
      const product = fallbackProducts.find((p) => p._id === req.params.id);
      if (product) {
        if (!(product as any).reviews) {
          (product as any).reviews = [];
        }

        const alreadyReviewed = (product as any).reviews.find(
          (r: any) => r.user.toString() === req.user._id.toString()
        );

        if (alreadyReviewed) {
          return res.status(400).json({ message: "Product already reviewed" });
        }

        const review = {
          _id: "fb_rev_" + Date.now().toString(),
          name: req.user.name || "Anonymous User",
          rating: ratingNum,
          comment,
          user: req.user._id,
          createdAt: new Date().toISOString(),
        };

        (product as any).reviews.push(review);
        (product as any).numReviews = (product as any).reviews.length;
        (product as any).rating =
          (product as any).reviews.reduce((acc: number, item: any) => item.rating + acc, 0) /
          (product as any).reviews.length;

        return res.status(201).json({ message: "Review added", review });
      } else {
        return res.status(404).json({ message: "Product not found" });
      }
    }

    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        return res.status(400).json({ message: "Product already reviewed" });
      }

      const review = {
        name: req.user.name,
        rating: ratingNum,
        comment,
        user: req.user._id,
      };

      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json({ message: "Review added", review });
    } else {
      res.status(302).json({ message: "Product not found" });
    }
  } catch (error: any) {
    console.error("Create review error:", error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
};
