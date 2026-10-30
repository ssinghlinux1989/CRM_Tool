/**
 * Solar Rooftop EPC Types & Models for Bharat Solar Shakti Pvt
 * 16 Sequential Workflow Stages:
 * Leads > Meeting > Sales Quotation > Approval > Conversion > PM Portal Registration >
 * Loan (if available) > Material Procurement > Inventory > Installation >
 * PM Suryaghar Document Submission > Net Metering > Commissioning > Balance Payment > Share Invoices > Support
 */

export type PipelineStage = 
  | 'leads'
  | 'meeting'
  | 'sales_quotation'
  | 'approval'
  | 'conversion'
  | 'pm_portal_reg'
  | 'loan'
  | 'material_procurement'
  | 'inventory'
  | 'installation'
  | 'pm_suryaghar_doc'
  | 'net_metering'
  | 'commissioning'
  | 'balance_payment'
  | 'share_invoices'
  | 'support';

export interface StageConfig {
  id: PipelineStage;
  stepNumber: number;
  label: string;
  shortLabel: string;
  description: string;
  category: 'Sales & Conversion' | 'PM Portal & Financing' | 'Execution & Inventory' | 'DISCOM & Commissioning' | 'Finance & Handover';
  color: string;
  badgeBg: string;
  iconName: string;
}

export type LeadSource = 
  | 'PM Surya Ghar Portal'
  | 'Facebook / Social Ads'
  | 'Google Search'
  | 'UPPCL Consumer Outreach'
  | 'Customer Referral'
  | 'Walk-in / Office'
  | 'Canvass / Field Survey';

export type RoofType = 
  | 'rcc_flat_concrete'
  | 'standing_seam_metal'
  | 'tin_shed'
  | 'elevated_superstructure'
  | 'tiled_roof';

export type FinancingType = 'cash' | 'pm_suryaghar_bank_loan' | 'nbfc_emi';

export interface SolarSystemSpec {
  monthlyBill: number;
  utilityRatePerKwh: number;
  annualConsumptionKwh: number;
  sunHoursPerDay: number;
  systemSizeKw: number;
  panelCount: number;
  panelWattage: number; // e.g. 545Wp / 550Wp Mono PERC or TOPCon
  panelModel: string;
  inverterType: 'Micro Inverter' | 'String Inverter (Deye/Growatt/Havells)' | 'Hybrid Inverter with Battery';
  batteryModel?: string;
  batteryCount: number;
  costPerWatt: number; // e.g. ₹55/Wp
  grossSystemCost: number;
  batteryCost: number;
  totalGrossCost: number;
  federalItcRate: number; // Subsidy calculation benchmark
  federalTaxCreditAmount: number; // PM Surya Ghar Subsidy Amount (e.g. ₹30k for 1kW, ₹60k for 2kW, ₹78k for 3kW+)
  netInvestment: number; // Total Gross - Subsidy
  estimatedYearOneProductionKwh: number;
  offsetPercentage: number;
  estimatedYearOneSavings: number;
  lifetime25YrSavings: number;
  paybackPeriodYears: number;
  monthlyLoanPayment?: number;
}

export interface SurveyPhoto {
  id: string;
  title: string;
  category: 'Roof Plane' | 'Main Electrical Panel' | 'Utility Meter' | 'Inverter / Battery Location' | 'Attic / Structure';
  dataUrl: string;
  uploadedAt: string;
  fileSizeKb: number;
}

export interface SiteSurveyData {
  roofType: RoofType;
  roofAgeYears: number;
  roofPitchDegrees: number;
  roofAzimuthDegrees: number; // 180 = South
  roofShadingPercent: number; // 0 to 100%
  roofAreaSqFt?: number;
  mainPanelAmpRating: number;
  busbarAmpRating: number;
  mpuRequired: boolean;
  structuralApproved: boolean;
  notes: string;
  inspectorName?: string;
  surveyDate?: string;
  photos: SurveyPhoto[];
}

// 16 Stage Details Structs
export interface MeetingDetails {
  scheduledDate: string;
  meetingTime?: string;
  location: string;
  assignedExecutive: string;
  roofAreaApproxSqFt: number;
  customerRequirements: string;
  isCompleted: boolean;
  meetingNotes?: string;
}

export interface SalesQuotationDetails {
  quotationNumber: string;
  quoteDate: string;
  validUntil: string;
  systemKw: number;
  panelBrand: string;
  inverterBrand: string;
  grossCost: number;
  subsidyAmount: number;
  netCostToCustomer: number;
  paybackYears: number;
  annualSavings: number;
  quotationStatus: 'draft' | 'shared' | 'customer_reviewed';
}

