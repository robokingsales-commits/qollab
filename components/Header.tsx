"use client";

import { useState, useEffect } from "react";
import { ShoppingBag, Bell, User, Building2 } from "lucide-react";
import { getCart, subscribeCart } from "@/lib/services/cart-service";
import CartDrawer from "@/components/CartDrawer";

interface HeaderProps {
  mode: "consumer" | "biz";
  onModeChange: (mode: "consumer" | "biz") => void;
}

export default function Header({ mode, onModeChange }: HeaderProps) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    setCartItemCount(getCart().length);
    const unsubscribe = subscribeCart((cart) => {
      setCartItemCount(cart.length);
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full px-4 py-3 transition-all duration-300 ${
          mode === "biz"
            ? "bg-[#0A0D14]/95 backdrop-blur-md border-b border-slate-800 text-white"
            : "apple-nav-glass border-b border-[rgba(0,0,0,0.08)] text-[#071D49]"
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Logo hidden as requested */}
          <div />

          {/* Action Items: Mode Switcher Pill + Cart + Bell */}
          <div className="flex items-center space-x-2">
            {/* Mode Switcher Toggle Pill */}
            <div
              className={`flex items-center rounded-full p-0.5 border ${
                mode === "biz"
                  ? "bg-slate-900 border-slate-800"
                  : "bg-[#f7f7f8] border-[rgba(0,0,0,0.08)]"
              }`}
            >
              <button
                onClick={() => onModeChange("consumer")}
                className={`flex items-center space-x-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold transition-all cursor-pointer ${
                  mode === "consumer"
                    ? "bg-[#071D49] text-white shadow-xs"
                    : mode === "biz"
                    ? "text-slate-400 hover:text-white"
                    : "text-[#6e6e73] hover:text-[#071D49]"
                }`}
              >
                <User className="h-3 w-3" />
                <span>개인</span>
              </button>
              <button
                onClick={() => onModeChange("biz")}
                className={`flex items-center space-x-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold transition-all cursor-pointer ${
                  mode === "biz"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md ring-1 ring-blue-400/30"
                    : "text-[#6e6e73] hover:text-[#071D49]"
                }`}
              >
                <Building2 className="h-3 w-3" />
                <span>BIZ</span>
              </button>
            </div>

            {/* Cart Drawer Toggle Button (Consumer only or neutral) */}
            {mode === "consumer" && (
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative rounded-full p-1.5 bg-white border border-[rgba(0,0,0,0.08)] text-[#111111] hover:border-black transition-all cursor-pointer"
                title="DIY 콤보 장바구니"
              >
                <ShoppingBag className="h-4 w-4" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#111111] text-[9px] font-bold text-white animate-pulse">
                    {cartItemCount}
                  </span>
                )}
              </button>
            )}

            {/* Notification Bell */}
            <button
              className={`relative rounded-full p-1.5 border transition-all cursor-pointer ${
                mode === "biz"
                  ? "bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-700"
                  : "bg-white border-[rgba(0,0,0,0.08)] text-[#111111] hover:border-black"
              }`}
            >
              <Bell className="h-4 w-4" />
              <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-blue-600 text-[8px] font-bold text-white">
                3
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
