import React, { useState } from 'react';
import { Card, Button, Input, Modal } from '../components/Shared';
import { Competitor, Supplier } from '../types';
import { Trash, Plus, Star, ExternalLink } from 'lucide-react';

interface SupplyAnalysisViewProps {
    competitors: Competitor[];
    suppliers: Supplier[];
    onUpdateCompetitors: (c: Competitor[]) => void;
    onUpdateSuppliers: (s: Supplier[]) => void;
}

export const SupplyAnalysisView = ({ competitors, suppliers, onUpdateCompetitors, onUpdateSuppliers }: SupplyAnalysisViewProps) => {
  const [isCompModalOpen, setCompModalOpen] = useState(false);
  const [isSuppModalOpen, setSuppModalOpen] = useState(false);
  
  // Temp state for new items
  const [newCompetitor, setNewCompetitor] = useState<Partial<Competitor>>({ name: '', type: 'direct', priceLevel: 'medium', strength: '', channels: '', website: '' });
  const [newSupplier, setNewSupplier] = useState<Partial<Supplier>>({ name: '', contact: '', ratingPrice: 3, ratingQuality: 3, ratingDeadline: 3 });

  const addCompetitor = () => {
    onUpdateCompetitors([...competitors, { ...newCompetitor, id: Date.now().toString() } as Competitor]);
    setCompModalOpen(false);
    setNewCompetitor({ name: '', type: 'direct', priceLevel: 'medium', strength: '', channels: '', website: '' });
  };

  const addSupplier = () => {
    onUpdateSuppliers([...suppliers, { ...newSupplier, id: Date.now().toString() } as Supplier]);
    setSuppModalOpen(false);
    setNewSupplier({ name: '', contact: '', ratingPrice: 3, ratingQuality: 3, ratingDeadline: 3 });
  };

  const RatingStars = ({ count }: { count: number }) => (
    <div className="flex text-[#ff9933]">
        {[...Array(5)].map((_, i) => (
            <Star key={i} size={14} fill={i < count ? "currentColor" : "none"} stroke="currentColor" />
        ))}
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Competitors Section */}
      <section>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-[#0b0b45]">Análise de Concorrência</h2>
            <Button onClick={() => setCompModalOpen(true)} className="text-sm"><Plus size={16}/> Adicionar Concorrente</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {competitors.map(comp => (
                <Card key={comp.id} className="border-t-4 border-[#ff9933] relative">
                    <button onClick={() => onUpdateCompetitors(competitors.filter(c => c.id !== comp.id))} className="absolute top-2 right-2 text-gray-400 hover:text-red-500"><Trash size={16}/></button>
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        {comp.name} 
                        {comp.website && <a href={comp.website} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline"><ExternalLink size={14}/></a>}
                    </h3>
                    <span className="text-xs uppercase bg-gray-100 px-2 py-1 rounded text-gray-600 font-semibold">{comp.type === 'direct' ? 'Concorrente Direto' : 'Indireto'}</span>
                    <div className="mt-3 space-y-2 text-sm text-gray-600">
                        <p><strong>Preço:</strong> {comp.priceLevel === 'high' ? 'Alto ($$$)' : comp.priceLevel === 'medium' ? 'Médio ($$)' : 'Baixo ($)'}</p>
                        <p><strong>Canais:</strong> {comp.channels}</p>
                        <p className="bg-gray-50 p-2 rounded italic">"{comp.strength}"</p>
                    </div>
                </Card>
            ))}
            {competitors.length === 0 && <p className="text-gray-500 italic col-span-3 text-center py-8">Nenhum concorrente mapeado.</p>}
        </div>
      </section>

      <hr className="border-gray-300" />

      {/* Suppliers Section */}
      <section>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-[#0b0b45]">Cadeia de Fornecedores</h2>
            <Button onClick={() => setSuppModalOpen(true)} className="text-sm"><Plus size={16}/> Adicionar Fornecedor</Button>
        </div>
        <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="w-full text-sm text-left">
                <thead className="bg-[#0b0b45] text-white">
                    <tr>
                        <th className="p-3">Fornecedor</th>
                        <th className="p-3">Contato</th>
                        <th className="p-3">Preço</th>
                        <th className="p-3">Qualidade</th>
                        <th className="p-3">Prazo</th>
                        <th className="p-3"></th>
                    </tr>
                </thead>
                <tbody>
                    {suppliers.map(sup => (
                        <tr key={sup.id} className="border-b hover:bg-gray-50">
                            <td className="p-3 font-semibold">{sup.name}</td>
                            <td className="p-3">{sup.contact}</td>
                            <td className="p-3"><RatingStars count={sup.ratingPrice} /></td>
                            <td className="p-3"><RatingStars count={sup.ratingQuality} /></td>
                            <td className="p-3"><RatingStars count={sup.ratingDeadline} /></td>
                            <td className="p-3 text-right">
                                <button onClick={() => onUpdateSuppliers(suppliers.filter(s => s.id !== sup.id))} className="text-red-500 hover:text-red-700"><Trash size={16}/></button>
                            </td>
                        </tr>
                    ))}
                    {suppliers.length === 0 && <tr><td colSpan={6} className="p-4 text-center text-gray-500">Nenhum fornecedor cadastrado.</td></tr>}
                </tbody>
            </table>
        </div>
      </section>

      {/* Modals */}
      <Modal isOpen={isCompModalOpen} onClose={() => setCompModalOpen(false)} title="Novo Concorrente">
          <Input label="Nome" value={newCompetitor.name} onChange={(e:any) => setNewCompetitor({...newCompetitor, name: e.target.value})} />
          <Input label="Website" value={newCompetitor.website} onChange={(e:any) => setNewCompetitor({...newCompetitor, website: e.target.value})} />
          <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Tipo</label>
              <select className="w-full border p-2 rounded" value={newCompetitor.type} onChange={(e:any) => setNewCompetitor({...newCompetitor, type: e.target.value})}>
                  <option value="direct">Direto</option>
                  <option value="indirect">Indireto</option>
              </select>
          </div>
          <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Nível de Preço</label>
              <select className="w-full border p-2 rounded" value={newCompetitor.priceLevel} onChange={(e:any) => setNewCompetitor({...newCompetitor, priceLevel: e.target.value})}>
                  <option value="low">Baixo ($)</option>
                  <option value="medium">Médio ($$)</option>
                  <option value="high">Alto ($$$)</option>
              </select>
          </div>
          <Input label="Canais (Site, Instagram)" value={newCompetitor.channels} onChange={(e:any) => setNewCompetitor({...newCompetitor, channels: e.target.value})} />
          <Input multiline label="Pontos Fortes/Fracos" value={newCompetitor.strength} onChange={(e:any) => setNewCompetitor({...newCompetitor, strength: e.target.value})} />
          <div className="mt-4 flex justify-end"><Button onClick={addCompetitor}>Salvar</Button></div>
      </Modal>

      <Modal isOpen={isSuppModalOpen} onClose={() => setSuppModalOpen(false)} title="Novo Fornecedor">
          <Input label="Nome" value={newSupplier.name} onChange={(e:any) => setNewSupplier({...newSupplier, name: e.target.value})} />
          <Input label="Contato" value={newSupplier.contact} onChange={(e:any) => setNewSupplier({...newSupplier, contact: e.target.value})} />
          <div className="space-y-4">
              <label className="block text-sm font-medium">Avaliação (1 a 5)</label>
              <div>Preço: <input type="range" min="1" max="5" value={newSupplier.ratingPrice} onChange={(e) => setNewSupplier({...newSupplier, ratingPrice: parseInt(e.target.value)})} className="w-full"/></div>
              <div>Qualidade: <input type="range" min="1" max="5" value={newSupplier.ratingQuality} onChange={(e) => setNewSupplier({...newSupplier, ratingQuality: parseInt(e.target.value)})} className="w-full"/></div>
              <div>Prazo: <input type="range" min="1" max="5" value={newSupplier.ratingDeadline} onChange={(e) => setNewSupplier({...newSupplier, ratingDeadline: parseInt(e.target.value)})} className="w-full"/></div>
          </div>
          <div className="mt-6 flex justify-end"><Button onClick={addSupplier}>Salvar</Button></div>
      </Modal>

    </div>
  );
};