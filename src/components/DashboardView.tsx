import React from 'react';
import { SolarLead, FollowUpItem } from '../types/solar';
import { PIPELINE_STAGES } from '../data/mockData';
import { formatInr } from '../utils/currency';
import { 
  TrendingUp, 
  ArrowRight,
  ShieldCheck,
  Landmark,
  CheckCircle2, 
  Wrench,
  Gauge,
  AlertCircle
} from 'lucide-react';

interface DashboardViewProps {
  leads: SolarLead[];
  followUps: FollowUpItem[];
  selectedCity: string;
  onNavigateTab: (tab: 'dashboard' | 'pipeline' | 'finances' | 'calculator' | 'reps' | 'blueprint' | 'followups' | 'projects') => void;
  onSelectLead: (lead: SolarLead) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  leads,
  followUps,
  selectedCity,
  onNavigateTab,
  onSelectLead,
}) => {
  // Financial computations
  const totalContractRevenue = leads.reduce((acc, l) => acc + (l.financials?.grossContractValue || l.estimatedValue || 0), 0);
  const totalSubsidies = leads.reduce((acc, l) => acc + (l.financials?.centralSubsidy || 0), 0);
  const totalCustomerAdvance = leads.reduce((acc, l) => acc + (l.financials?.advanceCollected || 0), 0);
  const totalCustomerStage = leads.reduce((acc, l) => acc + (l.financials?.stagePaymentsCollected || 0), 0);
  const totalPendingBalance = leads.reduce((acc, l) => acc + (l.financials?.balancePending || 0), 0);
  const totalCapacityKw = leads.reduce((acc, l) => acc + (l.systemSizeKw || 0), 0);

  // Stage distribution
  const stageCounts = PIPELINE_STAGES.map((stage) => {
    const stageLeads = leads.filter((l) => l.stage === stage.id);
    const value = stageLeads.reduce((acc, l) => acc + (l.financials?.grossContractValue || l.estimatedValue || 0), 0);
    return {
      ...stage,
      count: stageLeads.length,
      value
    };
  });

  // Actionable bottlenecks
  const netMeteringProjects = leads.filter(l => l.stage === 'net_metering');
  const installationProjects = leads.filter(l => l.stage === 'installation');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Executive Overview Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs text-amber-400 font-mono font-medium mb-1 flex items-center gap-2">
            <span>BSSPL Management Tool</span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-400">Bharat Solar Shakti Pvt (Lucknow, UP)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100 tracking-tight">
            Solar Operations & Financial Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Live overview of the 16-step PM Surya Ghar Muft Bijli Yojana installation lifecycle, DBT subsidy claims, and financial cashflow.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('pipeline')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300 transition-all shadow-xs active:scale-95"
          >
            <span>View 16-Step Pipeline</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onNavigateTab('finances')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 text-slate-200 font-medium text-xs hover:bg-slate-700 transition-all border border-slate-700"
          >
            <span>Finances & P&L</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Grid (4 cards with clean typography and tabular nums) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Booked Contract Revenue */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-medium">Total Pipeline Value</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-100 font-mono">
            {formatInr(totalContractRevenue)}
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            {leads.length} Contracts · {totalCapacityKw.toFixed(1)} kW Total
          </div>
        </div>

        {/* KPI 2: PM Surya Ghar Subsidies */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-medium">Govt DBT Subsidies</span>
            <Landmark className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono">
            {formatInr(totalSubsidies)}
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            Central PM Surya Ghar portal allocation
          </div>
        </div>

        {/* KPI 3: Inflows Collected */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-medium">Collections Received</span>
            <CheckCircle2 className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-extrabold text-sky-400 font-mono">
            {formatInr(totalCustomerAdvance + totalCustomerStage)}
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            Advance and milestone payments collected
          </div>
        </div>

        {/* KPI 4: Pending Receivables */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-medium">Balance Pending</span>
            <AlertCircle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-extrabold text-rose-400 font-mono">
            {formatInr(totalPendingBalance)}
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            Due upon net metering & commissioning
          </div>
        </div>
      </div>

      {/* 16-Stage Workflow Matrix */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-100">
              16-Stage Solar EPC Lifecycle Status
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Current count and contract value across every milestone
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('pipeline')}
            className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
          >
            <span>Open Pipeline Board</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {stageCounts.map((st) => (
            <div
              key={st.id}
              onClick={() => onNavigateTab('pipeline')}
              className="bg-slate-950/70 border border-slate-800 hover:border-slate-700 p-2.5 rounded-xl transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono mb-1">
                  <span>Step {st.stepNumber}</span>
                  <span className={`px-1.5 py-0.2 rounded font-semibold ${
                    st.count > 0 ? 'bg-amber-400/10 text-amber-400' : 'text-slate-600'
                  }`}>
                    {st.count}
                  </span>
                </div>
                <div className="font-bold text-xs text-slate-200 group-hover:text-amber-400 transition-colors truncate">
                  {st.shortLabel}
                </div>
              </div>
              <div className="mt-2 text-[10px] text-slate-400 font-mono">
                {st.value > 0 ? formatInr(st.value) : '₹0'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Field Operations (Installations & DISCOM Net Metering) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* On-Site Installations */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-amber-400" />
              <span>Active Installations ({installationProjects.length})</span>
            </h3>
            <span className="text-xs text-slate-400">Lucknow & NCR</span>
          </div>

          <div className="space-y-2">
            {installationProjects.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                No active installations today
              </div>
            ) : (
              installationProjects.map((lead) => (
                <div
                  key={lead.id}
                  onClick={() => onSelectLead(lead)}
                  className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-xs text-slate-200">{lead.fullName}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {lead.city} · {lead.systemSizeKw} kW Rooftop
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-semibold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
                      Mounting & Wiring
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* DISCOM Net Metering */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Gauge className="w-4 h-4 text-cyan-400" />
              <span>DISCOM Net Metering ({netMeteringProjects.length})</span>
            </h3>
            <span className="text-xs text-slate-400">UPPCL / MVVNL</span>
          </div>

          <div className="space-y-2">
            {netMeteringProjects.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                No pending net meter inspections
              </div>
            ) : (
              netMeteringProjects.map((lead) => (
                <div
                  key={lead.id}
                  onClick={() => onSelectLead(lead)}
                  className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-xs text-slate-200">{lead.fullName}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
                      {lead.city} · #{lead.consumerNumber || 'UPPCL-0819'}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-semibold text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded">
                      Testing Approved
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
