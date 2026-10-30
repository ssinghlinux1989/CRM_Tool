import React, { useState } from 'react';
import { SolarProject, ProjectMilestone, ProjectMilestoneStatus, SolarLead } from '../types/solar';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Calendar, 
  MapPin, 
  Sun, 
  DollarSign, 
  Hammer, 
  FileCheck, 
  Zap, 
  ChevronRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { formatInr } from '../utils/currency';

interface ProjectsTrackerProps {
  projects: SolarProject[];
  leads: SolarLead[];
  onUpdateMilestone: (projectId: string, milestoneId: string, status: ProjectMilestoneStatus) => void;
  onSelectLead: (lead: SolarLead) => void;
}

export const ProjectsTracker: React.FC<ProjectsTrackerProps> = ({
  projects,
  leads,
  onUpdateMilestone,
  onSelectLead,
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || '');
  const activeProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  const getStatusBadge = (status: ProjectMilestoneStatus) => {
    switch (status) {
      case 'completed':
        return (
          <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-800/40">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            Complete
          </span>
        );
      case 'in_progress':
        return (
          <span className="flex items-center gap-1 text-[11px] font-mono text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-800/40">
            <Clock className="w-3 h-3 text-amber-400 animate-spin-slow" />
            In Progress
          </span>
        );
      case 'blocked':
        return (
          <span className="flex items-center gap-1 text-[11px] font-mono text-rose-400 bg-rose-950/40 px-2 py-0.5 rounded-full border border-rose-800/40">
            <AlertTriangle className="w-3 h-3 text-rose-400" />
            Blocked / AHJ Correction
          </span>
        );
      default:
        return (
          <span className="text-[11px] font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800">
            Pending
          </span>
        );
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs tracking-wider uppercase mb-1">
            <Hammer className="w-4 h-4 text-cyan-400" />
            Project Execution & Operations
          </div>
          <h2 className="text-xl font-bold text-slate-100">
            Installation & Utility Interconnection Tracker
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Post-contract execution: CAD engineering, municipal permits, crew dispatch, and PTO energization
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 font-mono text-xs">
          <div>
            <span className="text-slate-500 text-[10px] uppercase block">Active Projects</span>
            <span className="text-slate-200 font-bold text-sm">{projects.length} Installs</span>
          </div>
          <div className="w-px h-8 bg-slate-800" />
          <div>
            <span className="text-slate-500 text-[10px] uppercase block">Avg Turnaround</span>
            <span className="text-cyan-400 font-bold text-sm">38 Days to PTO</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Project Selector List (4 Cols) */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Select Active Solar Project
          </h3>

          <div className="space-y-2">
            {projects.map((proj) => {
              const completedCount = proj.milestones.filter((m) => m.status === 'completed').length;
              const progressPct = Math.round((completedCount / proj.milestones.length) * 100);
              const isSelected = proj.id === activeProject?.id;

              return (
                <div
                  key={proj.id}
                  onClick={() => setSelectedProjectId(proj.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2.5 ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-500/60 shadow-lg shadow-cyan-500/5'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-slate-100">{proj.customerName}</h4>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        <span>{proj.address}, {proj.city}</span>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-amber-400">
                      {proj.systemSizeKw} kW
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-mono">
                      <span className="text-slate-400">Execution Progress</span>
                      <span className="text-cyan-400 font-bold">{progressPct}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-500 flex justify-between font-mono pt-1">
                    <span>Target PTO: {proj.targetPtoDate}</span>
                    <span>{formatInr(proj.contractValue)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Milestone Detail & Progress Checklist (8 Cols) */}
        {activeProject && (
          <div className="lg:col-span-8 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 sm:p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-bold">
                  Project #{activeProject.id.toUpperCase()}
                </span>
                <h3 className="text-lg font-bold text-slate-100">{activeProject.customerName}</h3>
                <p className="text-xs text-slate-400">
                  {activeProject.address}, {activeProject.city}, {activeProject.state} · Contract: {formatInr(activeProject.contractValue)}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {leads.find((l) => l.id === activeProject.leadId) && (
                  <button
                    onClick={() => onSelectLead(leads.find((l) => l.id === activeProject.leadId)!)}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700"
                  >
                    View Lead File
                  </button>
                )}
              </div>
            </div>

            {/* Milestones Flow */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Installation Milestones (Click to Update Status)
              </h4>

              <div className="space-y-3">
                {activeProject.milestones.map((m, idx) => {
                  return (
                    <div
                      key={m.id}
                      className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-slate-900 border border-slate-700 text-slate-300 flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <div>
                          <div className="font-semibold text-xs text-slate-200">{m.name}</div>
                          <div className="text-[11px] text-slate-500 font-mono mt-0.5 flex items-center gap-2">
                            <span>Assignee: {m.assignee}</span>
                            <span>·</span>
                            <span>Target: {m.targetDate}</span>
                            {m.completedDate && (
                              <>
                                <span>·</span>
                                <span className="text-emerald-400">Completed: {m.completedDate}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <select
                          value={m.status}
                          onChange={(e) =>
                            onUpdateMilestone(
                              activeProject.id,
                              m.id,
                              e.target.value as ProjectMilestoneStatus
                            )
                          }
                          className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none"
                        >
                          <option value="pending">Pending</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="blocked">Blocked / Issues</option>
                        </select>
                        {getStatusBadge(m.status)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
