import React, { useState, useEffect } from 'react';
import { 
  SolarLead, 
  SolarSystemSpec 
} from '../types/solar';
import { 
  calculateSolarSystem, 
  UTILITY_PRESETS, 
  BATTERY_OPTIONS 
} from '../utils/solarMath';
import { 
  Sun, 
  Zap, 
  Battery, 
  DollarSign, 
  TrendingUp, 
  CheckCircle, 
  Sliders, 
  Save, 
  FileText, 
  ShieldCheck, 
  Home, 
  Sparkles,
  ArrowRight,
  Layers
} from 'lucide-react';
import { formatInr, formatInrPerUnit, CURRENCY_SYMBOL } from '../utils/currency';

interface SolarCalculatorStudioProps {
  leads: SolarLead[];
  activeLeadId?: string;
  onSaveLeadSpecs: (leadId: string, specs: SolarSystemSpec) => void;
  onOpenProposal: (lead: SolarLead) => void;
}

export const SolarCalculatorStudio: React.FC<SolarCalculatorStudioProps> = ({
  leads,
  activeLeadId,
  onSaveLeadSpecs,
  onOpenProposal,
}) => {
  const selectedLead = leads.find((l) => l.id === activeLeadId) || leads[0];
  const [currentLeadId, setCurrentLeadId] = useState<string>(selectedLead?.id || '');

  // Form State
  const [monthlyBill, setMonthlyBill] = useState<number>(selectedLead?.specs.monthlyBill || 5500);
  const [utilityRate, setUtilityRate] = useState<number>(selectedLead?.specs.utilityRatePerKwh || 7.20);
  const [selectedUtility, setSelectedUtility] = useState<string>(selectedLead?.utilityProvider || UTILITY_PRESETS[0].name);
  const [sunHours, setSunHours] = useState<number>(selectedLead?.specs.sunHoursPerDay || 5.2);
  const [targetOffset, setTargetOffset] = useState<number>(selectedLead?.specs.offsetPercentage || 100);
  const [panelWattage, setPanelWattage] = useState<number>(selectedLead?.specs.panelWattage || 540);
  const [costPerWatt, setCostPerWatt] = useState<number>(selectedLead?.specs.costPerWatt || 52);
  const [batteryModel, setBatteryModel] = useState<any>(selectedLead?.specs.batteryModel || 'None');
  const [batteryCount, setBatteryCount] = useState<number>(selectedLead?.specs.batteryCount || 0);
  const [inverterType, setInverterType] = useState<any>(selectedLead?.specs.inverterType || 'Enphase IQ8+ Micro');
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Sync state when active lead changes from parent or dropdown
  useEffect(() => {
    if (activeLeadId) {
      setCurrentLeadId(activeLeadId);
    }
  }, [activeLeadId]);

  useEffect(() => {
    const lead = leads.find((l) => l.id === currentLeadId);
    if (lead) {
      setMonthlyBill(lead.specs.monthlyBill);
      setUtilityRate(lead.specs.utilityRatePerKwh);
      setSelectedUtility(lead.utilityProvider);
      setSunHours(lead.specs.sunHoursPerDay);
      setCostPerWatt(lead.specs.costPerWatt);
      setBatteryModel(lead.specs.batteryModel || 'None');
      setBatteryCount(lead.specs.batteryCount || 0);
      setInverterType(lead.specs.inverterType);
    }
  }, [currentLeadId]);

  // Handle utility preset selection
  const handleUtilityChange = (utilityName: string) => {
    setSelectedUtility(utilityName);
    const preset = UTILITY_PRESETS.find((u) => u.name === utilityName);
    if (preset) {
      setUtilityRate(preset.avgRate);
      setSunHours(preset.sunHours);
    }
  };

  // Live Recalculation
  const calculatedSpecs: SolarSystemSpec = calculateSolarSystem({
    monthlyBill,
    utilityRatePerKwh: utilityRate,
    sunHoursPerDay: sunHours,
    targetOffsetPercent: targetOffset,
    panelWattage,
    costPerWatt,
    batteryModel,
    batteryCount,
    inverterType,
  });

  const handleSaveToLead = () => {
    if (currentLeadId) {
      onSaveLeadSpecs(currentLeadId, calculatedSpecs);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    }
  };

  const handleLaunchProposal = () => {
    const lead = leads.find((l) => l.id === currentLeadId);
    if (lead) {
      // update lead specs and open proposal
      onSaveLeadSpecs(currentLeadId, calculatedSpecs);
      onOpenProposal({
        ...lead,
        specs: calculatedSpecs,
        systemSizeKw: calculatedSpecs.systemSizeKw,
        estimatedValue: calculatedSpecs.totalGrossCost,
      });
    }
  };

  const roofAreaSqFt = calculatedSpecs.panelCount * 18.5;

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner & Prospect Selector */}
      <div className="bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs tracking-wider uppercase mb-1">
            <Sliders className="w-4 h-4 text-amber-400" />
            PV Engineering & ROI Sizing Engine
          </div>
          <h2 className="text-xl font-bold text-slate-100">
            System Design & Solar Proposal Studio
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time generation models, NEC electrical rules, 30% Federal ITC, and 25-year cashflow ROI
          </p>
        </div>

        {/* Lead Selector & Action */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2 text-xs bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 font-medium">Active Deal:</span>
            <select
              value={currentLeadId}
              onChange={(e) => setCurrentLeadId(e.target.value)}
              className="bg-transparent text-slate-200 font-semibold focus:outline-none"
            >
              {leads.map((l) => (
                <option key={l.id} value={l.id} className="bg-slate-900 text-slate-200">
                  {l.fullName} ({l.city}, {l.state}) - {l.systemSizeKw}kW
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSaveToLead}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border transition-all ${
              saveSuccess
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
          >
            {saveSuccess ? (
              <>
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Specs Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-slate-400" />
                <span>Save to Lead</span>
              </>
            )}
          </button>

          <button
            onClick={handleLaunchProposal}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-lg shadow-amber-400/20 transition-all"
          >
            <FileText className="w-4 h-4 text-slate-950" />
            <span>Generate Client Proposal</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Interactive Engineering Sizing Controls (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Section 1: Utility Consumption & Sun Hours */}
          <div className="bg-slate-900/70 p-5 rounded-2xl border border-slate-800/80 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              1. Electric Bill & Utility Profile
            </h3>

            {/* Utility Preset Selector */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-300 flex justify-between">
                <span>Utility Company & Tariff Schedule</span>
                <span className="font-mono text-amber-400 text-[11px]">{formatInrPerUnit(utilityRate)} / Unit (kWh)</span>
              </label>
              <select
                value={selectedUtility}
                onChange={(e) => handleUtilityChange(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              >
                {UTILITY_PRESETS.map((preset) => (
                  <option key={preset.name} value={preset.name}>
                    {preset.name} ({preset.state}) · ₹{preset.avgRate}/unit · {preset.nemPolicy}
                  </option>
                ))}
              </select>
            </div>

            {/* Monthly Electric Bill Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300">Average Monthly Electricity Bill</span>
                <div className="flex items-center gap-1 font-mono text-sm font-bold text-slate-100 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                  <span>{formatInr(monthlyBill)}</span>
                  <span className="text-slate-500 text-[11px]">/month</span>
                </div>
              </div>
              <input
                type="range"
                min="1000"
                max="35000"
                step="500"
                value={monthlyBill}
                onChange={(e) => setMonthlyBill(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>₹1,000/mo (1-2 kW)</span>
                <span>₹6,000/mo (3-5 kW PM Surya Ghar)</span>
                <span>₹35,000/mo (Commercial / Heavy AC)</span>
              </div>
            </div>

            {/* Sun Hours & Target Offset Sliders Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Peak Sun Hours */}
              <div className="space-y-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800/60">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Peak Sun Hours</span>
                  <span className="font-mono font-bold text-amber-400">{sunHours} hrs/day</span>
                </div>
                <input
                  type="range"
                  min="3.5"
                  max="6.8"
                  step="0.1"
                  value={sunHours}
                  onChange={(e) => setSunHours(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
                <p className="text-[10px] text-slate-500">
                  Northeast: 4.0h · Sunbelt: 5.4h · Southwest: 6.2h
                </p>
              </div>

              {/* Target Offset % */}
              <div className="space-y-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800/60">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Target Energy Offset</span>
                  <span className="font-mono font-bold text-emerald-400">{targetOffset}%</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="130"
                  step="5"
                  value={targetOffset}
                  onChange={(e) => setTargetOffset(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
                <p className="text-[10px] text-slate-500">
                  Target 100-110% to zero out electric charges
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Hardware & Battery Storage Architecture */}
          <div className="bg-slate-900/70 p-5 rounded-2xl border border-slate-800/80 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-400" />
              2. Equipment Selection & Balance of System
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* PV Module Rating */}
              <div className="space-y-1.5">
                <label className="text-xs text-slate-300">Tier-1 Solar PV Modules</label>
                <select
                  value={panelWattage}
                  onChange={(e) => setPanelWattage(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value={405}>Qcells Q.PEAK DUO BLK 405W (All-Black)</option>
                  <option value={430}>REC Alpha Pure-R 430W (Heterojunction)</option>
                  <option value={410}>Canadian Solar HiKu6 410W (Mono-PERC)</option>
                </select>
              </div>

              {/* Inverter Architecture */}
              <div className="space-y-1.5">
                <label className="text-xs text-slate-300">Inverter Architecture</label>
                <select
                  value={inverterType}
                  onChange={(e) => setInverterType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="Enphase IQ8+ Micro">Enphase IQ8+ Microinverters (Module-Level)</option>
                  <option value="SolarEdge HD-Wave String">SolarEdge Home Hub + DC Optimizers</option>
                  <option value="Tesla String">Tesla Solar Inverter with Dual MPPT</option>
                </select>
              </div>
            </div>

            {/* Battery Storage Selector */}
            <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/70 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Battery className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-semibold text-slate-200">
                    Energy Storage System (ESS)
                  </span>
                </div>
                <span className="text-[11px] text-purple-400 font-mono">
                  Essential for NEM 3.0 & Outage Backup
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <select
                    value={batteryModel}
                    onChange={(e) => {
                      const model = e.target.value;
                      setBatteryModel(model);
                      if (model === 'None') setBatteryCount(0);
                      else if (batteryCount === 0) setBatteryCount(1);
                    }}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
                  >
                    <option value="None">No Battery (Grid-Tied Net Metered Only)</option>
                    <option value="Lithium-ion LFP Solar ESS (10 kWh)">Lithium-ion LFP Solar ESS (10 kWh) · ₹1,40,000</option>
                    <option value="Lithium LFP Battery Storage (5 kWh)">Lithium LFP Battery Storage (5 kWh) · ₹75,000</option>
                    <option value="Tubular Lead-Acid Bank (150Ah x 4)">Tubular Lead-Acid Solar Bank (150Ah x 4) · ₹55,000</option>
                  </select>
                </div>

                {batteryModel !== 'None' && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Units:</span>
                    <div className="flex items-center bg-slate-900 rounded-lg border border-slate-800 p-0.5">
                      {[1, 2, 3].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setBatteryCount(num)}
                          className={`px-3 py-1 text-xs font-mono font-medium rounded-md transition-colors ${
                            batteryCount === num
                              ? 'bg-purple-600 text-white font-bold'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {num}x ({(num * (BATTERY_OPTIONS[batteryModel]?.capacityKwh || 13.5)).toFixed(1)} kWh)
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Turnkey Redline / Cost Per Watt Pricing Slider */}
            <div className="space-y-2 pt-1">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300">Turnkey EPC Rate (Per Watt Peak)</span>
                <span className="font-mono font-bold text-amber-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  ₹{costPerWatt.toFixed(1)} / Wp (₹{(costPerWatt * 1000).toLocaleString('en-IN')}/kW)
                </span>
              </div>
              <input
                type="range"
                min="42"
                max="65"
                step="1"
                value={costPerWatt}
                onChange={(e) => setCostPerWatt(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>₹42/Wp (Standard String)</span>
                <span>₹52/Wp (Tier-1 Bifacial)</span>
                <span>₹65/Wp (Enphase Microinverters)</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Real-Time Sizing Outputs & 25-Year Financial Deck (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* System Specification Card */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/20 p-5 rounded-2xl border border-amber-500/30 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  Sized PV System Output
                </span>
                <div className="text-2xl font-black text-slate-100 font-mono">
                  {calculatedSpecs.systemSizeKw} <span className="text-amber-400 text-lg">kW DC</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Solar Energy Offset
                </span>
                <div className="text-2xl font-black text-emerald-400 font-mono">
                  {calculatedSpecs.offsetPercentage}%
                </div>
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase">Panel Count</div>
                <div className="text-base font-bold text-slate-200 mt-0.5">
                  {calculatedSpecs.panelCount} <span className="text-xs text-slate-400 font-normal">Modules</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1">~{roofAreaSqFt} sq ft roof area</div>
              </div>

              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase">Year 1 Production</div>
                <div className="text-base font-bold text-amber-400 mt-0.5">
                  {calculatedSpecs.estimatedYearOneProductionKwh.toLocaleString()} <span className="text-xs text-slate-400 font-normal">kWh/yr</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  Usage: {calculatedSpecs.annualConsumptionKwh.toLocaleString()} kWh
                </div>
              </div>
            </div>

            {/* Financial Deck Breakdown */}
            <div className="bg-slate-950/90 rounded-xl p-4 border border-slate-800 space-y-2.5 text-xs font-mono">
              <div className="flex justify-between items-center text-slate-400">
                <span>Solar PV Modules & Inverters:</span>
                <span className="text-slate-200">{formatInr(calculatedSpecs.grossSystemCost)}</span>
              </div>

              {calculatedSpecs.batteryCost > 0 && (
                <div className="flex justify-between items-center text-purple-300">
                  <span>Battery Storage ({calculatedSpecs.batteryCount}x):</span>
                  <span>+{formatInr(calculatedSpecs.batteryCost)}</span>
                </div>
              )}

              <div className="flex justify-between items-center text-slate-300 pt-2 border-t border-slate-800 font-medium">
                <span>Total Turnkey Gross Cost:</span>
                <span className="text-slate-100 font-bold">{formatInr(calculatedSpecs.totalGrossCost)}</span>
              </div>

              {/* PM Surya Ghar Central & State Subsidy */}
              <div className="flex justify-between items-center text-emerald-400 bg-emerald-950/30 px-2.5 py-1.5 rounded-lg border border-emerald-800/40 font-bold">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  PM Surya Ghar & State Subsidy:
                </span>
                <span>-{formatInr(calculatedSpecs.federalTaxCreditAmount)}</span>
              </div>

              {/* Net Investment */}
              <div className="flex justify-between items-center text-sm pt-1 font-bold">
                <span className="text-slate-200">Net Customer Investment:</span>
                <span className="text-amber-400 text-base font-extrabold">
                  {formatInr(calculatedSpecs.netInvestment)}
                </span>
              </div>
            </div>

            {/* Monthly Comparison: Loan vs Current Bill */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="text-[11px] font-semibold text-slate-300 flex items-center justify-between">
                <span>Monthly Electricity Bill vs Solar EMI</span>
                <span className="text-emerald-400 text-[10px] uppercase font-bold tracking-wider">
                  Day 1 Savings
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center font-mono">
                <div className="bg-rose-950/20 border border-rose-900/40 p-2.5 rounded-lg">
                  <span className="text-[10px] text-slate-400 block">Current Discom Bill</span>
                  <span className="text-base font-bold text-rose-300">{formatInr(monthlyBill)}/mo</span>
                  <span className="text-[10px] text-rose-400/80 block">+4.5% annual tariff hike</span>
                </div>

                <div className="bg-emerald-950/20 border border-emerald-900/40 p-2.5 rounded-lg">
                  <span className="text-[10px] text-slate-400 block">Solar Loan EMI (10-Yr)</span>
                  <span className="text-base font-bold text-emerald-300">
                    {formatInr(calculatedSpecs.monthlyLoanPayment)}/mo
                  </span>
                  <span className="text-[10px] text-emerald-400/80 block">SBI Surya Ghar 8.5% rate</span>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-between font-mono">
                <span>25-Year Cumulative Savings:</span>
                <span className="text-emerald-400 font-bold">
                  +{formatInr(calculatedSpecs.lifetime25YrSavings)}
                </span>
              </div>

              <div className="text-[11px] text-slate-400 flex items-center justify-between font-mono">
                <span>Estimated Payback Horizon:</span>
                <span className="text-slate-200 font-bold">
                  {calculatedSpecs.paybackPeriodYears} years
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
