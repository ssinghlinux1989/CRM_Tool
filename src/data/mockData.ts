import { 
  SolarLead, 
  SolarSalesRep, 
  StageConfig, 
  BrandingConfig, 
  FollowUpItem, 
  SolarProject,
  FinancialTransaction
} from '../types/solar';
import { calculateSolarSystem } from '../utils/solarMath';

export const PIPELINE_STAGES: StageConfig[] = [
  {
    id: 'leads',
    stepNumber: 1,
    label: '1. Leads',
    shortLabel: 'Leads',
    description: 'Initial intake, electricity bill & consumer number captured',
    category: 'Sales & Conversion',
    color: 'text-sky-400',
    badgeBg: 'bg-sky-500/10 border-sky-500/30',
    iconName: 'UserPlus'
  },
  {
    id: 'meeting',
    stepNumber: 2,
    label: '2. Meeting',
    shortLabel: 'Meeting',
    description: 'On-site technical survey & consumer consultation conducted',
    category: 'Sales & Conversion',
    color: 'text-blue-400',
    badgeBg: 'bg-blue-500/10 border-blue-500/30',
    iconName: 'Calendar'
  },
  {
    id: 'sales_quotation',
    stepNumber: 3,
    label: '3. Sales Quotation',
    shortLabel: 'Quotation',
    description: 'Solar design, panel specs, subsidy calculation & quote prepared',
    category: 'Sales & Conversion',
    color: 'text-indigo-400',
    badgeBg: 'bg-indigo-500/10 border-indigo-500/30',
    iconName: 'FileText'
  },
  {
    id: 'approval',
    stepNumber: 4,
    label: '4. Approval',
    shortLabel: 'Approval',
    description: 'Commercial margin sign-off and customer technical consent',
    category: 'Sales & Conversion',
    color: 'text-violet-400',
    badgeBg: 'bg-violet-500/10 border-violet-500/30',
    iconName: 'CheckCircle2'
  },
  {
    id: 'conversion',
    stepNumber: 5,
    label: '5. Conversion',
    shortLabel: 'Conversion',
    description: 'Contract signed and token booking advance received',
    category: 'Sales & Conversion',
    color: 'text-emerald-400',
    badgeBg: 'bg-emerald-500/10 border-emerald-500/30',
    iconName: 'Sparkles'
  },
  {
    id: 'pm_portal_reg',
    stepNumber: 6,
    label: '6. PM Portal Reg.',
    shortLabel: 'PM Portal',
    description: 'National PM Surya Ghar portal consumer registration filed',
    category: 'PM Portal & Financing',
    color: 'text-amber-400',
    badgeBg: 'bg-amber-500/10 border-amber-500/30',
    iconName: 'Landmark'
  },
  {
    id: 'loan',
    stepNumber: 7,
    label: '7. Loan (if available)',
    shortLabel: 'Loan / EMI',
    description: 'Jan Samarth / Bank solar rooftop loan sanction & verification',
    category: 'PM Portal & Financing',
    color: 'text-orange-400',
    badgeBg: 'bg-orange-500/10 border-orange-500/30',
    iconName: 'BadgePercent'
  },
  {
    id: 'material_procurement',
    stepNumber: 8,
    label: '8. Material Procurement',
    shortLabel: 'Procurement',
    description: 'BOM PO placed for Mono PERC panels, inverters & structure',
    category: 'Execution & Inventory',
    color: 'text-teal-400',
    badgeBg: 'bg-teal-500/10 border-teal-500/30',
    iconName: 'Truck'
  },
  {
    id: 'inventory',
    stepNumber: 9,
    label: '9. Inventory',
    shortLabel: 'Inventory',
    description: 'Warehouse stock check, serial logging & site dispatch',
    category: 'Execution & Inventory',
    color: 'text-cyan-400',
    badgeBg: 'bg-cyan-500/10 border-cyan-500/30',
    iconName: 'PackageCheck'
  },
  {
    id: 'installation',
    stepNumber: 10,
    label: '10. Installation',
    shortLabel: 'Installation',
    description: 'RCC structure mounting, module wiring & chemical earthing',
    category: 'Execution & Inventory',
    color: 'text-yellow-400',
    badgeBg: 'bg-yellow-500/10 border-yellow-500/30',
    iconName: 'Wrench'
  },
  {
    id: 'pm_suryaghar_doc',
    stepNumber: 11,
    label: '11. PM Suryaghar Docs',
    shortLabel: 'Doc Submission',
    description: 'WCR, geo-tagged photos & test reports uploaded to portal',
    category: 'DISCOM & Commissioning',
    color: 'text-lime-400',
    badgeBg: 'bg-lime-500/10 border-lime-500/30',
    iconName: 'UploadCloud'
  },
  {
    id: 'net_metering',
    stepNumber: 12,
    label: '12. Net Metering',
    shortLabel: 'Net Metering',
    description: 'DISCOM bi-directional net meter testing and site installation',
    category: 'DISCOM & Commissioning',
    color: 'text-emerald-300',
    badgeBg: 'bg-emerald-400/10 border-emerald-400/30',
    iconName: 'Gauge'
  },
  {
    id: 'commissioning',
    stepNumber: 13,
    label: '13. Commissioning',
    shortLabel: 'Commissioning',
    description: 'Joint DISCOM inspection, grid sync & plant energization',
    category: 'DISCOM & Commissioning',
    color: 'text-green-400',
    badgeBg: 'bg-green-500/10 border-green-500/30',
    iconName: 'Zap'
  },
  {
    id: 'balance_payment',
    stepNumber: 14,
    label: '14. Balance Payment',
    shortLabel: 'Balance Pay',
    description: 'Final customer balance settlement & DBT subsidy claim',
    category: 'Finance & Handover',
    color: 'text-fuchsia-400',
    badgeBg: 'bg-fuchsia-500/10 border-fuchsia-500/30',
    iconName: 'Receipt'
  },
  {
    id: 'share_invoices',
    stepNumber: 15,
    label: '15. Share Invoices',
    shortLabel: 'Share Invoices',
    description: 'GST invoice delivery, 25-yr panel warranty certificates handed over',
    category: 'Finance & Handover',
    color: 'text-rose-400',
    badgeBg: 'bg-rose-500/10 border-rose-500/30',
    iconName: 'Share2'
  },
  {
    id: 'support',
    stepNumber: 16,
    label: '16. Support',
    shortLabel: 'O&M Support',
    description: 'Ongoing remote solar generation monitoring, cleaning & AMC',
    category: 'Finance & Handover',
    color: 'text-blue-300',
    badgeBg: 'bg-blue-400/10 border-blue-400/30',
    iconName: 'Headphones'
  }
];

