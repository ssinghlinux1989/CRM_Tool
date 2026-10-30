/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  SolarLead, 
  PipelineStage, 
  SolarSystemSpec, 
  SiteSurveyData, 
  BrandingConfig, 
  FollowUpItem, 
  SolarProject,
  ProjectMilestoneStatus,
  FinancialTransaction
} from './types/solar';
import { 
  INITIAL_LEADS, 
  DEFAULT_BRANDING, 
  DEFAULT_FOLLOW_UPS, 
  DEFAULT_PROJECTS,
  DEFAULT_FINANCIAL_TRANSACTIONS,
  PIPELINE_STAGES
} from './data/mockData';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { PipelineBoard } from './components/PipelineBoard';
import { FinanceManager } from './components/FinanceManager';
import { FollowUpQueue } from './components/FollowUpQueue';
import { SolarCalculatorStudio } from './components/SolarCalculatorStudio';
import { ProjectsTracker } from './components/ProjectsTracker';
import { RepLeaderboard } from './components/RepLeaderboard';
import { VercelDeployGuide } from './components/VercelDeployGuide';
import { LeadDetailModal } from './components/LeadDetailModal';
import { SiteSurveyModal } from './components/SiteSurveyModal';
import { ProposalViewerModal } from './components/ProposalViewerModal';
import { NewLeadModal } from './components/NewLeadModal';
import { BrandingSettingsModal } from './components/BrandingSettingsModal';
import { CsvImportModal } from './components/CsvImportModal';
import { ShareAppModal } from './components/ShareAppModal';
import { db, testConnection, handleFirestoreError, OperationType } from './lib/firebase';
import { collection, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore';

const STORAGE_LEADS_KEY = 'bharat_solar_shakti_leads_v3';
const STORAGE_BRANDING_KEY = 'bharat_solar_shakti_branding_v3';
const STORAGE_FOLLOWUPS_KEY = 'bharat_solar_shakti_followups_v3';
const STORAGE_PROJECTS_KEY = 'bharat_solar_shakti_projects_v3';
const STORAGE_TRANSACTIONS_KEY = 'bharat_solar_shakti_transactions_v3';

export default function App() {
  // 1. Leads State
  const [leads, setLeads] = useState<SolarLead[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_LEADS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Could not read leads from localStorage', e);
    }
    return INITIAL_LEADS;
  });

  // 2. Branding State
  const [branding, setBranding] = useState<BrandingConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_BRANDING_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read branding from localStorage', e);
    }
    return DEFAULT_BRANDING;
  });

  // 3. Follow-Ups State
  const [followUps, setFollowUps] = useState<FollowUpItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_FOLLOWUPS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read follow-ups from localStorage', e);
    }
    return DEFAULT_FOLLOW_UPS;
  });

  // 4. Projects State
  const [projects, setProjects] = useState<SolarProject[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PROJECTS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read projects from localStorage', e);
    }
    return DEFAULT_PROJECTS;
  });

  // 5. Financial Transactions State ("all the Finances should be kept on the app")
  const [transactions, setTransactions] = useState<FinancialTransaction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_TRANSACTIONS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read transactions from localStorage', e);
    }
    return DEFAULT_FINANCIAL_TRANSACTIONS;
  });

  // UI Navigation & Regional Filters
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'pipeline' | 'finances' | 'calculator' | 'reps' | 'blueprint' | 'followups' | 'projects'
  >('dashboard');
  const [selectedCity, setSelectedCity] = useState<string>('All Cities');
  const [selectedRole, setSelectedRole] = useState<string>('Admin');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [selectedLead, setSelectedLead] = useState<SolarLead | null>(null);
  const [activeLeadForSizing, setActiveLeadForSizing] = useState<string | undefined>(leads[0]?.id);
  const [leadForSurvey, setLeadForSurvey] = useState<SolarLead | null>(null);
  const [leadForProposal, setLeadForProposal] = useState<SolarLead | null>(null);
  const [isNewLeadOpen, setIsNewLeadOpen] = useState(false);
  const [isBrandingOpen, setIsBrandingOpen] = useState(false);
  const [isImportCsvOpen, setIsImportCsvOpen] = useState(false);
  const [isShareAppOpen, setIsShareAppOpen] = useState(false);

  // Sync with Firestore & test connection on mount
  useEffect(() => {
    testConnection();

    // Firestore listener for leads
    const unsubscribeLeads = onSnapshot(collection(db, 'leads'), (snapshot) => {
      if (!snapshot.empty) {
        const firestoreLeads: SolarLead[] = [];
        snapshot.forEach((docSnap) => {
          firestoreLeads.push(docSnap.data() as SolarLead);
        });
        setLeads(firestoreLeads);
      }
    }, (error) => {
      console.warn('Firestore leads snapshot notification (fallback active):', error.message);
    });

    // Firestore listener for finances
    const unsubscribeFinances = onSnapshot(collection(db, 'finances'), (snapshot) => {
      if (!snapshot.empty) {
        const firestoreTxs: FinancialTransaction[] = [];
        snapshot.forEach((docSnap) => {
          firestoreTxs.push(docSnap.data() as FinancialTransaction);
        });
        setTransactions(firestoreTxs);
      }
    }, (error) => {
      console.warn('Firestore finances snapshot notification (fallback active):', error.message);
    });

    return () => {
      unsubscribeLeads();
      unsubscribeFinances();
    };
  }, []);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_LEADS_KEY, JSON.stringify(leads));
    } catch (e) {
      console.error(e);
    }
  }, [leads]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_BRANDING_KEY, JSON.stringify(branding));
    } catch (e) {
      console.error(e);
    }
  }, [branding]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_FOLLOWUPS_KEY, JSON.stringify(followUps));
    } catch (e) {
      console.error(e);
    }
  }, [followUps]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PROJECTS_KEY, JSON.stringify(projects));
    } catch (e) {
      console.error(e);
    }
  }, [projects]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_TRANSACTIONS_KEY, JSON.stringify(transactions));
    } catch (e) {
      console.error(e);
    }
  }, [transactions]);

  // Available unique cities
  const availableCities = [
    'All Cities',
    ...Array.from(new Set(leads.map((l) => l.city).filter(Boolean))),
  ];

  // City-Scoped Views
  const cityScopedLeads = selectedCity === 'All Cities'
    ? leads
    : leads.filter((l) => l.city.toLowerCase() === selectedCity.toLowerCase());

  const cityScopedFollowUps = selectedCity === 'All Cities'
    ? followUps
    : followUps.filter((f) => f.city.toLowerCase() === selectedCity.toLowerCase());

  const cityScopedProjects = selectedCity === 'All Cities'
    ? projects
    : projects.filter((p) => p.city.toLowerCase() === selectedCity.toLowerCase());

  // Handlers
  const handleUpdateLeadStage = async (leadId: string, newStage: PipelineStage) => {
    const stageObj = PIPELINE_STAGES.find(s => s.id === newStage);
    const stageName = stageObj ? stageObj.label : newStage;

    let updatedLeadRef: SolarLead | null = null;

    setLeads((prev) =>
      prev.map((lead) => {
        if (lead.id === leadId) {
          const updated: SolarLead = {
            ...lead,
            stage: newStage,
            updatedAt: new Date().toISOString(),
            notes: [
              `Workflow moved to ${stageName} on ${new Date().toLocaleDateString('en-IN')}`,
              ...lead.notes,
            ],
          };
          updatedLeadRef = updated;
          if (selectedLead?.id === leadId) setSelectedLead(updated);

          // If stage moved to conversion or later, auto-create project milestone if not present
          if (newStage === 'conversion' && !projects.some((p) => p.leadId === leadId)) {
            const newProj: SolarProject = {
              id: `proj-${Date.now().toString().slice(-4)}`,
              leadId: lead.id,
              customerName: lead.fullName,
              address: lead.address,
              city: lead.city,
              state: lead.state,
              systemSizeKw: lead.systemSizeKw,
              contractValue: lead.financials?.grossContractValue || lead.estimatedValue,
              signedDate: new Date().toISOString().split('T')[0],
              targetPtoDate: new Date(Date.now() + 45 * 86400000).toISOString().split('T')[0],
              currentMilestoneIndex: 0,
              milestones: [
                { id: 'm-1', name: 'Contract Signed & Advance Booking', status: 'completed', targetDate: new Date().toISOString().split('T')[0], completedDate: new Date().toISOString().split('T')[0], assignee: 'Vivek Sharma' },
                { id: 'm-2', name: 'PM Surya Ghar Portal Consumer Reg.', status: 'in_progress', targetDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0], assignee: 'Priya Srivastava' },
                { id: 'm-3', name: 'Jan Samarth Bank Loan Approval', status: 'pending', targetDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0], assignee: 'Saurabh Admin' },
                { id: 'm-4', name: 'Module Mounting & Earthing Installation', status: 'pending', targetDate: new Date(Date.now() + 25 * 86400000).toISOString().split('T')[0], assignee: 'Ram Kripal Tech' },
                { id: 'm-5', name: 'WCR & PM Suryaghar Document Submission', status: 'pending', targetDate: new Date(Date.now() + 32 * 86400000).toISOString().split('T')[0], assignee: 'Priya Srivastava' },
                { id: 'm-6', name: 'DISCOM Net Metering & Plant Energization', status: 'pending', targetDate: new Date(Date.now() + 45 * 86400000).toISOString().split('T')[0], assignee: 'Vivek Sharma' }
              ]
            };
            setProjects((p) => [newProj, ...p]);
          }

          return updated;
        }
        return lead;
      })
    );

    // Sync to Firestore
    if (updatedLeadRef) {
      try {
        await setDoc(doc(db, 'leads', leadId), updatedLeadRef, { merge: true });
      } catch (err) {
        console.warn('Could not sync lead stage update to Firestore:', err);
      }
    }
  };

  const handleAddTransaction = async (tx: FinancialTransaction) => {
    setTransactions((prev) => [tx, ...prev]);

    // Update lead balance and collected amounts
    if (tx.leadId && tx.leadId !== 'general_overhead') {
      setLeads((prev) =>
        prev.map((lead) => {
          if (lead.id === tx.leadId) {
            const currentFin = lead.financials || {
              grossContractValue: lead.estimatedValue,
              centralSubsidy: 78000,
              customerNetCost: lead.estimatedValue - 78000,
              advanceCollected: 0,
              stagePaymentsCollected: 0,
              balancePending: lead.estimatedValue - 78000,
              materialBOMCost: Math.round(lead.estimatedValue * 0.55),
              installationLaborCost: Math.round(lead.estimatedValue * 0.12),
              netMeteringLiaisonCost: 6500,
              grossProfit: Math.round(lead.estimatedValue * 0.30),
              profitMarginPercent: 30
            };

            let updatedAdvance = currentFin.advanceCollected || 0;
            let updatedStage = currentFin.stagePaymentsCollected || 0;

            if (tx.type === 'inflow_advance') updatedAdvance += tx.amount;
            else if (tx.type === 'inflow_stage' || tx.type === 'inflow_balance') updatedStage += tx.amount;

            const updatedBalance = Math.max(0, currentFin.customerNetCost - (updatedAdvance + updatedStage));

            const updatedLead: SolarLead = {
              ...lead,
              financials: {
                ...currentFin,
                advanceCollected: updatedAdvance,
                stagePaymentsCollected: updatedStage,
                balancePending: updatedBalance
              },
              notes: [
                `Payment recorded: +${tx.amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })} (${tx.paymentMode}) ref: ${tx.referenceNo}`,
                ...lead.notes
              ]
            };
            if (selectedLead?.id === lead.id) setSelectedLead(updatedLead);
            return updatedLead;
          }
          return lead;
        })
      );
    }

    // Sync to Firestore
    try {
      await setDoc(doc(db, 'finances', tx.id), tx);
    } catch (err) {
      console.warn('Could not sync transaction to Firestore:', err);
    }
  };

  const handleSaveLeadSpecs = (leadId: string, specs: SolarSystemSpec) => {
    setLeads((prev) =>
      prev.map((lead) => {
        if (lead.id === leadId) {
          const updated: SolarLead = {
            ...lead,
            specs,
            systemSizeKw: specs.systemSizeKw,
            estimatedValue: specs.totalGrossCost,
            financials: {
              ...(lead.financials || {}),
              grossContractValue: specs.totalGrossCost,
              centralSubsidy: specs.federalTaxCreditAmount,
              customerNetCost: specs.netInvestment,
              balancePending: Math.max(0, specs.netInvestment - (lead.financials?.advanceCollected || 0)),
              materialBOMCost: Math.round(specs.totalGrossCost * 0.55),
              installationLaborCost: Math.round(specs.totalGrossCost * 0.12),
              netMeteringLiaisonCost: 6500,
              grossProfit: Math.round(specs.totalGrossCost * 0.30),
              profitMarginPercent: 30
            },
            notes: [
              `Updated PV design: ${specs.systemSizeKw}kW (${specs.panelCount} panels), ₹${specs.totalGrossCost.toLocaleString('en-IN')} gross cost, ₹${specs.federalTaxCreditAmount.toLocaleString('en-IN')} PM subsidy`,
              ...lead.notes,
            ],
          };
          if (selectedLead?.id === leadId) setSelectedLead(updated);
          return updated;
        }
        return lead;
      })
    );
  };

  const handleSaveSurvey = (leadId: string, survey: SiteSurveyData) => {
    setLeads((prev) =>
      prev.map((lead) => {
        if (lead.id === leadId) {
          const updated = {
            ...lead,
            survey,
            notes: [
              `Site survey saved: ${survey.roofType.replace('_', ' ')} roof, ${survey.photos.length} photos, ${survey.mainPanelAmpRating}A main panel ${
                survey.mpuRequired ? '(MPU REQUIRED)' : '(Passes 120% rule)'
              }`,
              ...lead.notes,
            ],
          };
          if (selectedLead?.id === leadId) setSelectedLead(updated);
          return updated;
        }
        return lead;
      })
    );
  };

  const handleAddNote = (leadId: string, noteText: string) => {
    const formattedNote = `${new Date().toLocaleDateString('en-IN')}: ${noteText}`;
    setLeads((prev) =>
      prev.map((lead) => {
        if (lead.id === leadId) {
          const updated = {
            ...lead,
            notes: [formattedNote, ...lead.notes],
          };
          if (selectedLead?.id === leadId) setSelectedLead(updated);
          return updated;
        }
        return lead;
      })
    );
  };

  const handleDeleteLead = async (leadId: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== leadId));
    if (selectedLead?.id === leadId) setSelectedLead(null);
    try {
      await deleteDoc(doc(db, 'leads', leadId));
    } catch (err) {
      console.warn('Could not delete lead from Firestore:', err);
    }
  };

  const handleAddLead = async (newLead: SolarLead) => {
    setLeads((prev) => [newLead, ...prev]);
    setActiveLeadForSizing(newLead.id);
    try {
      await setDoc(doc(db, 'leads', newLead.id), newLead);
    } catch (err) {
      console.warn('Could not add lead to Firestore:', err);
    }
  };

  const handleImportLeads = (newLeads: SolarLead[]) => {
    setLeads((prev) => [...newLeads, ...prev]);
  };

  const handleToggleFollowUpStatus = (id: string) => {
    setFollowUps((prev) =>
      prev.map((f) =>
        f.id === id
          ? { ...f, status: f.status === 'completed' ? 'pending' : 'completed' }
          : f
      )
    );
  };

  const handleRescheduleFollowUp = (id: string, newDate: string) => {
    setFollowUps((prev) =>
      prev.map((f) => (f.id === id ? { ...f, scheduledDate: newDate } : f))
    );
  };

  const handleAddFollowUp = (item: Omit<FollowUpItem, 'id'>) => {
    const newItem: FollowUpItem = {
      ...item,
      id: `fu-${Date.now()}`,
    };
    setFollowUps((prev) => [newItem, ...prev]);
  };

  const handleUpdateMilestone = (
    projectId: string,
    milestoneId: string,
    status: ProjectMilestoneStatus
  ) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          const updatedMilestones = p.milestones.map((m) =>
            m.id === milestoneId
              ? {
                  ...m,
                  status,
                  completedDate: status === 'completed' ? new Date().toISOString().split('T')[0] : undefined,
                }
              : m
          );
          return {
            ...p,
            milestones: updatedMilestones,
          };
        }
        return p;
      })
    );
  };

  const handleExportCsv = () => {
    const headers = [
      'Project ID',
      'Customer Name',
      'Phone',
      'Email',
      'Address',
      'City',
      'State',
      'Pin Code',
      'DISCOM Provider',
      'Consumer Number',
      'Workflow Stage (1-16)',
      'System kW',
      'Panel Count',
      'Inverter',
      'Gross System Cost (INR)',
      'PM Surya Ghar Subsidy (INR)',
      'Customer Net Payable (INR)',
      'Advance Collected (INR)',
      'Balance Due (INR)',
      '25-Yr Savings (INR)',
    ];

    const rows = cityScopedLeads.map((l) => [
      l.id,
      `"${l.fullName}"`,
      `"${l.phone}"`,
      `"${l.email}"`,
      `"${l.address}"`,
      `"${l.city}"`,
      l.state,
      l.pinCode,
      `"${l.utilityProvider}"`,
      `"${l.consumerNumber || ''}"`,
      l.stage,
      l.systemSizeKw,
      l.specs.panelCount,
      `"${l.specs.inverterType}"`,
      l.financials?.grossContractValue || l.estimatedValue,
      l.financials?.centralSubsidy || l.specs.federalTaxCreditAmount,
      l.financials?.customerNetCost || l.specs.netInvestment,
      l.financials?.advanceCollected || 0,
      l.financials?.balancePending || 0,
      l.specs.lifetime25YrSavings,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${branding.companyName.toLowerCase().replace(/\s+/g, '-')}-solar-projects.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Dynamic Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        leads={cityScopedLeads}
        branding={branding}
        followUps={cityScopedFollowUps}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
        availableCities={availableCities}
        onOpenNewLead={() => setIsNewLeadOpen(true)}
        onOpenBranding={() => setIsBrandingOpen(true)}
        onOpenImportCsv={() => setIsImportCsvOpen(true)}
        onExportCsv={handleExportCsv}
        onOpenShareApp={() => setIsShareAppOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main View Port */}
      <main className="flex-1 overflow-x-hidden">
        {/* 1. Admin Dashboard */}
        {activeTab === 'dashboard' && (
          <DashboardView
            leads={cityScopedLeads}
            followUps={cityScopedFollowUps}
            selectedCity={selectedCity}
            onNavigateTab={setActiveTab}
            onSelectLead={(lead) => setSelectedLead(lead)}
          />
        )}

        {/* 2. 16-Stage Workflow Pipeline */}
        {activeTab === 'pipeline' && (
          <PipelineBoard
            leads={cityScopedLeads}
            onUpdateLeadStage={handleUpdateLeadStage}
            onSelectLead={(lead) => setSelectedLead(lead)}
            onOpenSizing={(lead) => {
              setActiveLeadForSizing(lead.id);
              setActiveTab('calculator');
            }}
            onOpenSurvey={(lead) => setLeadForSurvey(lead)}
            onOpenProposal={(lead) => setLeadForProposal(lead)}
            searchQuery={searchQuery}
          />
        )}

        {/* 3. All Finances & P&L ("all the Finances should be kept on the app") */}
        {activeTab === 'finances' && (
          <FinanceManager
            leads={cityScopedLeads}
            transactions={transactions}
            branding={branding}
            onAddTransaction={handleAddTransaction}
          />
        )}

        {/* 4. Proposals & Solar Sizing Studio */}
        {activeTab === 'calculator' && (
          <SolarCalculatorStudio
            leads={cityScopedLeads.length > 0 ? cityScopedLeads : leads}
            activeLeadId={activeLeadForSizing}
            onSaveLeadSpecs={handleSaveLeadSpecs}
            onOpenProposal={(lead) => setLeadForProposal(lead)}
          />
        )}

        {/* 5. Projects Tracker */}
        {activeTab === 'projects' && (
          <ProjectsTracker
            projects={cityScopedProjects}
            leads={cityScopedLeads}
            onUpdateMilestone={handleUpdateMilestone}
            onSelectLead={(lead) => setSelectedLead(lead)}
          />
        )}

        {/* 6. Follow-up Queue */}
        {activeTab === 'followups' && (
          <FollowUpQueue
            followUps={cityScopedFollowUps}
            leads={cityScopedLeads}
            onToggleStatus={handleToggleFollowUpStatus}
            onReschedule={handleRescheduleFollowUp}
            onAddFollowUp={handleAddFollowUp}
            onSelectLead={(lead) => setSelectedLead(lead)}
          />
        )}

        {/* 7. Team & Reps */}
        {activeTab === 'reps' && <RepLeaderboard leads={cityScopedLeads} />}

        {/* 8. Blueprint / Vercel Deploy Guide */}
        {activeTab === 'blueprint' && <VercelDeployGuide />}
      </main>

      {/* Modals */}
      {selectedLead && (
        <LeadDetailModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onUpdateLeadStage={handleUpdateLeadStage}
          onAddNote={handleAddNote}
          onDeleteLead={handleDeleteLead}
          onOpenSizing={(lead) => {
            setActiveLeadForSizing(lead.id);
            setActiveTab('calculator');
          }}
          onOpenSurvey={(lead) => setLeadForSurvey(lead)}
          onOpenProposal={(lead) => setLeadForProposal(lead)}
        />
      )}

      {leadForSurvey && (
        <SiteSurveyModal
          lead={leadForSurvey}
          onClose={() => setLeadForSurvey(null)}
          onSaveSurvey={handleSaveSurvey}
        />
      )}

      {leadForProposal && (
        <ProposalViewerModal
          lead={leadForProposal}
          branding={branding}
          onClose={() => setLeadForProposal(null)}
        />
      )}

      {isNewLeadOpen && (
        <NewLeadModal
          isOpen={isNewLeadOpen}
          onClose={() => setIsNewLeadOpen(false)}
          onAddLead={handleAddLead}
        />
      )}

      {isBrandingOpen && (
        <BrandingSettingsModal
          isOpen={isBrandingOpen}
          onClose={() => setIsBrandingOpen(false)}
          branding={branding}
          onSaveBranding={(b) => setBranding(b)}
        />
      )}

      {isImportCsvOpen && (
        <CsvImportModal
          isOpen={isImportCsvOpen}
          onClose={() => setIsImportCsvOpen(false)}
          onImportLeads={handleImportLeads}
        />
      )}

      {isShareAppOpen && (
        <ShareAppModal
          isOpen={isShareAppOpen}
          onClose={() => setIsShareAppOpen(false)}
          toolName={branding.toolName || 'BSSPL Management Tool'}
          companyName={branding.companyName}
        />
      )}
    </div>
  );
}
