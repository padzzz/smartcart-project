import { ShoppingCart, User, Search, Menu, LogOut, ClipboardList, Sparkles, Heart, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserInfo {
  name: string;
  email: string;
}

interface NavbarProps {
  user: UserInfo | null;
  onAuthClick: () => void;
  onLogout: () => void;
  cartCount: number;
  onCartClick: () => void;
  wishlistCount: number;
  onWishlistClick: () => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  currentView: "shop" | "orders" | "profile";
  onViewChange: (view: "shop" | "orders" | "profile") => void;
}

export function Navbar({ 
  user, 
  onAuthClick, 
  onLogout, 
  cartCount, 
  onCartClick,
  wishlistCount,
  onWishlistClick,
  theme,
  onToggleTheme,
  searchQuery,
  onSearchChange,
  currentView,
  onViewChange
}: NavbarProps) {
  // Get initials for user profile circle avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 h-auto py-2 sm:py-0" id="main-nav">
      <div className="container flex flex-col md:flex-row md:h-16 items-center justify-between px-4 sm:px-6 mx-auto gap-3 md:gap-0">
        
        {/* Brand & Mobile Actions */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <button 
            onClick={() => onViewChange("shop")} 
            className="flex items-center gap-2 group cursor-pointer focus:outline-none"
            id="nav-logo-btn"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-emerald-200 dark:shadow-none shadow-md transition-all group-hover:scale-105 duration-300">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 bg-clip-text text-transparent dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400 transition-all">
              SmartCart
            </span>
          </button>

          {/* Quick theme toggler for mobile screen sizes */}
          <div className="flex items-center gap-2 md:hidden">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-lg"
              onClick={onToggleTheme}
              title="Toggle Theme"
            >
              {theme === "dark" ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-indigo-600" />}
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="relative h-8 w-8 rounded-lg"
              onClick={onWishlistClick}
              title="Wishlist"
            >
              <Heart className="h-4 w-4 text-pink-500 fill-pink-500/10" />
              {wishlistCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-pink-500 text-[9px] text-white font-extrabold shadow-sm">
                  {wishlistCount}
                </span>
              )}
            </Button>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="w-full md:flex-1 md:flex items-center justify-center px-0 md:px-12">
          <div className="relative w-full max-w-md group">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-emerald-500 transition-colors" />
            <input
              type="search"
              placeholder="Query brand, fashion, watch..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full rounded-xl border border-input bg-muted/20 px-10 py-2.5 md:py-2 text-sm focus:outline-none focus:border-emerald-500 focus:bg-background focus:ring-2 focus:ring-emerald-500/10 transition-all duration-200 text-foreground"
              id="global-search-input"
            />
          </div>
        </div>

        {/* User Profile & Cart Buttons */}
        <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-3 mt-1 md:mt-0">
          
          {/* Leftside action button row */}
          <div className="flex items-center gap-2.5">
            {/* Theme status toggle button */}
            <Button 
              variant="outline" 
              size="icon" 
              onClick={onToggleTheme} 
              className="hidden md:inline-flex h-9 w-9 rounded-xl border-border/80 hover:bg-muted/70 transition-all"
              title="Toggle Theme Mode"
              id="theme-toggler-btn"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 text-amber-500 animate-spin" style={{ animationDuration: '60s' }} />
              ) : (
                <Moon className="h-4 w-4 text-indigo-600" />
              )}
            </Button>

            {/* Wishlist Heart Indicator */}
            <Button 
              variant="outline" 
              size="icon" 
              onClick={onWishlistClick} 
              className="hidden md:inline-flex relative h-9 w-9 rounded-xl border-border/80 hover:bg-muted/70 transition-all"
              title="View Wishlist"
              id="wishlist-trigger-btn"
            >
              <Heart className="h-4 w-4 text-pink-500 fill-pink-500/10" />
              {wishlistCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-pink-500 text-[10px] text-white font-extrabold shadow-md animate-in zoom-in">
                  {wishlistCount}
                </span>
              )}
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-2">
                {/* My Orders navigation */}
                <Button 
                  variant={currentView === "orders" ? "default" : "outline"} 
                  size="sm" 
                  onClick={() => onViewChange(currentView === "orders" ? "shop" : "orders")}
                  className={`h-9 text-xs font-semibold px-3 flex gap-1 items-center rounded-xl transition-all duration-200 ${
                    currentView === "orders"
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md shadow-emerald-500/10 border-transparent"
                      : "border-border hover:bg-muted/80 text-foreground"
                  }`}
                  id="my-orders-toggle-btn"
                >
                  <ClipboardList className="h-3.5 w-3.5" />
                  <span className="inline sm:inline">Orders</span>
                </Button>

                {/* User Clickable Avatar details (opens User Profile screen) */}
                <button 
                  onClick={() => onViewChange("profile")}
                  className={`flex items-center gap-2 pl-1.5 pr-2 py-1 rounded-xl border hover:bg-muted/40 transition-all ${
                    currentView === "profile" 
                      ? "border-emerald-500 bg-emerald-500/5 dark:bg-emerald-500/10" 
                      : "border-transparent"
                  }`}
                  title="View Profile Settings"
                  id="user-profile-navigation-btn"
                >
                  <div className="flex h-7.5 w-7.5 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-zinc-800 dark:to-zinc-700 text-indigo-700 dark:text-emerald-400 font-bold text-xs shadow-inner">
                    {getInitials(user.name)}
                  </div>
                  <div className="hidden sm:flex flex-col text-left max-w-[80px]">
                    <span className="text-[11px] font-bold leading-none truncate max-w-[75px] text-foreground">{user.name}</span>
                    <span className="text-[9px] text-muted-foreground leading-none font-mono truncate max-w-[75px] mt-0.5">{user.email}</span>
                  </div>
                </button>

                {/* Logout Button */}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={onLogout} 
                  className="h-9 w-9 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/20 text-muted-foreground hover:text-red-500 transition-all"
                  title="Sign Out"
                  id="sign-out-btn"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button 
                onClick={onAuthClick} 
                className="h-9 bg-gradient-to-r from-indigo-600 to-teal-600 hover:from-indigo-700 hover:to-teal-700 text-white font-semibold text-xs px-3.5 rounded-xl shadow-md transition-all duration-200 flex gap-1.5 items-center border-transparent"
                id="sign-in-dialog-btn"
              >
                <User className="h-3.5 w-3.5" />
                <span>Sign In</span>
              </Button>
            )}

            {/* Cart overview sheet trigger */}
            <Button 
              variant="outline" 
              size="icon" 
              className="relative h-9 w-9 rounded-xl border-border/80 hover:bg-muted/70 transition-all" 
              onClick={onCartClick} 
              title="Cart Overview"
              id="cart-trigger-btn"
            >
              <ShoppingCart className="h-4 w-4 text-foreground/80" />
              {cartCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] text-white font-extrabold animate-bounce shadow-md">
                  {cartCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
