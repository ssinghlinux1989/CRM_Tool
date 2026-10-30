import React, { useState } from 'react';
import { SolarLead, FinancialTransaction, BrandingConfig } from '../types/solar';
import { formatInr } from '../utils/currency';
import { 
  IndianRupee, 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  Receipt, 
  Building2, 
  Truck, 
  Wrench, 
  ArrowUpRight, 
  ArrowDownRight,
  Printer,
  X,
  Landmark,
  ShieldCheck
} from 'lucide-react';

interface FinanceManagerProps {
  leads: SolarLead[];
  transactions: FinancialTransaction[];
  branding: BrandingConfig;
  onAddTransaction: (tx: FinancialTransaction) => void;
  onUpdateLeadFinancials?: (leadId: string, updatedLead: SolarLead) => void;
}

export const FinanceManager: React.FC<FinanceManagerProps> = ({
  leads,
  transactions,
  branding,
  onAddTransaction,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'projects' | 'ledger' | 'invoices'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isAddTxModalOpen, setIsAddTxModalOpen] = useState(false);
  const [selectedInvoiceLead, setSelectedInvoiceLead] = useState<SolarLead | null>(null);

  // New Transaction Form State
  const [newTxLeadId, setNewTxLeadId] = useState<string>(leads[0]?.id || '');
  const [newTxType, setNewTxType] = useState<FinancialTransaction['type']>('inflow_advance');
  const [newTxAmount, setNewTxAmount] = useState<string>('');
  const [newTxDate, setNewTxDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [newTxMode, setNewTxMode] = useState<FinancialTransaction['paymentMode']>('NEFT / RTGS');
  const [newTxRef, setNewTxRef] = useState<string>('');
  const [newTxNotes, setNewTxNotes] = useState<string>('');

  // Computations
  const totalContractRevenue = leads.reduce((acc, l) => acc + (l.financials?.grossContractValue || l.estimatedValue || 0), 0);
  const totalCentralSubsidies = leads.reduce((acc, l) => acc + (l.financials?.centralSubsidy || 0), 0);
  const totalCustomerReceivables = leads.reduce((acc, l) => acc + (l.financials?.customerNetCost || 0), 0);
  const totalCollectedInflows = transactions
    .filter(t => t.type.startsWith('inflow_'))
    .reduce((acc, t) => acc + t.amount, 0);

  const totalPaidOutflows = transactions
    .filter(t => t.type.startsWith('outflow_'))
    .reduce((acc, t) => acc + t.amount, 0);

  const totalPendingBalance = leads.reduce((acc, l) => acc + (l.financials?.balancePending || 0), 0);
  const netOperatingMargin = totalCollectedInflows - totalPaidOutflows;
  const overallGrossMarginPercent = totalContractRevenue > 0 
    ? Math.round(((totalContractRevenue - totalPaidOutflows) / totalContractRevenue) * 100) 
    : 0;

  // Filtered transactions
  const filteredTransactions = transactions.filter(t => {
    const matchesCategory = selectedCategory === 'All' 
      || (selectedCategory === 'Inflows' && t.type.startsWith('inflow_'))
      || (selectedCategory === 'Outflows' && t.type.startsWith('outflow_'))
      || t.category === selectedCategory;
    
    const matchesSearch = searchTerm === '' 
      || (t.customerName && t.customerName.toLowerCase().includes(searchTerm.toLowerCase()))
      || t.referenceNo.toLowerCase().includes(searchTerm.toLowerCase())
      || (t.notes && t.notes.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const handleSaveTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(newTxAmount);
    if (!amountNum || isNaN(amountNum) || amountNum <= 0) return;

    const matchedLead = leads.find(l => l.id === newTxLeadId);

    let category: FinancialTransaction['category'] = 'Revenue';
    if (newTxType === 'outflow_materials') category = 'Procurement';
    else if (newTxType === 'outflow_installation') category = 'Labor';
    else if (newTxType === 'outflow_netmetering') category = 'Regulatory';
    else if (newTxType === 'outflow_overhead') category = 'Operations';

    const tx: FinancialTransaction = {
      id: `ftx-${Date.now().toString().slice(-6)}`,
      leadId: newTxLeadId,
      customerName: matchedLead ? matchedLead.fullName : 'Vendor / Contractor',
      type: newTxType,
      category,
      amount: amountNum,
      date: newTxDate,
      paymentMode: newTxMode,
      referenceNo: newTxRef || `TXN-${Date.now().toString().slice(-4)}`,
      notes: newTxNotes,
      recordedBy: 'Saurabh Admin',
      createdAt: new Date().toISOString()
    };

    onAddTransaction(tx);
    setIsAddTxModalOpen(false);
    setNewTxAmount('');
    setNewTxRef('');
    setNewTxNotes('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div>
          <div className="text-xs text-amber-400 font-mono font-medium mb-1">
            {branding.toolName || 'BSSPL Management Tool'} · {branding.companyName} · All Figures in INR (₹)
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100 tracking-tight">
            Financial Ledger & Project Margins
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Real-time tracking of contract billings, central PM Surya Ghar DBT subsidies, material procurement costs, contractor payments, and pending receivables.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddTxModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300 transition-all shadow-xs active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Record Transaction</span>
          </button>
        </div>
      </div>

      {/* KPI Financial Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Contract Bookings */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Total Booked Revenue</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-100">
            {formatInr(totalContractRevenue)}
          </div>
          <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-400">
            <span className="text-emerald-400 font-semibold">{leads.length} Solar Projects</span>
            <span>• Avg {formatInr(leads.length ? totalContractRevenue / leads.length : 0)}/proj</span>
          </div>
        </div>

        {/* Card 2: Cash Inflow Collected */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Total Cash Inflow</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-400">
            {formatInr(totalCollectedInflows)}
          </div>
          <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-400">
            <span>Includes Advances, Milestones & Subsidies</span>
          </div>
        </div>

        {/* Card 3: Direct Outflows (Procurement & Labor) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Direct Project Outflows</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-400">
            {formatInr(totalPaidOutflows)}
          </div>
          <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-400">
            <span>BOM Materials, Installers & DISCOM</span>
          </div>
        </div>

        {/* Card 4: Outstanding Customer Balance Due */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Customer Receivables Due</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-indigo-300">
            {formatInr(totalPendingBalance)}
          </div>
          <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-400">
            <span className="text-amber-400 font-semibold">{totalCentralSubsidies ? formatInr(totalCentralSubsidies) : '₹0'} PM Subsidy eligible</span>
          </div>
        </div>
      </div>

      {/* Sub Tabs Navigation */}
      <div className="flex items-center gap-1.5 border-b border-slate-800 pb-2 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveSubTab('overview')}
          className={`px-3.5 py-1.5 rounded-lg transition-all ${
            activeSubTab === 'overview'
              ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          P&L Overview
        </button>
        <button
          onClick={() => setActiveSubTab('projects')}
          className={`px-3.5 py-1.5 rounded-lg transition-all ${
            activeSubTab === 'projects'
              ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          Project Margins ({leads.length})
        </button>
        <button
          onClick={() => setActiveSubTab('ledger')}
          className={`px-3.5 py-1.5 rounded-lg transition-all ${
            activeSubTab === 'ledger'
              ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          Transaction Ledger ({transactions.length})
        </button>
        <button
          onClick={() => setActiveSubTab('invoices')}
          className={`px-3.5 py-1.5 rounded-lg transition-all ${
            activeSubTab === 'invoices'
              ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          GST Tax Invoices ({leads.length})
        </button>
      </div>

      {/* TAB 1: OVERVIEW & HEALTH */}
      {activeSubTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Net Margin & Cashflow Summary */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  Cashflow Summary & Realized Net Profit
                </h3>
                <p className="text-xs text-slate-400">Total net operating cash after direct project disbursements</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400">Net Operating Spread:</span>
                <div className={`text-xl font-black ${netOperatingMargin >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {formatInr(netOperatingMargin)}
                </div>
              </div>
            </div>

            {/* Visual Margin Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-300">
                <span>Collections ({formatInr(totalCollectedInflows)})</span>
                <span>Direct Expenses ({formatInr(totalPaidOutflows)})</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden flex">
                <div 
                  className="bg-emerald-500 h-full transition-all duration-500"
                  style={{ width: `${Math.min(100, totalCollectedInflows > 0 ? (totalPaidOutflows / totalCollectedInflows) * 100 : 0)}%` }}
                  title="Expenses percentage of collected inflow"
                />
                <div 
                  className="bg-amber-400 h-full transition-all duration-500"
                  style={{ width: `${Math.max(0, 100 - (totalCollectedInflows > 0 ? (totalPaidOutflows / totalCollectedInflows) * 100 : 0))}%` }}
                  title="Retained Margin"
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Disbursed for Materials & Labor
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span> Retained Gross Margin
                </span>
              </div>
            </div>

            {/* Cost Breakdown Structure */}
            <div className="border-t border-slate-800 pt-5 space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Average Project Cost Benchmark (per kW Rooftop)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
                  <span className="text-[11px] text-slate-400">Solar Modules & Inverter</span>
                  <div className="text-sm font-bold text-slate-100 mt-1">₹35,000 / kW</div>
                  <span className="text-[10px] text-slate-500">Tier-1 Mono PERC / TOPCon</span>
                </div>
                <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
                  <span className="text-[11px] text-slate-400">Structure, BOS & Cable</span>
                  <div className="text-sm font-bold text-slate-100 mt-1">₹12,000 / kW</div>
                  <span className="text-[10px] text-slate-500">HDG 1.5m, DCDB/ACDB, Copper Earthing</span>
                </div>
                <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
                  <span className="text-[11px] text-slate-400">Labor & Net Meter Liaison</span>
                  <div className="text-sm font-bold text-slate-100 mt-1">₹8,000 / kW</div>
                  <span className="text-[10px] text-slate-500">Testing fee, DISCOM JE inspection</span>
                </div>
              </div>
            </div>
          </div>

          {/* PM Surya Ghar Subsidy Tracker Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-amber-400">
              <Landmark className="w-5 h-5" />
              <h3 className="text-base font-bold text-slate-100">PM Surya Ghar Subsidy Radar</h3>
            </div>
            <p className="text-xs text-slate-400">
              Direct Benefit Transfer (DBT) subsidy rules under National Portal:
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <div>
                  <div className="font-bold text-slate-200">1 kW System</div>
                  <div className="text-[10px] text-slate-500">Residential rooftop</div>
                </div>
                <div className="text-sm font-bold text-emerald-400">₹30,000</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <div>
                  <div className="font-bold text-slate-200">2 kW System</div>
                  <div className="text-[10px] text-slate-500">Up to 2 kW capacity</div>
                </div>
                <div className="text-sm font-bold text-emerald-400">₹60,000</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <div>
                  <div className="font-bold text-slate-200">3 kW and Above</div>
                  <div className="text-[10px] text-slate-500">Max central assistance cap</div>
                </div>
                <div className="text-sm font-bold text-emerald-400">₹78,000</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
              <span className="font-bold block mb-1">Total Central Subsidy Sourced:</span>
              <span className="text-base font-black text-amber-400">{formatInr(totalCentralSubsidies)}</span>
              <p className="text-[10px] text-amber-300/80 mt-1">
                Subsidies are credited directly into consumer bank accounts linked with Aadhaar upon WCR verification and net meter energization.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PROJECT-LEVEL MARGINS */}
      {activeSubTab === 'projects' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amber-400" />
              Project-by-Project Financial Profitability
            </h3>
            <span className="text-xs text-slate-400">
              Showing {leads.length} Active Solar Contracts
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Customer / Project</th>
                  <th className="px-3 py-3">Capacity</th>
                  <th className="px-3 py-3">Contract Value</th>
                  <th className="px-3 py-3">PM Subsidy</th>
                  <th className="px-3 py-3">Customer Net</th>
                  <th className="px-3 py-3">Collected</th>
                  <th className="px-3 py-3">Balance Due</th>
                  <th className="px-3 py-3">Direct Cost</th>
                  <th className="px-3 py-3">Gross Margin</th>
                  <th className="px-4 py-3 text-right">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {leads.map((lead) => {
                  const fin = lead.financials || {
                    grossContractValue: lead.estimatedValue,
                    centralSubsidy: 78000,
                    customerNetCost: lead.estimatedValue - 78000,
                    advanceCollected: 0,
                    stagePaymentsCollected: 0,
                    balancePending: lead.estimatedValue - 78000,
                    materialBOMCost: Math.round(lead.estimatedValue * 0.55),
                    installationLaborCost: Math.round(lead.estimatedValue * 0.12),
                    netMeteringLiaisonCost: 7000,
                    grossProfit: Math.round(lead.estimatedValue * 0.30),
                    profitMarginPercent: 30
                  };

                  const totalCollected = (fin.advanceCollected || 0) + (fin.stagePaymentsCollected || 0);
                  const totalDirectCost = (fin.materialBOMCost || 0) + (fin.installationLaborCost || 0) + (fin.netMeteringLiaisonCost || 0);

                  return (
                    <tr key={lead.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-100">{lead.fullName}</div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1">
                          <span>{lead.city}</span> • <span className="font-mono text-slate-500">{lead.consumerNumber || 'UPPCL'}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 font-semibold text-amber-400">
                        {lead.systemSizeKw} kW
                      </td>
                      <td className="px-3 py-3 font-bold text-slate-100">
                        {formatInr(fin.grossContractValue)}
                      </td>
                      <td className="px-3 py-3 font-medium text-emerald-400">
                        {formatInr(fin.centralSubsidy)}
                      </td>
                      <td className="px-3 py-3 font-semibold text-slate-200">
                        {formatInr(fin.customerNetCost)}
                      </td>
                      <td className="px-3 py-3 font-bold text-emerald-400">
                        {formatInr(totalCollected)}
                      </td>
                      <td className="px-3 py-3 font-bold text-rose-400">
                        {formatInr(fin.balancePending)}
                      </td>
                      <td className="px-3 py-3 text-slate-400">
                        {formatInr(totalDirectCost)}
                      </td>
                      <td className="px-3 py-3">
                        <div className="font-bold text-emerald-400">{formatInr(fin.grossProfit)}</div>
                        <div className="text-[10px] text-slate-500">{fin.profitMarginPercent}% margin</div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => setSelectedInvoiceLead(lead)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold transition-colors flex items-center gap-1.5 ml-auto"
                        >
                          <FileText className="w-3.5 h-3.5 text-amber-400" />
                          <span>Tax Invoice</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: LIVE TRANSACTION LEDGER */}
      {activeSubTab === 'ledger' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl space-y-4">
          <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-amber-400" />
                Real-Time Payments & Disbursements Ledger
              </h3>
              <p className="text-xs text-slate-400">Audit-proof records of all inflows, vendor disbursements and subsidies</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search reference, customer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              >
                <option value="All">All Transactions</option>
                <option value="Inflows">All Inflows (Revenue)</option>
                <option value="Outflows">All Outflows (Disbursements)</option>
                <option value="Procurement">Procurement (Materials)</option>
                <option value="Labor">Installation Labor</option>
                <option value="Regulatory">DISCOM Net Metering</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Party / Customer</th>
                  <th className="px-3 py-3">Type / Category</th>
                  <th className="px-3 py-3">Payment Mode</th>
                  <th className="px-3 py-3">Reference / UTR</th>
                  <th className="px-3 py-3">Notes</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {filteredTransactions.map((tx) => {
                  const isInflow = tx.type.startsWith('inflow_');

                  return (
                    <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-4 py-3 font-mono text-slate-400 text-[11px]">
                        {tx.date}
                      </td>
                      <td className="px-4 py-3 font-bold text-slate-100">
                        {tx.customerName || 'Vendor / Contractor'}
                      </td>
                      <td className="px-3 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isInflow
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        }`}>
                          {isInflow ? <ArrowDownRight className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                          {tx.type.replace('inflow_', '').replace('outflow_', '').toUpperCase()}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-slate-300">
                        {tx.paymentMode}
                      </td>
                      <td className="px-3 py-3 font-mono text-slate-400 text-[11px]">
                        {tx.referenceNo}
                      </td>
                      <td className="px-3 py-3 text-slate-400 max-w-xs truncate">
                        {tx.notes || '—'}
                      </td>
                      <td className="px-4 py-3 text-right font-black text-sm">
                        <span className={isInflow ? 'text-emerald-400' : 'text-rose-400'}>
                          {isInflow ? '+' : '-'}{formatInr(tx.amount)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: GST TAX INVOICES */}
      {activeSubTab === 'invoices' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xs">
          <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/60">
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <span>GST Tax Invoices & DISCOM Billing Records</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Official compliant tax invoices for rooftop solar installations under PM Surya Ghar
              </p>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Entity: {branding.companyName}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Invoice # / Customer</th>
                  <th className="px-3 py-3">DISCOM / Consumer No</th>
                  <th className="px-3 py-3">Capacity</th>
                  <th className="px-3 py-3">Taxable Value</th>
                  <th className="px-3 py-3">GST (12% / 18%)</th>
                  <th className="px-3 py-3">Gross Invoice Total</th>
                  <th className="px-3 py-3">PM Subsidy</th>
                  <th className="px-3 py-3">Net Due from Client</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {leads.map((lead, idx) => {
                  const fin = lead.financials || {
                    grossContractValue: lead.estimatedValue,
                    centralSubsidy: 78000,
                    customerNetCost: lead.estimatedValue - 78000,
                    balancePending: lead.estimatedValue - 78000
                  };
                  const taxableValue = Math.round(fin.grossContractValue / 1.138);
                  const gstAmount = fin.grossContractValue - taxableValue;
                  const invoiceNo = `BSS-2025-${(idx + 101).toString()}`;

                  return (
                    <tr key={lead.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-mono text-amber-400 text-[11px] font-semibold">{invoiceNo}</div>
                        <div className="font-bold text-slate-100">{lead.fullName}</div>
                      </td>
                      <td className="px-3 py-3">
                        <div>{lead.utilityProvider}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{lead.consumerNumber || 'UPPCL-Pending'}</div>
                      </td>
                      <td className="px-3 py-3 font-semibold text-slate-200">
                        {lead.systemSizeKw} kW
                      </td>
                      <td className="px-3 py-3 font-mono text-slate-300">
                        {formatInr(taxableValue)}
                      </td>
                      <td className="px-3 py-3 font-mono text-slate-400">
                        {formatInr(gstAmount)}
                      </td>
                      <td className="px-3 py-3 font-mono font-bold text-slate-100">
                        {formatInr(fin.grossContractValue)}
                      </td>
                      <td className="px-3 py-3 font-mono text-emerald-400">
                        {formatInr(fin.centralSubsidy)}
                      </td>
                      <td className="px-3 py-3 font-mono font-bold text-amber-400">
                        {formatInr(fin.customerNetCost)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => setSelectedInvoiceLead(lead)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400/10 hover:bg-amber-400 text-amber-400 hover:text-slate-950 font-bold text-xs transition-all shadow-xs"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>View Invoice</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* RECORD TRANSACTION MODAL */}
      {isAddTxModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-amber-400" />
                Record Financial Entry
              </h3>
              <button
                onClick={() => setIsAddTxModalOpen(false)}
                className="text-slate-400 hover:text-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTransaction} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Associated Project / Customer
                </label>
                <select
                  value={newTxLeadId}
                  onChange={(e) => setNewTxLeadId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  {leads.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.fullName} — {l.systemSizeKw}kW ({l.city})
                    </option>
                  ))}
                  <option value="general_overhead">General Company Operational Expense</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Transaction Classification
                </label>
                <select
                  value={newTxType}
                  onChange={(e) => setNewTxType(e.target.value as FinancialTransaction['type'])}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <optgroup label="Cash Inflow (Revenue)">
                    <option value="inflow_advance">Customer Token Advance</option>
                    <option value="inflow_stage">Stage / Milestone Payment</option>
                    <option value="inflow_balance">Final Customer Balance</option>
                    <option value="inflow_subsidy">PM Surya Ghar Central Subsidy (DBT)</option>
                  </optgroup>
                  <optgroup label="Cash Outflow (Disbursements)">
                    <option value="outflow_materials">Material Procurement (Panels / Inverter)</option>
                    <option value="outflow_installation">Installation Crew & Civil Labor</option>
                    <option value="outflow_netmetering">DISCOM Net Meter Testing & Liaison</option>
                    <option value="outflow_overhead">Freight, Transport & Overhead</option>
                  </optgroup>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Amount (₹ INR)
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 50000"
                    value={newTxAmount}
                    onChange={(e) => setNewTxAmount(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newTxDate}
                    onChange={(e) => setNewTxDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Payment Mode
                  </label>
                  <select
                    value={newTxMode}
                    onChange={(e) => setNewTxMode(e.target.value as FinancialTransaction['paymentMode'])}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="NEFT / RTGS">NEFT / RTGS</option>
                    <option value="UPI">UPI</option>
                    <option value="Bank Transfer">Bank Transfer / IMPS</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Cash">Cash Receipt</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    UTR / Reference No
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. UTR9982410"
                    value={newTxRef}
                    onChange={(e) => setNewTxRef(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Notes & Details
                </label>
                <textarea
                  rows={2}
                  placeholder="Milestone release details, vendor invoice ref, etc."
                  value={newTxNotes}
                  onChange={(e) => setNewTxNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddTxModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300 transition-all shadow-md"
                >
                  Save Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAX INVOICE PREVIEW MODAL */}
      {selectedInvoiceLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-3xl max-w-2xl w-full p-8 shadow-2xl my-auto">
            {/* Action Bar */}
            <div className="flex justify-between items-center pb-4 border-b border-slate-200 print:hidden">
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                GST Tax Invoice — Bharat Solar Shakti Pvt
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-all shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / PDF</span>
                </button>
                <button
                  onClick={() => setSelectedInvoiceLead(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Invoice Body */}
            <div className="mt-6 space-y-6">
              {/* Company & Invoice Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">
                    {branding.companyName}
                  </h2>
                  <p className="text-xs text-slate-600 mt-0.5">{branding.address}</p>
                  <p className="text-xs text-slate-600">Email: {branding.email} | Phone: {branding.phone}</p>
                  <p className="text-xs font-mono font-bold text-slate-800 mt-1">
                    GSTIN: {branding.gstin || '09AAACB1234F1Z8'}
                  </p>
                  <p className="text-[11px] text-amber-700 font-semibold">
                    MNRE / PM Surya Ghar Approved Vendor ID: {branding.pmVendorId || 'UP-MNRE-VND-2024-889'}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-500 uppercase">Tax Invoice</span>
                  <div className="text-sm font-mono font-bold text-slate-900">
                    INV-BSS-2025-{(selectedInvoiceLead.id.replace(/\D/g, '') || '101')}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Date: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </div>
                </div>
              </div>

              {/* Bill To Info */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Customer / Consumer Details:
                  </span>
                  <div className="font-bold text-slate-900 text-sm">{selectedInvoiceLead.fullName}</div>
                  <div className="text-slate-600">{selectedInvoiceLead.address}</div>
                  <div className="text-slate-600">{selectedInvoiceLead.city}, {selectedInvoiceLead.state} - {selectedInvoiceLead.pinCode}</div>
                  <div className="text-slate-600">Phone: {selectedInvoiceLead.phone}</div>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Grid & Subsidy Identifiers:
                  </span>
                  <div className="text-slate-800"><span className="font-semibold">DISCOM:</span> {selectedInvoiceLead.utilityProvider}</div>
                  <div className="text-slate-800 font-mono"><span className="font-semibold">Consumer No:</span> {selectedInvoiceLead.consumerNumber || 'UPPCL-CONS-9918'}</div>
                  <div className="text-slate-800"><span className="font-semibold">Sanctioned Solar:</span> {selectedInvoiceLead.systemSizeKw} kW Rooftop PV</div>
                  <div className="text-emerald-700 font-semibold mt-1">PM Surya Ghar Scheme Applicable</div>
                </div>
              </div>

              {/* Line Items Table */}
              <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Description of Goods & Services</th>
                    <th className="p-3">HSN Code</th>
                    <th className="p-3 text-center">Qty / kW</th>
                    <th className="p-3 text-right">Gross Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-800">
                  <tr>
                    <td className="p-3">
                      <div className="font-bold text-slate-900">
                        {selectedInvoiceLead.systemSizeKw}kW Grid-Tied Solar Rooftop Power Plant
                      </div>
                      <div className="text-[11px] text-slate-600">
                        Tier-1 Mono PERC Solar PV Modules (25-Yr Linear Warranty), On-Grid Inverter, HDG Elevated Structure, ACDB/DCDB, Dual Chemical Earthing & Lightning Protection.
                      </div>
                    </td>
                    <td className="p-3 font-mono text-slate-600">8541</td>
                    <td className="p-3 text-center font-bold">{selectedInvoiceLead.systemSizeKw} kW</td>
                    <td className="p-3 text-right font-bold">
                      {formatInr(selectedInvoiceLead.financials?.grossContractValue || selectedInvoiceLead.estimatedValue)}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Financial Calculation & Subsidy Deduction */}
              <div className="flex justify-end">
                <div className="w-72 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Gross EPC System Value:</span>
                    <span className="font-bold text-slate-900">
                      {formatInr(selectedInvoiceLead.financials?.grossContractValue || selectedInvoiceLead.estimatedValue)}
                    </span>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-semibold bg-emerald-50 px-2 py-1 rounded-lg">
                    <span>Less PM Surya Ghar Subsidy:</span>
                    <span>-{formatInr(selectedInvoiceLead.financials?.centralSubsidy || 78000)}</span>
                  </div>
                  <div className="border-t border-slate-300 pt-2 flex justify-between font-black text-sm text-slate-900">
                    <span>Net Customer Payable:</span>
                    <span className="text-amber-600">
                      {formatInr(selectedInvoiceLead.financials?.customerNetCost || ((selectedInvoiceLead.financials?.grossContractValue || selectedInvoiceLead.estimatedValue) - 78000))}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                    <span>Advance Booking Collected:</span>
                    <span className="text-emerald-700 font-bold">
                      {formatInr(selectedInvoiceLead.financials?.advanceCollected || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] text-rose-600 font-bold">
                    <span>Balance Amount Due:</span>
                    <span>
                      {formatInr(selectedInvoiceLead.financials?.balancePending || 0)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer & Signature */}
              <div className="border-t border-slate-200 pt-6 flex justify-between items-end text-xs text-slate-600">
                <div className="space-y-1">
                  <div className="font-bold text-slate-800">Terms & Conditions:</div>
                  <div className="text-[10px] text-slate-500 max-w-sm">
                    1. 5-year free maintenance and periodic module inspection by Bharat Solar Shakti Pvt.
                    <br />
                    2. Central subsidy will be credited via DBT directly into the bank account registered on the PM Surya Ghar portal.
                  </div>
                </div>
                <div className="text-center space-y-8">
                  <div className="text-xs font-bold text-slate-900">For Bharat Solar Shakti Pvt</div>
                  <div className="border-t border-slate-400 pt-1 text-[10px] text-slate-600 font-semibold">
                    Authorized Signatory
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