export const DEFAULT_BRANDING: BrandingConfig = {
  toolName: 'BSSPL Management Tool',
  companyName: 'Bharat Solar Shakti Pvt',
  tagline: 'Empowering India with Clean, Subsidized Rooftop Solar',
  phone: '+91 98390 55221',
  email: 'support@bharatsolarshakti.com',
  address: 'A2, 1401, Omega windsor greens , Lucknow uttar PRadesh 226028',
  licenseNumber: 'UP-MNRE-SOLAR-2024-914',
  accentColor: 'amber',
  currency: '₹',
  gstin: '09AAACB1234F1Z8',
  pmVendorId: 'UP-MNRE-VND-2024-889'
};

export const SALES_REPS: SolarSalesRep[] = [
  {
    id: 'rep-1',
    name: 'Vivek Sharma',
    email: 'vivek.sharma@bharatsolarshakti.com',
    phone: '+91 98390 14820',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'Top Producer',
    assignedCity: 'Lucknow',
    commissionPerWatt: 1.50,
    closedKwThisMonth: 64.8,
    dealsCountThisMonth: 7,
    pipelineValue: 3369600
  },
  {
    id: 'rep-2',
    name: 'Priya Srivastava',
    email: 'priya.s@bharatsolarshakti.com',
    phone: '+91 94150 82910',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    role: 'Operations Manager',
    assignedCity: 'Lucknow',
    commissionPerWatt: 1.25,
    closedKwThisMonth: 48.6,
    dealsCountThisMonth: 5,
    pipelineValue: 2527200
  },
  {
    id: 'rep-3',
    name: 'Amit Verma',
    email: 'amit.verma@bharatsolarshakti.com',
    phone: '+91 99180 33410',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    role: 'Technical Surveyor',
    assignedCity: 'Kanpur',
    commissionPerWatt: 1.00,
    closedKwThisMonth: 32.4,
    dealsCountThisMonth: 4,
    pipelineValue: 1684800
  },
  {
    id: 'rep-4',
    name: 'Saurabh Admin',
    email: 'saurabh.france@gmail.com',
    phone: '+91 98390 55221',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    role: 'Finance Controller',
    assignedCity: 'Lucknow',
    commissionPerWatt: 0,
    closedKwThisMonth: 120,
    dealsCountThisMonth: 14,
    pipelineValue: 6240000
  }
];

