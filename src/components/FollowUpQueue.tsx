import React, { useState } from 'react';
import { FollowUpItem, SolarLead } from '../types/solar';
import { 
  Clock, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Phone, 
  FileText, 
  ClipboardCheck, 
  Plus, 
  X, 
  ArrowRight,
  MoreVertical,
  Check,
  RotateCcw
} from 'lucide-react';

interface FollowUpQueueProps {
  followUps: FollowUpItem[];
  leads: SolarLead[];
  onToggleStatus: (id: string) => void;
  onReschedule: (id: string, newDate: string) => void;
  onAddFollowUp: (item: Omit<FollowUpItem, 'id'>) => void;
  onSelectLead: (lead: SolarLead) => void;
}

export const FollowUpQueue: React.FC<FollowUpQueueProps> = ({
  followUps,
  leads,
  onToggleStatus,
  onReschedule,
  onAddFollowUp,
  onSelectLead,
}) => {
  const [filter, setFilter] = useState<'all' | 'today' | 'overdue' | 'upcoming' | 'completed'>('all');
  const [isAddOpen, setIsAddOpen] = useState(false);

  // New Follow-Up Form State
  const [leadId, setLeadId] = useState(leads[0]?.id || '');
  const [title, setTitle] = useState('');
  const [scheduledDate, setScheduledDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState<FollowUpItem['type']>('Call');
  const [priority, setPriority] = useState<FollowUpItem['priority']>('high');
  const [notes, setNotes] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  const filteredItems = followUps.filter((item) => {
    if (filter === 'completed') return item.status === 'completed';
    if (item.status === 'completed') return false; // hide completed from active lists
    if (filter === 'today') return item.scheduledDate === todayStr;
    if (filter === 'overdue') return item.scheduledDate < todayStr;
    if (filter === 'upcoming') return item.scheduledDate > todayStr;
    return true; // all active
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !leadId) return;
    const targetLead = leads.find((l) => l.id === leadId);

    onAddFollowUp({
      leadId,
      leadName: targetLead?.fullName || 'Prospect',
      city: targetLead?.city || 'Unknown',
      title: title.trim(),
      scheduledDate,
      type,
      priority,
      status: 'pending',
      notes: notes.trim(),
    });

    setTitle('');
    setNotes('');
    setIsAddOpen(false);
  };

  const addDays = (currentDateStr: string, days: number) => {
    const d = new Date(currentDateStr);
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs tracking-wider uppercase mb-1">
            <Clock className="w-4 h-4 text-amber-400" />
            Solar Sales Cadence & Task Scheduler
          </div>
          <h2 className="text-xl font-bold text-slate-100">
            Prospect Follow-ups & Reminders
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Never lose a solar deal to delayed quotes, unreturned calls, or expired utility bill audits
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-lg shadow-amber-400/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Follow-Up</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-900/60 p-2 rounded-xl border border-slate-800">
        {[
          { id: 'all', label: 'All Active Tasks' },
          { id: 'today', label: 'Due Today' },
          { id: 'overdue', label: 'Overdue' },
          { id: 'upcoming', label: 'Upcoming' },
          { id: 'completed', label: 'Completed' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
              filter === tab.id
                ? 'bg-slate-800 text-amber-400 font-bold shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="bg-slate-900/40 p-12 text-center rounded-2xl border border-slate-800/80 text-xs text-slate-500">
            No follow-ups match this filter. Excellent work staying on schedule!
          </div>
        ) : (
          filteredItems.map((item) => {
            const isOverdue = item.status === 'pending' && item.scheduledDate < todayStr;
            const isToday = item.status === 'pending' && item.scheduledDate === todayStr;
            const lead = leads.find((l) => l.id === item.leadId);

            return (
              <div
                key={item.id}
                className={`bg-slate-900/90 rounded-2xl border p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                  isOverdue
                    ? 'border-rose-900/50 bg-gradient-to-r from-rose-950/20 via-slate-900 to-slate-900'
                    : isToday
                    ? 'border-amber-500/40 bg-gradient-to-r from-amber-950/20 via-slate-900 to-slate-900'
                    : 'border-slate-800'
                }`}
              >
                {/* Left: Status Toggle & Info */}
                <div className="flex items-start gap-3.5">
                  <button
                    onClick={() => onToggleStatus(item.id)}
                    className={`mt-0.5 w-6 h-6 rounded-lg border flex items-center justify-center transition-colors ${
                      item.status === 'completed'
                        ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                        : 'border-slate-700 hover:border-amber-400 bg-slate-950 text-transparent'
                    }`}
                    title={item.status === 'completed' ? 'Mark Incomplete' : 'Mark Completed'}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                        item.type === 'Call' ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' :
                        item.type === 'Proposal Review' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        item.type === 'Site Visit' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                        'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        {item.type}
                      </span>

                      {isOverdue && (
                        <span className="text-[10px] font-mono font-bold text-rose-400 bg-rose-950/50 px-2 py-0.5 rounded border border-rose-800/40">
                          OVERDUE
                        </span>
                      )}

                      {isToday && (
                        <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-800/40">
                          DUE TODAY
                        </span>
                      )}

                      <span className="text-xs text-slate-400 font-mono">
                        {item.scheduledDate}
                      </span>
                    </div>

                    <h4 className={`text-sm font-semibold ${
                      item.status === 'completed' ? 'line-through text-slate-500' : 'text-slate-100'
                    }`}>
                      {item.title}
                    </h4>

                    {lead && (
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <button
                          onClick={() => onSelectLead(lead)}
                          className="hover:text-amber-400 font-medium text-slate-300 underline underline-offset-2"
                        >
                          {lead.fullName} ({lead.city}, {lead.state})
                        </button>
                        <span>·</span>
                        <span className="text-slate-500 font-mono">{lead.phone}</span>
                      </div>
                    )}

                    {item.notes && (
                      <p className="text-xs text-slate-400/90 italic pt-0.5">
                        "{item.notes}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Quick Reschedule & Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {item.status !== 'completed' && (
                    <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px] font-mono">
                      <span className="text-slate-500 px-1.5 text-[10px]">Snooze:</span>
                      <button
                        onClick={() => onReschedule(item.id, addDays(item.scheduledDate, 1))}
                        className="px-2 py-1 hover:bg-slate-800 text-slate-300 rounded"
                        title="Reschedule +1 day"
                      >
                        +1d
                      </button>
                      <button
                        onClick={() => onReschedule(item.id, addDays(item.scheduledDate, 3))}
                        className="px-2 py-1 hover:bg-slate-800 text-slate-300 rounded"
                        title="Reschedule +3 days"
                      >
                        +3d
                      </button>
                      <button
                        onClick={() => onReschedule(item.id, addDays(item.scheduledDate, 7))}
                        className="px-2 py-1 hover:bg-slate-800 text-slate-300 rounded"
                        title="Reschedule +1 week"
                      >
                        +7d
                      </button>
                    </div>
                  )}

                  {lead && (
                    <button
                      onClick={() => onSelectLead(lead)}
                      className="px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700"
                    >
                      Open Lead
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Follow-Up Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                Schedule Prospect Follow-Up
              </h3>
              <button
                onClick={() => setIsAddOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300">Target Lead / Customer *</label>
                <select
                  value={leadId}
                  onChange={(e) => setLeadId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                >
                  {leads.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.fullName} ({l.city})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300">Action Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Call to discuss battery tax credit"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  >
                    <option value="Call">Phone Call</option>
                    <option value="Proposal Review">Proposal Review</option>
                    <option value="Site Visit">Site Visit</option>
                    <option value="Contract Signature">Contract Signature</option>
                    <option value="Permit Check">Permit Check</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300">Date</label>
                  <input
                    type="date"
                    required
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300">Notes / Talking Points</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Customer mentioned they might buy an EV next spring."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-3 py-1.5 text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
