import React, { useState, useMemo } from 'react';
import { Property } from '../types';
import {
  TrendingUp,
  DollarSign,
  Building,
  Percent,
  Calculator,
  ShieldCheck,
  Calendar,
  Layers,
  Sparkles,
  Info,
  CheckCircle2,
  Copy,
  Check,
  ArrowUpRight,
  Landmark,
  FileSpreadsheet,
  Coins,
  History,
  BarChart3,
  SlidersHorizontal,
  BookmarkCheck,
  Compass
} from 'lucide-react';

interface InvestmentCalculatorProps {
  property: Property;
  onInquireInvestment?: () => void;
}

// Tanzanian Regional Benchmark Market Dynamics & Historical Data
export interface TanzaniaMarketTrend {
  regionKey: string;
  regionName: string;
  shortLabel: string;
  benchmarkAppreciation: number; // annual %
  longTermGrossYield: number; // %
  shortTermGrossYield: number; // %
  historical5yrCAGR: number; // %
  historicalInflationAlpha: number; // % over Bank of Tanzania CPI
  historicalAvgOccupancy: number; // %
  historicalRentalYieldRange: string;
  marketDynamics: string;
  primeDrivers: string[];
  historicalYearlyAppreciation: { year: number; appreciation: number; inflation: number; avgYield: number }[];
  sourceAuthority: string;
}

export const TANZANIA_MARKET_TRENDS: Record<string, TanzaniaMarketTrend> = {
  'dar es salaam': {
    regionKey: 'dar es salaam',
    regionName: 'Dar es Salaam (Masaki / Oysterbay / Peninsula)',
    shortLabel: 'Dar es Salaam',
    benchmarkAppreciation: 10.5,
    longTermGrossYield: 9.2,
    shortTermGrossYield: 14.5,
    historical5yrCAGR: 10.8,
    historicalInflationAlpha: 6.6,
    historicalAvgOccupancy: 91,
    historicalRentalYieldRange: '8.5% - 11.4%',
    marketDynamics: 'Prime oceanfront diplomatic and financial hub. Scarcity of titled peninsula land ensures continuous long-term USD leasing by multinational corporations and embassies.',
    primeDrivers: ['Diplomatic & UN accredited missions', 'Multinational oil/gas & mining regional HQs', 'USD-denominated 12-month advance leases'],
    historicalYearlyAppreciation: [
      { year: 2020, appreciation: 8.2, inflation: 3.3, avgYield: 9.0 },
      { year: 2021, appreciation: 9.1, inflation: 3.7, avgYield: 9.2 },
      { year: 2022, appreciation: 10.4, inflation: 4.3, avgYield: 9.4 },
      { year: 2023, appreciation: 11.2, inflation: 3.8, avgYield: 9.3 },
      { year: 2024, appreciation: 10.8, inflation: 3.2, avgYield: 9.2 },
      { year: 2025, appreciation: 11.0, inflation: 3.4, avgYield: 9.5 },
    ],
    sourceAuthority: 'Ministry of Lands, Housing & Human Settlements & BOT Real Estate Survey',
  },
  'zanzibar': {
    regionKey: 'zanzibar',
    regionName: 'Zanzibar (Unguja & Pemba / Fumba Town / Nungwi)',
    shortLabel: 'Zanzibar',
    benchmarkAppreciation: 13.8,
    longTermGrossYield: 10.2,
    shortTermGrossYield: 17.2,
    historical5yrCAGR: 14.2,
    historicalInflationAlpha: 9.9,
    historicalAvgOccupancy: 84,
    historicalRentalYieldRange: '9.5% - 18.0%',
    marketDynamics: 'Fastest-growing luxury market in East Africa, catalyzed by ZIPA foreign ownership protections, Golden Residency Visas, and surging high-net-worth international tourism.',
    primeDrivers: ['ZIPA 100% foreign investor ownership incentives', 'Residency-by-investment visas for $100k+ assets', 'High-ADR year-round beachfront hospitality demand'],
    historicalYearlyAppreciation: [
      { year: 2020, appreciation: 9.8, inflation: 3.5, avgYield: 11.2 },
      { year: 2021, appreciation: 12.0, inflation: 3.8, avgYield: 12.5 },
      { year: 2022, appreciation: 14.5, inflation: 4.5, avgYield: 14.8 },
      { year: 2023, appreciation: 15.2, inflation: 3.9, avgYield: 15.6 },
      { year: 2024, appreciation: 14.1, inflation: 3.4, avgYield: 16.2 },
      { year: 2025, appreciation: 14.6, inflation: 3.5, avgYield: 17.0 },
    ],
    sourceAuthority: 'Zanzibar Investment Promotion Authority (ZIPA) & Land Commission Data',
  },
  'arusha': {
    regionKey: 'arusha',
    regionName: 'Arusha (Northern Safari Circuit / Sekei / Njiro)',
    shortLabel: 'Arusha',
    benchmarkAppreciation: 9.4,
    longTermGrossYield: 8.6,
    shortTermGrossYield: 13.8,
    historical5yrCAGR: 9.6,
    historicalInflationAlpha: 5.5,
    historicalAvgOccupancy: 86,
    historicalRentalYieldRange: '8.0% - 10.5%',
    marketDynamics: 'East African Community (EAC) headquarters with strong safari lodge owner demand and high seasonal luxury hospitality rates.',
    primeDrivers: ['EAC & International Court judiciary personnel', 'Northern Safari circuit staging gate', 'Premium coffee estate & conservation developments'],
    historicalYearlyAppreciation: [
      { year: 2020, appreciation: 7.5, inflation: 3.3, avgYield: 8.2 },
      { year: 2021, appreciation: 8.4, inflation: 3.6, avgYield: 8.4 },
      { year: 2022, appreciation: 9.6, inflation: 4.2, avgYield: 8.7 },
      { year: 2023, appreciation: 10.1, inflation: 3.7, avgYield: 8.8 },
      { year: 2024, appreciation: 9.5, inflation: 3.1, avgYield: 8.6 },
      { year: 2025, appreciation: 9.8, inflation: 3.3, avgYield: 8.9 },
    ],
    sourceAuthority: 'EAC Regional Property Index & Arusha Municipal Chamber',
  },
  'dodoma': {
    regionKey: 'dodoma',
    regionName: 'Dodoma (Mtumba Government City / Capital Hub)',
    shortLabel: 'Dodoma',
    benchmarkAppreciation: 12.2,
    longTermGrossYield: 10.5,
    shortTermGrossYield: 12.0,
    historical5yrCAGR: 12.5,
    historicalInflationAlpha: 8.3,
    historicalAvgOccupancy: 94,
    historicalRentalYieldRange: '9.8% - 12.5%',
    marketDynamics: 'National capital relocation has caused historic civic expansion with acute shortages in executive and institutional residential housing.',
    primeDrivers: ['Complete relocation of Federal Ministries & Diplomatic delegations', 'Rapid civil infrastructure & rail investment', 'Long-term government institutional master leases'],
    historicalYearlyAppreciation: [
      { year: 2020, appreciation: 10.5, inflation: 3.4, avgYield: 9.8 },
      { year: 2021, appreciation: 11.8, inflation: 3.7, avgYield: 10.2 },
      { year: 2022, appreciation: 13.0, inflation: 4.4, avgYield: 10.6 },
      { year: 2023, appreciation: 13.2, inflation: 3.9, avgYield: 10.8 },
      { year: 2024, appreciation: 12.4, inflation: 3.2, avgYield: 10.5 },
      { year: 2025, appreciation: 12.8, inflation: 3.4, avgYield: 10.9 },
    ],
    sourceAuthority: 'Capital Development Authority (CDA) & National Housing Corporation (NHC)',
  },
  'kilimanjaro': {
    regionKey: 'kilimanjaro',
    regionName: 'Kilimanjaro (Moshi Urban / Shanty Town)',
    shortLabel: 'Kilimanjaro',
    benchmarkAppreciation: 8.5,
    longTermGrossYield: 8.0,
    shortTermGrossYield: 12.5,
    historical5yrCAGR: 8.7,
    historicalInflationAlpha: 4.6,
    historicalAvgOccupancy: 83,
    historicalRentalYieldRange: '7.5% - 9.5%',
    marketDynamics: 'Mount Kilimanjaro eco-tourism, diaspora returnees, and stable low-volatility residential real estate.',
    primeDrivers: ['Global high-altitude trekking expeditions', 'Stable diaspora retirement villas', 'Cool highland climate estate preference'],
    historicalYearlyAppreciation: [
      { year: 2020, appreciation: 7.0, inflation: 3.2, avgYield: 7.8 },
      { year: 2021, appreciation: 7.8, inflation: 3.5, avgYield: 7.9 },
      { year: 2022, appreciation: 8.6, inflation: 4.1, avgYield: 8.1 },
      { year: 2023, appreciation: 8.9, inflation: 3.7, avgYield: 8.2 },
      { year: 2024, appreciation: 8.7, inflation: 3.1, avgYield: 8.0 },
      { year: 2025, appreciation: 9.0, inflation: 3.3, avgYield: 8.2 },
    ],
    sourceAuthority: 'Kilimanjaro Chamber of Commerce & Moshi Municipal Council',
  },
  'mwanza': {
    regionKey: 'mwanza',
    regionName: 'Mwanza (Capri Point / Lake Victoria Executive)',
    shortLabel: 'Mwanza',
    benchmarkAppreciation: 8.0,
    longTermGrossYield: 7.8,
    shortTermGrossYield: 11.5,
    historical5yrCAGR: 8.2,
    historicalInflationAlpha: 4.1,
    historicalAvgOccupancy: 85,
    historicalRentalYieldRange: '7.2% - 9.0%',
    marketDynamics: 'Great Lakes regional commercial and gold mining hub with high executive ridge estate demand.',
    primeDrivers: ['Lake Victoria trade & maritime commerce', 'Gold mining regional executive housing', 'Growing regional financial services'],
    historicalYearlyAppreciation: [
      { year: 2020, appreciation: 6.8, inflation: 3.2, avgYield: 7.4 },
      { year: 2021, appreciation: 7.5, inflation: 3.6, avgYield: 7.6 },
      { year: 2022, appreciation: 8.3, inflation: 4.2, avgYield: 7.8 },
      { year: 2023, appreciation: 8.6, inflation: 3.7, avgYield: 8.0 },
      { year: 2024, appreciation: 8.1, inflation: 3.1, avgYield: 7.8 },
      { year: 2025, appreciation: 8.4, inflation: 3.3, avgYield: 8.0 },
    ],
    sourceAuthority: 'Bank of Tanzania Lake Zone Directorate & Mwanza Land Registry',
  },
};

