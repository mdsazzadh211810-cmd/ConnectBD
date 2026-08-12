import React, { useState } from 'react';
import { CartItem, UserProfile } from '../types';
import { CheckCircle2, ShieldCheck, ArrowRight, CreditCard, Building2, Phone, MapPin } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems?: CartItem[];
  currentUser?: UserProfile;
  onOrderCreated: (order: any) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems = [],
  currentUser,
  onOrderCreated
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [orgName, setOrgName] = useState(currentUser?.organization || '');
  const [district, setDistrict] = useState('Bogura');
  const [thana, setThana] = useState('Bogura Sadar');
  const [address, setAddress] = useState('Station Road, Campus Building 1');
  const [phone, setPhone] = useState(currentUser?.phone || '+880 1711-223344');
  const [paymentMethod, setPaymentMethod] = useState<'bKash/Nagad' | 'Bank Transfer' | 'Card' | 'Corporate Invoice'>('bKash/Nagad');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = cartItems.reduce((acc, it) => {
    const basePrice = (it.item as any).priceBDT || (it.item as any).startingPriceBDT || 0;
    const inst = it.includeInstallation ? 3500 : 0;
    return acc + (basePrice + inst) * it.quantity;
  }, 0);

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems,
          deliveryAddress: {
            district,
            thana,
            address,
            contactPhone: phone
          },
          paymentMethod,
          installationFeeBDT: cartItems.some((i) => i.includeInstallation) ? 3500 : 0
        })
      });

      const data = await response.json();
      if (data.order) {
        onOrderCreated(data.order);
        setStep(3);
      }
    } catch (err) {
      console.error('Order creation error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 text-slate-100">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Step {step} of 3</span>
            <h2 className="text-xl font-bold text-white mt-0.5">
              {step === 1 && '1. Site & Organization Information'}
              {step === 2 && '2. Delivery & Payment Method'}
              {step === 3 && 'Order Confirmed!'}
            </h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white font-bold">
            ✕
          </button>
        </div>

        {/* Step 1: Customer details */}
        {step === 1 && (
          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Customer / Organization Name</label>
              <input 
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder="e.g. ABC Education Center or Individual"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">District</label>
                <input 
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Thana / Upazila</label>
                <input 
                  type="text"
                  value={thana}
                  onChange={(e) => setThana(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Physical Installation Address</label>
              <input 
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Contact Phone Number</label>
              <input 
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                required
              />
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full py-3 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs rounded-xl transition-colors shadow-md flex items-center justify-center space-x-2"
            >
              <span>Continue to Payment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 2: Payment options */}
        {step === 2 && (
          <div className="space-y-5 text-xs">
            <div className="space-y-2">
              <label className="block text-slate-300 font-medium">Select Payment Method</label>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: 'bKash/Nagad', label: 'bKash / Nagad Mobile Banking' },
                  { id: 'Bank Transfer', label: 'Bank Wire / Transfer' },
                  { id: 'Card', label: 'Credit / Debit Card' },
                  { id: 'Corporate Invoice', label: 'Corporate Invoice / PO' }
                ].map((pm) => (
                  <div
                    key={pm.id}
                    onClick={() => setPaymentMethod(pm.id as any)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === pm.id
                        ? 'bg-slate-950 border-cyan-400 text-cyan-300 font-bold'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {pm.label}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <div className="flex justify-between font-bold text-white">
                <span>Total Amount Due</span>
                <span className="text-cyan-400">৳{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <p className="text-[10px] text-slate-400">Payment confirmation verified server-side. No raw card numbers stored.</p>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setStep(1)}
                className="py-3 px-4 bg-slate-950 text-slate-400 hover:text-white rounded-xl border border-slate-800"
              >
                Back
              </button>

              <button
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
                className="flex-1 py-3 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold rounded-xl transition-colors shadow-md flex items-center justify-center space-x-2"
              >
                {isSubmitting ? 'Processing Order...' : 'Confirm & Complete Order'}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && (
          <div className="text-center py-6 space-y-4">
            <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto" />
            <h3 className="text-xl font-extrabold text-white">Order Successfully Dispatched!</h3>
            <p className="text-xs text-slate-300 max-w-sm mx-auto">
              Your connectivity hardware and technician dispatch order has been recorded. Track live shipping and installation status in your customer dashboard.
            </p>

            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl hover:bg-cyan-300 transition-colors"
            >
              View Order in Customer Dashboard
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
