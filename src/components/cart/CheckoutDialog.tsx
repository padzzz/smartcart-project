import { useState, FormEvent } from "react";
import { 
  X, 
  MapPin, 
  CreditCard, 
  ShoppingBag, 
  Truck, 
  ShieldCheck, 
  FileText 
} from "lucide-react";
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

interface UserInfo {
  _id: string;
  name: string;
  email: string;
  token: string;
}

interface CheckoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  user: UserInfo | null;
  onOrderSuccess: () => void;
  onUnauthenticated?: () => void;
}

export function CheckoutDialog({ 
  isOpen, 
  onClose, 
  cartItems, 
  user, 
  onOrderSuccess,
  onUnauthenticated
}: CheckoutDialogProps) {
  const [address, setAddress] = useState("123 Main St");
  const [city, setCity] = useState("Metropolis");
  const [postalCode, setPostalCode] = useState("10101");
  const [country, setCountry] = useState("USA");
  const [paymentMethod, setPaymentMethod] = useState("Stripe");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const itemsPrice = cartItems.reduce((acc, i) => acc + i.price * i.qty, 0);
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
  const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    setError(null);

    try {
      const resp = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          orderItems: cartItems.map(item => ({...item, product: item._id})),
          shippingAddress: {
            address,
            city,
            postalCode,
            country,
          },
          paymentMethod,
          totalPrice,
        }),
      });

      if (resp.ok) {
        onOrderSuccess();
      } else {
        const errorData = await resp.json();
        if (resp.status === 401 && onUnauthenticated) {
          onUnauthenticated();
        }
        throw new Error(errorData.message || "Failed to submit purchase order");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong during checkout.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl border border-border/40 bg-background shadow-2xl overflow-hidden flex flex-col max-h-[90vh] md:max-h-[85vh] animate-in fade-in zoom-in-95 duration-200" id="checkout-container">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/40">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold tracking-tight">Secure Checkout</h2>
              <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">SmartCart Encrypted Protocol</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 hover:bg-muted/80 rounded-xl transition-all border border-transparent hover:border-border/50 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid md:grid-cols-12 gap-6">
            {/* Left side: Inputs */}
            <div className="md:col-span-7 space-y-6">
              {/* Shipping Form */}
              <div className="space-y-4">
                <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-muted-foreground border-b border-border/40 pb-2">
                  <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                  <h3>Delivery Address</h3>
                </div>
                
                <div className="space-y-3.5">
                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Street Address</label>
                    <input
                      type="text"
                      required
                      className="w-full rounded-xl border border-input bg-muted/20 px-3.5 py-2 text-sm focus:outline-none focus:border-emerald-500 focus:bg-background focus:ring-2 focus:ring-emerald-500/10 transition-all duration-200"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. 123 Main St"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3.5">
                    <div>
                      <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">City</label>
                      <input
                        type="text"
                        required
                        className="w-full rounded-xl border border-input bg-muted/20 px-3.5 py-2 text-sm focus:outline-none focus:border-emerald-500 focus:bg-background focus:ring-2 focus:ring-emerald-500/10 transition-all duration-200"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Metropolis"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Postal Code</label>
                      <input
                        type="text"
                        required
                        className="w-full rounded-xl border border-input bg-muted/20 px-3.5 py-2 text-sm focus:outline-none focus:border-emerald-500 focus:bg-background focus:ring-2 focus:ring-emerald-500/10 transition-all duration-200"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="e.g. 10101"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Country</label>
                    <input
                      type="text"
                      required
                      className="w-full rounded-xl border border-input bg-muted/20 px-3.5 py-2 text-sm focus:outline-none focus:border-emerald-500 focus:bg-background focus:ring-2 focus:ring-emerald-500/10 transition-all duration-200"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="e.g. USA"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-4">
                <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-muted-foreground border-b border-border/40 pb-2">
                  <CreditCard className="w-3.5 h-3.5 text-emerald-500" />
                  <h3>Choose Payment Option</h3>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  {["Stripe", "PayPal", "Credit Card"].map((method) => {
                    const isSelected = paymentMethod === method;
                    return (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setPaymentMethod(method)}
                        className={`py-2 px-3 border rounded-xl text-xs font-semibold text-center cursor-pointer transition-all ${
                          isSelected 
                            ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold ring-1 ring-emerald-500"
                            : "bg-background hover:bg-muted border-border/70 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {method}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right side: Items Overview & Totals */}
            <div className="md:col-span-5 space-y-6">
              {/* Order Items Review */}
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-muted-foreground border-b border-border/40 pb-2">
                  <ShoppingBag className="w-3.5 h-3.5 text-emerald-500" />
                  <h3>Purchase Review</h3>
                </div>

                <div className="max-h-48 overflow-y-auto space-y-2.5 pr-1" id="checkout-items-list">
                  {cartItems.map((item) => (
                    <div key={item._id} className="flex gap-2.5 p-1.5 rounded-lg border border-border/20 bg-muted/10 items-center text-xs">
                      <ProductImage 
                        src={item.image} 
                        alt={item.name} 
                        category={item.category}
                        className="w-10 h-10 object-cover rounded-lg border border-border/40 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold truncate text-foreground">{item.name}</p>
                        <p className="text-muted-foreground font-medium text-[10px] mt-0.5">Qty: {item.qty} × ${item.price}</p>
                      </div>
                      <span className="font-mono font-bold text-foreground">${(item.price * item.qty).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Billing Info */}
              <div className="space-y-3 bg-muted/20 p-4 rounded-2xl border border-border/40 shadow-sm">
                <div className="flex items-center gap-1.5 font-bold text-[10px] text-muted-foreground uppercase tracking-wider">
                  <FileText className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Cost Calculation</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-medium">Subtotal:</span>
                    <span className="font-semibold text-foreground">${itemsPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-medium flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5" /> Shipping:
                    </span>
                    <span className="font-semibold text-foreground">{shippingPrice === 0 ? "FREE" : `$${shippingPrice.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-medium">Estimated Tax (15%):</span>
                    <span className="font-semibold text-foreground">${taxPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t border-border/40 pt-2.5 mt-2.5 text-sm font-extrabold">
                    <span className="text-foreground">Grand Total:</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-mono text-base">${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-xs rounded-xl p-3 border border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30">
              {error}
            </div>
          )}

          {/* Action buttons footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/40">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose} 
              disabled={loading}
              className="rounded-xl font-bold text-xs h-9"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs h-9 rounded-xl shadow-md cursor-pointer" 
              disabled={loading}
            >
              {loading ? "Completing..." : "Confirm & Place Order"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