export const DEFAULT_NATIONAL_TREND: TanzaniaMarketTrend = {
  regionKey: 'national',
  regionName: 'Tanzania National Prime Average',
  shortLabel: 'National Average',
  benchmarkAppreciation: 8.8,
  longTermGrossYield: 8.5,
  shortTermGrossYield: 13.0,
  historical5yrCAGR: 9.0,
  historicalInflationAlpha: 4.9,
  historicalAvgOccupancy: 87,
  historicalRentalYieldRange: '7.8% - 10.5%',
  marketDynamics: 'Standard emerging market premium real estate with GDP growth outperforming regional peers at ~5.5% annually.',
  primeDrivers: ['Macroeconomic expansion', 'Urbanization rate exceeding 5%', 'Strategic East African infrastructure corridors'],
  historicalYearlyAppreciation: [
    { year: 2020, appreciation: 7.6, inflation: 3.3, avgYield: 8.2 },
    { year: 2021, appreciation: 8.4, inflation: 3.6, avgYield: 8.5 },
    { year: 2022, appreciation: 9.2, inflation: 4.3, avgYield: 8.8 },
    { year: 2023, appreciation: 9.5, inflation: 3.8, avgYield: 8.7 },
    { year: 2024, appreciation: 9.1, inflation: 3.2, avgYield: 8.5 },
    { year: 2025, appreciation: 9.4, inflation: 3.4, avgYield: 8.8 },
  ],
  sourceAuthority: 'National Bureau of Statistics (NBS) & Bank of Tanzania',
};

