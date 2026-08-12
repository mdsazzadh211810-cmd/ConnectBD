import React from 'react';
import { CartItem } from '../types';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ShieldCheck } from 'lucide-react';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems?: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onToggleInstallation: (id: string) => void;
  onProceedToCheckout: () => void;
}

export const CartModal: React.FC<CartModalProps> = ({
  isOpen,
  onClose,
  cartItems = [],
  onUpdateQuantity,
  onRemoveItem,
  onToggleInstallation,
  onProceedToCheckout
}) => {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, it) => {
    const basePrice = (it.item as any).priceBDT || (it.item as any).startingPriceBDT || 0;
    const inst = it.includeInstallation ? 3500 : 0;
    return acc + (basePrice + inst) * it.quantity;
  }, 0);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex justify-end">
      <div className="bg-slate-900 border-l border-slate-800 w-full max-w-md h-full flex flex-col justify-between p-6 shadow-2xl relative text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2">
            <ShoppingCart className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">Your Connectivity Cart</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white font-bold text-lg"
          >
            ✕
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <ShoppingCart className="w-12 h-12 text-slate-700 mx-auto" />
              <div className="text-sm font-bold text-slate-400">Your cart is empty</div>
              <p className="text-xs text-slate-400">Explore our products or managed packages to add items.</p>
            </div>
          ) : (
            cartItems.map((it) => {
              const itemPrice = (it.item as any).priceBDT || (it.item as any).startingPriceBDT || 0;
              return (
                <div key={it.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                        {it.type}
                      </span>
                      <h4 className="text-xs font-bold text-white">{it.item.name}</h4>
                      <div className="text-xs text-cyan-300 font-bold mt-0.5">
                        ৳{itemPrice.toLocaleString('en-IN')}
                      </div>
                    </div>
                    <button
                      onClick={() => onRemoveItem(it.id)}
                      className="text-slate-400 hover:text-red-400 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Quantity & Installation Check */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-900 text-xs">
                    <label className="flex items-center space-x-2 cursor-pointer text-slate-300">
                      <input 
                        type="checkbox"
                        checked={it.includeInstallation}
                        onChange={() => onToggleInstallation(it.id)}
                        className="rounded border-slate-800 bg-slate-900 text-cyan-400 focus:ring-0"
                      />
                      <span>On-site Tech Installation (+৳3,500)</span>
                    </label>

                    <div className="flex items-center space-x-2 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800">
                      <button 
                        onClick={() => onUpdateQuantity(it.id, -1)}
                        className="text-slate-400 hover:text-white font-bold"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-bold text-white px-1">{it.quantity}</span>
                      <button 
                        onClick={() => onUpdateQuantity(it.id, 1)}
                        className="text-slate-400 hover:text-white font-bold"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Subtotal & Checkout Button */}
        {cartItems.length > 0 && (
          <div className="border-t border-slate-800 pt-4 space-y-3">
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Subtotal</span>
                <span className="text-white font-bold">৳{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Estimated Customs / Duty</span>
                <span className="text-emerald-400 font-semibold">Included in Price</span>
              </div>
            </div>

            <button
              onClick={onProceedToCheckout}
              className="w-full py-3.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-colors shadow-lg shadow-cyan-500/20 flex items-center justify-center space-x-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
