import React from 'react';
import { SolarSalesRep, SolarLead } from '../types/solar';
import { SALES_REPS } from '../data/mockData';
import { 
  Trophy, 
  Award, 
  TrendingUp, 
  Zap, 
  Users, 
  Mail, 
  Phone,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { formatInr, formatInrPerUnit } from '../utils/currency';

interface RepLeaderboardProps {
  leads: SolarLead[];
}

export const RepLeaderboard: React.FC<RepLeaderboardProps> = ({ leads }) => {
  // Compute dynamically based on actual leads
  const repStats = SALES_REPS.map((rep) => {
    const repLeads = leads.filter((l) => l.assignedRepId === rep.id);
    const wonLeads = repLeads.filter((l) => 
      l.stage === 'commissioning' || 
      l.stage === 'balance_payment' || 
      l.stage === 'share_invoices' || 
      l.stage === 'support'
    );
    const totalKwWon = wonLeads.reduce((acc, l) => acc + (l.systemSizeKw || 0), 0);
    const pipelineKw = repLeads.reduce((acc, l) => acc + (l.systemSizeKw || 0), 0);
    const pipelineVal = repLeads.reduce((acc, l) => acc + (l.estimatedValue || 0), 0);
    // Commission earned: totalKwWon * 1000 watts * commissionPerWatt
    const commissionWon = Math.round(totalKwWon * 1000 * rep.commissionPerWatt);
    const projectedCommission = Math.round(pipelineKw * 1000 * rep.commissionPerWatt);

    return {
      ...rep,
      activeLeadsCount: repLeads.length,
      wonDealsCount: wonLeads.length,
      totalKwWon: Number(totalKwWon.toFixed(1)),
      pipelineKw: Number(pipelineKw.toFixed(1)),
      pipelineVal,
      commissionWon,
      projectedCommission,
    };
  }).sort((a, b) => b.totalKwWon - a.totalKwWon);

  const teamTotalKw = repStats.reduce((acc, r) => acc + r.totalKwWon, 0).toFixed(1);
  const teamTotalCommission = repStats.reduce((acc, r) => acc + r.commissionWon, 0);

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs tracking-wider uppercase mb-1">
            <Trophy className="w-4 h-4 text-amber-400" />
            Solar Sales Performance & Commissions
          </div>
          <h2 className="text-xl font-bold text-slate-100">
            Consultant Leaderboard & Commission Tracker
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Transparent ₹/Watt commission model for independent solar advisors, closers, and field canvassers
          </p>
        </div>

        {/* Aggregate Stats */}
        <div className="flex items-center gap-4 bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-xs">
          <div>
            <span className="text-slate-500 text-[10px] uppercase block">Closed Capacity</span>
            <span className="text-amber-400 font-bold text-sm">{teamTotalKw} kW</span>
          </div>
          <div className="w-px h-8 bg-slate-800" />
          <div>
            <span className="text-slate-500 text-[10px] uppercase block">Paid Commission</span>
            <span className="text-emerald-400 font-bold text-sm">{formatInr(teamTotalCommission)}</span>
          </div>
        </div>
      </div>

      {/* Leaderboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {repStats.map((rep, index) => {
          const isLeader = index === 0;

          return (
            <div
              key={rep.id}
              className={`bg-slate-900/80 rounded-2xl border p-5 relative overflow-hidden transition-all ${
                isLeader
                  ? 'border-amber-500/50 shadow-xl shadow-amber-500/5 bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/20'
                  : 'border-slate-800'
              }`}
            >
              {isLeader && (
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-bold">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  #1 Top Producer
                </div>
              )}

              <div className="flex items-start gap-3.5">
                <img
                  src={rep.avatar}
                  alt={rep.name}
                  className="w-13 h-13 rounded-2xl object-cover ring-2 ring-slate-700"
                />
                <div>
                  <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
                    {rep.name}
                  </h3>
                  <div className="text-xs text-amber-400/90 font-medium">{rep.role} · {rep.assignedCity || 'Lucknow'}</div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                    <span>{rep.email}</span>
                    <span>·</span>
                    <span>{rep.phone}</span>
                  </div>
                </div>
              </div>

              {/* Rep Numbers Grid */}
              <div className="mt-4 grid grid-cols-3 gap-2 bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 font-mono text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Closed kW</span>
                  <span className="font-bold text-slate-200 text-sm mt-0.5 block">
                    {rep.totalKwWon} kW
                  </span>
                  <span className="text-[10px] text-slate-500">{rep.wonDealsCount} deals won</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Earned Comm.</span>
                  <span className="font-bold text-emerald-400 text-sm mt-0.5 block">
                    {formatInr(rep.commissionWon)}
                  </span>
                  <span className="text-[10px] text-slate-500">₹{rep.commissionPerWatt}/W rate</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Active Pipe</span>
                  <span className="font-bold text-sky-400 text-sm mt-0.5 block">
                    {rep.pipelineKw} kW
                  </span>
                  <span className="text-[10px] text-slate-500">{formatInr(rep.pipelineVal)}</span>
                </div>
              </div>

              {/* Progress bar towards monthly quota */}
              <div className="mt-3.5 space-y-1">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-slate-400">Monthly Target (50 kW):</span>
                  <span className="text-amber-400 font-semibold">
                    {Math.min(100, Math.round((rep.totalKwWon / 50) * 100))}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full"
                    style={{ width: `${Math.min(100, (rep.totalKwWon / 50) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
