import React, { useMemo, useEffect } from 'react';
import { Card, Input } from '../components/Shared';
import { calculateProjections, calculateNPV, calculateValuation, calculateIRR } from '../utils/financialMath';
import { FinancialData, InvestmentBreakdown } from '../types';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Users, RefreshCw } from 'lucide-react';

interface FinancialViewProps {
    data: FinancialData;
    onUpdate: (data: FinancialData) => void;
    payrollCost?: number; // Propriedade nova vinda do OrganizationView
}

export const FinancialView = ({ data, onUpdate, payrollCost = 0 }: FinancialViewProps) => {
  // Sync total investment with breakdown
  useEffect(() => {
    if (data.investmentBreakdown) {
      const total = Object.values(data.investmentBreakdown).reduce((acc, val) => acc + val, 0);
      if (total !== data.initialInvestment) {
        onUpdate({ ...data, initialInvestment: total });
      }
    }
  }, [data.investmentBreakdown]);

  // Integração Automática RH -> Financeiro
  useEffect(() => {
      // Se o custo de folha for maior que o custo mensal atual, atualiza automaticamente
      // Assumindo que o custo mensal deve conter pelo menos a folha de pagamento
      if (payrollCost > 0 && data.monthlyCost < payrollCost) {
          onUpdate({ ...data, monthlyCost: payrollCost });
      }
  }, [payrollCost]);

  const { cashFlow, paybackMonth } = useMemo(() => calculateProjections(data), [data]);
  const flows = useMemo(() => cashFlow.map(c => c.netIncome), [cashFlow]);

  const npv = useMemo(() => calculateNPV(data.initialInvestment, flows, data.discountRate), [flows, data]);
  const irr = useMemo(() => calculateIRR(data.initialInvestment, flows), [flows, data.initialInvestment]);
  const valuation = useMemo(() => {
    const lastFlow = cashFlow[cashFlow.length - 1].netIncome;
    return calculateValuation(npv, lastFlow, data.discountRate, data.annualGrowthRate);
  }, [npv, cashFlow, data]);

  const handleChange = (field: keyof FinancialData, value: string) => {
    onUpdate({ ...data, [field]: parseFloat(value) || 0 });
  };

  const handleBreakdownChange = (field: keyof InvestmentBreakdown, value: string) => {
    const newVal = parseFloat(value) || 0;
    const newBreakdown = { ...data.investmentBreakdown, [field]: newVal };
    onUpdate({ ...data, investmentBreakdown: newBreakdown });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h2 className="text-2xl font-bold text-[#0b0b45]">Modelagem Financeira</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <h3 className="font-semibold mb-4 border-b pb-2 text-[#0b0b45]">Detalhamento do Investimento</h3>
            <div className="space-y-2 text-sm">
                <Input label="Reformas (R$)" type="number" value={data.investmentBreakdown?.reform || 0} onChange={(e: any) => handleBreakdownChange('reform', e.target.value)} />
                <Input label="Mobiliário (R$)" type="number" value={data.investmentBreakdown?.furniture || 0} onChange={(e: any) => handleBreakdownChange('furniture', e.target.value)} />
                <Input label="Equipamentos (R$)" type="number" value={data.investmentBreakdown?.equipment || 0} onChange={(e: any) => handleBreakdownChange('equipment', e.target.value)} />
                <Input label="Marketing Inicial (R$)" type="number" value={data.investmentBreakdown?.marketing || 0} onChange={(e: any) => handleBreakdownChange('marketing', e.target.value)} />
                <Input label="Jurídico/Legal (R$)" type="number" value={data.investmentBreakdown?.legal || 0} onChange={(e: any) => handleBreakdownChange('legal', e.target.value)} />
                <Input label="Capital de Giro (R$)" type="number" value={data.investmentBreakdown?.workingCapital || 0} onChange={(e: any) => handleBreakdownChange('workingCapital', e.target.value)} />
                <div className="pt-2 border-t font-bold flex justify-between text-[#0b0b45]">
                    <span>Total Investimento:</span>
                    <span>R$ {data.initialInvestment.toLocaleString('pt-BR')}</span>
                </div>
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold mb-4 border-b pb-2 text-[#0b0b45]">Premissas Operacionais</h3>
            
            {/* Integração Visual com RH */}
            {payrollCost > 0 && (
                <div className="mb-4 bg-blue-50 border border-blue-200 rounded p-3 text-sm">
                    <div className="flex items-center gap-2 text-blue-800 font-bold mb-1">
                        <Users size={16} /> Integração RH
                    </div>
                    <p className="text-gray-700">Custo de Pessoal Integrado:</p>
                    <p className="font-mono text-blue-900 font-bold">R$ {payrollCost.toLocaleString('pt-BR')}</p>
                    <p className="text-xs text-blue-600 mt-1">*Atualizado automaticamente do módulo organizacional.</p>
                </div>
            )}

            <Input label="Receita Mensal Inicial (R$)" type="number" value={data.monthlyRevenue} onChange={(e: any) => handleChange('monthlyRevenue', e.target.value)} />
            <Input label="Custo Operacional Mensal (R$)" type="number" value={data.monthlyCost} onChange={(e: any) => handleChange('monthlyCost', e.target.value)} />
            <Input label="Crescimento Anual (%)" type="number" value={data.annualGrowthRate} onChange={(e: any) => handleChange('annualGrowthRate', e.target.value)} />
            <Input label="Alíquota Impostos (%)" type="number" value={data.taxRate} onChange={(e: any) => handleChange('taxRate', e.target.value)} />
            <Input label="TMA (Desconto %)" type="number" value={data.discountRate} onChange={(e: any) => handleChange('discountRate', e.target.value)} />
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="text-center bg-gray-50 border-[#0b0b45]/20 border p-3">
                    <p className="text-xs text-gray-500 mb-1">VPL</p>
                    <p className={`text-lg font-bold ${npv >= 0 ? 'text-[#0b0b45]' : 'text-red-600'}`}>
                        R$ {npv.toLocaleString('pt-BR', { notation: 'compact' })}
                    </p>
                </Card>
                <Card className="text-center bg-gray-50 border-[#ff9933]/20 border p-3">
                    <p className="text-xs text-gray-500 mb-1">Payback</p>
                    <p className="text-lg font-bold text-[#ff9933]">
                        {paybackMonth > 0 ? `${paybackMonth} Meses` : '> 60 Meses'}
                    </p>
                </Card>
                <Card className="text-center bg-gray-50 border-[#0b0b45]/20 border p-3">
                    <p className="text-xs text-gray-500 mb-1">TIR (Anual)</p>
                    <p className={`text-lg font-bold ${irr > data.discountRate ? 'text-green-600' : 'text-red-500'}`}>
                        {irr.toFixed(2)}%
                    </p>
                </Card>
                <Card className="text-center bg-gray-50 border-[#0b0b45]/20 border p-3">
                    <p className="text-xs text-gray-500 mb-1">Valuation</p>
                    <p className="text-lg font-bold text-[#0b0b45]">
                        R$ {valuation.toLocaleString('pt-BR', { notation: 'compact' })}
                    </p>
                </Card>
            </div>

            <Card className="h-96">
                <h3 className="font-semibold mb-4 text-[#0b0b45]">Fluxo de Caixa Projetado (5 Anos)</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={cashFlow.filter((_, i) => i % 6 === 0)}>
                        <defs>
                            <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0b0b45" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#0b0b45" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="month" label={{ value: 'Mês', position: 'insideBottom', offset: -5 }} />
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip formatter={(value: number) => `R$ ${value.toFixed(0)}`} />
                        <Area type="monotone" dataKey="netIncome" stroke="#0b0b45" fillOpacity={1} fill="url(#colorNet)" name="Lucro Líquido" />
                        <Area type="monotone" dataKey="revenue" stroke="#ff9933" fill="none" strokeWidth={2} name="Receita Bruta" />
                    </AreaChart>
                </ResponsiveContainer>
            </Card>
        </div>
      </div>
    </div>
  );
};