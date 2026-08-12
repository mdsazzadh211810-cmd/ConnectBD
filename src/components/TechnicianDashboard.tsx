import React, { useState } from 'react';
import { TechnicianJob, UserProfile } from '../types';
import { 
  Wrench, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Phone, 
  Upload, 
  Camera, 
  AlertCircle, 
  FileText 
} from 'lucide-react';

interface TechnicianDashboardProps {
  currentUser?: UserProfile;
  jobs?: TechnicianJob[];
  onUpdateJob?: (jobId: string, updates: Partial<TechnicianJob>) => void;
  onUpdateJobStatus?: (jobId: string, status: TechnicianJob['status'], report?: string) => void;
}

export const TechnicianDashboard: React.FC<TechnicianDashboardProps> = ({
  currentUser,
  jobs = [],
  onUpdateJob,
  onUpdateJobStatus
}) => {
  const [selectedJob, setSelectedJob] = useState<TechnicianJob | null>(jobs[0] || null);

  const handleToggleChecklist = (jobId: string, itemIdx: number) => {
    if (!selectedJob) return;
    const updatedChecklist = [...selectedJob.checklist];
    updatedChecklist[itemIdx].completed = !updatedChecklist[itemIdx].completed;

    if (onUpdateJob) {
      onUpdateJob(jobId, { checklist: updatedChecklist });
    }
    setSelectedJob({ ...selectedJob, checklist: updatedChecklist });
  };

  const handleCompleteJob = (jobId: string) => {
    onUpdateJob(jobId, { status: 'Completed' });
    if (selectedJob) {
      setSelectedJob({ ...selectedJob, status: 'Completed' });
    }
  };

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 sm:p-8 flex items-center justify-between shadow-xl">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-cyan-950 border border-cyan-800 rounded-2xl flex items-center justify-center text-cyan-400">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Field Operations Center</span>
              <h1 className="text-xl font-black text-white">Technician Portal — {currentUser.name}</h1>
            </div>
          </div>

          <span className="px-3 py-1 bg-emerald-950 text-emerald-300 text-xs font-bold rounded-full border border-emerald-800">
            District: Bogura & Rajshahi Division
          </span>
        </div>

        {/* Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Jobs List */}
          <div className="lg:col-span-5 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Assigned Dispatch Work Orders ({jobs.length})</h2>
            
            <div className="space-y-3">
              {jobs.map((j) => (
                <div
                  key={j.id}
                  onClick={() => setSelectedJob(j)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-2 ${
                    selectedJob?.id === j.id
                      ? 'bg-slate-900 border-cyan-500 shadow-lg shadow-cyan-500/10'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-cyan-400">{j.jobRef}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      j.status === 'Completed' ? 'bg-emerald-950 text-emerald-300 border-emerald-800' : 'bg-cyan-950 text-cyan-300 border-cyan-800'
                    }`}>
                      {j.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white">{j.customerName}</h3>
                  <div className="text-xs text-slate-400 flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="truncate">{j.district} • {j.thana}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Job Inspector */}
          <div className="lg:col-span-7">
            {selectedJob ? (
              <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl">
                
                <div className="flex justify-between items-start border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400">{selectedJob.jobRef}</span>
                    <h2 className="text-xl font-bold text-white mt-0.5">{selectedJob.customerName}</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Contact Phone: <strong className="text-slate-200">{selectedJob.contactPhone}</strong></p>
                  </div>

                  <span className={`px-3 py-1 text-xs font-bold rounded-full border ${
                    selectedJob.status === 'Completed' ? 'bg-emerald-950 text-emerald-300 border-emerald-800' : 'bg-cyan-950 text-cyan-300 border-cyan-800'
                  }`}>
                    {selectedJob.status}
                  </span>
                </div>

                {/* Checklist */}
                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">On-Site Field Verification Checklist:</span>
                  
                  <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 space-y-2.5 text-xs">
                    {selectedJob.checklist.map((chk, idx) => (
                      <label 
                        key={idx}
                        className="flex items-center space-x-3 cursor-pointer p-2 rounded-xl hover:bg-slate-900 text-slate-200 transition-colors"
                      >
                        <input 
                          type="checkbox"
                          checked={chk.completed}
                          onChange={() => handleToggleChecklist(selectedJob.id, idx)}
                          className="w-4 h-4 rounded border-slate-800 bg-slate-900 text-cyan-400 focus:ring-0"
                        />
                        <span className={chk.completed ? 'line-through text-slate-500' : 'text-white'}>
                          {chk.task}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Device Serial Numbers */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Installed Hardware Serial Numbers:</span>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-mono text-cyan-300">
                    {selectedJob.installedDeviceSerials.length > 0 
                      ? selectedJob.installedDeviceSerials.join(', ') 
                      : 'SN-CBD-2026-9021-A, SN-CBD-2026-9021-B'}
                  </div>
                </div>

                {/* Complete Action Button */}
                {selectedJob.status !== 'Completed' && (
                  <button
                    onClick={() => handleCompleteJob(selectedJob.id)}
                    className="w-full py-3.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-colors shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Sign-Off & Complete Installation Work Order</span>
                  </button>
                )}

              </div>
            ) : (
              <div className="bg-slate-900 rounded-3xl border border-slate-800 p-12 text-center text-slate-400 text-xs">
                Select a work order from the left list to view checklist and log serial numbers.
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
