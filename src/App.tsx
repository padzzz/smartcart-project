import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { CartSheet } from "@/components/cart/CartSheet";
import { WishlistSheet } from "@/components/wishlist/WishlistSheet";
import { ProductDetailDialog } from "@/components/products/ProductDetailDialog";
import { UserProfile } from "@/components/profile/UserProfile";
import { ShoppingCart, Star, SlidersHorizontal, Heart, Trash2, Filter, Sparkles, RefreshCw, Layers, ShieldCheck, Truck, Undo } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderHistory } from "@/components/orders/OrderHistory";
import { CheckoutDialog } from "@/components/cart/CheckoutDialog";
import { ProductImage } from "@/components/ui/ProductImage";
import { Toaster, toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

const getCategoryBadgeStyles = (category: string) => {
  const cat = (category || "").toLowerCase().trim();
  switch (cat) {
    case "watch":
      return "from-violet-600 to-indigo-600 text-white shadow-violet-500/15";
    case "mobile":
      return "from-emerald-600 to-teal-600 text-white shadow-emerald-500/15";
    case "computer":
      return "from-blue-600 to-indigo-600 text-white shadow-blue-500/15";
    case "shoes":
      return "from-amber-500 to-orange-500 text-white shadow-orange-500/15";
    case "electronics":
      return "from-cyan-500 to-blue-500 text-white shadow-cyan-500/15";
    case "fashion":
      return "from-pink-500 to-rose-500 text-white shadow-pink-500/15";
    case "accessories":
      return "from-yellow-500 to-amber-600 text-white shadow-amber-500/15";
    default:
      return "from-zinc-500 to-slate-600 text-white shadow-slate-500/15";
  }
};

interface UserInfo {
  _id: string;
  name: string;
  email: string;
  token: string;
  isAdmin?: boolean;
}

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

interface CartItem extends Product {
  qty: number;
}

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // User auth state
  const [user, setUser] = useState<UserInfo | null>(() => {
    const saved = localStorage.getItem("userInfo");
    return saved ? JSON.parse(saved) : null;
  });
  const [showAuth, setShowAuth] = useState(false);

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("cartItems");
    return saved ? JSON.parse(saved) : [];
  });
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  // Wishlist state
  const [wishlistItems, setWishlistItems] = useState<Product[]>(() => {
    const saved = localStorage.getItem("wishlistItems");
    return saved ? JSON.parse(saved) : [];
  });
  const [showWishlist, setShowWishlist] = useState(false);

  // Product detail view state
  const [selectedDetailProduct, setSelectedDetailProduct] = useState<Product | null>(null);

  // Navigation state
  const [currentView, setCurrentView] = useState<"shop" | "orders" | "profile">("shop");

  // Advanced search and filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSort, setSelectedSort] = useState<"default" | "price-asc" | "price-desc" | "rating" | "reviews">("default");
  
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(2000);
  const [minRating, setMinRating] = useState<number>(0);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Theme state
  const [theme, setTheme] = useState<"light" | "dark" | "">(() => {
    const saved = localStorage.getItem("theme");
    return saved === "dark" || saved === "light" ? saved : "";
  });

  // Theme Sync effect
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const initialTheme = savedTheme || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    setTheme(initialTheme);
  }, []);

  useEffect(() => {
    if (!theme) return;
    localStorage.setItem("theme", theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme(prev => prev === "dark" ? "light" : "dark");
    toast.info(`Theme toggled to ${theme === "dark" ? "light" : "dark"} mode.`);
  };

  // Product loading
  const fetchProducts = () => {
    setLoading(true);
    setError(null);
    fetch("/api/products")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || data.message || "Failed to fetch products");
        }
        return data;
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data);
          // Keep current modal selection synced with new backend data
          if (selectedDetailProduct) {
            const updated = data.find(p => p._id === selectedDetailProduct._id);
            if (updated) setSelectedDetailProduct(updated);
          }
        } else {
          console.error("Data received is not an array:", data);
          setProducts([]);
          setError("Invalid data format received from server");
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Sync states on cart updates
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem("wishlistItems", JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  // Advanced search functionality that looks into name, category, AND description
  const searchedProducts = products.filter((product) => {
    const search = searchQuery.toLowerCase().trim();
    if (!search) return true;
    return (
      product.name.toLowerCase().includes(search) ||
      (product.category && product.category.toLowerCase().includes(search)) ||
      (product.description && product.description.toLowerCase().includes(search))
    );
  });

  // Filter based on selected category, price range, ratings and stock parameters
  const filteredProductsByCat = searchedProducts.filter((product) => {
    const matchesCategory = selectedCategory === "All" ||
      (product.category && product.category.toLowerCase() === selectedCategory.toLowerCase());
    
    const matchesPrice = product.price >= minPrice && product.price <= maxPrice;
    const ratingValue = product.rating || 4.5;
    const matchesRating = ratingValue >= minRating;
    const matchesStock = !onlyInStock || (product.countInStock !== undefined && product.countInStock > 0);

    return matchesCategory && matchesPrice && matchesRating && matchesStock;
  });

  // Sort options applied dynamically
  const sortedProducts = [...filteredProductsByCat].sort((a, b) => {
    switch (selectedSort) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "rating":
        return (b.rating || 4.5) - (a.rating || 4.5);
      case "reviews":
        return (b.numReviews || 0) - (a.numReviews || 0);
      default:
        return 0; // featured/standard DB order
    }
  });

  // Dynamic Related/Recommended products calculations based on search state, category or overall ratings
  const getRelatedRecommendations = () => {
    let list: Product[] = [];
    if (searchQuery.trim().length > 0) {
      const activeMatchCats = Array.from(new Set(searchedProducts.map(p => p.category).filter(Boolean)));
      list = products.filter(p => 
        activeMatchCats.includes(p.category) && 
        !searchedProducts.some(m => m._id === p._id)
      );
      if (list.length < 4) {
        const extra = products.filter(p => 
          !searchedProducts.some(m => m._id === p._id) && 
          !list.some(x => x._id === p._id)
        ).sort((a, b) => (b.rating || 4.5) - (a.rating || 4.5));
        list = [...list, ...extra];
      }
    } else if (selectedCategory !== "All") {
      list = products.filter(p => 
        p.category && 
        p.category.toLowerCase() !== selectedCategory.toLowerCase() &&
        (p.rating || 4.5) >= 4.5
      );
    } else {
      list = products.filter(p => (p.rating || 4.5) >= 4.7);
    }
    return list.slice(0, 4);
  };

  const relatedProducts = getRelatedRecommendations();

  // Shopping Cart Controls
  const addToCart = (product: Product) => {
    const exist = cartItems.find((x) => x._id === product._id);
    if (exist) {
      setCartItems(
        cartItems.map((x) =>
          x._id === product._id ? { ...exist, qty: exist.qty + 1 } : x
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, qty: 1 }]);
    }
    toast.success(`Added "${product.name}" to cart!`, {
      description: `$${product.price.toFixed(2)} - Category: ${product.category}`
    });
    setShowCart(true);
  };

  const removeFromCart = (id: string) => {
    const removedItem = cartItems.find((x) => x._id === id);
    setCartItems(cartItems.filter((x) => x._id !== id));
    if (removedItem) {
      toast.info(`Removed "${removedItem.name}" from your cart.`);
    }
  };

  const updateCartQty = (id: string, qty: number) => {
    setCartItems(cartItems.map((x) => (x._id === id ? { ...x, qty } : x)));
  };

  // Wishlist controls
  const toggleWishlist = (product: Product) => {
    const exists = wishlistItems.some(x => x._id === product._id);
    if (exists) {
      setWishlistItems(wishlistItems.filter(x => x._id !== product._id));
      toast.info(`Removed "${product.name}" from wishlist.`);
    } else {
      setWishlistItems([...wishlistItems, product]);
      toast.success(`Saved "${product.name}" to wishlist!`);
    }
  };

  const moveWishlistToCart = (product: Product) => {
    addToCart(product);
    setWishlistItems(wishlistItems.filter(x => x._id !== product._id));
    toast.success(`Added "${product.name}" from wishlist to your shopping cart!`);
  };

  const handleCheckout = () => {
    if (!user) {
      setShowAuth(true);
      setShowCart(false);
      return;
    }
    setShowCart(false);
    setShowCheckout(true);
  };

  const handleCheckoutSuccess = () => {
    toast.success("Checkout order complete! Delivery is being arranged.", {
      description: "Thank you for shopping on SmartCart. Track details below."
    });
    setCartItems([]);
    setShowCheckout(false);
    setCurrentView("orders");
  };

  const seedData = async () => {
    toast.loading("Refleshing standard product categories...");
    await fetch("/api/seed", { method: "POST" });
    fetchProducts();
    toast.dismiss();
    toast.success("Database successfully initialized with premium computers!");
  };

  const handleLoginSuccess = (userInfo: UserInfo) => {
    setUser(userInfo);
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
    setShowAuth(false);
    toast.success(`Welcome back, ${userInfo.name}! Login authorized.`);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("userInfo");
    setCurrentView("shop");
    toast.info("Logged out. Credentials cleared successfully.");
  };

  // Clear all filters easily
  const resetFilters = () => {
    setMinPrice(0);
    setMaxPrice(2000);
    setMinRating(0);
    setOnlyInStock(false);
    setSelectedCategory("All");
    setSelectedSort("default");
    setSearchQuery("");
    toast.info("Filter configurations reset.");
  };

  const hasActiveFilters = minPrice > 0 || maxPrice < 2000 || minRating > 0 || onlyInStock || selectedCategory !== "All" || searchQuery.trim().length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-zinc-100/70 to-slate-100 text-slate-800 dark:from-zinc-950 dark:via-zinc-900/95 dark:to-zinc-950 dark:text-zinc-100 transition-all duration-300 relative overflow-x-hidden" id="app-root-container">
      {/* Decorative premium floating subtle background glow circles to cover empty areas */}
      <div className="absolute top-[15%] left-[-10%] w-[550px] h-[550px] rounded-full bg-indigo-500/5 dark:bg-indigo-505/2 dark:bg-indigo-500/2 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-[55%] right-[-10%] w-[600px] h-[600px] rounded-full bg-emerald-500/4 dark:bg-emerald-530/2 dark:bg-emerald-500/2 blur-[130px] pointer-events-none -z-10" />
      <Navbar 
        user={user} 
        onAuthClick={() => setShowAuth(true)} 
        onLogout={handleLogout} 
        cartCount={cartItems.reduce((acc, i) => acc + i.qty, 0)}
        onCartClick={() => setShowCart(true)}
        wishlistCount={wishlistItems.length}
        onWishlistClick={() => setShowWishlist(true)}
        theme={theme === "dark" ? "dark" : "light"}
        onToggleTheme={handleToggleTheme}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        currentView={currentView}
        onViewChange={(view) => {
          if ((view === "orders" || view === "profile") && !user) {
            setShowAuth(true);
          } else {
            setCurrentView(view);
          }
        }}
      />
      
      {showAuth && (
        <AuthDialog 
          onSuccess={handleLoginSuccess} 
          onClose={() => setShowAuth(false)} 
        />
      )}

      <CartSheet 
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        items={cartItems}
        onRemove={removeFromCart}
        onUpdateQty={updateCartQty}
        onCheckout={handleCheckout}
        isLoggedIn={!!user}
      />

      <WishlistSheet
        isOpen={showWishlist}
        onClose={() => setShowWishlist(false)}
        items={wishlistItems}
        onRemove={(id) => {
          setWishlistItems(wishlistItems.filter(x => x._id !== id));
          toast.info("Item removed from your wishlist.");
        }}
        onMoveToCart={moveWishlistToCart}
      />

      {showCheckout && (
        <CheckoutDialog 
          isOpen={showCheckout}
          onClose={() => setShowCheckout(false)}
          cartItems={cartItems}
          user={user}
          onOrderSuccess={handleCheckoutSuccess}
          onUnauthenticated={handleLogout}
        />
      )}

      {selectedDetailProduct && (
        <ProductDetailDialog
          product={selectedDetailProduct}
          userToken={user?.token}
          isLoggedIn={!!user}
          isOpen={!!selectedDetailProduct}
          onClose={() => setSelectedDetailProduct(null)}
          onAddToCart={addToCart}
          onReviewSubmitted={fetchProducts}
          showToastSuccess={(msg) => toast.success(msg)}
          showToastError={(msg) => toast.error(msg)}
        />
      )}
      
      <main className="container mx-auto px-4 sm:px-6 py-10">
        {currentView === "orders" && user ? (
          <OrderHistory 
            token={user.token} 
            onBackToShop={() => setCurrentView("shop")} 
            onUnauthenticated={handleLogout}
          />
        ) : currentView === "profile" && user ? (
          <UserProfile
            user={user}
            onProfileUpdate={(updated) => {
              setUser(updated);
              localStorage.setItem("userInfo", JSON.stringify(updated));
            }}
            onBackToShop={() => setCurrentView("shop")}
            onUnauthenticated={handleLogout}
            showToastSuccess={(msg) => toast.success(msg)}
            showToastError={(msg) => toast.error(msg)}
          />
        ) : (
          <>
            {/* Custom Modern E-Commerce Hero Banner Section with glowing mesh grids and floating actions */}
            <motion.header 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative mb-14 rounded-3xl overflow-hidden bg-zinc-950 border border-zinc-900 text-white p-8 sm:p-14 shadow-2xl"
              id="hero-banner-header"
            >
              {/* Absolutes for futuristic glow accents */}
              <div className="absolute right-0 top-0 w-96 h-96 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/0 blur-3xl pointer-events-none" />
              <div className="absolute left-1/4 bottom-0 w-80 h-80 rounded-full bg-gradient-to-tr from-indigo-500/20 to-purple-500/0 blur-3xl pointer-events-none" />
              
              {/* Elegant Geometric grid pattern overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:30px_30px] opacity-70 pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-zinc-950 to-transparent opacity-60 pointer-events-none" />

              <div className="relative z-10 max-w-2xl space-y-5">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-xs font-bold text-emerald-400 uppercase tracking-widest">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: "12s" }} />
                  <span>Curated Fine Goods</span>
                </span>
                
                <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none bg-gradient-to-r from-white via-indigo-100 to-teal-100">
                  Elevate Your <br />
                  <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">Daily Curations.</span>
                </h1>
                
                <p className="text-sm sm:text-base text-zinc-400 font-normal leading-relaxed max-w-xl">
                  Discover risk-free shopping with our modern curations of master-crafted timepieces, pro computing laptops, intelligent wearables, and verified items.
                </p>
                
                {/* Visual Highlights Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
                  <div className="flex items-center gap-2.5 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] rounded-2xl p-3 transition-all duration-300">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                      <Truck className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-white">Free Express</p>
                      <p className="text-[10px] text-zinc-500">Orders over $100</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] rounded-2xl p-3 transition-all duration-300">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-white">100% Original</p>
                      <p className="text-[10px] text-zinc-500">Genuine products</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] rounded-2xl p-3 transition-all duration-300">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
                      <Undo className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-white">Easy Returns</p>
                      <p className="text-[10px] text-zinc-500">30-day guarantee</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Seed Button aligned inside Hero with better premium look */}
              {(!loading && (products.length === 0 || products.some(p => p._id.startsWith('fb')))) && (
                <div className="absolute top-6 right-6 sm:top-12 sm:right-12 z-20">
                  <Button 
                    onClick={seedData} 
                    className="border border-indigo-500/30 bg-indigo-950/20 hover:bg-indigo-900/50 hover:border-indigo-500/60 text-indigo-300 font-semibold text-xs px-4.5 py-2.5 rounded-xl cursor-pointer transition-all duration-300"
                  >
                    Reseed Sample Products
                  </Button>
                </div>
              )}
            </motion.header>

            {/* Interactive Filter and Sort Controllers */}
            <div className="flex flex-col gap-6 mb-10">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b pb-4 border-slate-200/65 dark:border-zinc-800/80 gap-4">
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-slate-800 dark:text-zinc-100 flex items-center gap-2.5">
                    <span className="w-3 h-7 bg-indigo-600 dark:bg-emerald-500 rounded-full inline-block shadow-lg shadow-indigo-650/30 dark:shadow-emerald-500/30 animate-pulse" />
                    Curated Master Catalog
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1.5 font-medium">Discover premium-grade mechanical watches, mobile devices, custom gear, and accessories.</p>
                </div>
                
                <div className="flex items-center gap-3 text-xs flex-wrap" id="sorting-row">
                  {/* Toggle Advanced Filters Button */}
                  <Button
                    variant={showAdvancedFilters ? "default" : "outline"}
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    className={`h-9.5 px-3.5 rounded-2xl flex items-center gap-1.5 text-xs font-bold cursor-pointer transition-all duration-200 ${
                      showAdvancedFilters 
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white border-transparent shadow-md shadow-indigo-500/10" 
                        : "bg-white/80 dark:bg-zinc-900/80 border-slate-200 dark:border-zinc-800 text-foreground"
                    }`}
                  >
                    <Filter className="w-3.5 h-3.5" />
                    <span>{showAdvancedFilters ? "Hide Filters" : "Advanced Filters"}</span>
                  </Button>

                  <div className="relative flex items-center gap-2.5 bg-white/70 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 rounded-2xl px-3.5 py-2 hover:border-slate-350 dark:hover:border-zinc-700 shadow-sm transition-all duration-200">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-500 dark:text-emerald-500" />
                    <span className="text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-wider text-[10px]">Sort:</span>
                    <select 
                      value={selectedSort}
                      onChange={(e) => setSelectedSort(e.target.value as any)}
                      className="bg-transparent text-slate-700 dark:text-zinc-100 font-extrabold focus:outline-none cursor-pointer pr-1 text-xs"
                      id="sort-select"
                    >
                      <option value="default">⚡ Featured/Default</option>
                      <option value="price-asc">💲 Price: Low to High</option>
                      <option value="price-desc">📈 Price: High to Low</option>
                      <option value="rating">⭐ Rating: High to Low</option>
                      <option value="reviews">🔥 Popularity: Most Reviewed</option>
                    </select>
                  </div>
                  
                  <span className="text-xs text-slate-500 dark:text-zinc-400 font-extrabold bg-white/70 dark:bg-zinc-900/80 px-3.5 py-2 rounded-2xl border border-slate-250 dark:border-zinc-800/80 shadow-sm">
                    {sortedProducts.length} results
                  </span>
                </div>
              </div>

              {/* Expandable Advanced Filters Grid Panel */}
              {showAdvancedFilters && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 rounded-2xl bg-white/80 dark:bg-zinc-900/40 border border-slate-200/80 dark:border-zinc-800/70 shadow-sm animate-in slide-in-from-top-3 duration-200">
                  
                  {/* Price Range */}
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 dark:text-zinc-505 block">Price (Up to ${maxPrice})</label>
                    <div className="space-y-1 mt-1.5">
                      <input 
                        type="range" 
                        min="0" 
                        max="2000" 
                        step="25"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                        className="w-full accent-indigo-600 dark:accent-emerald-500 h-1.5 bg-slate-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-[11px] font-mono text-slate-400 dark:text-zinc-500">
                        <span>$0</span>
                        <span>$2,000</span>
                      </div>
                    </div>
                  </div>

                  {/* Rating Selector */}
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 dark:text-zinc-505 block">Minimum Rating</label>
                    <select
                      value={minRating}
                      onChange={(e) => setMinRating(Number(e.target.value))}
                      className="w-full h-9.5 mt-1 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-foreground text-xs px-3 font-bold focus:outline-none"
                    >
                      <option value="0">⭐ All Rating Scores</option>
                      <option value="4">⭐ 4.0 Stars & Up</option>
                      <option value="4.5">⭐⭐ 4.5 Stars & Up</option>
                      <option value="4.7">⭐⭐⭐ 4.7 Stars & Up</option>
                    </select>
                  </div>

                  {/* Inventory stock */}
                  <div className="space-y-2 flex flex-col justify-center">
                    <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-foreground">
                      <input
                        type="checkbox"
                        checked={onlyInStock}
                        onChange={(e) => setOnlyInStock(e.target.checked)}
                        className="h-4.5 w-4.5 rounded text-indigo-605 border-slate-200 dark:border-zinc-800 accent-indigo-600 dark:accent-emerald-500"
                      />
                      <span>In Stock Items Only</span>
                    </label>
                    <p className="text-[10px] text-slate-400 dark:text-zinc-500 mt-1 pl-7">Hide temporarily unavailable listings</p>
                  </div>

                  {/* Clean up action Column */}
                  <div className="flex items-end justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetFilters}
                      disabled={!hasActiveFilters}
                      className="text-xs h-9.5 font-bold rounded-xl w-full sm:w-auto"
                    >
                      Reset Filter Configurations
                    </Button>
                  </div>
                </div>
              )}

              {/* Active Filter Tags */}
              {hasActiveFilters && (
                <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-zinc-400 mt-1.5">
                  <span className="font-semibold text-[10px] uppercase tracking-wider text-slate-400 dark:text-zinc-500 mr-1.5">Active parameters:</span>
                  
                  {searchQuery && (
                    <span className="inline-flex items-center gap-1 bg-white dark:bg-zinc-900 px-2.5 py-1 rounded-xl border border-slate-200 dark:border-zinc-800 font-bold shadow-xs">
                      Query: "{searchQuery}"
                    </span>
                  )}
                  {selectedCategory !== "All" && (
                    <span className="inline-flex items-center gap-1 bg-white dark:bg-zinc-900 px-2.5 py-1 rounded-xl border border-slate-200 dark:border-zinc-800 font-bold shadow-xs">
                      Category: {selectedCategory}
                    </span>
                  )}
                  {(minPrice > 0 || maxPrice < 2000) && (
                    <span className="inline-flex items-center gap-1 bg-white dark:bg-zinc-900 px-2.5 py-1 rounded-xl border border-slate-200 dark:border-zinc-800 font-bold shadow-xs">
                      Price: ${minPrice} - ${maxPrice}
                    </span>
                  )}
                  {minRating > 0 && (
                    <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2.5 py-1 rounded-xl border border-amber-500/20 font-bold shadow-xs">
                      Rating: {minRating}★+
                    </span>
                  )}
                  {onlyInStock && (
                    <span className="inline-flex items-center gap-1 bg-indigo-500/10 text-indigo-750 dark:text-indigo-400 px-2.5 py-1 rounded-xl border border-indigo-500/20 font-bold shadow-xs">
                      In-Stock Only
                    </span>
                  )}

                  <button 
                    onClick={resetFilters}
                    className="text-indigo-600 hover:text-indigo-700 dark:text-emerald-400 dark:hover:text-emerald-300 font-extrabold hover:underline text-[11px] ml-2 cursor-pointer transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}

              {/* Category Scroller Section with spring style hover */}
              <div className="flex flex-wrap items-center gap-2.5" id="category-scroller">
                {[
                  { id: "All", label: "💎 All Collections" },
                  { id: "Watch", label: "⌚ Classic Watches" },
                  { id: "Mobile", label: "📱 Smart Mobiles" },
                  { id: "Computer", label: "💻 Pro Computers" },
                  { id: "Shoes", label: "👟 Fine Footwear" },
                  { id: "Electronics", label: "🔌 Tech Gadgets" },
                  { id: "Fashion", label: "👕 Designer Apparel" },
                  { id: "Accessories", label: "👜 Luxe Accessories" }
                ].map((cat) => {
                  const isActive = selectedCategory.toLowerCase() === cat.id.toLowerCase();
                  return (
                    <motion.button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      className={`px-4.5 py-2.5 text-xs font-bold rounded-2xl border transition-all duration-250 cursor-pointer ${
                        isActive
                          ? "bg-gradient-to-r from-indigo-600 to-teal-500 text-white border-transparent shadow-lg shadow-indigo-650/20 scale-[1.02]"
                          : "bg-white/90 dark:bg-zinc-900/90 text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-100 hover:bg-white dark:hover:bg-zinc-850 hover:border-slate-300 dark:hover:border-zinc-700 border-slate-200/80 dark:border-zinc-800/80 shadow-sm"
                      }`}
                      id={`category-pill-${cat.id.toLowerCase()}`}
                    >
                      {cat.label}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col justify-center items-center h-80 gap-3">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500" />
                <span className="text-sm text-muted-foreground italic">Retrieving product catalog...</span>
              </div>
            ) : error ? (
              <div className="flex flex-col justify-center items-center h-80 text-red-500 gap-4 bg-red-50/10 rounded-2xl border border-red-500/20">
                <p className="font-semibold text-sm">Catalog loading error: {error}</p>
                <Button onClick={fetchProducts} className="bg-destructive hover:bg-destructive/90 text-white rounded-xl cursor-pointer">Retry Load</Button>
              </div>
            ) : (
              <>
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {sortedProducts.length === 0 ? (
                    <div className="col-span-full text-center py-20 bg-white/45 dark:bg-zinc-900/25 rounded-3xl border border-dashed border-slate-250 dark:border-zinc-800/80 text-slate-500 dark:text-zinc-400 flex flex-col items-center justify-center gap-3 shadow-xs">
                      <p className="font-medium">No products found matching active parameters.</p>
                      <Button variant="outline" size="sm" onClick={resetFilters} className="rounded-xl mt-1 text-xs cursor-pointer">Reset Filters Settings</Button>
                    </div>
                  ) : (
                    sortedProducts.map((product) => {
                      const ratingValue = product.rating || 4.5;
                      const reviewsCount = product.numReviews || 0;
                      const isWishlisted = wishlistItems.some(x => x._id === product._id);
                      return (
                        <motion.div 
                          key={product._id} 
                          whileHover={{ y: -6, scale: 1.015 }}
                          transition={{ type: "spring", stiffness: 350, damping: 25 }}
                          className="group relative flex flex-col h-full rounded-3xl border border-slate-200/80 dark:border-zinc-800/80 bg-gradient-to-b from-white to-slate-50/60 dark:from-zinc-900 dark:to-zinc-950/80 text-card-foreground shadow-xs hover:shadow-[0_20px_45px_-12px_rgba(79,70,229,0.12)] dark:hover:shadow-[0_20px_45px_-12px_rgba(16,185,129,0.15)] hover:border-indigo-500/40 dark:hover:border-emerald-500/40 transition-all duration-300 overflow-hidden"
                          id={`product-${product._id}`}
                        >
                          {/* Image Frame with category tag */}
                          <div 
                            className="aspect-square relative overflow-hidden bg-slate-100/50 dark:bg-zinc-950/60 cursor-pointer"
                            onClick={() => setSelectedDetailProduct(product)}
                          >
                            <ProductImage 
                              src={product.image} 
                              alt={product.name} 
                              category={product.category}
                              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                            />
                            
                            {product.category && (
                              <span className={`absolute left-3.5 top-3.5 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider bg-gradient-to-r ${getCategoryBadgeStyles(product.category)} rounded-full shadow-md z-10 scale-95 group-hover:scale-100 transition-all duration-305`}>
                                {product.category}
                              </span>
                            )}

                            {/* Wishlist Heart absolute overlays */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleWishlist(product);
                              }}
                              className={`absolute right-3.5 top-3.5 p-2 rounded-2xl border transition-all duration-300 cursor-pointer z-10 ${
                                isWishlisted
                                  ? "bg-pink-50/95 dark:bg-pink-950/90 border-pink-200/50 text-pink-500 shadow-md scale-105"
                                  : "bg-white/90 dark:bg-zinc-900/90 border-slate-200/50 dark:border-zinc-800/50 text-slate-400 dark:text-zinc-400 hover:text-pink-500 hover:scale-105 shadow-xs"
                              }`}
                              title="Toggle Wishlist"
                            >
                              <Heart 
                                className={`w-4 h-4 transition-all duration-300 ${
                                  isWishlisted ? "fill-pink-500 text-pink-500" : "text-current"
                                }`}
                              />
                            </button>
                          </div>

                          {/* Card Contents */}
                          <div className="p-5 flex flex-col flex-1 justify-between min-h-[170px]">
                            <div className="cursor-pointer" onClick={() => setSelectedDetailProduct(product)}>
                              <h3 className="font-bold text-[15px] sm:text-base text-slate-850 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1 mb-1.5" title={product.name}>
                                {product.name}
                              </h3>
                              {product.description && (
                                <p className="text-xs text-slate-500 dark:text-zinc-400 line-clamp-2 mb-3 leading-relaxed font-semibold">
                                  {product.description}
                                </p>
                              )}
                            </div>

                            <div className="space-y-4">
                              {/* Star Rating calculations inside elegant tag wrapper */}
                              <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => setSelectedDetailProduct(product)}>
                                <div className="flex items-center gap-1 bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/15 px-2 py-0.5 rounded-lg">
                                  <Star className="w-3 text-amber-500 fill-amber-500" />
                                  <span className="text-[11px] text-amber-700 dark:text-amber-400 font-extrabold font-mono leading-none">
                                    {ratingValue.toFixed(1)}
                                  </span>
                                </div>
                                <span className="text-xs text-slate-400 dark:text-zinc-500 font-extrabold">
                                  ({reviewsCount} {reviewsCount === 1 ? "review" : "reviews"})
                                </span>
                              </div>

                              {/* Price & Action Row */}
                              <div className="flex items-center justify-between pt-3 border-t border-slate-150/80 dark:border-zinc-800/80">
                                <div className="flex flex-col cursor-pointer" onClick={() => setSelectedDetailProduct(product)}>
                                  <span className="text-[9px] uppercase tracking-wider text-slate-400 dark:text-zinc-500 font-extrabold font-sans">Price</span>
                                  <span className="text-lg font-black font-mono text-slate-800 dark:text-zinc-50 tracking-tight">${product.price.toFixed(2)}</span>
                                </div>
                                
                                <Button 
                                  size="sm" 
                                  onClick={() => addToCart(product)}
                                  className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-650 hover:shadow-lg hover:shadow-indigo-500/10 active:scale-95 text-white font-bold rounded-xl px-4 py-2 transition-all duration-200 flex items-center gap-1.5 text-xs h-9 cursor-pointer border-transparent"
                                >
                                  <ShoppingCart className="w-3.5 h-3.5" />
                                  <span>Buy</span>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </section>

                {/* Dynamic Related Recommendations Section */}
                {relatedProducts.length > 0 && (
                  <section className="mt-16 bg-slate-100/50 dark:bg-zinc-900/20 border border-slate-200/60 dark:border-zinc-800/80 rounded-3xl p-6 sm:p-8" id="related-recommendations-sec">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-lg font-extrabold tracking-tight text-slate-800 dark:text-zinc-100 flex items-center gap-2">
                          <span className="w-2.5 h-5 bg-indigo-600 dark:bg-teal-500 rounded-full inline-block animate-pulse" />
                          {searchQuery.trim().length > 0 ? "Related Suggestions based on Search" : "Premium Recommendations for You"}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 font-sans">Dynamic matches curated based on your choices</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {relatedProducts.map((product) => {
                        const isWishlisted = wishlistItems.some(x => x._id === product._id);
                        return (
                          <motion.div 
                            key={`rel-${product._id}`}
                            whileHover={{ y: -3, scale: 1.01 }}
                            className="group flex flex-col justify-between bg-white dark:bg-zinc-900/60 hover:bg-white dark:hover:bg-zinc-800/40 border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-305 relative"
                          >
                            {/* Inner wishlist toggle button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleWishlist(product);
                              }}
                              className={`absolute right-4 top-4 p-1.5 rounded-lg border transition-all duration-300 cursor-pointer z-10 ${
                                isWishlisted
                                  ? "bg-pink-50/90 dark:bg-pink-950/90 border-pink-200/50 text-pink-500 shadow-sm"
                                  : "bg-black/60 hover:bg-black/85 text-white border-transparent hover:scale-105"
                              }`}
                              title="Toggle Wishlist"
                            >
                              <Heart 
                                className={`w-3.5 h-3.5 ${
                                  isWishlisted ? "fill-pink-500 text-pink-500" : "text-current"
                                }`}
                              />
                            </button>

                            <div className="flex gap-3 cursor-pointer" onClick={() => setSelectedDetailProduct(product)}>
                              <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 dark:bg-zinc-950/40 flex-shrink-0 border border-slate-200/80 dark:border-zinc-800/60">
                                <ProductImage 
                                  src={product.image} 
                                  alt={product.name} 
                                  category={product.category}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className={`text-[9px] uppercase font-bold tracking-wider bg-gradient-to-r ${getCategoryBadgeStyles(product.category)} px-2 py-0.5 rounded-md inline-block mb-1`}>{product.category}</span>
                                <h4 className="font-bold text-xs text-slate-800 dark:text-zinc-100 truncate group-hover:text-indigo-600 dark:group-hover:text-emerald-400 transition-colors" title={product.name}>{product.name}</h4>
                                <div className="flex items-center gap-1 mt-1">
                                  <Star className="w-2.5 h-2.5 fill-current text-amber-500" />
                                  <span className="text-[10px] text-slate-400 dark:text-zinc-400 font-extrabold">{(product.rating || 4.5).toFixed(1)}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100/50 dark:border-zinc-800/30">
                              <span className="font-mono text-xs font-extrabold text-slate-800 dark:text-zinc-100 cursor-pointer" onClick={() => setSelectedDetailProduct(product)}>${product.price.toFixed(2)}</span>
                              <Button 
                                size="xs" 
                                onClick={() => addToCart(product)}
                                className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 hover:shadow-md text-white font-bold px-3 py-1.5 h-7 rounded-lg transition-all cursor-pointer border-transparent"
                              >
                                + Buy
                              </Button>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </section>
                )}
              </>
            )}
          </>
        )}
      </main>
      
      {/* Toast Portal Container */}
      <Toaster position="bottom-right" richColors closeButton />
    </div>
  );
}