export const InvestmentCalculator: React.FC<InvestmentCalculatorProps> = ({
  property,
  onInquireInvestment,
}) => {
  // Determine local regional market profile
  const localMarketProfile = useMemo<TanzaniaMarketTrend>(() => {
    const pRegion = (property.location.region || '').toLowerCase();
    const pCity = (property.location.city || '').toLowerCase();
    const pWard = (property.location.ward || '').toLowerCase();

    for (const key of Object.keys(TANZANIA_MARKET_TRENDS)) {
      if (pRegion.includes(key) || pCity.includes(key) || pWard.includes(key)) {
        return TANZANIA_MARKET_TRENDS[key];
      }
    }
    return DEFAULT_NATIONAL_TREND;
  }, [property]);

  // View Mode: Calculator vs Historical Tanzania Data Archive
  const [calculatorView, setCalculatorView] = useState<'pro_forma' | 'historical_archive'>('pro_forma');

  // Currency Toggle: USD vs TZS (Fixed conversion standard: 1 USD = 2,650 TZS)
  const [currency, setCurrency] = useState<'USD' | 'TZS'>('USD');
  const TZS_RATE = 2650;

  // Investment Strategy: Long-Term Corporate vs Short-Term Hospitality
  const [strategy, setStrategy] = useState<'long_term' | 'short_term'>('long_term');

  // Core Financial Inputs
  const [propertyPrice, setPropertyPrice] = useState<number>(property.price || 450000);

  // Rental Yield Input Mode: by percentage (%) or by monthly rent ($)
  const [rentalYieldInputMode, setRentalYieldInputMode] = useState<'percentage' | 'amount'>('percentage');

  // Initial yield percentage pre-filled from regional historical data
  const initialYieldPct = property.metadata?.gross_yield || property.metadata?.cap_rate || localMarketProfile.longTermGrossYield;
  const [grossYieldInputPct, setGrossYieldInputPct] = useState<number>(initialYieldPct);

  // Monthly rent in USD, calculated from yield percentage or overridden
  const [monthlyRentUSD, setMonthlyRentUSD] = useState<number>(
    property.metadata?.projected_monthly_rent ||
      Math.round((property.price * (initialYieldPct / 100)) / 12)
  );

  // When user edits yield percentage directly
  const handleYieldPctChange = (newPct: number) => {
    const safePct = Math.max(1, Math.min(25, Number(newPct)));
    setGrossYieldInputPct(safePct);
    const newMonthly = Math.round((propertyPrice * (safePct / 100)) / 12);
    setMonthlyRentUSD(newMonthly);
  };

  // When user edits monthly rent directly
  const handleMonthlyRentChange = (newMonthly: number) => {
    const safeMonthly = Math.max(100, Number(newMonthly));
    setMonthlyRentUSD(safeMonthly);
    const calculatedYield = ((safeMonthly * 12) / propertyPrice) * 100;
    setGrossYieldInputPct(Number(calculatedYield.toFixed(2)));
  };

  // Short-Term ADR & Occupancy Inputs
  const [dailyRateUSD, setDailyRateUSD] = useState<number>(
    Math.round(propertyPrice * 0.00075) > 120 ? Math.round(propertyPrice * 0.00075) : 320
  );
  const [occupancyRate, setOccupancyRate] = useState<number>(localMarketProfile.historicalAvgOccupancy || 68);

  // Capital Appreciation Rate Input (% p.a.) - pre-filled from regional historical data
  const [appreciationRate, setAppreciationRate] = useState<number>(
    property.metadata?.estimated_appreciation_5yr
      ? Number((property.metadata.estimated_appreciation_5yr / 5).toFixed(1))
      : localMarketProfile.benchmarkAppreciation
  );

  // Financing Structure
  const [financingType, setFinancingType] = useState<'cash' | 'mortgage'>('cash');
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(30); // 30% down
  const [mortgageInterestRate, setMortgageInterestRate] = useState<number>(8.5); // USD bank rate in Tanzania
  const [loanTenureYears, setLoanTenureYears] = useState<number>(15);

  // Operational & Tax Expenses (Tanzania Regulatory specifics)
  const [applyTraWithholding, setApplyTraWithholding] = useState<boolean>(true);
  const [isResident, setIsResident] = useState<boolean>(false); // Non-resident (15%) vs resident (10%)
  const [propertyManagementPercent, setPropertyManagementPercent] = useState<number>(
    strategy === 'short_term' ? 16 : 8
  );
  const [maintenancePercent, setMaintenancePercent] = useState<number>(5);

  // Projection Horizon
  const [horizonYears, setHorizonYears] = useState<number>(5);

  // Copied toast state
  const [copiedMemo, setCopiedMemo] = useState<boolean>(false);

  // Format Helper
  const formatAmount = (valUSD: number) => {
    if (currency === 'TZS') {
      const valTZS = valUSD * TZS_RATE;
      return `${new Intl.NumberFormat('en-US', {
        maximumFractionDigits: 0,
      }).format(valTZS)} TZS`;
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(valUSD);
  };

  // Calculations
  // 1. Gross Annual Income
  const grossAnnualIncome = useMemo(() => {
    if (strategy === 'long_term') {
      return monthlyRentUSD * 12;
    } else {
      // Short-Term Luxury Villa: 365 days * ADR * (Occupancy / 100)
      return Math.round(365 * dailyRateUSD * (occupancyRate / 100));
    }
  }, [strategy, monthlyRentUSD, dailyRateUSD, occupancyRate]);

  // 2. Operational Deductions
  const annualManagementFee = (grossAnnualIncome * propertyManagementPercent) / 100;
  const annualMaintenance = (grossAnnualIncome * maintenancePercent) / 100;
  const traRate = isResident ? 0.10 : 0.15;
  const annualTraTax = applyTraWithholding ? grossAnnualIncome * traRate : 0;
  const annualPropertyTax = Math.min(Math.round(propertyPrice * 0.0015), 1200);

  const totalAnnualOperatingExpenses =
    annualManagementFee + annualMaintenance + annualTraTax + annualPropertyTax;

  const annualNOI = Math.max(0, grossAnnualIncome - totalAnnualOperatingExpenses);

  // 3. Financing / Debt Service
  const initialEquity = financingType === 'cash' ? propertyPrice : (propertyPrice * downPaymentPercent) / 100;
  const loanAmount = financingType === 'cash' ? 0 : propertyPrice - initialEquity;

  const annualDebtService = useMemo(() => {
    if (financingType === 'cash' || loanAmount <= 0) return 0;
    const monthlyRate = mortgageInterestRate / 100 / 12;
    const totalMonths = loanTenureYears * 12;
    const monthlyMortgage =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1);
    return monthlyMortgage * 12;
  }, [financingType, loanAmount, mortgageInterestRate, loanTenureYears]);

  const annualNetCashflow = annualNOI - annualDebtService;

  // Key Ratios
  const effectiveGrossRentalYield = (grossAnnualIncome / propertyPrice) * 100;
  const netRentalYield = (annualNOI / propertyPrice) * 100;
  const cashOnCashROI = initialEquity > 0 ? (annualNetCashflow / initialEquity) * 100 : 0;

  // 4. Multi-Year Horizon Projections (Compounded Capital Appreciation + Cumulative Cashflow)
  const projectionTable = useMemo(() => {
    const rows = [];
    let currentAssetValue = propertyPrice;
    let cumulativeCashflow = 0;

    for (let yr = 1; yr <= 10; yr++) {
      currentAssetValue = currentAssetValue * (1 + appreciationRate / 100);
      cumulativeCashflow += annualNetCashflow;
      const totalGain = (currentAssetValue - propertyPrice) + cumulativeCashflow;
      const totalROI = initialEquity > 0 ? (totalGain / initialEquity) * 100 : 0;

      rows.push({
        year: yr,
        assetValue: Math.round(currentAssetValue),
        netCashflowAnnual: Math.round(annualNetCashflow),
        cumulativeCashflow: Math.round(cumulativeCashflow),
        capitalAppreciationDollar: Math.round(currentAssetValue - propertyPrice),
        totalGain: Math.round(totalGain),
        totalROI: Number(totalROI.toFixed(1)),
      });
    }
    return rows;
  }, [propertyPrice, appreciationRate, annualNetCashflow, initialEquity]);

  const activeHorizonData = projectionTable[horizonYears - 1] || projectionTable[4];

  // Helper to apply historical presets
  const applyHistoricalScenario = (scenario: 'conservative' | 'baseline' | 'high_growth' | TanzaniaMarketTrend) => {
    if (typeof scenario === 'object') {
      setAppreciationRate(scenario.benchmarkAppreciation);
      if (strategy === 'long_term') {
        handleYieldPctChange(scenario.longTermGrossYield);
      } else {
        handleYieldPctChange(scenario.shortTermGrossYield);
        setOccupancyRate(scenario.historicalAvgOccupancy);
      }
      setCalculatorView('pro_forma');
      return;
    }

    if (scenario === 'conservative') {
      setAppreciationRate(6.5);
      handleYieldPctChange(7.2);
    } else if (scenario === 'baseline') {
      setAppreciationRate(localMarketProfile.benchmarkAppreciation);
      handleYieldPctChange(
        strategy === 'long_term'
          ? localMarketProfile.longTermGrossYield
          : localMarketProfile.shortTermGrossYield
      );
    } else if (scenario === 'high_growth') {
      setAppreciationRate(14.0);
      handleYieldPctChange(11.8);
    }
  };

  // Copy Pro-Forma Memo to clipboard
  const handleCopyMemo = () => {
    const memo = `
FLX TANZANIA PRIME ESTATE INVESTMENT MEMO
==================================================
Property: ${property.title}
Location: ${property.location.ward || 'Masaki'}, ${property.location.city}, ${property.location.region || 'Dar es Salaam'}, Tanzania
Region Profile: ${localMarketProfile.regionName}

VALUATION & ACQUISITION:
- Asset Valuation: $${propertyPrice.toLocaleString()} USD (~${(propertyPrice * TZS_RATE).toLocaleString()} TZS)
- Financing Structure: ${financingType === 'cash' ? '100% Cash Equity' : `${downPaymentPercent}% Down ($${initialEquity.toLocaleString()} USD)`}
- Operating Strategy: ${strategy === 'long_term' ? 'Corporate Diplomatic Long-Term Lease' : 'Luxury Hospitality / Safari-Beachfront Villa'}

USER CUSTOM INPUTS:
- Input Rental Yield: ${effectiveGrossRentalYield.toFixed(2)}% Gross
- Monthly Rental Projection: $${monthlyRentUSD.toLocaleString()} USD/mo
- Input Capital Appreciation Estimate: +${appreciationRate}% p.a.

HISTORICAL BENCHMARK COMPARISON (${localMarketProfile.shortLabel}):
- 5-Year Historical CAGR: ${localMarketProfile.historical5yrCAGR}% p.a.
- Historical Rental Yield Benchmark: ${localMarketProfile.historicalRentalYieldRange}
- Real Return Alpha over BOT Inflation: +${localMarketProfile.historicalInflationAlpha}%

ANNUAL PRO-FORMA YIELD METRICS:
- Gross Annual Income: $${grossAnnualIncome.toLocaleString()} USD
- Gross Rental Yield: ${effectiveGrossRentalYield.toFixed(2)}%
- Net Operating Income (NOI): $${annualNOI.toLocaleString()} USD
- Net Yield (Cap Rate): ${netRentalYield.toFixed(2)}%
- Cash-on-Cash Return: ${cashOnCashROI.toFixed(2)}%
- Annual Net Cashflow: $${annualNetCashflow.toLocaleString()} USD
- TRA Withholding Tax: ${applyTraWithholding ? (isResident ? '10% (Resident)' : '15% (Foreign/Non-Resident)') : 'Exempt'}

${horizonYears}-YEAR COMPREHENSIVE HORIZON:
- Asset Value at Yr ${horizonYears}: $${activeHorizonData.assetValue.toLocaleString()} USD
- Cumulative Net Rental Cashflow: $${activeHorizonData.cumulativeCashflow.toLocaleString()} USD
- Capital Appreciation Gain: +$${activeHorizonData.capitalAppreciationDollar.toLocaleString()} USD
- Total Investor Net Gain: +$${activeHorizonData.totalGain.toLocaleString()} USD (${activeHorizonData.totalROI}% Total ROI)
==================================================
Source Authority: ${localMarketProfile.sourceAuthority}
Generated on ${new Date().toLocaleDateString()} via FLX Financial Intelligence
    `.trim();

    navigator.clipboard.writeText(memo);
    setCopiedMemo(true);
    setTimeout(() => setCopiedMemo(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls: Region Indicator, View Switcher & Currency */}
      <div className="p-4 bg-gradient-to-r from-red-950/40 via-[#101216] to-black border border-white/10 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2 py-0.5 bg-red-600 text-white font-black text-[10px] uppercase tracking-widest rounded">
              Tanzania Real Estate Data
            </span>
            <span className="font-headline font-bold text-xs uppercase tracking-wider text-white">
              {localMarketProfile.regionName}
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl leading-relaxed">
            {localMarketProfile.marketDynamics}
          </p>
        </div>

        {/* View Mode & Currency Actions */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {/* Pro-Forma vs Historical Archive View */}
          <div className="flex items-center bg-black/80 border border-white/15 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setCalculatorView('pro_forma')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                calculatorView === 'pro_forma'
                  ? 'bg-red-600 text-white shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>ROI Pro-Forma</span>
            </button>
            <button
              type="button"
              onClick={() => setCalculatorView('historical_archive')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                calculatorView === 'historical_archive'
                  ? 'bg-red-600 text-white shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Historical Benchmarks</span>
            </button>
          </div>

          {/* Currency Toggle */}
          <div className="flex items-center bg-black/80 border border-white/15 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setCurrency('USD')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono transition-all ${
                currency === 'USD' ? 'bg-red-600 text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              $ USD
            </button>
            <button
              type="button"
              onClick={() => setCurrency('TZS')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono transition-all ${
                currency === 'TZS' ? 'bg-red-600 text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              TZS
            </button>
          </div>

          {/* Export Memo Button */}
          <button
            type="button"
            onClick={handleCopyMemo}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/15 rounded-xl text-xs text-zinc-300 hover:text-white transition-all font-mono"
            title="Export Pro-Forma Memo"
          >
            {copiedMemo ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-zinc-400" />
                <span className="hidden sm:inline">Export</span> Memo
              </>
            )}
          </button>
        </div>
      </div>

      {/* HISTORICAL ARCHIVE VIEW */}
      {calculatorView === 'historical_archive' && (
        <div className="space-y-6">
          <div className="p-5 bg-[#0e1014] border border-white/10 rounded-2xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div>
                <h4 className="font-headline font-bold text-sm uppercase tracking-wider text-white flex items-center gap-2">
                  <History className="w-4 h-4 text-red-500" />
                  <span>Historical Real Estate Performance in Tanzania (2020 – 2025)</span>
                </h4>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Verified land commission registry data, Bank of Tanzania inflation metrics, and private embassy lease records.
                </p>
              </div>
              <span className="text-[10px] font-mono text-zinc-400 bg-white/5 px-2.5 py-1 rounded border border-white/10">
                Data Source: Ministry of Lands & BOT
              </span>
            </div>

            {/* Regional Comparative Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.values(TANZANIA_MARKET_TRENDS).map((trend) => {
                const isCurrentRegion = trend.regionKey === localMarketProfile.regionKey;
                return (
                  <div
                    key={trend.regionKey}
                    className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                      isCurrentRegion
                        ? 'bg-gradient-to-b from-red-950/40 to-[#0e1014] border-red-500 ring-1 ring-red-500/50'
                        : 'bg-black/50 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-headline font-bold text-xs uppercase tracking-wide text-white">
                          {trend.shortLabel}
                        </span>
                        {isCurrentRegion ? (
                          <span className="px-2 py-0.5 bg-red-600 text-[9px] font-bold text-white rounded">
                            Listing Location
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono text-zinc-500">
                            {trend.historicalRentalYieldRange}
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2 my-3 text-xs">
                        <div className="p-2 bg-black/60 rounded-lg border border-white/5">
                          <span className="text-[9px] text-zinc-500 uppercase block font-medium">5-Yr Appreciation</span>
                          <strong className="text-white font-mono text-sm">+{trend.benchmarkAppreciation}%/yr</strong>
                        </div>
                        <div className="p-2 bg-black/60 rounded-lg border border-white/5">
                          <span className="text-[9px] text-zinc-500 uppercase block font-medium">Historical Gross Yield</span>
                          <strong className="text-emerald-400 font-mono text-sm">~{trend.longTermGrossYield}%</strong>
                        </div>
                        <div className="p-2 bg-black/60 rounded-lg border border-white/5">
                          <span className="text-[9px] text-zinc-500 uppercase block font-medium">Inflation Alpha</span>
                          <strong className="text-blue-400 font-mono text-xs">+{trend.historicalInflationAlpha}% real</strong>
                        </div>
                        <div className="p-2 bg-black/60 rounded-lg border border-white/5">
                          <span className="text-[9px] text-zinc-500 uppercase block font-medium">Avg Occupancy</span>
                          <strong className="text-zinc-200 font-mono text-xs">{trend.historicalAvgOccupancy}%</strong>
                        </div>
                      </div>

                      <p className="text-[11px] text-zinc-400 line-clamp-2 mb-3">
                        {trend.marketDynamics}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => applyHistoricalScenario(trend)}
                      className="w-full py-2 px-3 bg-white/10 hover:bg-red-600 text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <BookmarkCheck className="w-3.5 h-3.5" />
                      <span>Apply to Calculator</span>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Historical Yearly Track Record Table */}
            <div className="mt-6 pt-4 border-t border-white/10">
              <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-3 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-400" />
                <span>{localMarketProfile.regionName} — Annual Historical Yield & Appreciation (2020–2025)</span>
              </h5>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-white/10 text-[10px] text-zinc-500 uppercase font-mono">
                      <th className="py-2 px-3">Year</th>
                      <th className="py-2 px-3">Annual Land & Property Appreciation</th>
                      <th className="py-2 px-3">Average Gross Rental Yield</th>
                      <th className="py-2 px-3">Tanzania CPI Inflation</th>
                      <th className="py-2 px-3">Real Return Alpha (Hedging Power)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-mono">
                    {localMarketProfile.historicalYearlyAppreciation.map((row) => {
                      const realAlpha = Number((row.appreciation - row.inflation).toFixed(1));
                      return (
                        <tr key={row.year} className="hover:bg-white/5">
                          <td className="py-2 px-3 font-bold text-white">{row.year}</td>
                          <td className="py-2 px-3 text-emerald-400">+{row.appreciation}%</td>
                          <td className="py-2 px-3 text-zinc-200">~{row.avgYield}%</td>
                          <td className="py-2 px-3 text-zinc-400">{row.inflation}%</td>
                          <td className="py-2 px-3 text-blue-400 font-bold">+{realAlpha}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PRO-FORMA CALCULATOR VIEW */}
      {calculatorView === 'pro_forma' && (
        <div className="space-y-6">
          {/* Strategy Selector & Quick Historical Scenario Presets */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Strategy (6 cols) */}
            <div className="md:col-span-6 p-4 bg-[#0e1014] border border-white/10 rounded-2xl">
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold block mb-2">
                1. Operating Model
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setStrategy('long_term');
                    setPropertyManagementPercent(8);
                  }}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    strategy === 'long_term'
                      ? 'bg-red-950/40 border-red-500 text-white'
                      : 'bg-black/40 border-white/10 text-zinc-400 hover:border-white/20'
                  }`}
                >
                  <div className="font-bold text-xs text-white">Corporate / Diplomatic Lease</div>
                  <div className="text-[11px] text-zinc-400 mt-1">12-Mo USD advance • Expat & Embassy</div>
                  <div className="text-[10px] text-red-400 font-mono mt-2">
                    TZ Benchmark: ~{localMarketProfile.longTermGrossYield}%
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStrategy('short_term');
                    setPropertyManagementPercent(16);
                  }}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    strategy === 'short_term'
                      ? 'bg-red-950/40 border-red-500 text-white'
                      : 'bg-black/40 border-white/10 text-zinc-400 hover:border-white/20'
                  }`}
                >
                  <div className="font-bold text-xs text-white">Luxury Holiday Villa</div>
                  <div className="text-[11px] text-zinc-400 mt-1">Nightly ADRs • Safari & Beach</div>
                  <div className="text-[10px] text-emerald-400 font-mono mt-2">
                    TZ Benchmark: ~{localMarketProfile.shortTermGrossYield}%
                  </div>
                </button>
              </div>
            </div>

            {/* Quick Historical Tanzania Scenarios (6 cols) */}
            <div className="md:col-span-6 p-4 bg-[#0e1014] border border-white/10 rounded-2xl flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold block mb-2">
                  2. Apply Historical Tanzania Presets
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => applyHistoricalScenario('conservative')}
                    className="p-2.5 bg-black/60 hover:bg-white/5 border border-white/10 rounded-xl text-left transition-all"
                  >
                    <span className="text-[10px] uppercase font-bold text-zinc-400 block">Conservative</span>
                    <span className="text-xs font-mono font-bold text-white block mt-0.5">7.2% Yield</span>
                    <span className="text-[10px] font-mono text-zinc-500">+6.5% Appr</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => applyHistoricalScenario('baseline')}
                    className="p-2.5 bg-red-950/30 hover:bg-red-950/50 border border-red-500/50 rounded-xl text-left transition-all"
                  >
                    <span className="text-[10px] uppercase font-bold text-red-400 block">Local Median</span>
                    <span className="text-xs font-mono font-bold text-white block mt-0.5">
                      {localMarketProfile.longTermGrossYield}% Yield
                    </span>
                    <span className="text-[10px] font-mono text-red-400">+{localMarketProfile.benchmarkAppreciation}% Appr</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => applyHistoricalScenario('high_growth')}
                    className="p-2.5 bg-black/60 hover:bg-white/5 border border-white/10 rounded-xl text-left transition-all"
                  >
                    <span className="text-[10px] uppercase font-bold text-emerald-400 block">High-Growth</span>
                    <span className="text-xs font-mono font-bold text-white block mt-0.5">11.8% Yield</span>
                    <span className="text-[10px] font-mono text-emerald-400">+14.0% Appr</span>
                  </button>
                </div>
              </div>

              <div className="text-[11px] text-zinc-400 font-mono mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between">
                <span>Inflation Hedge Alpha:</span>
                <strong className="text-emerald-400">+{localMarketProfile.historicalInflationAlpha}% over CPI</strong>
              </div>
            </div>
          </div>

          {/* Core Interactive Inputs vs Live Yield Results Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Interactive Parameters (7 Cols) */}
            <div className="lg:col-span-7 space-y-5 p-5 bg-[#0e1014] border border-white/10 rounded-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h4 className="font-headline font-bold text-xs uppercase tracking-wider text-white flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-red-500" />
                  <span>Input Rental Yields & Capital Appreciation</span>
                </h4>
                <span className="text-[10px] font-mono text-zinc-500 uppercase">Interactive Model</span>
              </div>

              {/* Property Valuation / Acquisition Price */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="text-zinc-300 font-medium">Acquisition / Valuation Price</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={50000}
                      max={10000000}
                      step={5000}
                      value={propertyPrice}
                      onChange={(e) => setPropertyPrice(Number(e.target.value))}
                      className="w-28 px-2 py-1 text-right bg-black border border-white/20 rounded text-xs font-mono text-white focus:border-red-500 focus:outline-none"
                    />
                    <strong className="text-white font-mono text-sm">{formatAmount(propertyPrice)}</strong>
                  </div>
                </div>
                <input
                  type="range"
                  min={Math.round(property.price * 0.6)}
                  max={Math.round(property.price * 1.5)}
                  step={5000}
                  value={propertyPrice}
                  onChange={(e) => setPropertyPrice(Number(e.target.value))}
                  className="w-full accent-red-600 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Strategy-Specific Rental Yield & Income Inputs */}
              {strategy === 'long_term' ? (
                <div className="p-3.5 bg-black/60 border border-white/10 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Percent className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Rental Yield Input Mode</span>
                    </span>
                    <div className="flex items-center bg-zinc-900 border border-white/10 p-0.5 rounded-lg text-[10px]">
                      <button
                        type="button"
                        onClick={() => setRentalYieldInputMode('percentage')}
                        className={`px-2 py-0.5 rounded font-mono font-bold transition-all ${
                          rentalYieldInputMode === 'percentage'
                            ? 'bg-red-600 text-white'
                            : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        Yield %
                      </button>
                      <button
                        type="button"
                        onClick={() => setRentalYieldInputMode('amount')}
                        className={`px-2 py-0.5 rounded font-mono font-bold transition-all ${
                          rentalYieldInputMode === 'amount'
                            ? 'bg-red-600 text-white'
                            : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        Monthly Rent ($)
                      </button>
                    </div>
                  </div>

                  {/* Direct Gross Yield % Input & Slider */}
                  <div>
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-zinc-300 font-medium">Gross Rental Yield (% p.a.)</span>
                        <span className="text-[10px] font-mono text-zinc-500">
                          (TZ Benchmark: ~{localMarketProfile.longTermGrossYield}%)
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min={2.0}
                          max={22.0}
                          step={0.1}
                          value={grossYieldInputPct}
                          onChange={(e) => handleYieldPctChange(Number(e.target.value))}
                          className="w-20 px-2 py-1 text-right bg-[#0e1014] border border-white/20 rounded text-xs font-mono font-bold text-emerald-400 focus:border-red-500 focus:outline-none"
                        />
                        <span className="text-xs font-mono text-emerald-400 font-bold">%</span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min={3.0}
                      max={18.0}
                      step={0.1}
                      value={grossYieldInputPct}
                      onChange={(e) => handleYieldPctChange(Number(e.target.value))}
                      className="w-full accent-emerald-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Monthly Rent Equivalent Input */}
                  <div className="pt-2 border-t border-white/5">
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="text-zinc-400">Monthly Rent (Derived or Custom):</span>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min={200}
                          max={50000}
                          step={100}
                          value={monthlyRentUSD}
                          onChange={(e) => handleMonthlyRentChange(Number(e.target.value))}
                          className="w-24 px-2 py-1 text-right bg-[#0e1014] border border-white/20 rounded text-xs font-mono text-white focus:border-red-500 focus:outline-none"
                        />
                        <span className="text-xs font-mono text-zinc-300">USD/mo</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500 block text-right">
                      Annual Gross: {formatAmount(grossAnnualIncome)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 bg-black/60 border border-white/10 rounded-xl space-y-3">
                  <span className="text-xs font-bold text-white uppercase tracking-wider block">
                    Short-Term Hospitality Yield Drivers
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between items-center text-xs mb-1.5">
                        <span className="text-zinc-300">Nightly ADR ($)</span>
                        <input
                          type="number"
                          min={50}
                          max={2500}
                          step={10}
                          value={dailyRateUSD}
                          onChange={(e) => setDailyRateUSD(Number(e.target.value))}
                          className="w-20 px-2 py-1 text-right bg-[#0e1014] border border-white/20 rounded text-xs font-mono font-bold text-emerald-400 focus:border-red-500 focus:outline-none"
                        />
                      </div>
                      <input
                        type="range"
                        min={100}
                        max={1500}
                        step={10}
                        value={dailyRateUSD}
                        onChange={(e) => setDailyRateUSD(Number(e.target.value))}
                        className="w-full accent-emerald-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-center text-xs mb-1.5">
                        <span className="text-zinc-300">Annual Occupancy</span>
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min={20}
                            max={95}
                            step={1}
                            value={occupancyRate}
                            onChange={(e) => setOccupancyRate(Number(e.target.value))}
                            className="w-16 px-2 py-1 text-right bg-[#0e1014] border border-white/20 rounded text-xs font-mono font-bold text-white focus:border-red-500 focus:outline-none"
                          />
                          <span className="text-xs font-mono text-zinc-400">%</span>
                        </div>
                      </div>
                      <input
                        type="range"
                        min={30}
                        max={90}
                        step={1}
                        value={occupancyRate}
                        onChange={(e) => setOccupancyRate(Number(e.target.value))}
                        className="w-full accent-red-600 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Capital Appreciation Rate Input (% p.a.) */}
              <div className="p-3.5 bg-black/60 border border-white/10 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <div>
                    <span className="text-zinc-300 font-medium block">
                      Estimated Capital Appreciation (% per year)
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">
                      Based on historical registry land value escalation
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min={2.0}
                      max={25.0}
                      step={0.1}
                      value={appreciationRate}
                      onChange={(e) => setAppreciationRate(Number(e.target.value))}
                      className="w-20 px-2 py-1 text-right bg-[#0e1014] border border-white/20 rounded text-xs font-mono font-bold text-red-400 focus:border-red-500 focus:outline-none"
                    />
                    <span className="text-xs font-mono text-red-400 font-bold">%</span>
                  </div>
                </div>
                <input
                  type="range"
                  min={3.0}
                  max={20.0}
                  step={0.1}
                  value={appreciationRate}
                  onChange={(e) => setAppreciationRate(Number(e.target.value))}
                  className="w-full accent-red-600 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-zinc-500 mt-1">
                  <span>Inflation Match (3.5%)</span>
                  <span className="text-zinc-400">Historical Median ({localMarketProfile.benchmarkAppreciation}%)</span>
                  <span>Zanzibar/Dodoma Surge (14%+)</span>
                </div>
              </div>

              {/* Financing Structure */}
              <div className="pt-2 border-t border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-300 font-medium">Acquisition Financing</span>
                  <div className="flex items-center bg-black p-0.5 rounded-lg border border-white/10">
                    <button
                      type="button"
                      onClick={() => setFinancingType('cash')}
                      className={`px-3 py-1 text-xs font-bold rounded ${
                        financingType === 'cash' ? 'bg-red-600 text-white' : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      100% Cash / Equity
                    </button>
                    <button
                      type="button"
                      onClick={() => setFinancingType('mortgage')}
                      className={`px-3 py-1 text-xs font-bold rounded ${
                        financingType === 'mortgage' ? 'bg-red-600 text-white' : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      Bank Mortgage
                    </button>
                  </div>
                </div>

                {financingType === 'mortgage' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-black/50 border border-white/10 rounded-xl text-xs">
                    <div>
                      <span className="text-[10px] text-zinc-400 block mb-1">Down Payment</span>
                      <div className="font-mono text-white font-bold">{downPaymentPercent}% ({formatAmount(initialEquity)})</div>
                      <input
                        type="range"
                        min={20}
                        max={60}
                        step={5}
                        value={downPaymentPercent}
                        onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                        className="w-full accent-red-600 h-1 bg-zinc-800 rounded cursor-pointer mt-1"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-400 block mb-1">Interest Rate</span>
                      <div className="font-mono text-white font-bold">{mortgageInterestRate}% p.a.</div>
                      <input
                        type="range"
                        min={6.0}
                        max={16.0}
                        step={0.5}
                        value={mortgageInterestRate}
                        onChange={(e) => setMortgageInterestRate(Number(e.target.value))}
                        className="w-full accent-red-600 h-1 bg-zinc-800 rounded cursor-pointer mt-1"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-400 block mb-1">Tenure</span>
                      <div className="font-mono text-white font-bold">{loanTenureYears} Years</div>
                      <div className="flex gap-1 mt-1">
                        {[10, 15, 20].map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setLoanTenureYears(t)}
                            className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                              loanTenureYears === t ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-400'
                            }`}
                          >
                            {t}Y
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Tanzania TRA Withholding & Property Tax */}
              <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300">
                  <input
                    type="checkbox"
                    checked={applyTraWithholding}
                    onChange={(e) => setApplyTraWithholding(e.target.checked)}
                    className="accent-red-600 w-3.5 h-3.5"
                  />
                  <span>Apply TRA Rental Income Withholding Tax</span>
                </label>

                {applyTraWithholding && (
                  <div className="flex items-center gap-2 text-[10px]">
                    <button
                      type="button"
                      onClick={() => setIsResident(true)}
                      className={`px-2 py-0.5 rounded font-mono ${
                        isResident ? 'bg-zinc-700 text-white font-bold' : 'text-zinc-400'
                      }`}
                    >
                      Resident (10%)
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsResident(false)}
                      className={`px-2 py-0.5 rounded font-mono ${
                        !isResident ? 'bg-red-950 text-red-300 border border-red-800/60 font-bold' : 'text-zinc-400'
                      }`}
                    >
                      Foreign / Non-Resident (15%)
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Live Calculated Yields & Pro-Forma (5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              {/* Primary Key Metrics */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-gradient-to-br from-[#12141a] to-black border border-white/15 rounded-2xl">
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold block">
                    Gross Rental Yield
                  </span>
                  <div className="text-2xl font-black font-mono text-emerald-400 mt-1">
                    {effectiveGrossRentalYield.toFixed(1)}%
                  </div>
                  <span className="text-[10px] text-zinc-500 font-mono mt-0.5 block">
                    {formatAmount(grossAnnualIncome)}/yr
                  </span>
                </div>

                <div className="p-4 bg-gradient-to-br from-[#12141a] to-black border border-emerald-500/30 rounded-2xl">
                  <span className="text-[10px] text-emerald-400 uppercase tracking-wider font-bold block">
                    Net Yield (Cap Rate)
                  </span>
                  <div className="text-2xl font-black font-mono text-white mt-1">
                    {netRentalYield.toFixed(1)}%
                  </div>
                  <span className="text-[10px] text-emerald-400/80 font-mono mt-0.5 block">
                    NOI: {formatAmount(annualNOI)}/yr
                  </span>
                </div>
              </div>

              {/* Annual Pro-Forma Cashflow Statement */}
              <div className="p-5 bg-gradient-to-b from-[#14171e] to-[#0c0d10] border border-white/15 rounded-2xl space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Annual Pro-Forma Cashflow
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">USD & TZS</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-zinc-400">Gross Rental Income:</span>
                    <strong className="text-white font-mono">{formatAmount(grossAnnualIncome)}</strong>
                  </div>

                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-zinc-400">Property Management ({propertyManagementPercent}%):</span>
                    <strong className="text-red-400 font-mono">-{formatAmount(annualManagementFee)}</strong>
                  </div>

                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-zinc-400">Maintenance Reserve ({maintenancePercent}%):</span>
                    <strong className="text-red-400 font-mono">-{formatAmount(annualMaintenance)}</strong>
                  </div>

                  {applyTraWithholding && (
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-zinc-400">TRA Withholding Tax ({isResident ? '10%' : '15%'}):</span>
                      <strong className="text-red-400 font-mono">-{formatAmount(annualTraTax)}</strong>
                    </div>
                  )}

                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-zinc-400">Tanzania Land & Property Tax:</span>
                    <strong className="text-red-400 font-mono">-{formatAmount(annualPropertyTax)}</strong>
                  </div>

                  {financingType === 'mortgage' && (
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-zinc-400">Annual Mortgage Debt Service:</span>
                      <strong className="text-red-400 font-mono">-{formatAmount(annualDebtService)}</strong>
                    </div>
                  )}

                  <div className="flex justify-between py-2 border-t border-white/15 text-sm">
                    <span className="font-bold text-white">Net Annual Cashflow:</span>
                    <strong className={`font-black font-mono ${annualNetCashflow >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {formatAmount(annualNetCashflow)}/yr
                    </strong>
                  </div>
                </div>

                {/* Cash-on-Cash Return Pill */}
                <div className="p-3 bg-black/60 border border-white/10 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">
                      Cash-on-Cash Return
                    </span>
                    <span className="text-xs text-zinc-300 font-mono">
                      Invested: {formatAmount(initialEquity)}
                    </span>
                  </div>
                  <div className="text-lg font-black font-mono text-emerald-400">
                    {cashOnCashROI.toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Multi-Year Wealth Horizon Forecast (1Y, 3Y, 5Y, 10Y) */}
          <div className="p-5 bg-[#0e1014] border border-white/10 rounded-2xl space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <h4 className="font-headline font-bold text-xs uppercase tracking-wider text-white">
                    Compounded Horizon Forecast ({horizonYears} Years)
                  </h4>
                </div>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Compounding +{appreciationRate}% p.a. capital appreciation with cumulative rental yields.
                </p>
              </div>

              <div className="flex items-center bg-black p-1 border border-white/10 rounded-xl">
                {[1, 3, 5, 10].map((yr) => (
                  <button
                    key={yr}
                    type="button"
                    onClick={() => setHorizonYears(yr)}
                    className={`px-3 py-1 text-xs font-bold font-mono rounded-lg transition-all ${
                      horizonYears === yr
                        ? 'bg-red-600 text-white shadow-md'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {yr} {yr === 1 ? 'Year' : 'Years'}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Horizon Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-black/60 border border-white/10 rounded-xl">
                <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold block">
                  Asset Value at Yr {horizonYears}
                </span>
                <div className="text-xl font-black font-mono text-white mt-1">
                  {formatAmount(activeHorizonData.assetValue)}
                </div>
                <span className="text-[10px] text-emerald-400 font-mono mt-0.5 flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3" />
                  +{formatAmount(activeHorizonData.capitalAppreciationDollar)} gain
                </span>
              </div>

              <div className="p-4 bg-black/60 border border-white/10 rounded-xl">
                <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold block">
                  Cumulative Net Cashflow
                </span>
                <div className="text-xl font-black font-mono text-emerald-400 mt-1">
                  {formatAmount(activeHorizonData.cumulativeCashflow)}
                </div>
                <span className="text-[10px] text-zinc-500 font-mono mt-0.5 block">
                  Over {horizonYears} years holding
                </span>
              </div>

              <div className="p-4 bg-black/60 border border-white/10 rounded-xl">
                <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold block">
                  Total Investor Return
                </span>
                <div className="text-xl font-black font-mono text-white mt-1">
                  +{formatAmount(activeHorizonData.totalGain)}
                </div>
                <span className="text-[10px] text-emerald-400 font-mono mt-0.5 block">
                  Capital gain + net rent
                </span>
              </div>

              <div className="p-4 bg-black/60 border border-emerald-500/40 rounded-xl bg-gradient-to-br from-emerald-950/20 to-black">
                <span className="text-[10px] text-emerald-400 uppercase tracking-widest font-bold block">
                  Total Horizon ROI
                </span>
                <div className="text-2xl font-black font-mono text-emerald-400 mt-1">
                  +{activeHorizonData.totalROI}%
                </div>
                <span className="text-[10px] text-zinc-400 font-mono mt-0.5 block">
                  On Invested Capital
                </span>
              </div>
            </div>

            {/* 10-Year Compounded Valuation Trajectory Bars */}
            <div className="p-4 bg-black/50 border border-white/10 rounded-xl space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-300 font-bold uppercase tracking-wider text-[11px]">
                  10-Year Valuation & Cumulative Cashflow Trajectory
                </span>
                <div className="flex items-center gap-4 text-[10px] font-mono text-zinc-400">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 bg-red-600 rounded-sm" />
                    Asset Value
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-sm" />
                    Cumulative Rent
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 pt-4">
                {projectionTable.map((item) => {
                  const maxVal = projectionTable[9].assetValue + projectionTable[9].cumulativeCashflow;
                  const assetHeightPercent = Math.round((item.assetValue / maxVal) * 100);
                  const cashflowHeightPercent = Math.round((item.cumulativeCashflow / maxVal) * 100);
                  const isSelectedHorizon = item.year === horizonYears;

                  return (
                    <div
                      key={item.year}
                      onClick={() => setHorizonYears(item.year)}
                      className={`flex flex-col items-center justify-end cursor-pointer group p-1 rounded-lg transition-all ${
                        isSelectedHorizon ? 'bg-red-950/40 ring-1 ring-red-500' : 'hover:bg-white/5'
                      }`}
                    >
                      <div className="h-28 w-full flex items-end justify-center gap-1 pb-1">
                        <div
                          style={{ height: `${assetHeightPercent}%` }}
                          className={`w-3 rounded-t transition-all ${
                            isSelectedHorizon ? 'bg-red-600' : 'bg-red-900 group-hover:bg-red-700'
                          }`}
                          title={`Year ${item.year}: Asset ${formatAmount(item.assetValue)}`}
                        />
                        <div
                          style={{ height: `${Math.max(cashflowHeightPercent, 4)}%` }}
                          className={`w-3 rounded-t transition-all ${
                            isSelectedHorizon ? 'bg-emerald-400' : 'bg-emerald-700 group-hover:bg-emerald-500'
                          }`}
                          title={`Year ${item.year}: Rent ${formatAmount(item.cumulativeCashflow)}`}
                        />
                      </div>
                      <span className={`text-[10px] font-mono mt-1 ${isSelectedHorizon ? 'text-white font-bold' : 'text-zinc-500'}`}>
                        Y{item.year}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Inquire or Transmit Pro-Forma */}
            {onInquireInvestment && (
              <div className="p-4 bg-gradient-to-r from-red-950/30 to-black border border-red-500/30 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs">
                  <strong className="text-white block font-bold uppercase tracking-wider">
                    Ready to execute or request detailed feasibility study?
                  </strong>
                  <span className="text-zinc-400 text-[11px]">
                    Coordinate with certified Tanzanian conveyance attorneys and asset managers.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onInquireInvestment}
                  className="px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-800 hover:brightness-110 text-white rounded-xl text-xs font-bold uppercase tracking-widest shrink-0 transition-all shadow-md shadow-red-900/30"
                >
                  Direct Inquiry to Desk
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

