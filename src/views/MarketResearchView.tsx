import React from 'react';
import { Card, Input } from '../components/Shared';
import { MarketResearchData } from '../types';

interface MarketResearchViewProps {
    data: MarketResearchData;
    onUpdate: (data: MarketResearchData) => void;
}

export const MarketResearchView = ({ data, onUpdate }: MarketResearchViewProps) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h2 className="text-2xl font-bold text-[#0b0b45]">Pesquisa de Mercado</h2>
      
      <Card>
        <h3 className="font-semibold mb-4 text-[#0b0b45]">Coleta de Dados</h3>
        <Input 
            label="Link do Formulário de Pesquisa (Google Forms / Typeform)" 
            placeholder="https://..."
            value={data.surveyLink} 
            onChange={(e: any) => onUpdate({...data, surveyLink: e.target.value})} 
        />
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
            <h3 className="font-semibold mb-4 text-[#0b0b45]">Definição de Público-Alvo</h3>
            <Input 
                multiline 
                label="Descrição Demográfica e Comportamental" 
                placeholder="Idade, localização, interesses..."
                value={data.targetAudience} 
                onChange={(e: any) => onUpdate({...data, targetAudience: e.target.value})} 
            />
        </Card>
        <Card>
            <h3 className="font-semibold mb-4 text-[#0b0b45]">Persona Ideal</h3>
            <Input 
                multiline 
                label="Narrativa da Persona" 
                placeholder="João, 35 anos, gerente, busca..."
                value={data.persona} 
                onChange={(e: any) => onUpdate({...data, persona: e.target.value})} 
            />
        </Card>
      </div>

      <Card>
        <h3 className="font-semibold mb-4 text-[#0b0b45]">Análise de Resultados</h3>
        <Input 
            multiline 
            label="Principais Conclusões da Pesquisa" 
            placeholder="80% dos entrevistados preferem..."
            value={data.dataAnalysis} 
            onChange={(e: any) => onUpdate({...data, dataAnalysis: e.target.value})} 
        />
      </Card>
    </div>
  );
};