export const INITIAL_LEADS: SolarLead[] = [
  {
    id: 'lead-bss-101',
    fullName: 'Dr. Rajeshwar Dayal',
    email: 'r.dayal@gmail.com',
    phone: '+91 94150 18273',
    address: 'B-24, Sector 7, Gomti Nagar',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    pinCode: '226010',
    utilityProvider: 'MVVNL (Madhyanchal UPPCL)',
    consumerNumber: '081293847291',
    stage: 'installation',
    source: 'PM Surya Ghar Portal',
    assignedRepId: 'rep-1',
    createdAt: '2025-01-15T09:30:00Z',
    updatedAt: '2025-02-18T14:20:00Z',
    estimatedValue: 215000,
    systemSizeKw: 3.3,
    specs: calculateSolarSystem({ monthlyBill: 4800, utilityRatePerKwh: 7.50, sunHoursPerDay: 5.2, costPerWatt: 55 }),
    priority: 'high',
    financingPreference: 'pm_suryaghar_bank_loan',
    tags: ['RCC Roof', 'Subsidized 3kW', 'SBI Surya Ghar'],
    notes: [
      'Structure assembly completed. 6 x 550W Mono PERC panels being secured.',
      'Token booking ₹25,000 received. SBI loan sanctioned ₹1,12,000.',
      'PM Surya Ghar registration ref: PMSGY-UP-LKO-2025-00481'
    ],
    financials: {
      grossContractValue: 215000,
      centralSubsidy: 78000,
      customerNetCost: 137000,
      advanceCollected: 25000,
      stagePaymentsCollected: 85000,
      balancePending: 27000,
      materialBOMCost: 118000,
      installationLaborCost: 22000,
      netMeteringLiaisonCost: 6500,
      grossProfit: 68500,
      profitMarginPercent: 31.8
    },
    meetingDetails: {
      scheduledDate: '2025-01-18',
      meetingTime: '11:00 AM',
      location: 'Site - Gomti Nagar',
      assignedExecutive: 'Vivek Sharma',
      roofAreaApproxSqFt: 450,
      customerRequirements: 'Wants maximum subsidy under PM Surya Ghar and zero electricity bill',
      isCompleted: true,
      meetingNotes: 'South-facing RCC slab with zero shading. Excellent solar insolation.'
    },
    quotationDetails: {
      quotationNumber: 'BSS-QUO-2025-0101',
      quoteDate: '2025-01-20',
      validUntil: '2025-02-20',
      systemKw: 3.3,
      panelBrand: 'Tata Power / Waaree 550W Mono PERC',
      inverterBrand: 'Growatt 3.3kW On-Grid',
      grossCost: 215000,
      subsidyAmount: 78000,
      netCostToCustomer: 137000,
      paybackYears: 3.2,
      annualSavings: 42000,
      quotationStatus: 'customer_reviewed'
    },
    approvalDetails: {
      approvedBy: 'Saurabh Admin',
      approvalDate: '2025-01-22',
      commercialDiscountAmount: 3000,
      finalApprovedCost: 215000,
      managerComments: 'Standard commercial margin confirmed. Verified MNRE subsidy slab.',
      isApproved: true
    },
    conversionDetails: {
      conversionDate: '2025-01-24',
      bookingAdvancePaid: 25000,
      receiptNumber: 'BSS-REC-089',
      paymentMode: 'UPI',
      contractAgreementSigned: true,
      bookingReference: 'BSS-CNV-0101'
    },
    pmPortalDetails: {
      applicationNumber: 'PMSGY-UP-LKO-2025-00481',
      consumerNumber: '081293847291',
      discomName: 'Madhyanchal Vidyut Vitaran Nigam Ltd (MVVNL)',
      divisionSubdivision: 'Gomti Nagar Div III',
      portalSubmissionDate: '2025-01-26',
      applicationStatus: 'approved',
      electricityBillDocUploaded: true
    },
    loanDetails: {
      isLoanRequired: true,
      bankOrNbfcName: 'State Bank of India (Jan Samarth)',
      appliedAmount: 112000,
      sanctionedAmount: 112000,
      interestRatePercent: 7.0,
      tenureYears: 7,
      loanStatus: 'sanctioned',
      sanctionLetterNo: 'SBI-SURYAGHAR-LKO-9941',
      disbursedDate: '2025-02-05'
    },
    procurementDetails: {
      poNumber: 'PO-BSS-2025-042',
      panelsCount: 6,
      panelsWattage: 550,
      panelsBrand: 'Waaree Bi-Facial 550W',
      inverterModel: 'Growatt MIN 3300TL-X',
      bosKitOrdered: true,
      moduleMountingStructureType: 'HDG Elevated 1.5m Superstructure',
      supplierName: 'SolarTech Components UP Pvt Ltd',
      poAmount: 118000,
      orderDate: '2025-02-06',
      estimatedDeliveryDate: '2025-02-12',
      procurementStatus: 'delivered'
    },
    inventoryDetails: {
      warehouse: 'Lucknow Central Warehouse, Transport Nagar',
      modulesReceivedCount: 6,
      modulesSerialNumbers: ['WAA550-24901', 'WAA550-24902', 'WAA550-24903', 'WAA550-24904', 'WAA550-24905', 'WAA550-24906'],
      inverterSerialNo: 'GW-MIN-3300-88192',
      allocatedToSiteDate: '2025-02-14',
      dispatchVehicleNo: 'UP32 EZ 4419',
      isDispatchedToSite: true
    },
    installationDetails: {
      installationTeamLeader: 'Ram Kripal (Senior EPC Tech)',
      crewMembersCount: 4,
      startDate: '2025-02-16',
      targetCompletionDate: '2025-02-21',
      structureErected: true,
      modulesMounted: true,
      inverterAndDcdbWired: true,
      earthingChemicalPitDone: true,
      lightningArresterInstalled: true,
      installationStatus: 'underway'
    }
  },
  {
    id: 'lead-bss-102',
    fullName: 'Anuradha Saxena',
    email: 'anuradha.saxena@outlook.com',
    phone: '+91 98391 77201',
    address: 'Plot 44, Indira Nagar, Near Kaleva',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    pinCode: '226016',
    utilityProvider: 'MVVNL (Madhyanchal UPPCL)',
    consumerNumber: '081992019482',
    stage: 'net_metering',
    source: 'Customer Referral',
    assignedRepId: 'rep-2',
    createdAt: '2025-01-05T10:15:00Z',
    updatedAt: '2025-02-20T11:45:00Z',
    estimatedValue: 310000,
    systemSizeKw: 5.0,
    specs: calculateSolarSystem({ monthlyBill: 7500, utilityRatePerKwh: 7.60, sunHoursPerDay: 5.2, costPerWatt: 53 }),
    priority: 'high',
    financingPreference: 'cash',
    tags: ['RCC Roof', '5kW System', 'Net Metering in Progress'],
    notes: [
      'Plant installation completed. Work Completion Report submitted.',
      'DISCOM net meter testing receipt paid (₹2,500). Junior Engineer inspection scheduled this week.'
    ],
    financials: {
      grossContractValue: 310000,
      centralSubsidy: 78000,
      customerNetCost: 232000,
      advanceCollected: 50000,
      stagePaymentsCollected: 140000,
      balancePending: 42000,
      materialBOMCost: 165000,
      installationLaborCost: 28000,
      netMeteringLiaisonCost: 8000,
      grossProfit: 109000,
      profitMarginPercent: 35.1
    },
    netMeteringDetails: {
      discomApplicationNo: 'MVVNL-NET-2025-8819',
      meterTestingFeeReceiptNo: 'UPPCL-RCT-449102',
      meterTestingPassed: true,
      biDirectionalMeterNumber: 'GENUS-BD-88194',
      discomJeInspectorName: 'Er. Sandeep Mishra (MVVNL JE)',
      status: 'meter_testing'
    },
    pmSuryagharDocDetails: {
      wcrNumber: 'WCR-BSS-2025-081',
      wcrDate: '2025-02-12',
      geotaggedPhotosTaken: true,
      inverterSerialNumberProof: true,
      earthingTestCertificateUploaded: true,
      inspectionFormSigned: true,
      nationalPortalSubmissionStatus: 'uploaded'
    }
  },
  {
    id: 'lead-bss-103',
    fullName: 'Mahesh Chandra Gupta',
    email: 'mcgupta.kanpur@gmail.com',
    phone: '+91 94501 29482',
    address: '112/48, Swaroop Nagar',
    city: 'Kanpur',
    state: 'Uttar Pradesh',
    pinCode: '208002',
    utilityProvider: 'KESCO Kanpur',
    consumerNumber: '028472910482',
    stage: 'sales_quotation',
    source: 'Google Search',
    assignedRepId: 'rep-3',
    createdAt: '2025-02-10T11:00:00Z',
    updatedAt: '2025-02-19T16:00:00Z',
    estimatedValue: 155000,
    systemSizeKw: 2.2,
    specs: calculateSolarSystem({ monthlyBill: 3200, utilityRatePerKwh: 7.80, sunHoursPerDay: 5.1, costPerWatt: 56 }),
    priority: 'medium',
    financingPreference: 'cash',
    tags: ['KESCO', '2kW Residential', 'Quotation Shared'],
    notes: [
      'Site meeting conducted by Amit Verma. Roof area 300 sq ft.',
      'Quotation sent for 2.2kW with ₹60,000 PM Surya Ghar subsidy.'
    ],
    financials: {
      grossContractValue: 155000,
      centralSubsidy: 60000,
      customerNetCost: 95000,
      advanceCollected: 0,
      stagePaymentsCollected: 0,
      balancePending: 95000,
      materialBOMCost: 82000,
      installationLaborCost: 16000,
      netMeteringLiaisonCost: 5000,
      grossProfit: 52000,
      profitMarginPercent: 33.5
    },
    quotationDetails: {
      quotationNumber: 'BSS-QUO-2025-0142',
      quoteDate: '2025-02-18',
      validUntil: '2025-03-18',
      systemKw: 2.2,
      panelBrand: 'Goldi Solar 550W Mono PERC (4 Panels)',
      inverterBrand: 'Havells 2.5kW Solar Inverter',
      grossCost: 155000,
      subsidyAmount: 60000,
      netCostToCustomer: 95000,
      paybackYears: 2.9,
      annualSavings: 33000,
      quotationStatus: 'shared'
    }
  },
  {
    id: 'lead-bss-104',
    fullName: 'Col. Vikramaditya Singh (Retd)',
    email: 'col.vikram@gmail.com',
    phone: '+91 98399 22441',
    address: 'B-14, Cantt Area, Near Sadar Bazaar',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    pinCode: '226002',
    utilityProvider: 'MVVNL (UPPCL Cantt)',
    consumerNumber: '081492049102',
    stage: 'support',
    source: 'Walk-in / Office',
    assignedRepId: 'rep-1',
    createdAt: '2024-11-10T12:00:00Z',
    updatedAt: '2025-02-21T09:00:00Z',
    estimatedValue: 480000,
    systemSizeKw: 10.0,
    specs: calculateSolarSystem({ monthlyBill: 16000, utilityRatePerKwh: 7.50, sunHoursPerDay: 5.2, costPerWatt: 50 }),
    priority: 'low',
    financingPreference: 'cash',
    tags: ['Fully Commissioned', '10kW Hybrid', 'AMC Active', 'Subsidy Disbursed'],
    notes: [
      'Plant commissioned on Dec 20, 2024. Generating average 44 units/day.',
      'Central DBT subsidy ₹78,000 received directly into consumer bank account.',
      'Quarterly module cleaning done on Feb 15. All strings operating at peak efficiency.'
    ],
    financials: {
      grossContractValue: 480000,
      centralSubsidy: 78000,
      customerNetCost: 402000,
      advanceCollected: 100000,
      stagePaymentsCollected: 250000,
      balancePending: 0,
      materialBOMCost: 260000,
      installationLaborCost: 45000,
      netMeteringLiaisonCost: 12000,
      grossProfit: 163000,
      profitMarginPercent: 33.9
    },
    supportDetails: {
      amcTier: 'Standard Free 5-Yr O&M',
      plantMonitoringAppId: 'BSS-MON-10KW-LKO-441',
      firstYearFreeCleaningVisits: 4,
      cleaningVisitsCompleted: 1,
      lastServiceDate: '2025-02-15',
      nextScheduledVisitDate: '2025-05-15',
      openTickets: 0,
      totalGenerationLifetimeKwh: 2840
    },
    invoiceDetails: {
      gstTaxInvoiceNo: 'INV-BSS-2024-0092',
      invoiceDate: '2024-12-22',
      taxableAmount: 428571,
      cgstAmount: 25714,
      sgstAmount: 25714,
      totalInvoiceWithGst: 480000,
      warrantyCardShared: true,
      inverterWarrantyShared: true,
      customerAcknowledgementReceived: true
    }
  },
  {
    id: 'lead-bss-105',
    fullName: 'Sunil Kumar Agrawal',
    email: 'sk.agrawal.traders@yahoo.in',
    phone: '+91 94151 88392',
    address: 'Near Ram Mandir Road, Naya Ghat',
    city: 'Ayodhya',
    state: 'Uttar Pradesh',
    pinCode: '224123',
    utilityProvider: 'MVVNL Ayodhya Division',
    consumerNumber: '081394019283',
    stage: 'pm_portal_reg',
    source: 'Canvass / Field Survey',
    assignedRepId: 'rep-2',
    createdAt: '2025-02-01T14:30:00Z',
    updatedAt: '2025-02-19T10:00:00Z',
    estimatedValue: 245000,
    systemSizeKw: 4.0,
    specs: calculateSolarSystem({ monthlyBill: 5500, utilityRatePerKwh: 7.50, sunHoursPerDay: 5.3, costPerWatt: 54 }),
    priority: 'high',
    financingPreference: 'pm_suryaghar_bank_loan',
    tags: ['Ayodhya Solar City', '4kW System', 'Portal Registered'],
    notes: [
      'Agreement executed with advance payment ₹30,000.',
      'Application uploaded on PM Surya Ghar portal. Consumer id verified with MVVNL Ayodhya.'
    ],
    financials: {
      grossContractValue: 245000,
      centralSubsidy: 78000,
      customerNetCost: 167000,
      advanceCollected: 30000,
      stagePaymentsCollected: 0,
      balancePending: 137000,
      materialBOMCost: 132000,
      installationLaborCost: 24000,
      netMeteringLiaisonCost: 7000,
      grossProfit: 82000,
      profitMarginPercent: 33.4
    },
    pmPortalDetails: {
      applicationNumber: 'PMSGY-UP-AYO-2025-00192',
      consumerNumber: '081394019283',
      discomName: 'MVVNL (Ayodhya Circle)',
      divisionSubdivision: 'Faizabad Urban Div I',
      portalSubmissionDate: '2025-02-16',
      applicationStatus: 'submitted',
      electricityBillDocUploaded: true
    }
  },
  {
    id: 'lead-bss-106',
    fullName: 'Er. Alok Srivastava',
    email: 'alok.sri@tcs.com',
    phone: '+91 97930 11942',
    address: 'House 88, Eldeco Greens, Gomti Nagar',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    pinCode: '226010',
    utilityProvider: 'MVVNL (UPPCL)',
    consumerNumber: '081290384719',
    stage: 'meeting',
    source: 'UPPCL Consumer Outreach',
    assignedRepId: 'rep-1',
    createdAt: '2025-02-18T08:00:00Z',
    updatedAt: '2025-02-21T12:00:00Z',
    estimatedValue: 215000,
    systemSizeKw: 3.3,
    specs: calculateSolarSystem({ monthlyBill: 4600, utilityRatePerKwh: 7.50, sunHoursPerDay: 5.2, costPerWatt: 55 }),
    priority: 'medium',
    financingPreference: 'pm_suryaghar_bank_loan',
    tags: ['Meeting Scheduled', '3kW Inquiry', 'Gomti Nagar'],
    notes: [
      'Inquired via portal. Meeting booked for Sunday 11 AM.',
      'Requested technical review of momty shadow and elevated structure feasibility.'
    ],
    financials: {
      grossContractValue: 215000,
      centralSubsidy: 78000,
      customerNetCost: 137000,
      advanceCollected: 0,
      stagePaymentsCollected: 0,
      balancePending: 137000,
      materialBOMCost: 118000,
      installationLaborCost: 22000,
      netMeteringLiaisonCost: 6500,
      grossProfit: 68500,
      profitMarginPercent: 31.8
    },
    meetingDetails: {
      scheduledDate: '2025-02-23',
      meetingTime: '11:00 AM',
      location: 'Eldeco Greens, Gomti Nagar',
      assignedExecutive: 'Vivek Sharma',
      roofAreaApproxSqFt: 500,
      customerRequirements: 'Wants elevated structure to use rooftop as terrace garden',
      isCompleted: false
    }
  }
];

