import React, { useState } from 'react';
import { Card, Button, Modal, Input } from './Shared';
import { KANBAN_COLUMNS } from './projectTemplates';
import { Plus, MoreHorizontal, Phone, Calendar, Mail, Percent, MessageSquare, Save } from 'lucide-react';
import { Lead } from './types';

interface CommercialViewProps {
    leads: Lead[];
    onAddLead: (lead: Lead) => void;
    onUpdateLead: (lead: Lead) => void;
}

export const CommercialView = ({ leads, onAddLead, onUpdateLead }: CommercialViewProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [newLeadData, setNewLeadData] = useState<Partial<Lead>>({ name: '', company: '', value: 0, email: '', phone: '', probability: 10 });
  
  const [interactionNote, setInteractionNote] = useState('');
  const [interactionDate, setInteractionDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSaveNewLead = () => {
    if (newLeadData.name && newLeadData.company) {
        onAddLead({
            id: Date.now().toString(),
            name: newLeadData.name,
            company: newLeadData.company,
            value: Number(newLeadData.value),
            email: newLeadData.email,
            phone: newLeadData.phone,
            probability: Number(newLeadData.probability),
            status: 'prospect',
            lastContact: new Date().toISOString().split('T')[0],
            history: []
        } as Lead);
        setIsModalOpen(false);
        setNewLeadData({ name: '', company: '', value: 0, email: '', phone: '', probability: 10 });
    }
  };

  const moveLead = (leadId: string, newStatus: Lead['status']) => {
    const lead = leads.find(l => l.id === leadId);
    if(lead) onUpdateLead({ ...lead, status: newStatus });
  };

  const handleAddInteraction = () => {
      if (!selectedLead || !interactionNote) return;

      const newHistoryItem = {
          date: interactionDate,
          note: interactionNote
      };

      const updatedLead = {
          ...selectedLead,
          lastContact: interactionDate,
          history: [newHistoryItem, ...selectedLead.history]
      };

      onUpdateLead(updatedLead);
      setSelectedLead(updatedLead);
      setInteractionNote('');
  };

  return (
    <div className="h-full flex gap-4">
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#0b0b45]">Pipeline Comercial</h2>
            <Button onClick={() => setIsModalOpen(true)}><Plus size={16} /> Novo Lead</Button>
        </div>

        <div className="flex gap-4 overflow-x-auto h-full pb-4">
            {KANBAN_COLUMNS.map(col => (
            <div key={col.id} className="min-w-[280px] bg-white rounded-lg p-3 flex flex-col border border-[#d9d9d9] shadow-sm">
                <h3 className="font-semibold text-[#0b0b45] mb-3 flex justify-between">
                {col.title}
                <span className="bg-[#d9d9d9] text-xs px-2 py-1 rounded-full text-[#0b0b45] font-bold">
                    {leads.filter(l => l.status === col.id).length}
                </span>
                </h3>
                <div className="space-y-3 flex-1 overflow-y-auto">
                {leads.filter(l => l.status === col.id).map(lead => (
                    <Card key={lead.id} className="p-4 cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-[#ff9933] group relative">
                    <div className="flex justify-between items-start mb-2" onClick={() => setSelectedLead(lead)}>
                        <h4 className="font-bold text-gray-800">{lead.company}</h4>
                        <MoreHorizontal size={16} className="text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{lead.name}</p>
                    <div className="flex justify-between items-center mt-3">
                        <span className="text-sm font-semibold text-[#0b0b45]">
                        R$ {lead.value.toLocaleString('pt-BR')}
                        </span>
                        {lead.probability && (
                             <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded flex items-center gap-1">
                                <Percent size={10} /> {lead.probability}%
                             </span>
                        )}
                    </div>
                    <div className="mt-3 flex gap-2">
                         {col.id !== 'closed_won' && (
                             <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const idx = KANBAN_COLUMNS.findIndex(c => c.id === col.id);
                                    if (idx < KANBAN_COLUMNS.length - 1) {
                                        moveLead(lead.id, KANBAN_COLUMNS[idx + 1].id as any);
                                    }
                                }}
                                className="text-xs bg-[#0b0b45]/10 text-[#0b0b45] px-2 py-1 rounded hover:bg-[#0b0b45] hover:text-white w-full transition-colors"
                             >
                                Avançar
                             </button>
                         )}
                    </div>
                    </Card>
                ))}
                </div>
            </div>
            ))}
        </div>
      </div>

      {selectedLead && (
        <div className="w-96 bg-white border-l border-[#d9d9d9] p-6 shadow-xl flex flex-col h-full animate-in slide-in-from-right duration-300 fixed right-0 top-0 z-40 md:relative md:top-auto md:right-auto md:h-auto overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-[#0b0b45]">Detalhes</h3>
                <button onClick={() => setSelectedLead(null)} className="text-gray-400 hover:text-gray-600"><Plus className="rotate-45" /></button>
            </div>
            <div className="space-y-4 mb-6">
                <div>
                    <label className="text-xs text-gray-500 uppercase">Empresa</label>
                    <p className="font-semibold text-lg">{selectedLead.company}</p>
                </div>
                <div>
                    <label className="text-xs text-gray-500 uppercase">Contato</label>
                    <p className="font-medium">{selectedLead.name}</p>
                    {selectedLead.email && <p className="text-sm text-gray-600 flex items-center gap-2 mt-1"><Mail size={12}/> {selectedLead.email}</p>}
                    {selectedLead.phone && <p className="text-sm text-gray-600 flex items-center gap-2 mt-1"><Phone size={12}/> {selectedLead.phone}</p>}
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="text-xs text-gray-500 uppercase">Valor</label>
                        <p className="font-bold text-[#ff9933] text-lg">R$ {selectedLead.value.toLocaleString('pt-BR', { notation: 'compact' })}</p>
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 uppercase">Probabilidade</label>
                        <p className="font-bold text-[#0b0b45] text-lg">{selectedLead.probability}%</p>
                    </div>
                </div>
                <div>
                    <label className="text-xs text-gray-500 uppercase">Última Interação</label>
                    <p className="flex items-center gap-2"><Calendar size={14} /> {selectedLead.lastContact}</p>
                </div>
            </div>
            <div className="border-t pt-4 mb-4">
                <h4 className="font-semibold mb-3 flex items-center gap-2"><MessageSquare size={16}/> Nova Interação</h4>
                <div className="space-y-3 bg-gray-50 p-3 rounded border border-gray-200">
                    <Input type="date" label="Data" value={interactionDate} onChange={(e: any) => setInteractionDate(e.target.value)} />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Observação / Resumo</label>
                        <textarea className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff9933]" rows={3} value={interactionNote} onChange={(e) => setInteractionNote(e.target.value)} placeholder="Ex: Reunião de alinhamento..."></textarea>
                    </div>
                    <Button onClick={handleAddInteraction} className="w-full text-sm" disabled={!interactionNote}><Save size={14} /> Registrar Histórico</Button>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto">
                <h4 className="font-semibold mb-3">Histórico de Atividades</h4>
                {selectedLead.history.length === 0 ? (
                    <p className="text-sm text-gray-400 italic">Nenhuma interação registrada.</p>
                ) : (
                    <ul className="space-y-3 relative border-l border-gray-200 ml-2 pl-4">
                        {selectedLead.history.map((h, i) => (
                            <li key={i} className="relative">
                                <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#ff9933]"></span>
                                <div className="text-sm bg-gray-50 p-3 rounded border border-gray-100">
                                    <span className="text-xs font-bold text-[#0b0b45] block mb-1">{new Date(h.date).toLocaleDateString('pt-BR')}</span>
                                    <p className="text-gray-700 whitespace-pre-wrap">{h.note}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Novo Lead">
        <Input label="Nome da Empresa" value={newLeadData.company} onChange={(e: any) => setNewLeadData({...newLeadData, company: e.target.value})} />
        <Input label="Contato Principal" value={newLeadData.name} onChange={(e: any) => setNewLeadData({...newLeadData, name: e.target.value})} />
        <div className="grid grid-cols-2 gap-4">
             <Input label="Email" value={newLeadData.email} onChange={(e: any) => setNewLeadData({...newLeadData, email: e.target.value})} />
             <Input label="Telefone" value={newLeadData.phone} onChange={(e: any) => setNewLeadData({...newLeadData, phone: e.target.value})} />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <Input label="Valor Estimado (R$)" type="number" value={newLeadData.value} onChange={(e: any) => setNewLeadData({...newLeadData, value: e.target.value})} />
            <Input label="Probabilidade (%)" type="number" value={newLeadData.probability} onChange={(e: any) => setNewLeadData({...newLeadData, probability: e.target.value})} />
        </div>
        <div className="mt-6 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveNewLead}>Salvar Lead</Button>
        </div>
      </Modal>
    </div>
  );
};