import React from 'react';
import { Card } from '../components/Shared';
import { OperationalData } from '../types/index';
import { Store, Gauge, Settings, Truck } from 'lucide-react';

interface OperationalViewProps {
    data: OperationalData;
    setData: (d: OperationalData) => void;
}

export const OperationalView = ({ data, setData }: OperationalViewProps) => {
  const handleChange = (field: keyof OperationalData, value: string) => {
    setData({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h2 className="text-2xl font-bold text-[#0b0b45]">Plano Operacional</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center gap-2 mb-4 text-[#0b0b45]">
             <Store size={20} />
             <h3 className="font-bold">Arranjo Físico e Localização</h3>
          </div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Layout e Infraestrutura
          </label>
          <textarea 
            className="w-full p-4 border border-gray-200 rounded-lg h-40 focus:ring-2 focus:ring-[#ff9933] outline-none resize-none bg-gray-50 text-gray-700" 
            placeholder="Descreva a localização, o layout do escritório/loja/fábrica e a infraestrutura necessária..."
            value={data.layout || ''}
            onChange={(e) => handleChange('layout', e.target.value)}
          ></textarea>
        </Card>

        <Card>
          <div className="flex items-center gap-2 mb-4 text-[#0b0b45]">
             <Gauge size={20} />
             <h3 className="font-bold">Capacidade Operacional</h3>
          </div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
             Capacidade Produtiva/Serviço
          </label>
          <textarea 
            className="w-full p-4 border border-gray-200 rounded-lg h-40 focus:ring-2 focus:ring-[#ff9933] outline-none resize-none bg-gray-50 text-gray-700" 
            placeholder="Quantos clientes/produtos podem ser atendidos por dia/mês? Quais são os gargalos?"
            value={data.capacity || ''}
            onChange={(e) => handleChange('capacity', e.target.value)}
          ></textarea>
        </Card>

        <Card>
          <div className="flex items-center gap-2 mb-4 text-[#0b0b45]">
             <Settings size={20} />
             <h3 className="font-bold">Processos Chave</h3>
          </div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
             Fluxo Operacional
          </label>
          <textarea 
            className="w-full p-4 border border-gray-200 rounded-lg h-40 focus:ring-2 focus:ring-[#ff9933] outline-none resize-none bg-gray-50 text-gray-700" 
            placeholder="Descreva as etapas principais da operação, desde a entrada do pedido até a entrega..."
            value={data.processes || ''}
            onChange={(e) => handleChange('processes', e.target.value)}
          ></textarea>
        </Card>

        <Card>
          <div className="flex items-center gap-2 mb-4 text-[#0b0b45]">
             <Truck size={20} />
             <h3 className="font-bold">Logística e Distribuição</h3>
          </div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
             Logística
          </label>
          <textarea 
            className="w-full p-4 border border-gray-200 rounded-lg h-40 focus:ring-2 focus:ring-[#ff9933] outline-none resize-none bg-gray-50 text-gray-700" 
            placeholder="Como será o controle de estoque, distribuição e entrega ao cliente?"
            value={data.logistics || ''}
            onChange={(e) => handleChange('logistics', e.target.value)}
          ></textarea>
        </Card>
      </div>
    </div>
  );
};