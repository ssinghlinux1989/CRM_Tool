import React, { useState, useRef } from 'react';
import { SolarLead } from '../types/solar';
import { calculateSolarSystem, UTILITY_PRESETS } from '../utils/solarMath';
import { SALES_REPS } from '../data/mockData';
import { 
  X, 
  Upload, 
  FileSpreadsheet, 
  Check, 
  AlertCircle, 
  Download,
  CheckCircle2
} from 'lucide-react';

interface CsvImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportLeads: (leads: SolarLead[]) => void;
}

export const CsvImportModal: React.FC<CsvImportModalProps> = ({ isOpen, onClose, onImportLeads }) => {
  if (!isOpen) return null;

  const [csvText, setCsvText] = useState('');
  const [parsedCount, setParsedCount] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sampleCsv = `Name,Phone,Email,Address,City,State,MonthlyBill,Utility,Source
"Marcus Brody","(408) 555-9011","m.brody@gmail.com","5100 Vista Del Monte","San Jose","CA",340,"PG&E (Pacific Gas & Electric)","Google Search"
"Jessica Lin","(512) 555-3290","jess.lin@outlook.com","1200 Barton Springs Rd","Austin","TX",280,"Oncor Electric Delivery","Customer Referral"
"Aaron Vance","(813) 555-4819","aaron.vance@yahoo.com","402 Harbour Island Way","Tampa","FL",310,"Florida Power & Light (FPL)","Facebook Ads"`;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCsvText(event.target.result as string);
        }
      };
      reader.readAsText(file);
    }
  };

  const parseCsv = () => {
    setErrorMsg(null);
    if (!csvText.trim()) {
      setErrorMsg('Please paste CSV data or upload a file.');
      return;
    }

    try {
      const lines = csvText.trim().split('\n');
      if (lines.length < 2) {
        setErrorMsg('CSV must have a header row and at least one data row.');
        return;
      }

      const newLeads: SolarLead[] = [];

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Basic CSV regex split supporting quoted strings
        const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || line.split(',');
        const cleanMatches = matches.map((m) => m.replace(/^"|"$/g, '').trim());

        const fullName = cleanMatches[0] || `Prospect #${i}`;
        const phone = cleanMatches[1] || '(555) 000-0000';
        const email = cleanMatches[2] || `${fullName.toLowerCase().replace(/\s+/g, '.')}@example.com`;
        const address = cleanMatches[3] || '123 Solar Street';
        const city = cleanMatches[4] || 'Austin';
        const state = cleanMatches[5] || 'TX';
        const monthlyBill = Number(cleanMatches[6]) || 290;
        const utility = cleanMatches[7] || UTILITY_PRESETS[0].name;
        const source = (cleanMatches[8] as any) || 'Website Form';

        const preset = UTILITY_PRESETS.find((u) => u.name.toLowerCase().includes(utility.toLowerCase())) || UTILITY_PRESETS[0];

        const specs = calculateSolarSystem({
          monthlyBill,
          utilityRatePerKwh: preset.avgRate,
          sunHoursPerDay: preset.sunHours,
          targetOffsetPercent: 100,
          costPerWatt: 2.85,
          batteryModel: 'None',
          batteryCount: 0,
        });

        newLeads.push({
          id: `import-${Date.now()}-${i}`,
          fullName,
          phone,
          email,
          address,
          city,
          state: state || 'Uttar Pradesh',
          pinCode: '226010',
          utilityProvider: preset.name,
          consumerNumber: `081${Math.floor(100000000 + Math.random() * 900000000)}`,
          stage: 'leads',
          source,
          assignedRepId: SALES_REPS[0].id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          estimatedValue: specs.totalGrossCost,
          systemSizeKw: specs.systemSizeKw,
          specs,
          financials: {
            grossContractValue: specs.totalGrossCost,
            centralSubsidy: specs.federalTaxCreditAmount,
            customerNetCost: specs.netInvestment,
            advanceCollected: 0,
            stagePaymentsCollected: 0,
            balancePending: specs.netInvestment,
            materialBOMCost: Math.round(specs.totalGrossCost * 0.55),
            installationLaborCost: Math.round(specs.totalGrossCost * 0.12),
            netMeteringLiaisonCost: 6500,
            grossProfit: Math.round(specs.totalGrossCost * 0.30),
            profitMarginPercent: 30
          },
          notes: [`Imported from CSV spreadsheet on ${new Date().toLocaleDateString('en-IN')}.`],
          tags: ['Excel Import', 'Awaiting Bill'],
          priority: 'medium',
          financingPreference: 'pm_suryaghar_bank_loan',
        });
      }

      if (newLeads.length > 0) {
        onImportLeads(newLeads);
        onClose();
      } else {
        setErrorMsg('Could not parse any valid leads from the data.');
      }
    } catch (e: any) {
      setErrorMsg(`Parsing error: ${e.message}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-100">
                Import Leads from Excel / CSV
              </h3>
              <p className="text-[11px] text-slate-400">
                Instant solar PV system auto-sizing on all imported accounts
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-100">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Upload or Paste */}
        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-300 font-medium">Paste CSV Data or Upload File</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCsvText(sampleCsv)}
                className="text-[11px] text-amber-400 hover:text-amber-300 underline"
              >
                Load Sample Template
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".csv,.txt"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 font-mono text-[11px]"
              >
                <Upload className="w-3 h-3" />
                <span>Upload .csv</span>
              </button>
            </div>
          </div>

          <textarea
            rows={8}
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            placeholder='Name,Phone,Email,Address,City,State,MonthlyBill,Utility,Source&#10;"John Doe","(555) 123-4567","john@example.com","100 Main St","Austin","TX",320,"Oncor Electric Delivery","Google Search"'
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 font-mono text-[11px] focus:outline-none focus:border-emerald-500"
          />

          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-800/50 text-rose-300 flex items-center gap-2 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs text-slate-400 hover:text-slate-200"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={parseCsv}
            className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-md shadow-emerald-400/20 transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Process & Import Leads</span>
          </button>
        </div>
      </div>
    </div>
  );
};