export const DEFAULT_FINANCIAL_TRANSACTIONS: FinancialTransaction[] = [
  {
    id: 'ftx-101',
    leadId: 'lead-bss-101',
    customerName: 'Dr. Rajeshwar Dayal',
    type: 'inflow_advance',
    category: 'Revenue',
    amount: 25000,
    date: '2025-01-24',
    paymentMode: 'UPI',
    referenceNo: 'UPI/502410948291',
    notes: 'Token booking advance for 3.3kW solar rooftop project',
    recordedBy: 'Saurabh Admin',
    createdAt: '2025-01-24T10:00:00Z'
  },
  {
    id: 'ftx-102',
    leadId: 'lead-bss-101',
    customerName: 'Dr. Rajeshwar Dayal',
    type: 'inflow_stage',
    category: 'Revenue',
    amount: 85000,
    date: '2025-02-14',
    paymentMode: 'NEFT / RTGS',
    referenceNo: 'SBIN00084920194',
    notes: 'Stage payment upon material delivery at site',
    recordedBy: 'Saurabh Admin',
    createdAt: '2025-02-14T15:30:00Z'
  },
  {
    id: 'ftx-103',
    leadId: 'lead-bss-101',
    customerName: 'SolarTech Components UP Pvt Ltd',
    type: 'outflow_materials',
    category: 'Procurement',
    amount: 118000,
    date: '2025-02-06',
    paymentMode: 'Bank Transfer',
    referenceNo: 'HDFC-TX-9948102',
    notes: 'PO-BSS-2025-042: 6 x Waaree 550W + Growatt 3.3kW inverter + Structure',
    recordedBy: 'Priya Srivastava',
    createdAt: '2025-02-06T12:00:00Z'
  },
  {
    id: 'ftx-104',
    leadId: 'lead-bss-102',
    customerName: 'Anuradha Saxena',
    type: 'inflow_advance',
    category: 'Revenue',
    amount: 50000,
    date: '2025-01-10',
    paymentMode: 'NEFT / RTGS',
    referenceNo: 'ICIC009481920',
    notes: 'Booking advance for 5kW Solar EPC agreement',
    recordedBy: 'Saurabh Admin',
    createdAt: '2025-01-10T14:00:00Z'
  },
  {
    id: 'ftx-105',
    leadId: 'lead-bss-102',
    customerName: 'Anuradha Saxena',
    type: 'inflow_stage',
    category: 'Revenue',
    amount: 140000,
    date: '2025-02-02',
    paymentMode: 'NEFT / RTGS',
    referenceNo: 'ICIC009849102',
    notes: 'Milestone 2 payment on structure & panel mounting completion',
    recordedBy: 'Saurabh Admin',
    createdAt: '2025-02-02T16:20:00Z'
  },
  {
    id: 'ftx-106',
    leadId: 'lead-bss-102',
    customerName: 'MVVNL Electricity Distribution',
    type: 'outflow_netmetering',
    category: 'Regulatory',
    amount: 2500,
    date: '2025-02-15',
    paymentMode: 'Bank Transfer',
    referenceNo: 'UPPCL-RCT-449102',
    notes: 'Bi-directional net meter testing and liaison fees',
    recordedBy: 'Priya Srivastava',
    createdAt: '2025-02-15T11:00:00Z'
  },
  {
    id: 'ftx-107',
    leadId: 'lead-bss-104',
    customerName: 'Col. Vikramaditya Singh',
    type: 'inflow_balance',
    category: 'Revenue',
    amount: 52000,
    date: '2024-12-22',
    paymentMode: 'Cheque',
    referenceNo: 'CHQ-994821-SBI',
    notes: 'Final balance payment cleared upon net meter energization',
    recordedBy: 'Saurabh Admin',
    createdAt: '2024-12-22T17:00:00Z'
  },
  {
    id: 'ftx-108',
    leadId: 'lead-bss-104',
    customerName: 'Ministry of New & Renewable Energy (MNRE)',
    type: 'inflow_subsidy',
    category: 'Revenue',
    amount: 78000,
    date: '2025-01-28',
    paymentMode: 'Bank Transfer',
    referenceNo: 'DBT-MNRE-UPPCL-48192',
    notes: 'Direct Benefit Transfer (DBT) central subsidy disbursed',
    recordedBy: 'Saurabh Admin',
    createdAt: '2025-01-28T10:00:00Z'
  }
];

