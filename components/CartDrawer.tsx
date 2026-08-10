"use client";

import { useState, useEffect } from "react";
import {
  ShoppingBag,
  X,
  Trash2,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Tag,
  CreditCard,
} from "lucide-react";
import {
  getCart,
  removeFromCart,
  clearCart,
  subscribeCart,
  CartComboItem,
} from "@/lib/services/cart-service";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const [cartItems, setCartItems] = useState<CartComboItem[]>([]);
  const [isCheckoutSuccessOpen, setIsCheckoutSuccessOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<CartComboItem[]>([]);

  useEffect(() => {
    setCartItems(getCart());
    const unsubscribe = subscribeCart((updatedCart) => {
      setCartItems(updatedCart);
    });
    return () => unsubscribe();
  }, []);

  if (!isOpen) return null;

  const totalCartOriginal = cartItems.reduce((acc, c) => acc + c.totalOriginalPrice, 0);
  const totalCartDiscount = cartItems.reduce((acc, c) => acc + c.totalDiscountAmount, 0);
  const totalCartFinal = cartItems.reduce((acc, c) => acc + c.totalFinalPrice, 0);

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    setCompletedOrder([...cartItems]);
    clearCart();
    setIsCheckoutSuccessOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm flex justify-end animate-fadeIn">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden transition-all duration-300">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-indigo-600 rounded-xl text-white">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-black flex items-center gap-2">
                <span>DIY 콤보 장바구니</span>
                <span className="bg-indigo-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                  {cartItems.length}
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                사업자 할인 여력(0% ➔ 60% ➔ 85% ➔ 100%) 반영 콤보
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Dynamic Margin Discount Banner Notice */}
        <div className="bg-indigo-50 border-b border-indigo-100 p-3 px-5 text-indigo-900 text-xs font-extrabold flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center space-x-1.5">
            <Sparkles className="h-4 w-4 text-indigo-600 shrink-0" />
            <span>단계별 할인 여력: 1개(0%) ➔ 2개(60%) ➔ 3개(85%) ➔ 4개+(100%)</span>
          </div>
        </div>

        {/* Cart Item Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {cartItems.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <div className="mx-auto h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                <ShoppingBag className="h-8 w-8" />
              </div>
              <p className="text-sm font-extrabold text-gray-600">
                장바구니가 비어 있습니다.
              </p>
              <p className="text-xs text-gray-400 max-w-xs mx-auto">
                위치기반 DIY 콤보 생성기에서 매장을 결합하고 할인 여력(최대 100%) 혜택을 담아보세요!
              </p>
            </div>
          ) : (
            cartItems.map((combo) => (
              <div
                key={combo.id}
                className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm space-y-3 hover:border-indigo-300 transition"
              >
                {/* Combo Header Info */}
                <div className="flex items-start justify-between pb-2 border-b border-gray-100">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-black text-slate-900">
                        {combo.title}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      📍 {combo.locationName} · {combo.stores.length}개 매장 결합
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromCart(combo.id)}
                    className="text-gray-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition"
                    title="콤보 삭제"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Combo Stage Rate Badge */}
                <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-[11px] font-black">
                  <Tag className="h-3 w-3 text-indigo-600" />
                  <span>{combo.rateLabel}</span>
                </div>

                {/* Stores Item Breakdown */}
                <div className="space-y-2 pt-1">
                  {combo.stores.map((st, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs bg-gray-50 p-2.5 rounded-2xl border border-gray-100"
                    >
                      <div className="min-w-0 flex-1 pr-2">
                        <span className="font-extrabold text-slate-900 truncate block">
                          {st.storeName}
                        </span>
                        <span className="text-[11px] text-indigo-600 font-semibold truncate block">
                          {st.itemName}
                        </span>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-[10px] text-gray-400 line-through">
                          {st.originalPrice.toLocaleString()}원
                        </div>
                        <div className="font-black text-indigo-900">
                          {st.finalPrice.toLocaleString()}원
                          <span className="text-[10px] text-rose-500 ml-1 font-extrabold">
                            (-{st.appliedDiscount.toLocaleString()}원)
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Combo Subtotal Summary */}
                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs font-black">
                  <span className="text-gray-500">
                    정가 {combo.totalOriginalPrice.toLocaleString()}원
                  </span>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-rose-600 text-[11px]">
                      할인여력 -{combo.totalDiscountAmount.toLocaleString()}원
                    </span>
                    <span className="text-base text-indigo-600">
                      {combo.totalFinalPrice.toLocaleString()}원
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Checkout Summary Bar */}
        {cartItems.length > 0 && (
          <div className="p-4 sm:p-5 bg-slate-900 text-white space-y-3.5 border-t border-slate-800 shrink-0">
            <div className="space-y-1.5 text-xs font-bold">
              <div className="flex justify-between text-slate-400">
                <span>총 정가 금액</span>
                <span>{totalCartOriginal.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between text-rose-400 font-black">
                <span>총 사업자 여력 할인 반영액</span>
                <span>-{totalCartDiscount.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between text-base font-black text-white pt-2 border-t border-slate-800">
                <span>최종 결제 예정 금액</span>
                <span className="text-xl text-amber-400">
                  {totalCartFinal.toLocaleString()}원
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={clearCart}
                className="rounded-2xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-3 text-xs font-bold transition shrink-0"
              >
                비우기
              </button>

              <button
                onClick={handleCheckout}
                className="flex-1 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs py-3.5 px-4 shadow-lg transition flex items-center justify-center space-x-2"
              >
                <CreditCard className="h-4 w-4" />
                <span>최종 콤보 주문 / 결제하기 ({totalCartFinal.toLocaleString()}원)</span>
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Order Confirmation Modal */}
      {isCheckoutSuccessOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full text-center space-y-5 shadow-2xl">
            <div className="mx-auto h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 animate-bounce" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-gray-900">
                🎉 결제가 성공적으로 완료되었습니다!
              </h3>
              <p className="text-xs text-gray-500">
                사업자 마진을 철저히 보호하는 Qollab 다단계 콤보 할인이 적용되었습니다.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 text-left space-y-2 text-xs font-bold text-gray-700">
              <div className="flex justify-between border-b border-gray-200 pb-1.5">
                <span>주문 번호</span>
                <span className="text-indigo-600 font-mono">QOL-{Date.now().toString().slice(-8)}</span>
              </div>
              <div className="flex justify-between">
                <span>결제 완료 금액</span>
                <span className="text-indigo-600 font-black">
                  {completedOrder.reduce((acc, c) => acc + c.totalFinalPrice, 0).toLocaleString()}원
                </span>
              </div>
              <div className="flex justify-between text-emerald-600">
                <span>절감된 할인액</span>
                <span>
                  -{completedOrder.reduce((acc, c) => acc + c.totalDiscountAmount, 0).toLocaleString()}원
                </span>
              </div>
            </div>

            <div className="p-3 bg-indigo-50 text-indigo-900 rounded-2xl text-xs font-extrabold flex items-center justify-center space-x-2 border border-indigo-200">
              <ShieldCheck className="h-4 w-4 text-indigo-600 shrink-0" />
              <span>모바일 바우처 바코드가 [마이 패키지]로 즉시 발송되었습니다.</span>
            </div>

            <button
              onClick={() => {
                setIsCheckoutSuccessOpen(false);
                onClose();
              }}
              className="w-full rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs py-3.5 transition shadow-md"
            >
              확인 및 마이 패키지로 이동
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
