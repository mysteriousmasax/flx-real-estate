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
  Coins
} from 'lucide-react';

interface InvestmentCalculatorProps {
  property: Property;
  onInquireInvestment?: () => void;
}

// Tanzanian Regional Benchmark Market Dynamics
interface TanzaniaMarketTrend {
  regionKey: string;
  regionName: string;
  benchmarkAppreciation: number; // annual %
  longTermGrossYield: number; // %
  shortTermGrossYield: number; // %
  marketDynamics: string;
  primeDrivers: string[];
}

const TANZANIA_MARKET_TRENDS: Record<string, TanzaniaMarketTrend> = {
  'dar es salaam': {
    regionKey: 'dar es salaam',
    regionName: 'Dar es Salaam (Masaki / Oysterbay / Peninsula)',
    benchmarkAppreciation: 10.5,
    longTermGrossYield: 9.2,
    shortTermGrossYield: 14.5,
    marketDynamics: 'Prime oceanfront diplomatic hub with severe land scarcity, high USD corporate tenancy demand, and stable appreciation.',
    primeDrivers: ['Diplomatic & UN missions', 'Multinational oil/gas & mining HQs', 'USD-denominated 12-month advance leases'],
  },
  'zanzibar': {
    regionKey: 'zanzibar',
    regionName: 'Zanzibar (Unguja & Pemba / Fumba / Nungwi)',
    benchmarkAppreciation: 13.8,
    longTermGrossYield: 10.0,
    shortTermGrossYield: 17.2,
    marketDynamics: 'Fastest-growing luxury market driven by ZIPA foreign investor incentives, Golden Visas, and surging high-net-worth tourism.',
    primeDrivers: ['ZIPA 100% foreign ownership incentives', 'Residency-by-investment visas', 'Year-round beachfront holiday ADRs'],
  },
  'arusha': {
    regionKey: 'arusha',
    regionName: 'Arusha (Safari Circuit / Sekei / Njiro)',
    benchmarkAppreciation: 9.4,
    longTermGrossYield: 8.6,
    shortTermGrossYield: 13.8,
    marketDynamics: 'East African Community (EAC) headquarters with strong safari lodge owner demand and high seasonal luxury hospitality rates.',
    primeDrivers: ['EAC & International Court personnel', 'Northern Safari circuit staging gate', 'Premium coffee estate developments'],
  },
  'dodoma': {
    regionKey: 'dodoma',
    regionName: 'Dodoma (Mtumba Government City / Capital)',
    benchmarkAppreciation: 12.2,
    longTermGrossYield: 10.5,
    shortTermGrossYield: 12.0,
    marketDynamics: 'National capital relocation driving historic capital expansion, severe supply deficits in executive housing, and infrastructure spending.',
    primeDrivers: ['All Federal Ministries relocation', 'Rapid civic infrastructure development', 'Long-term government institutional leases'],
  },
  'kilimanjaro': {
    regionKey: 'kilimanjaro',
    regionName: 'Kilimanjaro (Moshi Urban / Shanty Town)',
    benchmarkAppreciation: 8.5,
    longTermGrossYield: 8.0,
    shortTermGrossYield: 12.5,
    marketDynamics: 'Mount Kilimanjaro eco-tourism, diaspora returnees, and stable low-volatility residential real estate.',
    primeDrivers: ['Global high-altitude trekking tourism', 'Stable diaspora second homes', 'Cool climate estate preferences'],
  },
  'mwanza': {
    regionKey: 'mwanza',
    regionName: 'Mwanza (Capri Point / Lake Victoria)',
    benchmarkAppreciation: 8.0,
    longTermGrossYield: 7.8,
    shortTermGrossYield: 11.5,
    marketDynamics: 'Great Lakes commercial port and gold mining administrative center with high executive ridge estate demand.',
    primeDrivers: ['Gold mining regional executive housing', 'Lake Victoria maritime commerce', 'Growing financial services base'],
  },
};

