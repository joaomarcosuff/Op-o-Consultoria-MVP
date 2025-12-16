import { FinancialData } from '../types';

export const calculateProjections = (data: FinancialData, years: number = 5) => {
  const months = years * 12;
  let currentRevenue = data.monthlyRevenue;
  let currentCost = data.monthlyCost;
  
  const cashFlow = [];
  let cumulativeCashFlow = -data.initialInvestment;
  let paybackMonth = -1;

  for (let m = 1; m <= months; m++) {
    // Apply growth annually
    if (m > 1 && m % 12 === 1) {
      currentRevenue *= (1 + data.annualGrowthRate / 100);
      currentCost *= (1 + (data.annualGrowthRate * 0.5) / 100); // Assume costs grow slower
    }

    const grossProfit = currentRevenue - currentCost;
    const taxes = grossProfit > 0 ? grossProfit * (data.taxRate / 100) : 0;
    const netIncome = grossProfit - taxes;

    cumulativeCashFlow += netIncome;
    
    if (paybackMonth === -1 && cumulativeCashFlow >= 0) {
      paybackMonth = m;
    }

    cashFlow.push({
      month: m,
      year: Math.ceil(m / 12),
      revenue: currentRevenue,
      costs: currentCost,
      netIncome,
      cumulative: cumulativeCashFlow
    });
  }

  return { cashFlow, paybackMonth };
};

export const calculateNPV = (initialInvestment: number, flows: number[], discountRate: number): number => {
  // discountRate is annual
  const monthlyRate = Math.pow(1 + discountRate / 100, 1 / 12) - 1;
  
  let npv = -initialInvestment;
  flows.forEach((flow, index) => {
    npv += flow / Math.pow(1 + monthlyRate, index + 1);
  });
  
  return npv;
};

// Calculates Internal Rate of Return (Annualized) using Bisection method
export const calculateIRR = (initialInvestment: number, flows: number[]): number => {
    let low = -0.99;
    let high = 5.0; // 500% cap for search
    let guess = 0.1;
    const precision = 0.01; // Currency precision tolerance

    // Try to find the rate where NPV is close to 0
    for (let i = 0; i < 100; i++) {
        // We pass 'guess * 100' because calculateNPV expects a percentage (e.g. 12 for 12%)
        const npv = calculateNPV(initialInvestment, flows, guess * 100);
        
        if (Math.abs(npv) < precision) return guess * 100;
        
        // If NPV is positive, the rate is too low (we need to discount more to get to 0)
        if (npv > 0) {
            low = guess;
        } else {
            high = guess;
        }
        guess = (low + high) / 2;
    }
    return guess * 100;
};

export const calculateDepreciation = (totalFixedAssets: number, years: number = 5): number => {
    return totalFixedAssets / years;
};

// Simplified Valuation based on DCF of 5 years + Terminal Value
export const calculateValuation = (npv: number, lastYearFlow: number, discountRate: number, growthRate: number): number => {
    // Terminal Value = (Final Cash Flow * (1 + g)) / (r - g)
    // Careful: g must be < r for this formula. We'll cap g for terminal value.
    const safeGrowth = Math.min(growthRate, discountRate - 2); 
    const terminalValue = (lastYearFlow * 12 * (1 + safeGrowth/100)) / ((discountRate - safeGrowth)/100);
    
    // Discount Terminal Value to present
    const presentTerminalValue = terminalValue / Math.pow(1 + discountRate/100, 5);
    
    return npv + presentTerminalValue;
};