export const DEFAULT_FOLLOW_UPS: FollowUpItem[] = [
  {
    id: 'fu-1',
    leadId: 'lead-bss-106',
    leadName: 'Er. Alok Srivastava',
    city: 'Lucknow',
    title: 'Site Meeting & Structural Feasibility',
    scheduledDate: '2025-02-23',
    type: 'Site Visit',
    priority: 'high',
    status: 'pending',
    notes: 'Evaluate momty shadow and elevated structure placement.'
  },
  {
    id: 'fu-2',
    leadId: 'lead-bss-102',
    leadName: 'Anuradha Saxena',
    city: 'Lucknow',
    title: 'Followup with MVVNL Junior Engineer on Net Metering',
    scheduledDate: '2025-02-22',
    type: 'Net Metering Liaison',
    priority: 'high',
    status: 'pending',
    notes: 'Meter testing passed. Coordinate physical meter installation date.'
  },
  {
    id: 'fu-3',
    leadId: 'lead-bss-103',
    leadName: 'Mahesh Chandra Gupta',
    city: 'Kanpur',
    title: 'Review 2.2kW Quotation & Commercial Discount',
    scheduledDate: '2025-02-24',
    type: 'Proposal Review',
    priority: 'medium',
    status: 'pending',
    notes: 'Client comparing with local vendor. Highlight Tier-1 panels and 5-yr free AMC.'
  }
];

