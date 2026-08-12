import React, { useState } from 'react';
import { ComplianceCertificate, UserProfile } from '../types';
import { 
  ShieldCheck, 
  CheckCircle, 
  AlertCircle, 
  ExternalLink, 
  Download, 
  Plus, 
  FileText, 
  Lock, 
  Upload 
} from 'lucide-react';

interface ComplianceCenterProps {
  certificates?: ComplianceCertificate[];
  currentUser?: UserProfile;
  setActiveTab?: (tab: string) => void;
  onAddCertificate?: (cert: any) => void;
}

export const ComplianceCenter: React.FC<ComplianceCenterProps> = ({
  certificates = [],
  currentUser,
  setActiveTab,
  onAddCertificate
}) => {
  const [selectedCert, setSelectedCert] = useState<ComplianceCertificate | null>(certificates[0] || null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // New Cert form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'Regulatory' | 'BTRC Credential' | 'Business Registration' | 'Import/Export' | 'Supplier Quality' | 'Security'>('Regulatory');
  const [newAuthority, setNewAuthority] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [newStatus, setNewStatus] = useState<'Verified' | 'Pending Verification'>('Verified');
  const [newDescription, setNewDescription] = useState('');

  const handleUploadCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (onAddCertificate) {
      onAddCertificate({
        title: newTitle,
        category: newCategory,
        issuingAuthority: newAuthority,
        certificateNumber: newNumber,
        verificationStatus: newStatus,
        description: newDescription,
        issueDate: new Date().toISOString().split('T')[0],
        expiryDate: '2028-12-31'
      });
    }
    setShowUploadModal(false);
  };

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="inline-flex items-center space-x-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Public Regulatory Transparency Portal</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-1">
              Compliance & Certifications Center
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              ConnectBD publishes verified trade licenses, BTRC authorization paperwork, NBR Customs BIN permits, and Shenzhen factory ISO 9001 quality audit records.
            </p>
          </div>

          {currentUser?.role === 'admin' && (
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs rounded-xl shadow-md flex items-center space-x-2 shrink-0 self-start sm:self-center"
            >
              <Plus className="w-4 h-4" />
              <span>Upload Compliance Document (Admin)</span>
            </button>
          )}
        </div>

        {/* Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Document Cards List */}
          <div className="lg:col-span-5 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Published Verified Records</h2>
            
            <div className="space-y-3">
              {certificates.map((cert) => (
                <div
                  key={cert.id}
                  onClick={() => setSelectedCert(cert)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-2 ${
                    selectedCert?.id === cert.id
                      ? 'bg-slate-900 border-cyan-500 shadow-lg shadow-cyan-500/10'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                      {cert.category}
                    </span>

                    {cert.verificationStatus === 'Verified' ? (
                      <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                        <CheckCircle className="w-3 h-3 text-emerald-400" />
                        <span>Verified</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-amber-300 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
                        <AlertCircle className="w-3 h-3 text-amber-400" />
                        <span>Paperwork Under Review</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-white line-clamp-1">{cert.title}</h3>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{cert.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Document Preview & Details Inspector */}
          <div className="lg:col-span-7">
            {selectedCert && (
              <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl">
                
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">{selectedCert.category}</span>
                    <h2 className="text-xl font-bold text-white mt-0.5">{selectedCert.title}</h2>
                  </div>

                  {selectedCert.verificationStatus === 'Verified' ? (
                    <span className="px-3 py-1 bg-emerald-950 text-emerald-300 text-xs font-bold rounded-full border border-emerald-800 flex items-center space-x-1">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Official Verified Status</span>
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-amber-950 text-amber-300 text-xs font-bold rounded-full border border-amber-800 flex items-center space-x-1">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                      <span>Paperwork Under Processing</span>
                    </span>
                  )}
                </div>

                {/* Metadata Table */}
                <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between border-b border-slate-900 pb-2">
                    <span className="text-slate-400">Issuing Authority:</span>
                    <strong className="text-slate-200">{selectedCert.issuingAuthority}</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-900 pb-2">
                    <span className="text-slate-400">Certificate / License Ref:</span>
                    <strong className="text-cyan-300 font-mono">{selectedCert.certificateNumber}</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-900 pb-2">
                    <span className="text-slate-400">Issue Date:</span>
                    <span className="text-slate-300">{selectedCert.issueDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Validity Expiry:</span>
                    <span className="text-slate-300">{selectedCert.expiryDate}</span>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5 text-xs text-slate-300 leading-relaxed">
                  <strong className="text-white block">Official Summary & Scope:</strong>
                  <p className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80">{selectedCert.description}</p>
                </div>

                {/* Simulated Document Preview Banner */}
                <div className="bg-slate-950 rounded-2xl border border-slate-800 p-8 text-center space-y-3">
                  <FileText className="w-12 h-12 text-cyan-400 mx-auto" />
                  <div className="text-xs font-bold text-white">{selectedCert.title} (Official Copy)</div>
                  <div className="text-[11px] text-slate-400">Ref: {selectedCert.certificateNumber} • Issued by {selectedCert.issuingAuthority}</div>
                  
                  {selectedCert.verificationLink && (
                    <a 
                      href={selectedCert.verificationLink} 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center space-x-1.5 text-xs text-cyan-400 hover:underline font-semibold pt-2"
                    >
                      <span>Verify on Official Government Portal</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

              </div>
            )}
          </div>

        </div>

        {/* Modal: Admin Upload Certificate */}
        {showUploadModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-5 relative shadow-2xl">
              <button 
                onClick={() => setShowUploadModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>

              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <Upload className="w-5 h-5 text-cyan-400" />
                  <span>Publish Compliance Record (Admin Only)</span>
                </h3>
              </div>

              <form onSubmit={handleUploadCert} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Document Title</label>
                  <input 
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g., BTRC Equipment Import Approval 2026"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Category</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                    >
                      <option>Regulatory</option>
                      <option>BTRC Credential</option>
                      <option>Business Registration</option>
                      <option>Import/Export</option>
                      <option>Supplier Quality</option>
                      <option>Security</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Verification Status</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                    >
                      <option>Verified</option>
                      <option>Pending Verification</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Issuing Authority</label>
                    <input 
                      type="text"
                      value={newAuthority}
                      onChange={(e) => setNewAuthority(e.target.value)}
                      placeholder="e.g., BTRC / NBR / DNCC"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Certificate Number / ID</label>
                    <input 
                      type="text"
                      value={newNumber}
                      onChange={(e) => setNewNumber(e.target.value)}
                      placeholder="e.g., BTRC-APP-2026-901"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Description</label>
                  <textarea 
                    rows={2}
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Provide official scope or verification notes..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-colors"
                >
                  Publish Verified Document
                </button>
              </form>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
