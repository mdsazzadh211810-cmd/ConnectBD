import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Send, FileText, CheckCircle2, ShieldCheck } from 'lucide-react';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: UserProfile;
  initialData?: any;
  onQuoteSubmitted?: (quote: any) => void;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  initialData,
  onQuoteSubmitted
}) => {
  if (!isOpen) return null;

  const [customerType, setCustomerType] = useState(initialData?.customerType || 'Education');
  const [orgName, setOrgName] = useState(initialData?.organizationName || currentUser?.organization || '');
  const [location, setLocation] = useState(initialData?.location || 'Bogura Sadar, Bogura District');
  const [usersCount, setUsersCount] = useState(initialData?.numberOfUsers || 400);
  const [sqFt, setSqFt] = useState(initialData?.coverageAreaSqFt || 15000);
  const [buildings, setBuildings] = useState(initialData?.numberOfBuildings || 3);
  const [backhaul, setBackhaul] = useState(initialData?.preferredBackhaul || 'Fiber');
  const [budget, setBudget] = useState(initialData?.budgetRangeBDT || '40,000 - 60,000 BDT');
  const [notes, setNotes] = useState(initialData?.specialRequirements || '');

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        } as Record<string, string>,
        body: JSON.stringify({
          customerType,
          organizationName: orgName,
          location,
          numberOfUsers: usersCount,
          coverageAreaSqFt: sqFt,
          numberOfBuildings: buildings,
          preferredBackhaul: backhaul,
          budgetRangeBDT: budget,
          additionalNotes: notes
        })
      });

      const data = await response.json();
      if (data.quote) {
        if (onQuoteSubmitted) onQuoteSubmitted(data.quote);
        setSubmitted(true);
      }
    } catch (err) {
      console.error('Quote submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 text-slate-100">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Formal Proposal Request</span>
            <h2 className="text-lg font-bold text-white mt-0.5">Request a Custom Connectivity Quote</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white font-bold">
            ✕
          </button>
        </div>

        {submitted ? (
          <div className="text-center py-8 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="text-lg font-bold text-white">Quotation Request Submitted!</h3>
            <p className="text-xs text-slate-300 max-w-sm mx-auto">
              Our engineering team will assess your site layout and upload a formal PDF cost quotation to your dashboard within 24 hours.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl hover:bg-cyan-300"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Customer Type</label>
                <select 
                  value={customerType}
                  onChange={(e) => setCustomerType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                >
                  <option>Community</option>
                  <option>Education</option>
                  <option>Business</option>
                  <option>Government</option>
                  <option>Individual</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Organization Name</label>
                <input 
                  type="text"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="e.g. ABC Education Center"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-medium">Location in Bangladesh</label>
              <input 
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Station Road, Bogura Sadar"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Users</label>
                <input 
                  type="number"
                  value={usersCount}
                  onChange={(e) => setUsersCount(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Sq Feet</label>
                <input 
                  type="number"
                  value={sqFt}
                  onChange={(e) => setSqFt(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Buildings</label>
                <input 
                  type="number"
                  value={buildings}
                  onChange={(e) => setBuildings(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Preferred Backhaul</label>
                <select 
                  value={backhaul}
                  onChange={(e) => setBackhaul(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                >
                  <option>Fiber</option>
                  <option>Terrestrial Wireless</option>
                  <option>Cellular Backhaul</option>
                  <option>Satellite Hybrid</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Target Budget (BDT)</label>
                <input 
                  type="text"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-medium">Additional Requirements / Site Notes</label>
              <textarea 
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Details about power backup, cable paths or existing ISP..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Submitting Request...' : 'Submit Quotation Request'}</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
