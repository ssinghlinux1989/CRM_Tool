import React, { useState } from 'react';
import { SolarLead, PipelineStage } from '../types/solar';
import { PIPELINE_STAGES, SALES_REPS } from '../data/mockData';
import { 
  X, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Sun, 
  Battery, 
  FileText, 
  Plus, 
  CheckCircle2, 
  Trash2,
  ChevronRight,
  Landmark,
  Truck,
  Wrench,
  Gauge,
  Receipt,
  Share2,
  Headphones,
  Check,
  Building2,
  ShieldCheck,
  Zap,
  Sliders,
  DollarSign
} from 'lucide-react';
import { formatInr } from '../utils/currency';

interface LeadDetailModalProps {
  lead: SolarLead | null;
  onClose: () => void;
  onUpdateLeadStage: (leadId: string, stage: PipelineStage) => void;
  onAddNote: (leadId: string, note: string) => void;
  onDeleteLead: (leadId: string) => void;
  onOpenSizing: (lead: SolarLead) => void;
  onOpenSurvey: (lead: SolarLead) => void;
  onOpenProposal: (lead: SolarLead) => void;
}

export const LeadDetailModal: React.FC<LeadDetailModalProps> = ({
  lead,
  onClose,
  onUpdateLeadStage,
  onAddNote,
  onDeleteLead,
  onOpenSizing,
  onOpenSurvey,
  onOpenProposal,
}) => {
  if (!lead) return null;

  const [newNote, setNewNote] = useState('');
  const [activeTab, setActiveTab] = useState<'workflow' | 'financials' | 'specs' | 'notes'>('workflow');
  const rep = SALES_REPS.find((r) => r.id === lead.assignedRepId) || SALES_REPS[0];

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    onAddNote(lead.id, newNote.trim());
    setNewNote('');
  };

  const currentStageIndex = PIPELINE_STAGES.findIndex(s => s.id === lead.stage);
  const nextStage = currentStageIndex < PIPELINE_STAGES.length - 1 ? PIPELINE_STAGES[currentStageIndex + 1] : null;

  const fin = lead.financials || {
    grossContractValue: lead.estimatedValue,
    centralSubsidy: 78000,
    customerNetCost: lead.estimatedValue - 78000,
    advanceCollected: 25000,
    stagePaymentsCollected: 0,
    balancePending: lead.estimatedValue - 78000 - 25000,
    materialBOMCost: Math.round(lead.estimatedValue * 0.55),
    installationLaborCost: Math.round(lead.estimatedValue * 0.12),
    netMeteringLiaisonCost: 6500,
    grossProfit: Math.round(lead.estimatedValue * 0.30),
    profitMarginPercent: 30
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-100">{lead.fullName}</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  {lead.systemSizeKw} kW Rooftop
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {lead.utilityProvider}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>{lead.address}, {lead.city}, {lead.state} - {lead.pinCode}</span>
                {lead.consumerNumber && (
                  <span className="font-mono text-slate-400 font-bold">
                    • Consumer #{lead.consumerNumber}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onDeleteLead(lead.id)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
              title="Delete Project"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 16-Stage Horizontal Stepper Tracker */}
        <div className="px-6 py-3 bg-slate-950/80 border-b border-slate-800 overflow-x-auto">
          <div className="flex items-center gap-1.5 min-w-[950px]">
            {PIPELINE_STAGES.map((st, idx) => {
              const isPast = idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex;

              return (
                <button
                  key={st.id}
                  onClick={() => onUpdateLeadStage(lead.id, st.id)}
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold transition-all whitespace-nowrap ${
                    isCurrent
                      ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                      : isPast
                      ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      : 'text-slate-600 hover:text-slate-400 bg-slate-900/50'
                  }`}
                  title={st.description}
                >
                  <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-mono ${
                    isCurrent ? 'bg-slate-950 text-amber-400' : isPast ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'
                  }`}>
                    {idx + 1}
                  </span>
                  <span>{st.shortLabel}</span>
                  {idx < PIPELINE_STAGES.length - 1 && (
                    <ChevronRight className="w-2.5 h-2.5 text-slate-600 ml-0.5" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Advance Bar */}
        <div className="px-6 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="text-slate-500">Current Workflow Step:</span>
            <span className="font-bold text-amber-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              {PIPELINE_STAGES[currentStageIndex]?.label}
            </span>
          </div>

          {nextStage && (
            <button
              onClick={() => onUpdateLeadStage(lead.id, nextStage.id)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300 transition-all shadow-sm"
            >
              <span>Advance to Step {currentStageIndex + 2}: {nextStage.shortLabel}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Navigation Tabs Inside Modal */}
        <div className="px-6 pt-3 border-b border-slate-800 flex items-center gap-4 bg-slate-900">
          <button
            onClick={() => setActiveTab('workflow')}
            className={`pb-2.5 text-xs font-bold transition-all border-b-2 ${
              activeTab === 'workflow'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Workflow Stage Details
          </button>
          <button
            onClick={() => setActiveTab('financials')}
            className={`pb-2.5 text-xs font-bold transition-all border-b-2 ${
              activeTab === 'financials'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Project Financials & Subsidy
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-2.5 text-xs font-bold transition-all border-b-2 ${
              activeTab === 'specs'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Technical PV Specifications
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`pb-2.5 text-xs font-bold transition-all border-b-2 ${
              activeTab === 'notes'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Project Audit Log & Notes ({lead.notes.length})
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: WORKFLOW STAGE DETAILS */}
          {activeTab === 'workflow' && (
            <div className="space-y-6">
              {/* Dynamic Step-Specific Card */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Stage {currentStageIndex + 1} Checklist & Deliverables: {PIPELINE_STAGES[currentStageIndex]?.label}
                  </h3>
                  <span className="text-xs text-slate-400">
                    Category: {PIPELINE_STAGES[currentStageIndex]?.category}
                  </span>
                </div>

                {/* Granular stage data preview */}
                {lead.stage === 'leads' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-slate-400 block mb-1">Consumer Electricity Bill:</span>
                      <div className="text-sm font-bold text-slate-100">Monthly Bill: {formatInr(lead.specs.monthlyBill)}</div>
                      <div className="text-slate-400">Consumption: {lead.specs.annualConsumptionKwh.toLocaleString()} kWh/yr</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-slate-400 block mb-1">Lead Source & Executive:</span>
                      <div className="text-sm font-bold text-slate-100">{lead.source}</div>
                      <div className="text-slate-400">Assigned: {rep.name} ({rep.phone})</div>
                    </div>
                  </div>
                )}

                {lead.stage === 'meeting' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-slate-400 block mb-1">Site Meeting Status:</span>
                      <div className="text-sm font-bold text-slate-100">
                        {lead.meetingDetails?.scheduledDate || 'Scheduled for this week'}
                      </div>
                      <div className="text-slate-400">Location: {lead.meetingDetails?.location || lead.address}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-slate-400 block mb-1">Rooftop Physical Feasibility:</span>
                      <div className="text-sm font-bold text-slate-100">~{lead.meetingDetails?.roofAreaApproxSqFt || 400} Sq. Ft. RCC Slab</div>
                      <div className="text-slate-400">Zero Shading / South Orientation</div>
                    </div>
                  </div>
                )}

                {lead.stage === 'sales_quotation' && (
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-200">Formal EPC Quotation: {lead.quotationDetails?.quotationNumber || 'BSS-QUO-2025'}</span>
                      <span className="text-amber-400 font-bold">{lead.systemSizeKw} kW Sizing</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800">
                      <div>
                        <span className="text-slate-500">Gross Price:</span>
                        <div className="font-bold text-slate-100">{formatInr(fin.grossContractValue)}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">PM Central Subsidy:</span>
                        <div className="font-bold text-emerald-400">-{formatInr(fin.centralSubsidy)}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Net Customer Payable:</span>
                        <div className="font-bold text-amber-400">{formatInr(fin.customerNetCost)}</div>
                      </div>
                    </div>
                  </div>
                )}

                {lead.stage === 'conversion' && (
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-200">Contract Signed & Token Received</span>
                      <span className="text-emerald-400 font-bold">Booking Advance: {formatInr(fin.advanceCollected || 25000)}</span>
                    </div>
                    <div className="text-slate-400">Agreement executed. Project ID allocated in EPC registry.</div>
                  </div>
                )}

                {lead.stage === 'pm_portal_reg' && (
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-200">PM Surya Ghar National Portal</span>
                      <span className="text-amber-400 font-mono font-bold">{lead.pmPortalDetails?.applicationNumber || 'PMSGY-UP-LKO-2025-00481'}</span>
                    </div>
                    <div className="text-slate-400">DISCOM: {lead.utilityProvider} • Consumer No: {lead.consumerNumber}</div>
                    <div className="text-emerald-400 font-semibold">Electricity Bill & Consumer Aadhaar linked on national portal.</div>
                  </div>
                )}

                {lead.stage === 'loan' && (
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-200">Jan Samarth / Bank Loan Assistance</span>
                      <span className="text-emerald-400 font-bold">Sanction Status: {lead.loanDetails?.loanStatus || 'Sanctioned (SBI)'}</span>
                    </div>
                    <div className="text-slate-400">Sanctioned Amount: {formatInr(lead.loanDetails?.sanctionedAmount || 112000)} @ 7% p.a. subsidized rooftop rate</div>
                  </div>
                )}

                {lead.stage === 'material_procurement' && (
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-200">BOM Procurement Purchase Order</span>
                      <span className="text-teal-400 font-mono font-bold">{lead.procurementDetails?.poNumber || 'PO-BSS-2025-042'}</span>
                    </div>
                    <div className="text-slate-400">Ordered: 6 x 550W Waaree Mono PERC + Growatt 3.3kW On-Grid Inverter + HDG Elevated Structure</div>
                  </div>
                )}

                {lead.stage === 'inventory' && (
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-200">Warehouse Allocation & Serial Logging</span>
                      <span className="text-cyan-400 font-bold">Lucknow Central Warehouse</span>
                    </div>
                    <div className="text-slate-400">All module serial numbers logged. Ready for site dispatch.</div>
                  </div>
                )}

                {lead.stage === 'installation' && (
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-200">Rooftop Civil & Electrical Installation</span>
                      <span className="text-yellow-400 font-bold">Crew Lead: Ram Kripal Tech</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                      <div>✓ HDG Elevated Structure Assembled</div>
                      <div>✓ 6 x Mono PERC Modules Secured</div>
                      <div>✓ Dual Chemical Earthing Pit Complete</div>
                      <div>✓ ACDB/DCDB & SPD Protection Wired</div>
                    </div>
                  </div>
                )}

                {lead.stage === 'pm_suryaghar_doc' && (
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-200">Work Completion Report (WCR)</span>
                      <span className="text-lime-400 font-mono font-bold">{lead.pmSuryagharDocDetails?.wcrNumber || 'WCR-BSS-2025-081'}</span>
                    </div>
                    <div className="text-slate-400">Geotagged site photos & equipment test certificates uploaded to PM Surya Ghar portal.</div>
                  </div>
                )}

                {lead.stage === 'net_metering' && (
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-200">DISCOM Bi-Directional Net Metering</span>
                      <span className="text-emerald-300 font-bold">Inspection & Sealing</span>
                    </div>
                    <div className="text-slate-400">Meter testing fee paid. DISCOM Junior Engineer verification underway.</div>
                  </div>
                )}

                {lead.stage === 'commissioning' && (
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-200">Grid Synchronization & Energization</span>
                      <span className="text-green-400 font-bold">Plant Energized</span>
                    </div>
                    <div className="text-slate-400">Solar generation synchronized with UPPCL grid. Initial meter test reading logged.</div>
                  </div>
                )}

                {lead.stage === 'balance_payment' && (
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-200">Customer Balance Payment & DBT Claim</span>
                      <span className="text-fuchsia-400 font-bold">Pending: {formatInr(fin.balancePending)}</span>
                    </div>
                    <div className="text-slate-400">Invoicing shared with consumer. DBT subsidy claim initiated on national portal.</div>
                  </div>
                )}

                {lead.stage === 'share_invoices' && (
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-200">Tax Invoice & Warranty Handover</span>
                      <span className="text-rose-400 font-mono font-bold">{lead.invoiceDetails?.gstTaxInvoiceNo || 'INV-BSS-2025-101'}</span>
                    </div>
                    <div className="text-slate-400">25-year solar PV warranty certificate & system manual handed over to customer.</div>
                  </div>
                )}

                {lead.stage === 'support' && (
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-200">Ongoing Solar O&M & Remote Monitoring</span>
                      <span className="text-blue-400 font-bold">5-Yr Free AMC Active</span>
                    </div>
                    <div className="text-slate-400">Remote app connected. Regular quarterly cleaning schedule logged.</div>
                  </div>
                )}
              </div>

              {/* Quick Action Tools */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onOpenSizing(lead)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all"
                >
                  <Sliders className="w-3.5 h-3.5 text-amber-400" />
                  <span>Adjust PV System Sizing</span>
                </button>
                <button
                  onClick={() => onOpenSurvey(lead)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all"
                >
                  <Sun className="w-3.5 h-3.5 text-sky-400" />
                  <span>Site Audit & Photos</span>
                </button>
                <button
                  onClick={() => onOpenProposal(lead)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all"
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-400" />
                  <span>View Customer Proposal</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: FINANCIALS */}
          {activeTab === 'financials' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                  <span className="text-xs text-slate-400 block mb-1">Gross System Cost</span>
                  <div className="text-xl font-black text-slate-100">{formatInr(fin.grossContractValue)}</div>
                  <span className="text-[11px] text-slate-500">₹{lead.specs.costPerWatt}/Wp benchmark</span>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                  <span className="text-xs text-slate-400 block mb-1">PM Surya Ghar Subsidy</span>
                  <div className="text-xl font-black text-emerald-400">-{formatInr(fin.centralSubsidy)}</div>
                  <span className="text-[11px] text-emerald-400/80">Direct Benefit Transfer</span>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                  <span className="text-xs text-slate-400 block mb-1">Customer Net Payable</span>
                  <div className="text-xl font-black text-amber-400">{formatInr(fin.customerNetCost)}</div>
                  <span className="text-[11px] text-slate-500">Excludes subsidy</span>
                </div>
              </div>

              {/* Collections vs Due */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Payment Milestone Progress</h4>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block">Token Advance Received:</span>
                    <span className="font-bold text-emerald-400 text-sm">{formatInr(fin.advanceCollected)}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block">Stage Payments Received:</span>
                    <span className="font-bold text-emerald-400 text-sm">{formatInr(fin.stagePaymentsCollected)}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block">Balance Pending Collection:</span>
                    <span className="font-bold text-rose-400 text-sm">{formatInr(fin.balancePending)}</span>
                  </div>
                </div>
              </div>

              {/* Cost & Gross Margin */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Project Direct Costs & Profitability</h4>
                  <span className="text-xs font-bold text-emerald-400">{fin.profitMarginPercent}% Margin</span>
                </div>
                <div className="grid grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block">Material BOM</span>
                    <span className="font-semibold text-slate-200">{formatInr(fin.materialBOMCost)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Civil & Labor</span>
                    <span className="font-semibold text-slate-200">{formatInr(fin.installationLaborCost)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Liaison & Net Meter</span>
                    <span className="font-semibold text-slate-200">{formatInr(fin.netMeteringLiaisonCost)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Gross Profit</span>
                    <span className="font-bold text-emerald-400">{formatInr(fin.grossProfit)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SPECS */}
          {activeTab === 'specs' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block">Panel Count:</span>
                  <span className="font-bold text-slate-200 text-sm">{lead.specs.panelCount} Panels</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block">Module Wattage:</span>
                  <span className="font-bold text-slate-200 text-sm">{lead.specs.panelWattage || 550}W Mono PERC</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block">Inverter:</span>
                  <span className="font-bold text-slate-200 text-sm">{lead.specs.inverterType}</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block">Annual Solar Gen:</span>
                  <span className="font-bold text-slate-200 text-sm">~{lead.specs.estimatedYearOneProductionKwh} kWh</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: NOTES */}
          {activeTab === 'notes' && (
            <div className="space-y-4">
              <form onSubmit={handleAddNote} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Record an inspection note, client update, or milestone log..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-400 text-slate-950 font-bold rounded-xl text-xs hover:bg-amber-300 transition-colors"
                >
                  Add Note
                </button>
              </form>

              <div className="space-y-2">
                {lead.notes.map((note, idx) => (
                  <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 text-xs text-slate-300">
                    {note}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
