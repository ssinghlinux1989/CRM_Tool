import React, { useState } from 'react';
import { 
  SolarLead, 
  PipelineStage, 
  StageConfig
} from '../types/solar';
import { PIPELINE_STAGES, SALES_REPS } from '../data/mockData';
import { formatInr } from '../utils/currency';
import { 
  Search,
  LayoutGrid, 
  Table as TableIcon,
  ChevronRight,
  ChevronLeft,
  GripVertical,
  Check,
  Filter,
  ArrowRight,
  User,
  MapPin,
  Calendar,
  Clock,
  Sparkles
} from 'lucide-react';

interface PipelineBoardProps {
  leads: SolarLead[];
  onUpdateLeadStage: (leadId: string, newStage: PipelineStage) => void;
  onSelectLead: (lead: SolarLead) => void;
  onOpenSizing: (lead: SolarLead) => void;
  onOpenSurvey: (lead: SolarLead) => void;
  onOpenProposal: (lead: SolarLead) => void;
  searchQuery: string;
}

interface PhaseDefinition {
  id: string;
  phaseNumber: number;
  title: string;
  subtitle: string;
  stageIds: PipelineStage[];
}

const WORKFLOW_PHASES: PhaseDefinition[] = [
  {
    id: 'phase-1',
    phaseNumber: 1,
    title: 'Sales & Conversion',
    subtitle: 'Stages 1 – 5',
    stageIds: ['leads', 'meeting', 'sales_quotation', 'approval', 'conversion'],
  },
  {
    id: 'phase-2',
    phaseNumber: 2,
    title: 'PM Portal & Loan',
    subtitle: 'Stages 6 – 7',
    stageIds: ['pm_portal_reg', 'loan'],
  },
  {
    id: 'phase-3',
    phaseNumber: 3,
    title: 'Materials & Install',
    subtitle: 'Stages 8 – 10',
    stageIds: ['material_procurement', 'inventory', 'installation'],
  },
  {
    id: 'phase-4',
    phaseNumber: 4,
    title: 'DISCOM & Grid',
    subtitle: 'Stages 11 – 13',
    stageIds: ['pm_suryaghar_doc', 'net_metering', 'commissioning'],
  },
  {
    id: 'phase-5',
    phaseNumber: 5,
    title: 'Billing & Support',
    subtitle: 'Stages 14 – 16',
    stageIds: ['balance_payment', 'share_invoices', 'support'],
  },
];

