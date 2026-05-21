import { ShoppingBag, X, Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductImage } from "@/components/ui/ProductImage";

interface CartItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  qty: number;
  category?: string;
}

interface CartSheetProps {
  items: CartItem[];
  isOpen: boolean;
  onClose: () => void;
  onRemove: (id: string) => void;
  onUpdateQty: (id: string, qty: number) => void;
  onCheckout: () => void;
  isLoggedIn: boolean;
}

export function CartSheet({ 
  items, 
  isOpen, 
  onClose, 
  onRemove, 
  onUpdateQty, 
  onCheckout,
  isLoggedIn 
}: CartSheetProps) {
  if (!isOpen) return null;

  const total = items.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <div className="fixed inset-0 z-[100] flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" id="cart-drawer-backdrop">
      <div 
        className="h-full w-full max-w-md border-l border-border/40 bg-background/95 backdrop-blur-md p-6 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300"
        id="cart-drawer-content"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-5 border-b border-border/40">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold tracking-tight">Shopping Cart</h2>
              <p className="text-xs text-muted-foreground font-medium">
                {items.length} {items.length === 1 ? "item" : "items"} selected
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

        {/* Dynamic Cart Items List */}
        <div className="flex-1 overflow-y-auto py-5 space-y-4 pr-1 -mr-1" style={{ maxHeight: 'calc(100vh - 260px)' }}>
          {items.length === 0 ? (
            <div className="text-center py-20 flex flex-col items-center justify-center space-y-4">
              <div className="p-4 bg-muted/40 rounded-full text-muted-foreground">
                <ShoppingBag className="h-10 w-10 opacity-60" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">Your cart is currently empty</p>
                <p className="text-xs text-muted-foreground mt-1 max-w-[200px] mx-auto">
                  Browse our catalog and pick some premium gadgets to fill it up.
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
                <div className="h-20 w-20 rounded-xl overflow-hidden bg-white border border-border/40 flex-shrink-0">
                  <ProductImage src={item.image} alt={item.name} className="h-full w-full object-cover animate-in fade-in" category={item.category} />
                </div>

                {/* Info & Quantity controls */}
                <div className="flex-1 flex flex-col justify-between">
                  <div className="pr-4">
                    <h3 className="font-bold text-sm text-foreground line-clamp-1 leading-snug">{item.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Price: ${item.price.toFixed(2)}</p>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    {/* Compact Quantity Spinner */}
                    <div className="flex items-center border border-border/80 bg-background rounded-lg overflow-hidden h-7">
                      <button 
                        onClick={() => onUpdateQty(item._id, Math.max(1, item.qty - 1))}
                        className="p-1 px-1.5 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold font-mono text-foreground">{item.qty}</span>
                      <button 
                        onClick={() => onUpdateQty(item._id, item.qty + 1)}
                        className="p-1 px-1.5 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    <span className="text-sm font-extrabold text-foreground font-mono">
                      ${(item.price * item.qty).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Absolutely positioned remove button for clean visual */}
                <button 
                  onClick={() => onRemove(item._id)}
                  className="absolute right-3 top-3 p-1 rounded-lg text-muted-foreground hover:text-destructive hover:bg-red-50 dark:hover:bg-red-950/20 opacity-0 group-hover:opacity-100 transition-all duration-200"
                  title="Remove Item"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer Payment Checkout Drawer Section */}
        <div className="pt-5 border-t border-border/40 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground uppercase tracking-wider font-extrabold">Subtotal</span>
            <span className="text-2xl font-extrabold font-mono text-foreground">${total.toFixed(2)}</span>
          </div>

          <Button 
            className="w-full h-11 text-xs font-bold rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-500/10 hover:shadow-lg hover:shadow-emerald-500/15 transition-all flex items-center justify-center gap-2 cursor-pointer"
            disabled={items.length === 0}
            onClick={onCheckout}
            id="checkout-trigger-btn"
          >
            <span>{isLoggedIn ? "Proceed to Checkout" : "Login to Checkout"}</span>
            <ArrowRight className="h-4 w-4" />
          </Button>

          <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest font-bold">
            🛡️ Safe and Secure SSL Encryption
          </p>
        </div>
      </div>
    </div>
  );
}
