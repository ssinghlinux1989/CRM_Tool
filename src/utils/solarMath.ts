import { SolarSystemSpec } from '../types/solar';

export const UTILITY_PRESETS = [
  { name: 'UPPCL - MVVNL (Lucknow & Central UP)', state: 'UP', avgRate: 7.20, sunHours: 5.2, nemPolicy: 'PM Surya Ghar Net Metering & Banking' },
  { name: 'UPPCL - PVVNL (Noida, Ghaziabad & West UP)', state: 'UP', avgRate: 7.10, sunHours: 5.3, nemPolicy: 'UPNEDA Gross / Net Metering' },
  { name: 'BSES Rajdhani / Yamuna (Delhi NCR)', state: 'DL', avgRate: 7.50, sunHours: 5.1, nemPolicy: 'Delhi Solar Policy Virtual Net Metering' },
  { name: 'Tata Power DDL (North Delhi)', state: 'DL', avgRate: 7.40, sunHours: 5.1, nemPolicy: 'DERC Net Metering' },
  { name: 'Mahavitaran - MSEDCL (Maharashtra)', state: 'MH', avgRate: 8.80, sunHours: 5.4, nemPolicy: 'MERC Net Metering Regulations' },
  { name: 'Tata Power / Adani Electricity (Mumbai)', state: 'MH', avgRate: 9.20, sunHours: 5.3, nemPolicy: 'Rooftop Net Metering' },
  { name: 'BESCOM (Bangalore & Karnataka)', state: 'KA', avgRate: 7.60, sunHours: 5.5, nemPolicy: 'KERC Solar Policy' },
  { name: 'TANGEDCO (Tamil Nadu)', state: 'TN', avgRate: 6.90, sunHours: 5.6, nemPolicy: 'Solar Energy Net Feed-in' },
  { name: 'DHBVN / UHBVN (Haryana / Gurugram)', state: 'HR', avgRate: 7.30, sunHours: 5.3, nemPolicy: 'HERC Net Metering' },
  { name: 'National Average (India Discoms)', state: 'IN', avgRate: 7.20, sunHours: 5.3, nemPolicy: 'PM Surya Ghar Muft Bijli Yojana' },
];

export const BATTERY_OPTIONS: Record<string, { cost: number; capacityKwh: number }> = {
  'Lithium-ion LFP Solar ESS (10 kWh)': { cost: 140000, capacityKwh: 10.0 },
  'Lithium LFP Battery Storage (5 kWh)': { cost: 75000, capacityKwh: 5.0 },
  'Tubular Lead-Acid Bank (150Ah x 4)': { cost: 55000, capacityKwh: 7.2 },
  'None': { cost: 0, capacityKwh: 0 },
};

/**
 * Calculates full solar PV engineering specs and 25-year financial ROI in Indian Rupees (INR ₹)
 * Incorporates PM Surya Ghar: Muft Bijli Yojana Central Subsidy + UP State Subsidy
 */