export const PipelineBoard: React.FC<PipelineBoardProps> = ({
  leads,
  onUpdateLeadStage,
  onSelectLead,
  onOpenSizing,
  onOpenSurvey,
  onOpenProposal,
  searchQuery,
}) => {
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [activePhaseId, setActivePhaseId] = useState<string>('phase-1'); // Default to Phase 1 for clean layout
  const [repFilter, setRepFilter] = useState<string>('all');
  const [localSearch, setLocalSearch] = useState<string>('');
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
  const [dragOverStageId, setDragOverStageId] = useState<PipelineStage | null>(null);
  const [stagePickerLeadId, setStagePickerLeadId] = useState<string | null>(null);

  const effectiveSearch = (searchQuery || localSearch).trim().toLowerCase();

  // Filter leads based on search query and rep filter
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch = !effectiveSearch || 
      lead.fullName.toLowerCase().includes(effectiveSearch) ||
      lead.address.toLowerCase().includes(effectiveSearch) ||
      lead.city.toLowerCase().includes(effectiveSearch) ||
      lead.utilityProvider.toLowerCase().includes(effectiveSearch) ||
      (lead.consumerNumber && lead.consumerNumber.toLowerCase().includes(effectiveSearch));

    const matchesRep = repFilter === 'all' || lead.assignedRepId === repFilter;

    return matchesSearch && matchesRep;
  });

  const getRep = (repId: string) => {
    return SALES_REPS.find((r) => r.id === repId) || SALES_REPS[0];
  };

  const getNextStage = (currentStage: PipelineStage): PipelineStage | null => {
    const currentIndex = PIPELINE_STAGES.findIndex(s => s.id === currentStage);
    if (currentIndex >= 0 && currentIndex < PIPELINE_STAGES.length - 1) {
      return PIPELINE_STAGES[currentIndex + 1].id;
    }
    return null;
  };

  const getPreviousStage = (currentStage: PipelineStage): PipelineStage | null => {
    const currentIndex = PIPELINE_STAGES.findIndex(s => s.id === currentStage);
    if (currentIndex > 0) {
      return PIPELINE_STAGES[currentIndex - 1].id;
    }
    return null;
  };

  // Determine which stages to display in kanban view
  const currentPhase = WORKFLOW_PHASES.find(p => p.id === activePhaseId);
  const visibleStages = activePhaseId === 'all'
    ? PIPELINE_STAGES
    : PIPELINE_STAGES.filter(s => currentPhase?.stageIds.includes(s.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* WORKFLOW PHASE STEPPER (Reduces 16 column chaos into clean, focused phases) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 border-b border-slate-800/80 pb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <span>PM Surya Ghar 16-Step EPC Workflow</span>
              <span className="text-[11px] font-normal text-slate-400">
                ({filteredLeads.length} active consumer projects)
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Select a workflow phase below or toggle full view to track progress from inquiry to commissioning.
            </p>
          </div>

          {/* View Mode & Rep Filter */}
          <div className="flex items-center gap-2">
            <select
              value={repFilter}
              onChange={(e) => setRepFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-amber-500"
            >
              <option value="all">All Field Officers</option>
              {SALES_REPS.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-0.5 flex items-center">
              <button
                onClick={() => setViewMode('kanban')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                  viewMode === 'kanban'
                    ? 'bg-slate-800 text-amber-400 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Board View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Board</span>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                  viewMode === 'table'
                    ? 'bg-slate-800 text-amber-400 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Table View"
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">List</span>
              </button>
            </div>
          </div>
        </div>

        {/* Phase Navigation Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {WORKFLOW_PHASES.map((phase) => {
            const phaseLeadCount = leads.filter(l => phase.stageIds.includes(l.stage)).length;
            const isActive = activePhaseId === phase.id;

            return (
              <button
                key={phase.id}
                onClick={() => setActivePhaseId(phase.id)}
                className={`text-left p-2.5 rounded-xl border transition-all ${
                  isActive
                    ? 'bg-amber-500/10 border-amber-500/40 text-slate-100 shadow-xs'
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                  <span className={isActive ? 'text-amber-400 font-bold' : 'text-slate-500'}>
                    Phase 0{phase.phaseNumber}
                  </span>
                  <span className={`px-1.5 py-0.2 rounded font-semibold ${
                    phaseLeadCount > 0 ? 'bg-slate-800 text-slate-200' : 'text-slate-600'
                  }`}>
                    {phaseLeadCount}
                  </span>
                </div>
                <div className="font-bold text-xs truncate text-slate-200">
                  {phase.title}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  {phase.subtitle}
                </div>
              </button>
            );
          })}

          {/* Full 16-Stage Panoramic Option */}
          <button
            onClick={() => setActivePhaseId('all')}
            className={`text-left p-2.5 rounded-xl border transition-all ${
              activePhaseId === 'all'
                ? 'bg-amber-500/10 border-amber-500/40 text-slate-100'
                : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center justify-between text-[10px] font-mono mb-1">
              <span className={activePhaseId === 'all' ? 'text-amber-400 font-bold' : 'text-slate-500'}>
                Panoramic
              </span>
              <span className="px-1.5 py-0.2 rounded font-semibold bg-slate-800 text-slate-200">
                {leads.length}
              </span>
            </div>
            <div className="font-bold text-xs truncate text-slate-200">
              All 16 Stages
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Full Horizon
            </div>
          </button>
        </div>
      </div>

      {/* Search Bar when searching locally */}
      {!searchQuery && (
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search consumer name, mobile, consumer ID, or locality..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      )}

      {/* KANBAN BOARD VIEW */}
      {viewMode === 'kanban' && (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-[max-content] items-start">
            {visibleStages.map((stage) => {
              const stageLeads = filteredLeads.filter((l) => l.stage === stage.id);
              const stageTotalKw = stageLeads.reduce((acc, l) => acc + (l.systemSizeKw || 0), 0);
              const stageValue = stageLeads.reduce((acc, l) => acc + (l.financials?.grossContractValue || l.estimatedValue || 0), 0);

              return (
                <div
                  key={stage.id}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'move';
                    if (dragOverStageId !== stage.id) {
                      setDragOverStageId(stage.id);
                    }
                  }}
                  onDragLeave={(e) => {
                    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
                    if (dragOverStageId === stage.id) {
                      setDragOverStageId(null);
                    }
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    const leadId = e.dataTransfer.getData('text/plain') || draggedLeadId;
                    if (leadId) {
                      onUpdateLeadStage(leadId, stage.id);
                    }
                    setDraggedLeadId(null);
                    setDragOverStageId(null);
                  }}
                  className={`w-80 flex-shrink-0 bg-slate-900 border rounded-2xl flex flex-col max-h-[calc(100vh-250px)] shadow-xs transition-all ${
                    dragOverStageId === stage.id
                      ? 'border-amber-400 ring-2 ring-amber-400/40 bg-slate-900/90 shadow-lg'
                      : 'border-slate-800'
                  }`}
                >
                  {/* Column Header */}
                  <div className={`p-3.5 border-b rounded-t-2xl transition-colors ${
                    dragOverStageId === stage.id ? 'bg-amber-500/10 border-amber-400/40' : 'bg-slate-950/60 border-slate-800/80'
                  }`}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-amber-400/10 text-amber-400 flex items-center justify-center text-[11px] font-bold font-mono">
                          {stage.stepNumber}
                        </span>
                        <h3 className="font-bold text-xs text-slate-100">
                          {stage.shortLabel}
                        </h3>
                      </div>
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-medium bg-slate-800 text-slate-300">
                        {stageLeads.length}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 line-clamp-1 mb-2">
                      {stage.description}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/60 font-mono">
                      <span>{stageTotalKw.toFixed(1)} kW</span>
                      <span className="font-semibold text-slate-200">{formatInr(stageValue)}</span>
                    </div>
                  </div>

                  {/* Active Drop Zone Indicator */}
                  {dragOverStageId === stage.id && (
                    <div className="mx-3 mt-3 p-2.5 rounded-xl border-2 border-dashed border-amber-400 bg-amber-500/15 text-center text-xs font-bold text-amber-300 animate-pulse flex items-center justify-center gap-1.5 shadow-inner">
                      <span>Drop card to move to Stage {stage.stepNumber}</span>
                    </div>
                  )}

                  {/* Column Cards */}
                  <div className="p-3 space-y-2.5 overflow-y-auto flex-1 custom-scrollbar">
                    {stageLeads.length === 0 ? (
                      <div className={`p-6 text-center text-xs rounded-xl border border-dashed transition-colors ${
                        dragOverStageId === stage.id
                          ? 'border-amber-400/60 text-amber-300 bg-amber-500/5'
                          : 'border-slate-800/80 text-slate-500'
                      }`}>
                        {dragOverStageId === stage.id ? 'Release to drop card here' : 'No projects at this stage'}
                      </div>
                    ) : (
                      stageLeads.map((lead) => {
                        const rep = getRep(lead.assignedRepId);
                        const nextStageId = getNextStage(lead.stage);
                        const prevStageId = getPreviousStage(lead.stage);
                        const isDragging = draggedLeadId === lead.id;
                        const fin = lead.financials || {
                          grossContractValue: lead.estimatedValue,
                          centralSubsidy: 78000,
                          customerNetCost: lead.estimatedValue - 78000,
                          balancePending: lead.estimatedValue - 78000
                        };

                        return (
                          <div
                            key={lead.id}
                            draggable
                            onDragStart={(e) => {
                              e.dataTransfer.setData('text/plain', lead.id);
                              e.dataTransfer.effectAllowed = 'move';
                              setDraggedLeadId(lead.id);
                            }}
                            onDragEnd={() => {
                              setDraggedLeadId(null);
                              setDragOverStageId(null);
                            }}
                            className={`bg-slate-950/80 border rounded-xl p-3 space-y-2.5 transition-all hover:shadow-md cursor-pointer group relative ${
                              isDragging
                                ? 'opacity-40 border-dashed border-amber-400 ring-2 ring-amber-400/30'
                                : 'border-slate-800 hover:border-slate-700'
                            }`}
                            onClick={() => onSelectLead(lead)}
                          >
                            {/* Card Top: Customer, Capacity & Drag Handle */}
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0 flex-1">
                                <h4 className="font-semibold text-xs text-slate-100 group-hover:text-amber-400 transition-colors truncate">
                                  {lead.fullName}
                                </h4>
                                <div className="text-[11px] text-slate-400 mt-0.5 flex items-center flex-wrap gap-1">
                                  <span>{lead.city}</span>
                                  <span className="text-slate-600">·</span>
                                  <span className="text-amber-400/90 font-medium">{lead.systemSizeKw} kW</span>
                                  {lead.consumerNumber && (
                                    <>
                                      <span className="text-slate-600">·</span>
                                      <span className="font-mono text-slate-500">#{lead.consumerNumber.slice(-4)}</span>
                                    </>
                                  )}
                                </div>
                              </div>

                              <div 
                                className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-slate-800 text-slate-500 hover:text-amber-400 transition-colors shrink-0"
                                title="Drag card to move between stages"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <GripVertical className="w-3.5 h-3.5" />
                              </div>
                            </div>

                            {/* Card Financials */}
                            <div className="bg-slate-900/60 rounded-lg p-2 text-[11px] grid grid-cols-2 gap-2 border border-slate-800/40">
                              <div>
                                <span className="text-slate-500 text-[10px] block">Contract Value</span>
                                <span className="font-semibold text-slate-200">
                                  {formatInr(fin.grossContractValue)}
                                </span>
                              </div>
                              <div>
                                <span className="text-slate-500 text-[10px] block">Balance Due</span>
                                <span className="font-semibold text-rose-400">
                                  {formatInr(fin.balancePending)}
                                </span>
                              </div>
                            </div>

                            {/* Card Footer: Officer & Click-To-Move Controls */}
                            <div className="flex items-center justify-between pt-1.5 border-t border-slate-800/60 text-[11px] gap-1">
                              <span className="text-slate-400 text-[10px] truncate max-w-[70px]">
                                {rep.name.split(' ')[0]}
                              </span>

                              {/* Interactive Click-to-Move Stage Bar */}
                              <div className="flex items-center gap-1 relative" onClick={(e) => e.stopPropagation()}>
                                {/* Prev Step Button */}
                                {prevStageId && (
                                  <button
                                    type="button"
                                    onClick={() => onUpdateLeadStage(lead.id, prevStageId)}
                                    className="p-1 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors border border-slate-800"
                                    title={`Move back to ${PIPELINE_STAGES.find(s => s.id === prevStageId)?.shortLabel}`}
                                  >
                                    <ChevronLeft className="w-3 h-3" />
                                  </button>
                                )}

                                {/* Jump to Any Stage Dropdown */}
                                <div className="relative">
                                  <button
                                    type="button"
                                    onClick={() => setStagePickerLeadId(stagePickerLeadId === lead.id ? null : lead.id)}
                                    className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-300 text-[10px] font-medium border border-slate-700 transition-colors"
                                    title="Click to jump to any stage"
                                  >
                                    <span>Move ▾</span>
                                  </button>

                                  {stagePickerLeadId === lead.id && (
                                    <div 
                                      className="absolute right-0 bottom-full mb-1 w-56 max-h-60 overflow-y-auto bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-1 z-50 text-xs custom-scrollbar"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <div className="px-2 py-1 text-[10px] font-mono text-slate-400 border-b border-slate-800 uppercase flex items-center justify-between">
                                        <span>Click to Move Stage</span>
                                        <button 
                                          onClick={() => setStagePickerLeadId(null)}
                                          className="text-slate-500 hover:text-slate-300"
                                        >
                                          ✕
                                        </button>
                                      </div>
                                      <div className="py-1 space-y-0.5">
                                        {PIPELINE_STAGES.map((s) => {
                                          const isSelected = s.id === lead.stage;
                                          return (
                                            <button
                                              key={s.id}
                                              type="button"
                                              onClick={() => {
                                                onUpdateLeadStage(lead.id, s.id);
                                                setStagePickerLeadId(null);
                                              }}
                                              className={`w-full px-2 py-1 text-left rounded-lg text-[11px] flex items-center justify-between transition-colors ${
                                                isSelected
                                                  ? 'bg-amber-400/20 text-amber-300 font-bold'
                                                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                              }`}
                                            >
                                              <span className="truncate">
                                                {s.stepNumber}. {s.shortLabel}
                                              </span>
                                              {isSelected && <Check className="w-3 h-3 text-amber-400 shrink-0 ml-1" />}
                                            </button>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {/* Next Step Button */}
                                {nextStageId && (
                                  <button
                                    type="button"
                                    onClick={() => onUpdateLeadStage(lead.id, nextStageId)}
                                    className="flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-amber-400/15 text-amber-300 hover:bg-amber-400 hover:text-slate-950 font-bold text-[10px] transition-all border border-amber-400/30 shadow-xs"
                                    title={`Move forward to ${PIPELINE_STAGES.find(s => s.id === nextStageId)?.shortLabel}`}
                                  >
                                    <span>Next</span>
                                    <ChevronRight className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TABLE / LIST VIEW (Clean, dense scannability) */}
      {viewMode === 'table' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-3 py-3">City / DISCOM</th>
                  <th className="px-3 py-3">Current Stage</th>
                  <th className="px-3 py-3">Capacity</th>
                  <th className="px-3 py-3">Contract Value</th>
                  <th className="px-3 py-3">Balance Pending</th>
                  <th className="px-3 py-3">Assigned Officer</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredLeads.map((lead) => {
                  const stageObj = PIPELINE_STAGES.find((s) => s.id === lead.stage) || PIPELINE_STAGES[0];
                  const rep = getRep(lead.assignedRepId);
                  const fin = lead.financials || {
                    grossContractValue: lead.estimatedValue,
                    balancePending: lead.estimatedValue - 78000
                  };
                  const nextStage = getNextStage(lead.stage);

                  return (
                    <tr
                      key={lead.id}
                      onClick={() => onSelectLead(lead)}
                      className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-100">{lead.fullName}</div>
                        <div className="text-[11px] text-slate-400">{lead.phone}</div>
                      </td>
                      <td className="px-3 py-3">
                        <div>{lead.city}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{lead.utilityProvider}</div>
                      </td>
                      <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={lead.stage}
                          onChange={(e) => onUpdateLeadStage(lead.id, e.target.value as PipelineStage)}
                          className="bg-slate-950 border border-slate-700 hover:border-amber-400 rounded-lg px-2 py-1 text-[11px] text-amber-300 font-medium focus:outline-none focus:border-amber-400 cursor-pointer"
                        >
                          {PIPELINE_STAGES.map((s) => (
                            <option key={s.id} value={s.id} className="bg-slate-900 text-slate-100">
                              {s.stepNumber}. {s.shortLabel}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-3 py-3 font-mono font-medium text-amber-400">
                        {lead.systemSizeKw} kW
                      </td>
                      <td className="px-3 py-3 font-mono font-semibold text-slate-200">
                        {formatInr(fin.grossContractValue)}
                      </td>
                      <td className="px-3 py-3 font-mono font-semibold text-rose-400">
                        {formatInr(fin.balancePending)}
                      </td>
                      <td className="px-3 py-3 text-slate-300">
                        {rep.name}
                      </td>
                      <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                        {nextStage ? (
                          <button
                            onClick={() => onUpdateLeadStage(lead.id, nextStage)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-400/10 hover:bg-amber-400 text-amber-400 hover:text-slate-950 font-semibold text-[11px] transition-all"
                          >
                            <span>Advance</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <span className="text-[11px] text-emerald-400 font-medium">Completed</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
