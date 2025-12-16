import React from 'react';
import { Card, Input, Button } from '../components/Shared';
import { OrganizationData, Role } from '../types';
import { Trash, Plus } from 'lucide-react';

interface OrganizationViewProps {
    data: OrganizationData;
    onUpdate: (data: OrganizationData) => void;
}

export const OrganizationView = ({ data, onUpdate }: OrganizationViewProps) => {
  const addRole = () => {
      const newRole: Role = { id: Date.now().toString(), title: '', salary: 0, quantity: 1 };
      onUpdate({ ...data, roles: [...data.roles, newRole] });
  };

  const updateRole = (id: string, field: keyof Role, value: any) => {
      onUpdate({
          ...data,
          roles: data.roles.map(r => r.id === id ? { ...r, [field]: value } : r)
      });
  };

  const totalPayroll = data.roles.reduce((acc, r) => acc + (r.salary * r.quantity), 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h2 className="text-2xl font-bold text-[#0b0b45]">Organização e RH</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="md:col-span-2">
              <h3 className="font-semibold mb-4 text-[#0b0b45]">Identidade Organizacional</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input multiline label="Missão" value={data.mission} onChange={(e:any) => onUpdate({...data, mission: e.target.value})} placeholder="Razão de existir..." />
                  <Input multiline label="Visão" value={data.vision} onChange={(e:any) => onUpdate({...data, vision: e.target.value})} placeholder="Onde queremos chegar..." />
                  <Input multiline label="Valores" value={data.values} onChange={(e:any) => onUpdate({...data, values: e.target.value})} placeholder="Princípios norteadores..." />
              </div>
          </Card>

          <Card>
              <h3 className="font-semibold mb-4 text-[#0b0b45]">Dados Legais</h3>
              <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Regime Tributário</label>
                  <select className="w-full border p-2 rounded" value={data.taxRegime} onChange={(e) => onUpdate({...data, taxRegime: e.target.value})}>
                      <option>Simples Nacional</option>
                      <option>Lucro Presumido</option>
                      <option>Lucro Real</option>
                  </select>
              </div>
              <Input label="CNAE Principal" value={data.cnae} onChange={(e:any) => onUpdate({...data, cnae: e.target.value})} />
          </Card>

          <Card>
              <h3 className="font-semibold mb-4 text-[#0b0b45]">Resumo RH</h3>
              <div className="flex flex-col justify-center h-full">
                  <p className="text-gray-500">Custo Mensal Estimado (Folha Bruta)</p>
                  <p className="text-3xl font-bold text-[#0b0b45] mt-2">R$ {totalPayroll.toLocaleString('pt-BR')}</p>
                  <p className="text-sm text-red-500 mt-2">*Não inclui encargos variáveis (VR/VT/Plano de Saúde)</p>
              </div>
          </Card>
      </div>

      <Card>
          <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-[#0b0b45]">Estrutura de Cargos e Salários</h3>
              <Button onClick={addRole} variant="secondary" className="text-sm"><Plus size={14}/> Adicionar Cargo</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-[#0b0b45] text-white">
                    <tr>
                        <th className="p-2 pl-4 rounded-tl">Cargo</th>
                        <th className="p-2">Salário Bruto (R$)</th>
                        <th className="p-2">Qtd. Vagas</th>
                        <th className="p-2">Subtotal</th>
                        <th className="p-2 rounded-tr"></th>
                    </tr>
                </thead>
                <tbody>
                    {data.roles.map(role => (
                        <tr key={role.id} className="border-b hover:bg-gray-50">
                            <td className="p-2"><input className="w-full bg-transparent p-1 border-b border-transparent focus:border-[#ff9933] outline-none" value={role.title} onChange={(e) => updateRole(role.id, 'title', e.target.value)} placeholder="Ex: Gerente" /></td>
                            <td className="p-2"><input type="number" className="w-full bg-transparent p-1 border-b border-transparent focus:border-[#ff9933] outline-none" value={role.salary} onChange={(e) => updateRole(role.id, 'salary', parseFloat(e.target.value))} /></td>
                            <td className="p-2"><input type="number" className="w-20 bg-transparent p-1 border-b border-transparent focus:border-[#ff9933] outline-none" value={role.quantity} onChange={(e) => updateRole(role.id, 'quantity', parseFloat(e.target.value))} /></td>
                            <td className="p-2 font-bold text-[#0b0b45]">R$ {(role.salary * role.quantity).toLocaleString('pt-BR')}</td>
                            <td className="p-2 text-center">
                                <button onClick={() => onUpdate({...data, roles: data.roles.filter(r => r.id !== role.id)})} className="text-gray-400 hover:text-red-500"><Trash size={16}/></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
          </div>
      </Card>
    </div>
  );
};