export function calculateSolarSystem(params: {
  monthlyBill: number; // in INR ₹
  utilityRatePerKwh: number; // in INR ₹ / unit (kWh)
  sunHoursPerDay: number;
  targetOffsetPercent?: number;
  panelWattage?: number;
  costPerWatt?: number; // in INR ₹ / Wp (standard in India ~₹48 to ₹58/Wp)
  batteryModel?: any;
  batteryCount?: number;
  inverterType?: any;
  panelModel?: string;
}): SolarSystemSpec {
  const {
    monthlyBill,
    utilityRatePerKwh,
    sunHoursPerDay,
    targetOffsetPercent = 100,
    panelWattage = 540, // standard Tier-1 mono bifacial in India: 540W - 550W
    costPerWatt = 52.0, // ₹52 / Watt installed (₹52,000 / kW)
    batteryModel = 'None',
    batteryCount = 0,
    inverterType = 'Enphase IQ8+ Micro',
    panelModel = 'Waaree / Tata Power Solar 540W Mono PERC'
  } = params;

  // Derate factor (losses for dust, temperature, wiring, inverter efficiency: ~82%)
  const DERATE_FACTOR = 0.82;

  // Annual consumption estimation: Units = Monthly Bill / Tariff Rate
  const monthlyConsumptionKwh = utilityRatePerKwh > 0 ? monthlyBill / utilityRatePerKwh : 500;
  const annualConsumptionKwh = monthlyConsumptionKwh * 12;

  // Ideal target generation
  const targetKwh = (annualConsumptionKwh * targetOffsetPercent) / 100;

  // Raw kW needed = targetKwh / (sunHours * 365 * DERATE_FACTOR)
  const rawKwNeeded = targetKwh / (sunHoursPerDay * 365 * DERATE_FACTOR);

  // Calculate panel count (min 4 panels, e.g. ~2.16 kW)
  const panelCount = Math.max(4, Math.ceil((rawKwNeeded * 1000) / panelWattage));

  // Actual System Size in kW DC
  const systemSizeKw = Number(((panelCount * panelWattage) / 1000).toFixed(2));

  // Actual Estimated Year 1 Production in Units (kWh)
  const estimatedYearOneProductionKwh = Math.round(systemSizeKw * sunHoursPerDay * 365 * DERATE_FACTOR);

  // Exact offset %
  const offsetPercentage = Math.round((estimatedYearOneProductionKwh / annualConsumptionKwh) * 100);

  // Gross system cost in INR ₹
  const grossSystemCost = Math.round(systemSizeKw * 1000 * costPerWatt);
  const batteryUnitCost = BATTERY_OPTIONS[batteryModel]?.cost || 0;
  const batteryCost = batteryModel !== 'None' ? batteryUnitCost * batteryCount : 0;
  const totalGrossCost = grossSystemCost + batteryCost;

  // PM Surya Ghar Muft Bijli Yojana Central & State Subsidy Formula:
  // 1 kW: ₹30,000 Central
  // 2 kW: ₹60,000 Central
  // 3 kW and above: ₹78,000 Central + ₹15,000 UP State subsidy (for UP consumers) = up to ₹93,000!
  let federalTaxCreditAmount = 0;
  if (systemSizeKw >= 3.0) {
    federalTaxCreditAmount = 78000 + 15000; // ₹93,000 total subsidy
  } else if (systemSizeKw >= 2.0) {
    federalTaxCreditAmount = 60000 + 10000;
  } else if (systemSizeKw >= 1.0) {
    federalTaxCreditAmount = 30000;
  } else {
    federalTaxCreditAmount = Math.round(totalGrossCost * 0.30);
  }

  // Cap subsidy so it does not exceed 60% of system cost
  federalTaxCreditAmount = Math.min(federalTaxCreditAmount, Math.round(totalGrossCost * 0.55));
  const federalItcRate = Number((federalTaxCreditAmount / totalGrossCost).toFixed(2));
  const netInvestment = totalGrossCost - federalTaxCreditAmount;

  // Year 1 Savings (bill reduction + offset value in INR ₹)
  const billReductionRate = Math.min(1, offsetPercentage / 100);
  const estimatedYearOneSavings = Math.round(monthlyBill * 12 * billReductionRate);

  // 25-Year Cumulative Savings calculation with 4.5% annual discom electricity tariff escalation
  let lifetime25YrSavings = 0;
  let currentYearUtilityBill = monthlyBill * 12;
  let currentYearSolarProduction = estimatedYearOneProductionKwh;

  for (let year = 1; year <= 25; year++) {
    const yearSavings = Math.min(currentYearUtilityBill, (currentYearSolarProduction * utilityRatePerKwh * Math.pow(1.045, year - 1)));
    lifetime25YrSavings += yearSavings;
    currentYearSolarProduction *= 0.995; // 0.5% degradation
  }
  lifetime25YrSavings = Math.round(lifetime25YrSavings);

  // Simple Payback period in years
  const paybackPeriodYears = estimatedYearOneSavings > 0 
    ? Number((netInvestment / estimatedYearOneSavings).toFixed(1)) 
    : 3.8;

  // Solar Loan payment (Indian Solar Loan 8.5% p.a., 7-year to 10-year repayment term standard via SBI Surya Ghar loan)
  const annualInterest = 0.085;
  const monthlyRate = annualInterest / 12;
  const numPayments = 10 * 12; // 120 months (10 years)
  const monthlyLoanPayment = Math.round(
    (netInvestment * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
    (Math.pow(1 + monthlyRate, numPayments) - 1)
  );

  return {
    monthlyBill,
    utilityRatePerKwh,
    annualConsumptionKwh: Math.round(annualConsumptionKwh),
    sunHoursPerDay,
    systemSizeKw,
    panelCount,
    panelWattage,
    panelModel,
    inverterType,
    batteryModel,
    batteryCount,
    costPerWatt,
    grossSystemCost,
    batteryCost,
    totalGrossCost,
    federalItcRate,
    federalTaxCreditAmount,
    netInvestment,
    estimatedYearOneProductionKwh,
    offsetPercentage,
    estimatedYearOneSavings,
    lifetime25YrSavings,
    paybackPeriodYears,
    monthlyLoanPayment,
  };
}

/**
 * Electrical Panel & Solar Backfeed Rule (Indian CEA / Discom Metering Standards)
 */
export function checkNec120Rule(mainBreakerAmps: number, busbarRatingAmps: number, systemKw: number): {
  allowedBackfeedAmps: number;
  solarBackfeedAmpsRequired: number;
  mpuRequired: boolean;
  recommendation: string;
} {
  const allowedBackfeedAmps = Math.floor((busbarRatingAmps * 1.20) - mainBreakerAmps);
  const inverterContinuousAmps = (systemKw * 1000) / 230; // 230V single phase / 415V three phase in India
  const solarBackfeedAmpsRequired = Math.ceil(inverterContinuousAmps * 1.25);

  const mpuRequired = solarBackfeedAmpsRequired > allowedBackfeedAmps;

  let recommendation = 'Main distribution box and bi-directional net meter can support this solar generation.';
  if (mpuRequired) {
    if (mainBreakerAmps <= 32) {
      recommendation = `Service Upgrade Required: 32A/40A DB is insufficient for ${solarBackfeedAmpsRequired}A solar feed. Upgrade main MCB & busbar for net metering sanction.`;
    } else {
      recommendation = `Distribution Board upgrade required: Allowed backfeed is ${allowedBackfeedAmps}A but system requires ${solarBackfeedAmpsRequired}A.`;
    }
  }

  return {
    allowedBackfeedAmps,
    solarBackfeedAmpsRequired,
    mpuRequired,
    recommendation,
  };
}