const DEFAULT_NATIONAL_TREND: TanzaniaMarketTrend = {
  regionKey: 'national',
  regionName: 'Tanzania National Prime Average',
  benchmarkAppreciation: 8.8,
  longTermGrossYield: 8.5,
  shortTermGrossYield: 13.0,
  marketDynamics: 'Standard emerging market premium real estate with GDP growth outperforming regional peers at ~5.5% annually.',
  primeDrivers: ['Macroeconomic expansion', 'Urbanization rate exceeding 5%', 'Strategic East African infrastructure corridors'],
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

  // Currency Toggle: USD vs TZS (Fixed conversion standard: 1 USD = 2,650 TZS)
  const [currency, setCurrency] = useState<'USD' | 'TZS'>('USD');
  const TZS_RATE = 2650;

  // Investment Strategy: Long-Term Corporate vs Short-Term Hospitality
  const [strategy, setStrategy] = useState<'long_term' | 'short_term'>('long_term');

  // Core Financial Inputs
  const [propertyPrice, setPropertyPrice] = useState<number>(property.price || 450000);
  
  // Custom or default monthly rental projection
  const defaultMonthlyRent = useMemo(() => {
    if (property.metadata?.projected_monthly_rent) {
      return property.metadata.projected_monthly_rent;
    }
    // Estimate from regional long-term yield
    return Math.round((propertyPrice * (localMarketProfile.longTermGrossYield / 100)) / 12);
  }, [property, propertyPrice, localMarketProfile]);

  const [monthlyRentUSD, setMonthlyRentUSD] = useState<number>(defaultMonthlyRent);

  // Short-Term ADR & Occupancy Inputs
  const [dailyRateUSD, setDailyRateUSD] = useState<number>(
    Math.round(propertyPrice * 0.00075) > 120 ? Math.round(propertyPrice * 0.00075) : 320
  );
  const [occupancyRate, setOccupancyRate] = useState<number>(68); // 68% annual occupancy

  // Capital Appreciation Rate Input (Pre-filled from local Tanzanian trend)
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
  // Management Fee
  const annualManagementFee = (grossAnnualIncome * propertyManagementPercent) / 100;
  
  // Maintenance / Reserve Fund
  const annualMaintenance = (grossAnnualIncome * maintenancePercent) / 100;

  // TRA Rental Income Withholding Tax (10% resident, 15% non-resident)
  const traRate = isResident ? 0.10 : 0.15;
  const annualTraTax = applyTraWithholding ? grossAnnualIncome * traRate : 0;

  // Local Tanzanian Land Rent & Property Tax (Kodi ya Ardhi & Majengo)
  const annualPropertyTax = Math.min(Math.round(propertyPrice * 0.0015), 1200);

  // Total Annual Operational Expenses
  const totalAnnualOperatingExpenses =
    annualManagementFee + annualMaintenance + annualTraTax + annualPropertyTax;

  // Net Operating Income (NOI)
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

  // Annual Net Cashflow to Investor
  const annualNetCashflow = annualNOI - annualDebtService;

  // Key Ratios
  const grossRentalYield = (grossAnnualIncome / propertyPrice) * 100;
  const netRentalYield = (annualNOI / propertyPrice) * 100;
  const capRate = netRentalYield;
  const cashOnCashROI = initialEquity > 0 ? (annualNetCashflow / initialEquity) * 100 : 0;

  // 4. Multi-Year Horizon Projections (Compounded Capital Appreciation + Cumulative Cashflow)
  const projectionTable = useMemo(() => {
    const rows = [];
    let currentAssetValue = propertyPrice;
    let cumulativeCashflow = 0;

    for (let yr = 1; yr <= 10; yr++) {
      // Annual compounded appreciation
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

  // Horizon Selected Metrics
  const activeHorizonData = projectionTable[horizonYears - 1] || projectionTable[4];

  // Copy Pro-Forma Memo to clipboard
  const handleCopyMemo = () => {
    const memo = `
FLX TANZANIA PRIME ESTATE INVESTMENT MEMO
==================================================
Property: ${property.title}
Location: ${property.location.ward || 'Masaki'}, ${property.location.district || 'Kinondoni'}, ${property.location.region || 'Dar es Salaam'}, Tanzania
Cadastre Code: ${property.location.ward ? `TZ-${property.location.region?.substring(0,3).toUpperCase()}-${property.location.district?.substring(0,3).toUpperCase()}` : 'TZ-REG-ESTATE'}

ACQUISITION & VALUATION:
- Asset Valuation: $${propertyPrice.toLocaleString()} USD (~${(propertyPrice * TZS_RATE).toLocaleString()} TZS)
- Financing Structure: ${financingType === 'cash' ? '100% All-Cash Equity' : `${downPaymentPercent}% Down Payment ($${initialEquity.toLocaleString()} USD)`}
- Investment Strategy: ${strategy === 'long_term' ? 'Corporate / Diplomatic Long-Term Lease' : 'Luxury Hospitality / Safari-Beach Villa'}

LOCAL TANZANIAN BENCHMARKS (${localMarketProfile.regionName}):
- Benchmark Capital Appreciation: ${appreciationRate}% p.a.
- Local Market Context: ${localMarketProfile.marketDynamics}

PROJECTED YIELDS:
- Gross Annual Rental Income: $${grossAnnualIncome.toLocaleString()} USD
- Gross Rental Yield: ${grossRentalYield.toFixed(2)}%
- Net Operating Income (NOI): $${annualNOI.toLocaleString()} USD
- Net Rental Yield (Cap Rate): ${netRentalYield.toFixed(2)}%
- Cash-on-Cash Return: ${cashOnCashROI.toFixed(2)}%
- TRA Withholding Tax Rate Applied: ${applyTraWithholding ? (isResident ? '10% (Resident)' : '15% (Non-Resident/Foreign)') : 'None'}

${horizonYears}-YEAR COMPREHENSIVE HORIZON FORECAST:
- Projected Asset Value (Year ${horizonYears}): $${activeHorizonData.assetValue.toLocaleString()} USD
- Cumulative Rental Cashflow: $${activeHorizonData.cumulativeCashflow.toLocaleString()} USD
- Total Capital Gain: +$${activeHorizonData.capitalAppreciationDollar.toLocaleString()} USD
- Total Investor Net Return: +$${activeHorizonData.totalGain.toLocaleString()} USD (${activeHorizonData.totalROI}% Total ROI)
==================================================
Generated on ${new Date().toLocaleDateString()} via FLX Prime Cadastre Intelligence
    `.trim();

    navigator.clipboard.writeText(memo);
    setCopiedMemo(true);
    setTimeout(() => setCopiedMemo(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* 1. TOP BANNER: TANZANIAN MARKET CONTEXT & CURRENCY BAR */}
      <div className="p-4 bg-gradient-to-r from-red-950/30 via-[#101216] to-black border border-white/10 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2 py-0.5 bg-red-600/90 text-white font-black text-[10px] uppercase tracking-widest rounded">
              Tanzania Market Trend
            </span>
            <span className="font-headline font-bold text-xs uppercase tracking-wider text-white">
              {localMarketProfile.regionName}
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl leading-relaxed">
            {localMarketProfile.marketDynamics}
          </p>
        </div>

        {/* Currency & Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Currency Toggle */}
          <div className="flex items-center bg-black/80 border border-white/15 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setCurrency('USD')}
              className={`px-3 py-1 rounded-lg text-xs font-bold font-mono transition-all ${
                currency === 'USD'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              $ USD
            </button>
            <button
              type="button"
              onClick={() => setCurrency('TZS')}
              className={`px-3 py-1 rounded-lg text-xs font-bold font-mono transition-all ${
                currency === 'TZS'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              TZS Shillings
            </button>
          </div>

          {/* Export Memo Button */}
          <button
            type="button"
            onClick={handleCopyMemo}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/15 rounded-xl text-xs text-zinc-300 hover:text-white transition-all font-mono"
            title="Copy Investor Executive Summary"
          >
            {copiedMemo ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-zinc-400" />
                <span>Export Memo</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. STRATEGY TOGGLE & KEY DRIVERS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strategy Selector */}
        <div className="p-4 bg-[#0e1014] border border-white/10 rounded-2xl flex flex-col justify-between">
          <div>
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold block mb-1">
              Select Operating Model
            </span>
            <div className="grid grid-cols-2 gap-2 mt-2">
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
                <div className="text-[11px] text-zinc-400 mt-1">12-Mo Advance Rent • Expat & Embassy Tenants</div>
                <div className="text-[10px] text-red-400 font-mono mt-2">Yield Benchmark: ~{localMarketProfile.longTermGrossYield}%</div>
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
                <div className="text-[11px] text-zinc-400 mt-1">High Nightly ADRs • Safari & Beachfront Tourism</div>
                <div className="text-[10px] text-emerald-400 font-mono mt-2">Yield Benchmark: ~{localMarketProfile.shortTermGrossYield}%</div>
              </button>
            </div>
          </div>
        </div>

        {/* Local Growth Catalysts in Tanzania */}
        <div className="p-4 bg-[#0e1014] border border-white/10 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold block">
                Local Macroeconomic Catalysts
              </span>
              <span className="text-[10px] font-mono text-emerald-400">GDP Trend +5.6% p.a.</span>
            </div>
            <ul className="mt-2.5 space-y-1.5">
              {localMarketProfile.primeDrivers.map((driver, idx) => (
                <li key={idx} className="flex items-center gap-2 text-xs text-zinc-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  <span>{driver}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="pt-2.5 mt-2.5 border-t border-white/10 text-[11px] text-zinc-400 font-mono">
            Local Benchmark Appreciation: <strong className="text-white">+{localMarketProfile.benchmarkAppreciation}% annually</strong>
          </div>
        </div>
      </div>

      {/* 3. CORE INPUT CONTROLS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Parameters (7 Cols) */}
        <div className="lg:col-span-7 space-y-5 p-5 bg-[#0e1014] border border-white/10 rounded-2xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h4 className="font-headline font-bold text-xs uppercase tracking-wider text-white flex items-center gap-2">
              <Calculator className="w-4 h-4 text-red-500" />
              <span>Investment Parameters & Financing</span>
            </h4>
            <span className="text-[10px] font-mono text-zinc-500 uppercase">Interactive Pro-Forma</span>
          </div>

          {/* Property Valuation / Acquisition Price */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-zinc-300 font-medium">Acquisition / Property Price</span>
              <strong className="text-white font-mono text-sm">{formatAmount(propertyPrice)}</strong>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={Math.round(property.price * 0.7)}
                max={Math.round(property.price * 1.6)}
                step={5000}
                value={propertyPrice}
                onChange={(e) => setPropertyPrice(Number(e.target.value))}
                className="w-full accent-red-600 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Strategy-Specific Rental Inputs */}
          {strategy === 'long_term' ? (
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="text-zinc-300 font-medium">Expected Monthly Rental (USD)</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-zinc-500 font-mono">Benchmark: ~${defaultMonthlyRent}/mo</span>
                  <strong className="text-emerald-400 font-mono">{formatAmount(monthlyRentUSD)}/mo</strong>
                </div>
              </div>
              <input
                type="range"
                min={Math.round(defaultMonthlyRent * 0.5)}
                max={Math.round(defaultMonthlyRent * 1.8)}
                step={100}
                value={monthlyRentUSD}
                onChange={(e) => setMonthlyRentUSD(Number(e.target.value))}
                className="w-full accent-red-600 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-zinc-500 mt-1">
                <span>Conservative: ${Math.round(defaultMonthlyRent * 0.8)}</span>
                <span>Optimistic: ${Math.round(defaultMonthlyRent * 1.4)}</span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="text-zinc-300 font-medium">Nightly ADR ($)</span>
                  <strong className="text-emerald-400 font-mono">${dailyRateUSD}/night</strong>
                </div>
                <input
                  type="range"
                  min={120}
                  max={1200}
                  step={10}
                  value={dailyRateUSD}
                  onChange={(e) => setDailyRateUSD(Number(e.target.value))}
                  className="w-full accent-red-600 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
                />
              </div>
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="text-zinc-300 font-medium">Annual Occupancy</span>
                  <strong className="text-white font-mono">{occupancyRate}%</strong>
                </div>
                <input
                  type="range"
                  min={40}
                  max={90}
                  step={2}
                  value={occupancyRate}
                  onChange={(e) => setOccupancyRate(Number(e.target.value))}
                  className="w-full accent-red-600 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* Capital Appreciation Rate (Annual %) Slider */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <div className="flex items-center gap-1.5">
                <span className="text-zinc-300 font-medium">Projected Capital Appreciation</span>
                <span className="text-[10px] px-1.5 py-0.2 bg-zinc-800 text-red-400 rounded font-mono">
                  {localMarketProfile.regionKey.toUpperCase()} TREND
                </span>
              </div>
              <strong className="text-white font-mono text-sm">+{appreciationRate}% / year</strong>
            </div>
            <input
              type="range"
              min={4.0}
              max={18.0}
              step={0.2}
              value={appreciationRate}
              onChange={(e) => setAppreciationRate(Number(e.target.value))}
              className="w-full accent-red-600 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-zinc-500 mt-1">
              <span>Low-Volatility (5.0%)</span>
              <span>Regional Baseline ({localMarketProfile.benchmarkAppreciation}%)</span>
              <span>Zanzibar/Dodoma High-Growth (15%+)</span>
            </div>
          </div>

          {/* Financing Structure Toggle */}
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
                  <span className="text-[10px] text-zinc-400 block mb-1">Loan Tenure</span>
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

          {/* Tanzania Tax & Compliance Settings (TRA Withholding) */}
          <div className="pt-2 border-t border-white/10">
            <div className="flex flex-wrap items-center justify-between gap-2">
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
        </div>

        {/* Right Column: Return Metrics & Yield Summary (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Key Metric Hero Cards */}
          <div className="grid grid-cols-2 gap-3">
            {/* Gross Rental Yield */}
            <div className="p-4 bg-gradient-to-br from-[#12141a] to-black border border-white/15 rounded-2xl">
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold block">
                Gross Rental Yield
              </span>
              <div className="text-2xl font-black font-mono text-emerald-400 mt-1">
                {grossRentalYield.toFixed(1)}%
              </div>
              <span className="text-[10px] text-zinc-500 font-mono mt-0.5 block">
                Gross: {formatAmount(grossAnnualIncome)}/yr
              </span>
            </div>

            {/* Net Rental Yield / Cap Rate */}
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

          {/* Cashflow & Financial Statement Card */}
          <div className="p-5 bg-gradient-to-b from-[#14171e] to-[#0c0d10] border border-white/15 rounded-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Annual Pro-Forma Cashflow
              </span>
              <span className="text-[10px] font-mono text-zinc-400">USD & TZS Equivalent</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-zinc-400">Gross Projected Rent:</span>
                <strong className="text-white font-mono">{formatAmount(grossAnnualIncome)}</strong>
              </div>

              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-zinc-400">Property Management ({propertyManagementPercent}%):</span>
                <strong className="text-red-400 font-mono">-{formatAmount(annualManagementFee)}</strong>
              </div>

              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-zinc-400">Maintenance & Reserves ({maintenancePercent}%):</span>
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
                  Cash-on-Cash Yield
                </span>
                <span className="text-xs text-zinc-300 font-mono">
                  Initial Invested Capital: {formatAmount(initialEquity)}
                </span>
              </div>
              <div className="text-lg font-black font-mono text-emerald-400">
                {cashOnCashROI.toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. MULTI-YEAR COMPREHENSIVE HORIZON FORECAST (1Y, 3Y, 5Y, 10Y) */}
      <div className="p-5 bg-[#0e1014] border border-white/10 rounded-2xl space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <h4 className="font-headline font-bold text-xs uppercase tracking-wider text-white">
                Multi-Year Wealth Creation Horizon ({horizonYears} Years)
              </h4>
            </div>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Compounded capital growth (+{appreciationRate}% p.a.) combined with cumulative net rental yields.
            </p>
          </div>

          {/* Horizon Pills */}
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

        {/* Highlight Milestone Card for Chosen Horizon */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-black/60 border border-white/10 rounded-xl">
            <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold block">
              Asset Value at Yr {horizonYears}
            </span>
            <div className="text-xl font-black font-mono text-white mt-1">
              {formatAmount(activeHorizonData.assetValue)}
            </div>
            <span className="text-[10px] text-emerald-400 font-mono mt-0.5 block flex items-center gap-1">
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
              Total Investor Gain
            </span>
            <div className="text-xl font-black font-mono text-white mt-1">
              +{formatAmount(activeHorizonData.totalGain)}
            </div>
            <span className="text-[10px] text-emerald-400 font-mono mt-0.5 block">
              Capital gain + rental income
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
              Total Return on Invested Capital
            </span>
          </div>
        </div>

        {/* Visual Compounded Asset & Yield Chart (SVG Responsive Projection) */}
        <div className="p-4 bg-black/50 border border-white/10 rounded-xl space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-300 font-bold uppercase tracking-wider text-[11px]">
              10-Year Compounded Valuation Trajectory
            </span>
            <div className="flex items-center gap-4 text-[10px] font-mono text-zinc-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-red-600 rounded-sm" />
                Asset Valuation
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-sm" />
                Cumulative Cashflow
              </span>
            </div>
          </div>

          {/* Projection Bar / Curve Representation */}
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
                  <div className="h-32 w-full flex items-end justify-center gap-1 pb-1">
                    {/* Asset value bar */}
                    <div
                      style={{ height: `${assetHeightPercent}%` }}
                      className={`w-3 rounded-t transition-all ${
                        isSelectedHorizon ? 'bg-red-600' : 'bg-red-900 group-hover:bg-red-700'
                      }`}
                      title={`Year ${item.year}: Asset ${formatAmount(item.assetValue)}`}
                    />
                    {/* Cumulative Cashflow bar */}
                    <div
                      style={{ height: `${Math.max(cashflowHeightPercent, 4)}%` }}
                      className={`w-3 rounded-t transition-all ${
                        isSelectedHorizon ? 'bg-emerald-400' : 'bg-emerald-700 group-hover:bg-emerald-500'
                      }`}
                      title={`Year ${item.year}: Cashflow ${formatAmount(item.cumulativeCashflow)}`}
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

        {/* Pro-Forma Disclaimer & Legal Note */}
        <div className="p-3 bg-zinc-950 border border-white/5 rounded-xl text-[11px] text-zinc-500 flex items-start gap-2">
          <Info className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Estimates are benchmarked against historical land registry transactions, TRA tax guidelines, and regional GDP indicators across Tanzania. Actual returns may fluctuate depending on tenant profile, occupancy rates, foreign exchange fluctuations (USD/TZS), and individual property management efficiency.
          </p>
        </div>
      </div>
    </div>
  );
};
