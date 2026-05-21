import React, { useState, useEffect } from "react";
import { User, Mail, Shield, Save, KeyRound, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserInfo {
  _id: string;
  name: string;
  email: string;
  token: string;
  isAdmin?: boolean;
}

interface UserProfileProps {
  user: UserInfo;
  onProfileUpdate: (updatedUser: UserInfo) => void;
  onBackToShop: () => void;
  onUnauthenticated?: () => void;
  showToastSuccess?: (msg: string) => void;
  showToastError?: (msg: string) => void;
}

export function UserProfile({ 
  user, 
  onProfileUpdate, 
  onBackToShop, 
  onUnauthenticated,
  showToastSuccess,
  showToastError
}: UserProfileProps) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Re-sync forms if user entity changes
  useEffect(() => {
    setName(user.name);
    setEmail(user.email);
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Form Validations
    if (!name.trim()) {
      setErrorMessage("Full Name is required.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    if (password && password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          name,
          email,
          ...(password ? { password } : {}),
        }),
      });

      const data = await response.json();

      if (response.status === 401) {
        if (onUnauthenticated) {
          onUnauthenticated();
          return;
        }
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile settings");
      }

      // Success fully updated profile
      const updatedUserInfo: UserInfo = {
        ...user,
        name: data.name,
        email: data.email,
        ...(data.token ? { token: data.token } : {}),
      };

      onProfileUpdate(updatedUserInfo);
      setSuccessMessage("Your profile information has been securely updated!");
      setPassword("");
      setConfirmPassword("");
      if (showToastSuccess) {
        showToastSuccess("Profile updated successfully!");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Something went wrong while saving changes.");
      if (showToastError) {
        showToastError(err.message || "Profile update failed.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-5">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <span className="w-3 h-6 bg-emerald-500 rounded-full inline-block" />
            Acccount Profile
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 font-medium font-sans">
            Manage your personal credentials, email synchronization, and security.
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Left Column: Visual User Profile Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="border border-border/60 bg-card rounded-2xl p-6 text-center space-y-4 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500" />
            
            <div className="mx-auto h-20 w-20 rounded-full bg-indigo-50 dark:bg-zinc-800 flex items-center justify-center text-indigo-700 dark:text-emerald-400 font-extrabold text-2xl border-2 border-indigo-200 dark:border-emerald-500/20 shadow-inner">
              {user.name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase()}
            </div>
            
            <div className="space-y-1">
              <h3 className="font-extrabold text-lg text-foreground truncate">{user.name}</h3>
              <p className="text-xs text-muted-foreground font-mono truncate">{user.email}</p>
            </div>

            <div className="pt-2 border-t border-border/40 space-y-2 text-left">
              <div className="flex items-center gap-2.5 text-xs text-muted-foreground bg-muted/30 px-3 py-2 rounded-xl border border-border/40">
                <Shield className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                <div className="min-w-0">
                  <span className="font-bold block text-foreground">Role Privileges</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 dark:text-emerald-400 font-mono">
                    {user.isAdmin ? "⭐ Platform Admin" : "Standard Client Account"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-xs text-muted-foreground bg-muted/30 px-3 py-2 rounded-xl border border-border/40">
                <CheckCircle2 className="h-4 w-4 text-indigo-500 flex-shrink-0" />
                <div className="min-w-0">
                  <span className="font-bold block text-foreground">Member Status</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-600 dark:text-indigo-400 font-mono">
                    Verified Profile
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Profile Form Details */}
        <div className="lg:col-span-8">
          <div className="border border-border/60 bg-card rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
            <h3 className="text-base font-extrabold text-foreground flex items-center gap-2">
              <User className="h-4 w-4 text-emerald-500" />
              Credentials Information
            </h3>

            {successMessage && (
              <div className="flex items-center gap-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs px-4 py-3 rounded-xl">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                <span className="font-bold">{successMessage}</span>
              </div>
            )}

            {errorMessage && (
              <div className="flex items-center gap-2.5 bg-destructive/10 border border-destructive/20 text-destructive text-xs px-4 py-3 rounded-xl animate-shake">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span className="font-bold">{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Full name input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground block uppercase tracking-wider">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground/75" />
                    <input
                      type="text"
                      className="w-full text-sm rounded-xl border border-input bg-muted/20 px-10 py-2.5 focus:bg-background focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 focus-visible:outline-none transition-all duration-200 text-foreground font-medium"
                      placeholder="Jane Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>

                {/* Email input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground block uppercase tracking-wider">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground/75" />
                    <input
                      type="email"
                      className="w-full text-sm rounded-xl border border-input bg-muted/20 px-10 py-2.5 focus:bg-background focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 focus-visible:outline-none transition-all duration-200 text-foreground font-medium"
                      placeholder="jane@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border/40">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2 mb-4">
                  <KeyRound className="h-4 w-4 text-emerald-500" />
                  Security Update (Leave blank to keep unchanged)
                </h3>

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Password input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground block uppercase tracking-wider">New Password</label>
                    <input
                      type="password"
                      className="w-full text-sm rounded-xl border border-input bg-muted/20 px-4 py-2.5 focus:bg-background focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 focus-visible:outline-none transition-all duration-200 text-foreground font-mono"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  {/* Confirm Password input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground block uppercase tracking-wider">Confirm New Password</label>
                    <input
                      type="password"
                      className="w-full text-sm rounded-xl border border-input bg-muted/20 px-4 py-2.5 focus:bg-background focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 focus-visible:outline-none transition-all duration-200 text-foreground font-mono"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold h-10 px-6 rounded-xl text-xs flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
                >
                  <Save className="h-4 w-4" />
                  <span>{isSubmitting ? "Saving Changes..." : "Save Profile Details"}</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