export const DEFAULT_PROJECTS: SolarProject[] = [
  {
    id: 'proj-101',
    leadId: 'lead-bss-101',
    customerName: 'Dr. Rajeshwar Dayal',
    address: 'B-24, Sector 7, Gomti Nagar',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    systemSizeKw: 3.3,
    contractValue: 215000,
    signedDate: '2025-01-24',
    targetPtoDate: '2025-03-10',
    currentMilestoneIndex: 3,
    milestones: [
      { id: 'm-1', name: 'Contract Signed & Advance Booking', status: 'completed', targetDate: '2025-01-24', completedDate: '2025-01-24', assignee: 'Vivek Sharma' },
      { id: 'm-2', name: 'PM Surya Ghar Portal Consumer Reg.', status: 'completed', targetDate: '2025-01-26', completedDate: '2025-01-26', assignee: 'Priya Srivastava' },
      { id: 'm-3', name: 'SBI Surya Ghar Loan Sanction', status: 'completed', targetDate: '2025-02-05', completedDate: '2025-02-05', assignee: 'Saurabh Admin' },
      { id: 'm-4', name: 'Material Dispatch & Mechanical Installation', status: 'in_progress', targetDate: '2025-02-21', assignee: 'Ram Kripal Tech' },
      { id: 'm-5', name: 'PM Suryaghar WCR & Photo Submission', status: 'pending', targetDate: '2025-02-26', assignee: 'Priya Srivastava' },
      { id: 'm-6', name: 'DISCOM Net Metering & Synchronization', status: 'pending', targetDate: '2025-03-05', assignee: 'Vivek Sharma' }
    ]
  },
  {
    id: 'proj-102',
    leadId: 'lead-bss-102',
    customerName: 'Anuradha Saxena',
    address: 'Plot 44, Indira Nagar',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    systemSizeKw: 5.0,
    contractValue: 310000,
    signedDate: '2025-01-10',
    targetPtoDate: '2025-02-28',
    currentMilestoneIndex: 4,
    milestones: [
      { id: 'm-1', name: 'Contract Signed & Advance', status: 'completed', targetDate: '2025-01-10', completedDate: '2025-01-10', assignee: 'Priya Srivastava' },
      { id: 'm-2', name: 'PM Surya Ghar Registration', status: 'completed', targetDate: '2025-01-14', completedDate: '2025-01-14', assignee: 'Priya Srivastava' },
      { id: 'm-3', name: 'Procurement & Warehouse Dispatch', status: 'completed', targetDate: '2025-01-25', completedDate: '2025-01-25', assignee: 'Warehouse Desk' },
      { id: 'm-4', name: '5kW Installation & Chemical Earthing', status: 'completed', targetDate: '2025-02-10', completedDate: '2025-02-10', assignee: 'Ram Kripal Tech' },
      { id: 'm-5', name: 'DISCOM Net Meter Testing & Sealing', status: 'in_progress', targetDate: '2025-02-24', assignee: 'Vivek Sharma' },
      { id: 'm-6', name: 'Grid Commissioning & Final Invoicing', status: 'pending', targetDate: '2025-02-28', assignee: 'Saurabh Admin' }
    ]
  }
];

