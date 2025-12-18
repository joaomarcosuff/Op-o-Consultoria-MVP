import { FinancialData } from './types';

export const calculateProjections = (data: FinancialData, years: number = 5) => {
  const months = years * 12;
  let currentRevenue = data.monthlyRevenue;
  let currentCost = data.monthlyCost;
  
  const cashFlow = [];
  let cumulativeCashFlow = -data.initialInvestment;
  let paybackMonth = -1;

  for (let m = 1; m <= months; m++) {
    if (m > 1 && m % 12 === 1) {
      currentRevenue *= (1 + data.annualGrowthRate / 100);
      currentCost *= (1 + (data.annualGrowthRate * 0.5) / 100);
    }
    const grossProfit = currentRevenue - currentCost;
    const taxes = grossProfit > 0 ? grossProfit * (data.taxRate / 100) : 0;
    const netIncome = grossProfit - taxes;
    cumulativeCashFlow += netIncome;
    if (paybackMonth === -1 && cumulativeCashFlow >= 0) paybackMonth = m;
    cashFlow.push({ month: m, year: Math.ceil(m / 12), revenue: currentRevenue, costs: currentCost, netIncome, cumulative: cumulativeCashFlow });
  }
  return { cashFlow, paybackMonth };
};

export const calculateNPV = (initialInvestment: number, flows: number[], discountRate: number): number => {
  const monthlyRate = Math.pow(1 + discountRate / 100, 1 / 12) - 1;
  let npv = -initialInvestment;
  flows.forEach((flow, index) => { npv += flow / Math.pow(1 + monthlyRate, index + 1); });
  return npv;
};

export const calculateIRR = (initialInvestment: number, flows: number[]): number => {
    let low = -0.99, high = 5.0, guess = 0.1;
    for (let i = 0; i < 100; i++) {
        const npv = calculateNPV(initialInvestment, flows, guess * 100);
        if (Math.abs(npv) < 0.01) return guess * 100;
        if (npv > 0) low = guess; else high = guess;
        guess = (low + high) / 2;
    }
    return guess * 100;
};

export const calculateValuation = (npv: number, lastYearFlow: number, discountRate: number, growthRate: number): number => {
    const safeGrowth = Math.min(growthRate, discountRate - 2); 
    const terminalValue = (lastYearFlow * 12 * (1 + safeGrowth/100)) / ((discountRate - safeGrowth)/100);
    return npv + (terminalValue / Math.pow(1 + discountRate/100, 5));
};