export interface ApprovalDetails {
  approvedBy: string;
  approvalDate: string;
  commercialDiscountAmount: number;
  finalApprovedCost: number;
  managerComments: string;
  isApproved: boolean;
}

export interface ConversionDetails {
  conversionDate: string;
  bookingAdvancePaid: number;
  receiptNumber: string;
  paymentMode: 'UPI' | 'NEFT / RTGS' | 'Cheque' | 'Cash';
  contractAgreementSigned: boolean;
  bookingReference: string;
}

export interface PmPortalRegDetails {
  applicationNumber: string;
  consumerNumber: string;
  discomName: string; // e.g. "Madhyanchal Vidyut Vitaran Nigam Ltd (MVVNL)"
  divisionSubdivision: string;
  portalSubmissionDate: string;
  applicationStatus: 'submitted' | 'feasibility_approved' | 'query_raised' | 'approved';
  electricityBillDocUploaded: boolean;
}

export interface LoanDetails {
  isLoanRequired: boolean;
  bankOrNbfcName: string; // e.g. "State Bank of India (Jan Samarth)"
  appliedAmount: number;
  sanctionedAmount?: number;
  interestRatePercent?: number;
  tenureYears?: number;
  loanStatus: 'not_required' | 'document_collection' | 'applied' | 'sanctioned' | 'disbursed';
  sanctionLetterNo?: string;
  disbursedDate?: string;
}

export interface MaterialProcurementDetails {
  poNumber: string;
  panelsCount: number;
  panelsWattage: number;
  panelsBrand: string;
  inverterModel: string;
  bosKitOrdered: boolean;
  moduleMountingStructureType: string;
  supplierName: string;
  poAmount: number;
  orderDate: string;
  estimatedDeliveryDate: string;
  procurementStatus: 'requisitioned' | 'po_placed' | 'in_transit' | 'delivered';
}

export interface InventoryDetails {
  warehouse: string; // "Lucknow Central Warehouse, Transport Nagar"
  modulesReceivedCount: number;
  modulesSerialNumbers: string[];
  inverterSerialNo: string;
  allocatedToSiteDate?: string;
  dispatchVehicleNo?: string;
  isDispatchedToSite: boolean;
}

export interface InstallationDetails {
  installationTeamLeader: string;
  crewMembersCount: number;
  startDate: string;
  targetCompletionDate: string;
  actualCompletedDate?: string;
  structureErected: boolean;
  modulesMounted: boolean;
  inverterAndDcdbWired: boolean;
  earthingChemicalPitDone: boolean;
  lightningArresterInstalled: boolean;
  installationStatus: 'scheduled' | 'underway' | 'completed' | 'hold';
}

export interface PmSuryagharDocDetails {
  wcrNumber: string; // Work Completion Report Number
  wcrDate: string;
  geotaggedPhotosTaken: boolean;
  inverterSerialNumberProof: boolean;
  earthingTestCertificateUploaded: boolean;
  inspectionFormSigned: boolean;
  nationalPortalSubmissionStatus: 'pending' | 'uploaded' | 'under_review_discom' | 'verified';
}

export interface NetMeteringDetails {
  discomApplicationNo: string;
  meterTestingFeeReceiptNo: string;
  meterTestingPassed: boolean;
  biDirectionalMeterNumber: string;
  netMeterInstalledDate?: string;
  discomJeInspectorName?: string;
  meterSealingCertificateNo?: string;
  status: 'applied' | 'meter_testing' | 'installation_scheduled' | 'net_meter_installed';
}

export interface CommissioningDetails {
  commissioningDate: string;
  initialSolarExportReading: number;
  gridSynchronized: boolean;
  jointInspectionPassed: boolean;
  commissioningCertNumber: string;
  plantEnergized: boolean;
}

export interface BalancePaymentDetails {
  totalContractValue: number;
  advanceReceived: number;
  stagePaymentsReceived: number;
  balanceAmountDue: number;
  paymentReceivedDate?: string;
  paymentMode?: string;
  transactionRef?: string;
  isFullyPaid: boolean;
  subsidyClaimInitiated: boolean;
  subsidyClaimRef?: string;
}

export interface ShareInvoicesDetails {
  gstTaxInvoiceNo: string;
  invoiceDate: string;
  taxableAmount: number;
  cgstAmount: number; // 6% or 9%
  sgstAmount: number; // 6% or 9%
  totalInvoiceWithGst: number;
  warrantyCardShared: boolean; // 25-yr solar module warranty
  inverterWarrantyShared: boolean; // 5-yr / 10-yr inverter warranty
  handoverKitSharedDate?: string;
  customerAcknowledgementReceived: boolean;
}