export const VERCEL_BLUEPRINT_CODE = {
  postgresSchemaSql: `-- PostgreSQL Schema for Bharat Solar Shakti Solar CRM
CREATE TABLE IF NOT EXISTS solar_leads (
    id VARCHAR(64) PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(32),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pin_code VARCHAR(16),
    utility_provider VARCHAR(100),
    consumer_number VARCHAR(64),
    stage VARCHAR(64) DEFAULT 'leads',
    system_size_kw NUMERIC(6,2),
    estimated_value NUMERIC(12,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS financial_transactions (
    id VARCHAR(64) PRIMARY KEY,
    lead_id VARCHAR(64) REFERENCES solar_leads(id) ON DELETE SET NULL,
    customer_name VARCHAR(255),
    type VARCHAR(64) NOT NULL,
    category VARCHAR(64) NOT NULL,
    amount NUMERIC(12,2) NOT NULL,
    payment_mode VARCHAR(64),
    reference_no VARCHAR(128),
    notes TEXT,
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`,

  cliWalkthrough: [
    {
      step: 1,
      title: 'Initialize Git & Connect GitHub',
      code: 'git init\ngit add .\ngit commit -m "feat: initial Bharat Solar Shakti release"\ngh repo create bharat-solar-shakti --public --source=. --push'
    },
    {
      step: 2,
      title: 'Deploy to Vercel via CLI or Dashboard',
      code: 'npm install -g vercel\nvercel login\nvercel --prod'
    },
    {
      step: 3,
      title: 'Connect Firebase or PostgreSQL',
      code: 'vercel env add VITE_FIREBASE_API_KEY\nvercel env add VITE_FIREBASE_PROJECT_ID'
    },
    {
      step: 4,
      title: 'Attach Custom Domain & Auto-SSL',
      code: 'vercel domains add crm.bharatsolarshakti.com'
    }
  ],

  stackOverview: [
    {
      layer: 'Hosting & CDN',
      cost: '$0.00 / mo',
      tech: 'Vercel Hobby Tier',
      why: 'Global Edge network, automatic HTTPS, sub-100ms asset delivery across India.'
    },
    {
      layer: 'Database & Auth',
      cost: '$0.00 / mo',
      tech: 'Firebase Firestore & Auth',
      why: 'Real-time WebSocket snapshot listeners, zero-server maintenance, role-based access.'
    },
    {
      layer: 'Frontend Framework',
      cost: '$0.00 / mo',
      tech: 'React 19 + Vite + Tailwind CSS',
      why: 'Lightning-fast client-side routing, instant calculations, fully mobile responsive.'
    }
  ],

  vercelJson: `{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}`
};

