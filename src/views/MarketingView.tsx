import React, { useState } from 'react';
import { Card, Button, Input } from '../components/Shared';
import { GoogleGenAI } from "@google/genai";
import { Sparkles, Plus, Trash, CheckCircle } from 'lucide-react';
import { MarketingData } from '../types';

interface MarketingViewProps {
    data: MarketingData;
    onUpdate: (data: MarketingData) => void;
}

export const MarketingView = ({ data, onUpdate }: MarketingViewProps) => {
  const [loading, setLoading] = useState(false);
  const [aiOutput, setAiOutput] = useState('');

  const generateStrategy = async () => {
    if (!process.env.API_KEY) {
        setAiOutput("Erro: API_KEY não configurada no ambiente.");
        return;
    }
    setLoading(true);
    try {
      // Initialize GoogleGenAI with the API key from environment
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Atue como um Consultor de Marketing Sênior. Para o seguinte negócio: "${data.description}", crie uma Análise SWOT detalhada e sugira 3 canais de marketing prioritários. Formate a saída em Markdown.`;
      
      // Fix: Always use 'gemini-3-flash-preview' for basic text tasks and access .text property directly
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      
      setAiOutput(response.text || 'Sem resposta.');
    } catch (error) {
      setAiOutput('Erro ao gerar estratégia. Tente novamente.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const addActionItem = () => {
      const newItem = { id: Date.now().toString(), what: '', why: '', who: '', when: '', where: '', how: '', howMuch: 0, status: 'pending' as const };
      onUpdate({ ...data, actionPlan: [...data.actionPlan, newItem] });
  };

  const toggleStatus = (id: string, currentStatus: string) => {
      const nextStatus = currentStatus === 'pending' ? 'in_progress' : currentStatus === 'in_progress' ? 'done' : 'pending';
      const newPlan = data.actionPlan.map(item => item.id === id ? { ...item, status: nextStatus as any } : item);
      onUpdate({ ...data, actionPlan: newPlan });
  };

  const getStatusColor = (status: string) => {
      if (status === 'done') return 'text-green-500';
      if (status === 'in_progress') return 'text-yellow-500';
      return 'text-gray-300';
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#0b0b45]">Planejamento de Marketing e Vendas</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
            <Card>
                <h3 className="font-semibold mb-2 text-[#0b0b45]">Definição do Negócio</h3>
                <p className="text-sm text-gray-500 mb-4">Descreva o produto/serviço para a IA gerar insights.</p>
                <textarea 
                    className="w-full h-32 border border-gray-300 rounded p-2 focus:ring-2 focus:ring-[#ff9933] focus:outline-none"
                    placeholder="Ex: Consultoria de RH focada em startups de tecnologia..."
                    value={data.description}
                    onChange={(e) => onUpdate({ ...data, description: e.target.value })}
                ></textarea>
                <Button 
                    onClick={generateStrategy} 
                    disabled={loading || !data.description}
                    className="mt-4 w-full"
                >
                    {loading ? 'Gerando...' : <><Sparkles size={16} /> Gerar Análise com IA</>}
                </Button>
            </Card>
            
            <Card>
                <h3 className="font-semibold mb-4 text-[#0b0b45]">Mix de Marketing (4Ps)</h3>
                <div className="space-y-3">
                    <Input label="Produto" value={data.mix.product} onChange={(e:any) => onUpdate({...data, mix: {...data.mix, product: e.target.value}})} />
                    <Input label="Preço" value={data.mix.price} onChange={(e:any) => onUpdate({...data, mix: {...data.mix, price: e.target.value}})} />
                    <Input label="Praça" value={data.mix.place} onChange={(e:any) => onUpdate({...data, mix: {...data.mix, place: e.target.value}})} />
                    <Input label="Promoção" value={data.mix.promotion} onChange={(e:any) => onUpdate({...data, mix: {...data.mix, promotion: e.target.value}})} />
                </div>
            </Card>
        </div>

        <Card className="h-full min-h-[500px] overflow-auto bg-gray-50">
            <h3 className="font-semibold mb-4 sticky top-0 bg-gray-50 pb-2 border-b text-[#0b0b45]">Assistente Estratégico (Gemini)</h3>
            {aiOutput ? (
                <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-line">
                    {aiOutput}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                    <Sparkles size={48} className="mb-2 opacity-50" />
                    <p>Aguardando input para gerar análise...</p>
                </div>
            )}
        </Card>
      </div>

      <Card>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-[#0b0b45]">Plano de Ação 5W2H</h3>
            <Button onClick={addActionItem} variant="secondary" className="text-sm"><Plus size={14}/> Adicionar</Button>
          </div>
          <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                  <thead className="bg-[#0b0b45] text-white">
                      <tr>
                          <th className="p-2 w-8"></th>
                          <th className="p-2 rounded-tl">O Que</th>
                          <th className="p-2">Por Que</th>
                          <th className="p-2">Quem</th>
                          <th className="p-2">Quando</th>
                          <th className="p-2">Custo (R$)</th>
                          <th className="p-2 rounded-tr"></th>
                      </tr>
                  </thead>
                  <tbody>
                      {data.actionPlan.map((item, idx) => (
                          <tr key={item.id} className="border-b hover:bg-gray-50">
                              <td className="p-2 text-center cursor-pointer" onClick={() => toggleStatus(item.id, item.status)}>
                                  <CheckCircle size={18} className={getStatusColor(item.status)} />
                              </td>
                              <td className="p-2"><input className="w-full bg-transparent" placeholder="Ação..." value={item.what} onChange={(e) => {
                                  const newPlan = [...data.actionPlan]; newPlan[idx].what = e.target.value; onUpdate({...data, actionPlan: newPlan});
                              }}/></td>
                              <td className="p-2"><input className="w-full bg-transparent" placeholder="Motivo..." value={item.why} onChange={(e) => {
                                  const newPlan = [...data.actionPlan]; newPlan[idx].why = e.target.value; onUpdate({...data, actionPlan: newPlan});
                              }}/></td>
                              <td className="p-2"><input className="w-full bg-transparent" placeholder="Responsável..." value={item.who} onChange={(e) => {
                                  const newPlan = [...data.actionPlan]; newPlan[idx].who = e.target.value; onUpdate({...data, actionPlan: newPlan});
                              }}/></td>
                              <td className="p-2"><input className="w-full bg-transparent" type="date" value={item.when} onChange={(e) => {
                                  const newPlan = [...data.actionPlan]; newPlan[idx].when = e.target.value; onUpdate({...data, actionPlan: newPlan});
                              }}/></td>
                              <td className="p-2"><input className="w-full bg-transparent" type="number" value={item.howMuch} onChange={(e) => {
                                  const newPlan = [...data.actionPlan]; newPlan[idx].howMuch = parseFloat(e.target.value); onUpdate({...data, actionPlan: newPlan});
                              }}/></td>
                              <td className="p-2 text-center text-red-500 cursor-pointer" onClick={() => {
                                  onUpdate({...data, actionPlan: data.actionPlan.filter(i => i.id !== item.id)});
                              }}><Trash size={14} /></td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      </Card>
    </div>
  );
};
