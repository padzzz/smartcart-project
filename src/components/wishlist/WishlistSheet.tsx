import { Heart, X, Trash2, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductImage } from "@/components/ui/ProductImage";

interface WishlistItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description?: string;
  rating?: number;
}

interface WishlistSheetProps {
  items: WishlistItem[];
  isOpen: boolean;
  onClose: () => void;
  onRemove: (id: string) => void;
  onMoveToCart: (product: WishlistItem) => void;
}

export function WishlistSheet({
  items,
  isOpen,
  onClose,
  onRemove,
  onMoveToCart,
}: WishlistSheetProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" id="wishlist-drawer-backdrop">
      <div
        className="h-full w-full max-w-md border-l border-border/40 bg-background/95 backdrop-blur-md p-6 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300"
        id="wishlist-drawer-content"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-5 border-b border-border/40">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-50 text-pink-600 dark:bg-pink-950/40 dark:text-pink-400">
              <Heart className="h-5 w-5 fill-current" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold tracking-tight">My Wishlist</h2>
              <p className="text-xs text-muted-foreground font-medium">
                {items.length} {items.length === 1 ? "item" : "items"} saved
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-muted/80 rounded-xl transition-all border border-transparent hover:border-border/50 text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Dynamic Wishlist Items List */}
        <div className="flex-1 overflow-y-auto py-5 space-y-4 pr-1 -mr-1" style={{ maxHeight: 'calc(100vh - 120px)' }}>
          {items.length === 0 ? (
            <div className="text-center py-20 flex flex-col items-center justify-center space-y-4">
              <div className="p-4 bg-muted/40 rounded-full text-muted-foreground">
                <Heart className="h-10 w-10 opacity-60 text-slate-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">Wishlist is empty</p>
                <p className="text-xs text-muted-foreground mt-1 max-w-[200px] mx-auto">
                  Mark items with a heart while exploring to save them here.
                </p>
              </div>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item._id}
                className="flex gap-4 p-3 rounded-xl border border-border/30 bg-muted/20 hover:bg-muted/40 transition-all duration-200 relative group"
              >
                {/* Product Thumbnail */}
                <div className="h-20 w-20 rounded-xl overflow-hidden bg-white border border-border/40 flex-shrink-0 relative">
                  <ProductImage src={item.image} alt={item.name} className="h-full w-full object-cover animate-in fade-in" category={item.category} />
                </div>

                {/* Info & Action Controls */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between min-w-0">
                      <h3 className="font-bold text-sm text-foreground line-clamp-1 leading-snug pr-2">{item.name}</h3>
                      <button
                        onClick={() => onRemove(item._id)}
                        className="text-muted-foreground hover:text-red-500 transition-all p-1 hover:bg-red-55 border border-transparent hover:border-red-500/10 rounded-lg"
                        title="Remove from wishlist"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <span className="text-[10px] bg-pink-100 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300 px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider">{item.category}</span>
                    <p className="text-xs text-foreground font-extrabold font-mono mt-1.5">${item.price.toFixed(2)}</p>
                  </div>

                  <div className="mt-2.5">
                    <Button
                      size="sm"
                      onClick={() => onMoveToCart(item)}
                      className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-750 hover:to-teal-750 text-white font-bold h-8 rounded-lg text-xs flex items-center justify-center gap-1.5"
                    >
                      <ShoppingCart className="h-3 w-3" />
                      <span>Add to Cart</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
