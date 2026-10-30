import React from 'react';
import { SolarLead, BrandingConfig } from '../types/solar';
import { BharatSolarShaktiLogo } from './BharatSolarShaktiLogo';
import { formatInr } from '../utils/currency';
import { 
  X, 
  Printer, 
  Sun, 
  Battery, 
  ShieldCheck, 
  Zap, 
  TrendingUp, 
  CheckCircle, 
  Leaf, 
  TreePine, 
  Car,
  Download,
  Calendar,
  DollarSign
} from 'lucide-react';

interface ProposalViewerModalProps {
  lead: SolarLead | null;
  branding: BrandingConfig;
  onClose: () => void;
}

export const ProposalViewerModal: React.FC<ProposalViewerModalProps> = ({ lead, branding, onClose }) => {
  if (!lead) return null;

  const { specs } = lead;
  const co2AvoidedTons = Math.round((specs.lifetime25YrSavings * 0.85) / 100);
  const treesPlanted = Math.round(co2AvoidedTons * 16.5);
  const gallonsGasAvoided = Math.round(co2AvoidedTons * 112);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {branding.logoUrl ? (
              <img
                src={branding.logoUrl}
                alt={branding.companyName}
                className="h-8 max-w-[140px] object-contain rounded"
              />
            ) : (
              <BharatSolarShaktiLogo size="sm" showText={false} />
            )}
            <div>
              <h3 className="font-bold text-sm text-slate-100">
                Official Solar PV System Proposal
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                Proposal #{lead.id.toUpperCase()} · Prepared for {lead.fullName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body / Printable Proposal Document */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto print:bg-white print:text-black">
          {/* Proposal Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2.5">
                {branding.logoUrl ? (
                  <img
                    src={branding.logoUrl}
                    alt={branding.companyName}
                    className="h-12 max-w-[200px] object-contain rounded"
                  />
                ) : (
                  <div className="py-1">
                    <BharatSolarShaktiLogo size="md" showText={true} />
                  </div>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-2 font-medium">
                {branding.companyName} · {branding.tagline}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Regd. Office: {branding.address}
              </p>
              <p className="text-[11px] text-amber-400/90 font-mono mt-0.5">
                Support: {branding.email} · Helpline: {branding.phone}
              </p>
            </div>

            <div className="text-left sm:text-right text-xs">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block">Customer Account</span>
              <div className="text-slate-200 font-bold text-sm mt-0.5">{lead.fullName}</div>
              <div className="text-slate-400">{lead.address}</div>
              <div className="text-slate-400">{lead.city}, {lead.state} {lead.pinCode || '226010'}</div>
              <div className="text-amber-400 font-mono text-[11px] mt-1">Discom: {lead.utilityProvider}</div>
            </div>
          </div>

          {/* Sizing Highlights Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-mono">
                System Size
              </span>
              <span className="text-2xl font-black text-amber-400 font-mono block mt-1">
                {specs.systemSizeKw} <span className="text-xs text-slate-400">kW</span>
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">
                {specs.panelCount}x 540W Tier-1 Panels
              </span>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-mono">
                Energy Offset
              </span>
              <span className="text-2xl font-black text-emerald-400 font-mono block mt-1">
                {specs.offsetPercentage}%
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Of Annual Electricity Need
              </span>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-mono">
                Yr 1 Generation
              </span>
              <span className="text-2xl font-black text-sky-400 font-mono block mt-1">
                {specs.estimatedYearOneProductionKwh.toLocaleString()}
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block font-mono">
                Units (kWh) / Year
              </span>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-mono">
                25-Yr Net Savings
              </span>
              <span className="text-2xl font-black text-emerald-300 font-mono block mt-1">
                {formatInr(specs.lifetime25YrSavings)}
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Payback: {specs.paybackPeriodYears} yrs
              </span>
            </div>
          </div>

          {/* Equipment Bill of Materials */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              Engineered Equipment & Warranty Package
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-500 text-[10px] uppercase font-mono block">Solar PV Modules</span>
                <div className="font-semibold text-slate-200">{specs.panelModel}</div>
                <div className="text-[11px] text-amber-400/90 font-mono">{specs.panelCount} units · {specs.panelWattage}W Mono Bifacial</div>
                <div className="text-[10px] text-emerald-400 font-medium">25-Year Performance Warranty (ALMM Approved)</div>
              </div>

              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-500 text-[10px] uppercase font-mono block">Grid-Tied Inverter</span>
                <div className="font-semibold text-slate-200">{specs.inverterType}</div>
                <div className="text-[11px] text-sky-400/90 font-mono">Discom Net Metering Certified</div>
                <div className="text-[10px] text-emerald-400 font-medium">10-Year Comprehensive Warranty & Mobile App</div>
              </div>

              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-500 text-[10px] uppercase font-mono block">Battery Storage (Optional)</span>
                <div className="font-semibold text-slate-200">
                  {specs.batteryModel !== 'None' ? specs.batteryModel : 'On-Grid Net Metering'}
                </div>
                <div className="text-[11px] text-purple-400 font-mono">
                  {specs.batteryCount > 0 ? `${specs.batteryCount}x Storage Pack` : 'Full Grid Banking via Bi-Directional Meter'}
                </div>
                <div className="text-[10px] text-slate-400">
                  {specs.batteryCount > 0 ? '5-Year Replacement Warranty' : 'Zero Maintenance Grid Tie'}
                </div>
              </div>
            </div>
          </div>

          {/* Financial Breakdown: Cash vs 10-Year Surya Ghar Loan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Cash Purchase Deck */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h4 className="font-bold text-slate-200 text-sm font-sans">Direct EPC Purchase</h4>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
                  Max Savings
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-slate-400">
                  <span>Gross Turnkey System Price:</span>
                  <span className="text-slate-200">{formatInr(specs.totalGrossCost)}</span>
                </div>

                <div className="flex justify-between text-emerald-400 font-bold">
                  <span>PM Surya Ghar + UP State Subsidy:</span>
                  <span>-{formatInr(specs.federalTaxCreditAmount)}</span>
                </div>

                <div className="pt-2 border-t border-slate-800 flex justify-between text-slate-100 font-bold text-sm">
                  <span>Net Investment to Customer:</span>
                  <span className="text-amber-400 text-base font-black">
                    {formatInr(specs.netInvestment)}
                  </span>
                </div>

                <div className="text-[10px] text-slate-500 font-sans pt-1">
                  *Subsidy credited directly to customer DBT bank account via National Portal for Rooftop Solar upon meter energization.
                </div>
              </div>
            </div>

            {/* 10-Year Solar Loan Deck */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h4 className="font-bold text-slate-200 text-sm font-sans">SBI / Bank Surya Ghar Loan (10-Yr)</h4>
                <span className="text-[10px] text-sky-400 font-bold bg-sky-950/40 px-2 py-0.5 rounded border border-sky-800/40">
                  Concessional 7% - 8.5%
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-slate-400">
                  <span>Fixed Monthly Solar Loan EMI:</span>
                  <span className="text-emerald-400 font-bold text-sm">{formatInr(specs.monthlyLoanPayment)}/mo</span>
                </div>

                <div className="flex justify-between text-slate-400">
                  <span>Current Monthly Discom Bill:</span>
                  <span className="text-rose-400 font-bold">{formatInr(specs.monthlyBill)}/mo</span>
                </div>

                <div className="pt-2 border-t border-slate-800 flex justify-between text-slate-100 font-bold text-sm">
                  <span>Monthly Cash Savings:</span>
                  <span className="text-emerald-400 text-base font-black">
                    +{formatInr(Math.max(0, specs.monthlyBill - (specs.monthlyLoanPayment || 0)))}/mo
                  </span>
                </div>

                <div className="text-[10px] text-slate-500 font-sans pt-1">
                  *Loan EMI is less than regular electricity bill, generating positive cashflow from Month 1!
                </div>
              </div>
            </div>
          </div>

          {/* Environmental Offset */}
          <div className="bg-emerald-950/20 border border-emerald-500/20 p-4 rounded-2xl flex flex-wrap items-center justify-around gap-4 text-center">
            <div className="flex items-center gap-2 text-left">
              <Leaf className="w-8 h-8 text-emerald-400 shrink-0" />
              <div>
                <span className="text-base font-black text-emerald-300 font-mono block">
                  {co2AvoidedTons} Metric Tonnes
                </span>
                <span className="text-[11px] text-slate-400">CO2 Carbon Footprint Eliminated</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-left">
              <TreePine className="w-8 h-8 text-emerald-400 shrink-0" />
              <div>
                <span className="text-base font-black text-emerald-300 font-mono block">
                  {treesPlanted.toLocaleString()} Trees
                </span>
                <span className="text-[11px] text-slate-400">Equivalent Forest Planted</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-left">
              <Car className="w-8 h-8 text-emerald-400 shrink-0" />
              <div>
                <span className="text-base font-black text-emerald-300 font-mono block">
                  {gallonsGasAvoided.toLocaleString()} Litres
                </span>
                <span className="text-[11px] text-slate-400">Petrol / Diesel Fuel Equivalent</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
