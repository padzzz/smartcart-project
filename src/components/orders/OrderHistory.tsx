import { useEffect, useState } from "react";
import { 
  ClipboardList, 
  CheckCircle, 
  XCircle, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  MapPin, 
  CreditCard, 
  Package, 
  Calendar,
  AlertCircle,
  ShoppingBag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductImage } from "@/components/ui/ProductImage";

interface OrderItem {
  _id: string;
  name: string;
  qty: number;
  image: string;
  price: number;
  product: string;
  category?: string;
}

interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

interface Order {
  _id: string;
  createdAt: string;
  totalPrice: number;
  paymentMethod: string;
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  shippingAddress: ShippingAddress;
  orderItems: OrderItem[];
}

interface OrderHistoryProps {
  token: string;
  onBackToShop: () => void;
  onUnauthenticated?: () => void;
}

export function OrderHistory({ token, onBackToShop, onUnauthenticated }: OrderHistoryProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch("/api/orders/myorders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (resp.status === 401) {
        if (onUnauthenticated) {
          onUnauthenticated();
          return;
        }
      }

      if (!resp.ok) {
        throw new Error("Failed to retrieve your order history");
      }

      const data = await resp.json();
      setOrders(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong while loading orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token]);

  const toggleExpand = (orderId: string) => {
    setExpandedOrder((prev) => (prev === orderId ? null : orderId));
  };

  const formatDate = (dateStr: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: "numeric", 
      month: "long", 
      day: "numeric", 
      hour: "2-digit", 
      minute: "2-digit" 
    };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-muted-foreground italic">Retrieving your purchase history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 py-12 gap-4">
        <AlertCircle className="w-12 h-12 text-destructive" />
        <h3 className="text-xl font-bold">Unable to load orders</h3>
        <p className="text-muted-foreground max-w-md text-center">{error}</p>
        <div className="flex gap-4">
          <Button onClick={fetchOrders} variant="outline">Try Again</Button>
          <Button onClick={onBackToShop}>Back to Shop</Button>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="bg-muted p-4 rounded-full mb-6">
          <ClipboardList className="w-12 h-12 text-muted-foreground" />
        </div>
        <h3 className="text-2xl font-bold mb-2">No Orders Placed Yet</h3>
        <p className="text-muted-foreground max-w-md mb-8">
          You haven't purchased any items yet. Browse our selection and pick something amazing!
        </p>
        <Button onClick={onBackToShop} size="lg">
          Start Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Premium Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-5">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <span className="w-3 h-6 bg-emerald-500 rounded-full inline-block" />
            Purchase History
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 font-medium">
            Track, view invoice cost parameters, and access logistics status of previous orders.
          </p>
        </div>
        <Button 
          onClick={onBackToShop} 
          variant="outline" 
          size="sm"
          className="rounded-xl border-border/80 font-bold text-xs h-9 self-start sm:self-auto hover:bg-muted/60"
        >
          Return to Curation Shop
        </Button>
      </div>

      <div className="grid gap-5 mt-6">
        {orders.map((order) => {
          const isExpanded = expandedOrder === order._id;
          const totalItems = order.orderItems.reduce((acc, item) => acc + item.qty, 0);

          return (
            <div 
              key={order._id}
              className={`border rounded-2xl bg-card text-card-foreground shadow-sm overflow-hidden transition-all duration-300 border-border/60 ${
                isExpanded 
                  ? "ring-2 ring-emerald-500/20 border-emerald-500/40 shadow-emerald-500/5 shadow-lg" 
                  : "hover:border-border-hover hover:shadow-md hover:-translate-y-0.5"
              }`}
              id={`order-card-${order._id}`}
            >
              {/* Order Card Header */}
              <div 
                className="p-5 sm:p-6 cursor-pointer flex flex-col lg:flex-row lg:items-center justify-between gap-4 select-none hover:bg-zinc-50/50 dark:hover:bg-zinc-900/40 transition-colors"
                onClick={() => toggleExpand(order._id)}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
                  {/* Order Meta Info */}
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold font-mono text-muted-foreground/80 tracking-widest uppercase">ID: {order._id.substring(0, 15)}...</p>
                    <div className="flex items-center gap-2 text-sm text-foreground/90 font-bold">
                      <Calendar className="w-4 h-4 text-emerald-500" />
                      <span>{formatDate(order.createdAt)}</span>
                    </div>
                  </div>

                  {/* Summary Details */}
                  <div className="flex items-center gap-8 pl-1 border-l border-border/40 py-1">
                    <div>
                      <span className="text-[10px] text-muted-foreground block uppercase font-extrabold tracking-wider">Product Count</span>
                      <span className="text-sm font-bold text-foreground">{totalItems} {totalItems === 1 ? 'item' : 'items'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground block uppercase font-extrabold tracking-wider">Order Value</span>
                      <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">${order.totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Status Badges & Toggle */}
                <div className="flex items-center justify-between lg:justify-end gap-3 border-t lg:border-0 pt-3 lg:pt-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Paid Status */}
                    {order.isPaid ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        <CheckCircle className="w-3.5 h-3.5 fill-current/10" />
                        Paid
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                        <Clock className="w-3.5 h-3.5" />
                        Pending
                      </span>
                    )}

                    {/* Delivery Status */}
                    {order.isDelivered ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                        <Package className="w-3.5 h-3.5" />
                        Delivered
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-muted text-muted-foreground border border-border/80">
                        <Clock className="w-3.5 h-3.5" />
                        Processing
                      </span>
                    )}
                  </div>

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted/60 hover:bg-muted text-muted-foreground transition-colors ml-1">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </div>
              </div>

              {/* Order Card Collapsible Body */}
              {isExpanded && (
                <div className="border-t border-border/40 bg-muted/20 dark:bg-zinc-950/10 px-5 sm:px-6 py-6 space-y-6">
                  {/* Real-time Order Tracking Status UI */}
                  <div className="border border-border/50 rounded-2xl p-5 bg-card relative shadow-sm">
                    <h4 className="font-extrabold text-xs mb-5 text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                      <Package className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                      Logistics Dispatch & Live Delivery Status
                    </h4>

                    {/* Timeline Tracker */}
                    <div className="relative">
                      {/* Desktop Timeline (horizontal) */}
                      <div className="hidden sm:flex items-center justify-between relative z-10 w-full mb-2">
                        {/* Connecting track line */}
                        <div className="absolute top-[18px] left-[6%] right-[6%] h-[3px] bg-muted -z-10 dark:bg-zinc-800">
                          <div 
                            className="h-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-500 transition-all duration-500" 
                            style={{ 
                              width: order.isDelivered 
                                ? "100%" 
                                : order.isPaid 
                                  ? "66%" 
                                  : "0%" 
                            }}
                          />
                        </div>

                        {/* Step 1: Placed */}
                        <div className="flex flex-col items-center text-center space-y-2 w-1/4">
                          <div className="h-9 w-9 rounded-full bg-emerald-505 bg-emerald-500 text-white flex items-center justify-center font-bold text-xs ring-4 ring-emerald-500/10 dark:ring-emerald-500/20">
                            1
                          </div>
                          <div>
                            <span className="text-xs font-bold block text-foreground">Order Placed</span>
                            <span className="text-[10px] text-muted-foreground font-medium">Payment Checked</span>
                          </div>
                        </div>

                        {/* Step 2: Processing */}
                        <div className="flex flex-col items-center text-center space-y-2 w-1/4">
                          <div className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                            order.isPaid 
                              ? "bg-emerald-500 text-white ring-4 ring-emerald-500/10 dark:ring-emerald-500/20" 
                              : "bg-muted text-muted-foreground border-2 border-border/80"
                          }`}>
                            2
                          </div>
                          <div>
                            <span className={`text-xs font-bold block transition-colors ${order.isPaid ? 'text-foreground' : 'text-muted-foreground'}`}>Quality Checked</span>
                            <span className="text-[10px] text-muted-foreground font-medium">Packed securely</span>
                          </div>
                        </div>

                        {/* Step 3: Out for Shipping */}
                        <div className="flex flex-col items-center text-center space-y-2 w-1/4">
                          <div className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                            order.isPaid 
                              ? "bg-emerald-500 text-white ring-4 ring-emerald-500/10 dark:ring-emerald-500/20" 
                              : "bg-muted text-muted-foreground border-2 border-border/80"
                          }`}>
                            3
                          </div>
                          <div>
                            <span className={`text-xs font-bold block transition-colors ${order.isPaid ? 'text-foreground' : 'text-muted-foreground'}`}>In Transit</span>
                            <span className="text-[10px] text-muted-foreground font-medium">Cargo dispatched</span>
                          </div>
                        </div>

                        {/* Step 4: Delivered */}
                        <div className="flex flex-col items-center text-center space-y-2 w-1/4">
                          <div className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                            order.isDelivered 
                              ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white ring-4 ring-emerald-500/15 animate-bounce" 
                              : "bg-muted text-muted-foreground border-2 border-border/80"
                          }`}>
                            4
                          </div>
                          <div>
                            <span className={`text-xs font-bold block transition-colors ${order.isDelivered ? 'text-foreground' : 'text-muted-foreground'}`}>Delivered</span>
                            <span className="text-[10px] text-muted-foreground font-medium">Handover complete</span>
                          </div>
                        </div>
                      </div>

                      {/* Mobile Timeline (vertical) */}
                      <div className="sm:hidden space-y-5 relative pl-4 border-l-2 border-border dark:border-zinc-800">
                        {/* Step 1 */}
                        <div className="relative">
                          <div className="absolute -left-[24px] top-0 h-4 w-4 rounded-full bg-emerald-500 border-2 border-background" />
                          <div className="pl-2 space-y-0.5">
                            <span className="text-xs font-bold block text-foreground">Order Processed</span>
                            <p className="text-[10px] text-muted-foreground font-medium">Logistics setup generated successfully</p>
                          </div>
                        </div>

                        {/* Step 2 */}
                        <div className="relative">
                          <div className={`absolute -left-[24px] top-0 h-4 w-4 rounded-full border-2 border-background ${
                            order.isPaid ? 'bg-emerald-500' : 'bg-muted'
                          }`} />
                          <div className="pl-2 space-y-0.5">
                            <span className={`text-xs font-bold block ${order.isPaid ? 'text-foreground' : 'text-muted-foreground'}`}>Quality Checked & Packed</span>
                            <p className="text-[10px] text-muted-foreground font-medium">Verified by dispatch staff</p>
                          </div>
                        </div>

                        {/* Step 3 */}
                        <div className="relative">
                          <div className={`absolute -left-[24px] top-0 h-4 w-4 rounded-full border-2 border-background ${
                            order.isPaid ? 'bg-emerald-500' : 'bg-muted'
                          }`} />
                          <div className="pl-2 space-y-0.5">
                            <span className={`text-xs font-bold block ${order.isPaid ? 'text-foreground' : 'text-muted-foreground'}`}>In Transit (Shipped)</span>
                            <p className="text-[10px] text-muted-foreground font-medium">Sent via SmartCart Express courier</p>
                          </div>
                        </div>

                        {/* Step 4 */}
                        <div className="relative">
                          <div className={`absolute -left-[24px] top-0 h-4 w-4 rounded-full border-2 border-background ${
                            order.isDelivered ? 'bg-emerald-500' : 'bg-muted'
                          }`} />
                          <div className="pl-2 space-y-0.5">
                            <span className={`text-xs font-bold block ${order.isDelivered ? 'text-foreground' : 'text-muted-foreground'}`}>Delivered</span>
                            <p className="text-[10px] text-muted-foreground font-medium">Delivered securely to shipping destination</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Items List */}
                  <div>
                    <h4 className="font-extrabold text-xs mb-3 text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                      <ShoppingBag className="w-3.5 h-3.5 text-emerald-500" />
                      Ordered Items Curation
                    </h4>
                    <div className="divide-y divide-border/40 rounded-xl border bg-card overflow-hidden shadow-sm">
                      {order.orderItems.map((item) => (

                        <div key={item._id} className="flex gap-4 p-4 items-center hover:bg-muted/10 transition-colors">
                          <div className="w-14 h-14 rounded-md overflow-hidden bg-muted flex-shrink-0 border border-border/40">
                            <ProductImage 
                              src={item.image} 
                              alt={item.name} 
                              category={item.category}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="font-medium text-sm text-foreground truncate">{item.name}</h5>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              Quantity: <span className="font-semibold">{item.qty}</span>
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <span className="font-semibold text-sm block">${(item.price * item.qty).toFixed(2)}</span>
                            {item.qty > 1 && (
                              <span className="text-xs text-muted-foreground">${item.price.toFixed(2)} each</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Dispatch and Payment Information */}
                  <div className="grid md:grid-cols-2 gap-6 pt-2">
                    {/* Shipping Address */}
                    <div className="space-y-2 border rounded-lg p-4 bg-muted/40">
                      <div className="flex items-center gap-2 font-semibold text-sm mb-1 text-foreground/90">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <h4>Shipping Destination</h4>
                      </div>
                      <div className="text-sm space-y-0.5 text-muted-foreground pl-6">
                        <p>{order.shippingAddress.address}</p>
                        <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                        <p>{order.shippingAddress.country}</p>
                      </div>
                    </div>

                    {/* Payment Summary */}
                    <div className="space-y-2 border rounded-lg p-4 bg-muted/40">
                      <div className="flex items-center gap-2 font-semibold text-sm mb-1 text-foreground/90">
                        <CreditCard className="w-4 h-4 text-muted-foreground" />
                        <h4>Payment Summary</h4>
                      </div>
                      <div className="text-sm space-y-1 text-muted-foreground pl-6">
                        <p className="flex justify-between">
                          <span>Payment Method:</span> 
                          <span className="font-medium text-foreground">{order.paymentMethod}</span>
                        </p>
                        <p className="flex justify-between border-t pt-1.5 mt-1.5">
                          <span>Total Amount Paid:</span> 
                          <span className="font-bold text-foreground">${order.totalPrice.toFixed(2)}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
