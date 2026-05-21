import React, { useState, useEffect } from "react";
import { Star, X, ShoppingCart, MessageSquare, ShieldCheck, Mail, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductImage } from "@/components/ui/ProductImage";

interface Review {
  _id?: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description?: string;
  rating?: number;
  numReviews?: number;
  countInStock?: number;
  reviews?: Review[];
}

interface ProductDetailDialogProps {
  product: Product;
  userToken?: string;
  isLoggedIn: boolean;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onReviewSubmitted: () => void;
  showToastSuccess?: (msg: string) => void;
  showToastError?: (msg: string) => void;
}

export function ProductDetailDialog({
  product,
  userToken,
  isLoggedIn,
  isOpen,
  onClose,
  onAddToCart,
  onReviewSubmitted,
  showToastSuccess,
  showToastError,
}: ProductDetailDialogProps) {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Clean-up inputs when opening/switching products
  useEffect(() => {
    setRating(5);
    setComment("");
    setFormError(null);
  }, [product]);

  if (!isOpen) return null;

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!comment.trim()) {
      setFormError("Review comment cannot be empty.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/products/${product._id}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          rating,
          comment,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit review");
      }

      setComment("");
      setRating(5);
      if (showToastSuccess) {
        showToastSuccess("Thank you! Review has been successfully recorded.");
      }
      onReviewSubmitted(); // Refresh products in parent App state
    } catch (err: any) {
      setFormError(err.message || "Something went wrong.");
      if (showToastError) {
        showToastError(err.message || "Could not publish your review.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentReviews = product.reviews || [];
  const inStock = (product.countInStock ?? 0) > 0;

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return Math.abs(Date.now() - d.getTime()) < 3 * 60 * 1000 
      ? "Just now" 
      : d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200" id="detail-modal-root">
      <div
        className="relative w-full max-w-4xl bg-background border border-border/60 rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col"
        id="detail-modal-content"
      >
        {/* Sticky modal header with close x */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/40 select-none bg-background/80 backdrop-blur-md">
          <span className="text-[10px] font-extrabold uppercase tracking-widest bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-lg">
            {product.category} Curation
          </span>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-muted/80 rounded-xl transition-all border border-transparent hover:border-border/50 text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Scrollable Contents */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Product Image Panel */}
            <div className="md:col-span-5 space-y-4">
              <div className="aspect-square w-full rounded-2xl overflow-hidden bg-muted/30 border border-border/40 relative">
                <ProductImage src={product.image} alt={product.name} className="w-full h-full object-cover" category={product.category} />
              </div>
              <div className="flex items-center justify-between text-xs bg-muted/40 border border-border/45 px-4 py-3 rounded-xl">
                <span className="font-bold text-muted-foreground">Inventory Status:</span>
                {inStock ? (
                  <span className="text-emerald-500 font-extrabold flex items-center gap-1">
                    🟢 {product.countInStock} Units Available
                  </span>
                ) : (
                  <span className="text-red-500 font-extrabold">
                    🔴 Temporarily Out of Stock
                  </span>
                )}
              </div>
            </div>

            {/* Core Specs & Cart Row */}
            <div className="md:col-span-7 space-y-5 flex flex-col justify-between">
              <div className="space-y-3">
                <h2 className="text-2xl font-extrabold tracking-tight text-foreground">{product.name}</h2>
                <div className="flex items-center gap-2">
                  <div className="flex items-center text-amber-500">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star
                        key={idx}
                        className={`w-4 h-4 ${
                          idx < Math.floor(product.rating || 4.5)
                            ? "fill-current"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground font-bold">
                    {(product.rating || 4.5).toFixed(1)} / 5.0 ({product.numReviews || 0} customer reviews)
                  </span>
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed font-sans mt-2">{product.description}</p>
              </div>

              <div className="space-y-4 pt-5 border-t border-border/40">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs uppercase font-extrabold tracking-widest text-muted-foreground">Retail Price</span>
                  <span className="text-3xl font-extrabold text-foreground font-mono">${product.price.toFixed(2)}</span>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => {
                      onAddToCart(product);
                      onClose();
                    }}
                    disabled={!inStock}
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold h-11 rounded-xl shadow-md transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span>Instant Purchase (Add to Cart)</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Customer Reviews Section */}
          <div className="border-t border-border/40 pt-6 space-y-6">
            <h3 className="text-lg font-extrabold text-foreground flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-emerald-500" />
              Verified Reviews ({currentReviews.length})
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Existing Reviews Column */}
              <div className="lg:col-span-7 space-y-4">
                {currentReviews.length === 0 ? (
                  <div className="text-center p-8 bg-muted/20 border border-dashed border-border/60 rounded-2xl text-muted-foreground flex flex-col items-center justify-center space-y-1.5">
                    <p className="font-bold text-foreground/90 text-sm">No reviews yet for {product.name}</p>
                    <p className="text-xs">Purchased this item? Be the first to publish your feedback below.</p>
                  </div>
                ) : (
                  <div className="space-y-3.5 max-h-[350px] overflow-y-auto pr-2">
                    {currentReviews.map((r, i) => (
                      <div
                        key={r._id || i}
                        className="p-4 rounded-2xl bg-muted/20 border border-border/30 hover:border-border/60 transition-all duration-200 space-y-2.5"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-7 w-7 rounded-lg bg-emerald-50 dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs flex items-center justify-center">
                              {r.name[0].toUpperCase()}
                            </div>
                            <span className="text-xs font-bold text-foreground">{r.name}</span>
                          </div>
                          <span className="text-[10px] text-muted-foreground font-mono flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-slate-400" />
                            {formatDate(r.createdAt)}
                          </span>
                        </div>
                        
                        <div className="flex items-center text-amber-500 gap-0.5">
                          {Array.from({ length: 5 }).map((_, idx) => (
                            <Star
                              key={idx}
                              className={`w-3 h-3 ${
                                idx < r.rating ? "fill-current" : "text-muted-foreground/20"
                              }`}
                            />
                          ))}
                        </div>

                        <p className="text-xs text-muted-foreground leading-relaxed italic">{r.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Review Input Submission Column */}
              <div className="lg:col-span-5 bg-muted/10 border border-border/40 p-5 rounded-2xl relative">
                {isLoggedIn ? (
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <h4 className="text-sm font-bold text-foreground">Write a Customer Review</h4>
                    
                    {formError && (
                      <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs px-3.5 py-2 rounded-xl">
                        {formError}
                      </div>
                    )}

                    {/* Interactive ratings star rating */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block">Overall Rating</label>
                      <div className="flex items-center gap-1.5">
                        {Array.from({ length: 5 }).map((_, idx) => {
                          const val = idx + 1;
                          const active = hoverRating !== null ? val <= hoverRating : val <= rating;
                          return (
                            <button
                              type="button"
                              key={idx}
                              onClick={() => setRating(val)}
                              onMouseEnter={() => setHoverRating(val)}
                              onMouseLeave={() => setHoverRating(null)}
                              className="text-amber-500 transition-transform hover:scale-115 focus:outline-none cursor-pointer"
                            >
                              <Star className={`w-6 h-6 ${active ? "fill-current" : "text-muted-foreground/30"}`} />
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block">Review Comment</label>
                      <textarea
                        className="w-full text-xs rounded-xl border border-input bg-background/50 px-3 py-2.5 focus:bg-background focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 focus-visible:outline-none transition-all duration-200 text-foreground"
                        rows={3}
                        placeholder="Write something helpful for other curated shoppers..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-slate-900 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-bold h-9 rounded-xl text-xs"
                    >
                      {isSubmitting ? "Submitting Review..." : "Publish Review"}
                    </Button>
                  </form>
                ) : (
                  <div className="h-full flex flex-col justify-center items-center text-center p-4 py-8 space-y-3">
                    <Mail className="h-8 w-8 text-slate-400 animate-pulse" />
                    <div>
                      <h4 className="font-extrabold text-xs text-foreground uppercase tracking-widest">Sign In to Leave Feedback</h4>
                      <p className="text-muted-foreground text-[11px] mt-1 max-w-[200px] mx-auto">
                        Only verified registered accounts can submit product ratings.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
