import React, { useState } from 'react';
import { SolarLead, LeadSource } from '../types/solar';
import { SALES_REPS } from '../data/mockData';
import { UTILITY_PRESETS, calculateSolarSystem } from '../utils/solarMath';
import { 
  X, 
  Plus, 
  Sun, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  Zap, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { formatInr } from '../utils/currency';

interface NewLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLead: (lead: SolarLead) => void;
}

export const NewLeadModal: React.FC<NewLeadModalProps> = ({ isOpen, onClose, onAddLead }) => {
  if (!isOpen) return null;

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Lucknow');
  const [state, setState] = useState('Uttar Pradesh');
  const [zip, setZip] = useState('226010');
  const [utilityProvider, setUtilityProvider] = useState(UTILITY_PRESETS[0].name);
  const [monthlyBill, setMonthlyBill] = useState<number>(3500);
  const [source, setSource] = useState<LeadSource>('PM Surya Ghar Portal');
  const [assignedRepId, setAssignedRepId] = useState<string>(SALES_REPS[0].id);
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('high');

  const preset = UTILITY_PRESETS.find((u) => u.name === utilityProvider) || UTILITY_PRESETS[0];

  const previewSpecs = calculateSolarSystem({
    monthlyBill,
    utilityRatePerKwh: preset.avgRate,
    sunHoursPerDay: preset.sunHours,
    targetOffsetPercent: 100,
    costPerWatt: 52.0,
    batteryModel: 'None',
    batteryCount: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !address.trim()) return;

    const newLead: SolarLead = {
      id: `lead-bss-${Date.now().toString().slice(-4)}`,
      fullName: fullName.trim(),
      email: email.trim() || 'support@bharatsolarshakti.com',
      phone: phone.trim(),
      address: address.trim(),
      city: city.trim() || 'Lucknow',
      state: state.trim() || 'Uttar Pradesh',
      pinCode: zip.trim() || '226010',
      utilityProvider,
      consumerNumber: `081${Math.floor(100000000 + Math.random() * 900000000)}`,
      stage: 'leads',
      source,
      assignedRepId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      estimatedValue: previewSpecs.totalGrossCost,
      systemSizeKw: previewSpecs.systemSizeKw,
      specs: previewSpecs,
      financials: {
        grossContractValue: previewSpecs.totalGrossCost,
        centralSubsidy: previewSpecs.federalTaxCreditAmount,
        customerNetCost: previewSpecs.netInvestment,
        advanceCollected: 0,
        stagePaymentsCollected: 0,
        balancePending: previewSpecs.netInvestment,
        materialBOMCost: Math.round(previewSpecs.totalGrossCost * 0.55),
        installationLaborCost: Math.round(previewSpecs.totalGrossCost * 0.12),
        netMeteringLiaisonCost: 6500,
        grossProfit: Math.round(previewSpecs.totalGrossCost * 0.30),
        profitMarginPercent: 30
      },
      notes: [
        `Lead captured via ${source}. Initial estimate: ${formatInr(monthlyBill)}/mo bill with ${utilityProvider}.`,
      ],
      tags: ['New Intake', 'Auto-Sized', 'PM Surya Ghar'],
      priority,
      financingPreference: 'pm_suryaghar_bank_loan',
    };

    onAddLead(newLead);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-100">
                Capture New Solar Sales Lead
              </h3>
              <p className="text-[11px] text-slate-400">
                Instant preliminary sizing & channel tracking
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto text-xs">
          {/* Customer Personal Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Customer Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Michael & Lisa Chen"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Phone Number *</label>
              <input
                type="tel"
                required
                placeholder="e.g. (408) 555-0143"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Email Address</label>
              <input
                type="email"
                placeholder="e.g. mchen.home@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Lead Acquisition Source</label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value as LeadSource)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
              >
                <option value="Facebook Ads">Facebook Ads</option>
                <option value="Google Search">Google Search</option>
                <option value="Website Form">Website Form</option>
                <option value="Customer Referral">Customer Referral</option>
                <option value="Walk-in">Walk-in</option>
                <option value="Cold Call / Canvass">Cold Call / Canvass</option>
              </select>
            </div>
          </div>

          {/* Address & Utility */}
          <div className="space-y-3 pt-2 border-t border-slate-800/80">
            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Street Address *</label>
              <input
                type="text"
                required
                placeholder="e.g. 742 Evergreen Terrace"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-slate-400">City</label>
                <input
                  type="text"
                  placeholder="e.g. Lucknow"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">State</label>
                <input
                  type="text"
                  placeholder="Uttar Pradesh"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">PIN Code</label>
                <input
                  type="text"
                  placeholder="226028"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium">DISCOM Provider & Tariff</label>
              <select
                value={utilityProvider}
                onChange={(e) => setUtilityProvider(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
              >
                {UTILITY_PRESETS.map((p) => (
                  <option key={p.name} value={p.name}>
                    {p.name} ({p.state}) · ₹{p.avgRate}/unit
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Sizing & Bill Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800/80">
            <div className="space-y-1">
              <label className="text-slate-300 font-medium flex justify-between">
                <span>Avg Monthly Electric Bill</span>
                <span className="font-mono text-amber-400">{formatInr(monthlyBill)}/mo</span>
              </label>
              <input
                type="number"
                min="500"
                max="100000"
                step="100"
                value={monthlyBill}
                onChange={(e) => setMonthlyBill(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Assign Sales Consultant</label>
              <select
                value={assignedRepId}
                onChange={(e) => setAssignedRepId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
              >
                {SALES_REPS.map((rep) => (
                  <option key={rep.id} value={rep.id}>
                    {rep.name} ({rep.role} · {rep.assignedCity})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Instant Auto-Sizing Preview Card */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-amber-500/30 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-amber-400 flex items-center gap-1.5 uppercase font-mono tracking-wider">
                <Sun className="w-3.5 h-3.5" />
                Auto-Sized Solar Spec & Subsidy Preview
              </span>
              <span className="text-emerald-400 font-mono font-bold">100% Offset</span>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center font-mono text-xs">
              <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 block">System</span>
                <span className="font-bold text-amber-400">{previewSpecs.systemSizeKw} kW</span>
              </div>
              <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 block">540W Modules</span>
                <span className="font-bold text-slate-200">{previewSpecs.panelCount}p</span>
              </div>
              <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Gross Cost</span>
                <span className="font-bold text-slate-200">{formatInr(previewSpecs.totalGrossCost)}</span>
              </div>
              <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Net After Subsidy</span>
                <span className="font-bold text-emerald-400">{formatInr(previewSpecs.netInvestment)}</span>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-lg shadow-amber-400/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Lead to Pipeline</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