export interface SupportDetails {
  amcTier: 'Standard Free 5-Yr O&M' | 'Comprehensive Annual Maintenance' | 'Premium Solar Shield';
  plantMonitoringAppId: string;
  firstYearFreeCleaningVisits: number;
  cleaningVisitsCompleted: number;
  lastServiceDate?: string;
  nextScheduledVisitDate: string;
  openTickets: number;
  totalGenerationLifetimeKwh: number;
}

export interface SolarLead {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  utilityProvider: string; // e.g. "MVVNL (UPPCL)"
  consumerNumber: string;
  stage: PipelineStage;
  source: LeadSource;
  assignedRepId: string;
  createdAt: string;
  updatedAt: string;
  estimatedValue: number;
  systemSizeKw: number;
  specs: SolarSystemSpec;
  survey?: SiteSurveyData;
  notes: string[];
  tags: string[];
  priority: 'low' | 'medium' | 'high';
  financingPreference: FinancingType;

  // Financial tracking per project
  financials: {
    grossContractValue: number;
    centralSubsidy: number;
    customerNetCost: number;
    advanceCollected: number;
    stagePaymentsCollected: number;
    balancePending: number;
    materialBOMCost: number;
    installationLaborCost: number;
    netMeteringLiaisonCost: number;
    grossProfit: number;
    profitMarginPercent: number;
  };

  // 16 Stage Granular Progress Data
  meetingDetails?: MeetingDetails;
  quotationDetails?: SalesQuotationDetails;
  approvalDetails?: ApprovalDetails;
  conversionDetails?: ConversionDetails;
  pmPortalDetails?: PmPortalRegDetails;
  loanDetails?: LoanDetails;
  procurementDetails?: MaterialProcurementDetails;
  inventoryDetails?: InventoryDetails;
  installationDetails?: InstallationDetails;
  pmSuryagharDocDetails?: PmSuryagharDocDetails;
  netMeteringDetails?: NetMeteringDetails;
  commissioningDetails?: CommissioningDetails;
  balancePaymentDetails?: BalancePaymentDetails;
  invoiceDetails?: ShareInvoicesDetails;
  supportDetails?: SupportDetails;
}

export interface FinancialTransaction {
  id: string;
  leadId?: string;
  customerName?: string;
  type: 
    | 'inflow_advance' 
    | 'inflow_stage' 
    | 'inflow_balance' 
    | 'inflow_subsidy' 
    | 'outflow_materials' 
    | 'outflow_installation' 
    | 'outflow_netmetering' 
    | 'outflow_overhead';
  category: 'Revenue' | 'Procurement' | 'Labor' | 'Regulatory' | 'Operations';
  amount: number;
  date: string;
  paymentMode: 'NEFT / RTGS' | 'UPI' | 'Cheque' | 'Cash' | 'Bank Transfer';
  referenceNo: string;
  notes?: string;
  recordedBy: string;
  createdAt: string;
}

export interface SolarSalesRep {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: 'Closer' | 'Operations Manager' | 'Technical Surveyor' | 'Finance Controller' | 'Top Producer';
  assignedCity?: string;
  commissionPerWatt: number; // ₹ per Wp
  closedKwThisMonth: number;
  dealsCountThisMonth: number;
  pipelineValue: number;
}

export interface BrandingConfig {
  toolName?: string;
  companyName: string;
  tagline: string;
  logoUrl?: string;
  accentColor: 'amber' | 'sky' | 'emerald' | 'slate';
  phone: string;
  email: string;
  licenseNumber: string;
  address: string;
  currency: string;
  gstin?: string;
  pmVendorId?: string;
}

export interface FollowUpItem {
  id: string;
  leadId: string;
  leadName: string;
  city: string;
  title: string;
  scheduledDate: string;
  type: 'Call' | 'Site Visit' | 'Proposal Review' | 'PM Portal Followup' | 'Net Metering Liaison';
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'completed' | 'cancelled';
  notes?: string;
}

export type ProjectMilestoneStatus = 'pending' | 'in_progress' | 'completed' | 'blocked';

export interface ProjectMilestone {
  id: string;
  name: string;
  status: ProjectMilestoneStatus;
  targetDate: string;
  completedDate?: string;
  assignee: string;
  notes?: string;
}

export interface SolarProject {
  id: string;
  leadId: string;
  customerName: string;
  address: string;
  city: string;
  state: string;
  systemSizeKw: number;
  contractValue: number;
  signedDate: string;
  targetPtoDate: string;
  currentMilestoneIndex: number;
  milestones: ProjectMilestone[];
}
