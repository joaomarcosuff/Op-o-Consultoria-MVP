import React, { useState } from 'react';
import { PROJECT_STAGES } from '../data/projectTemplates';
import { FinancialView } from './FinancialView';
import { MarketingView } from './MarketingView';
import { MarketResearchView } from './MarketResearchView';
import { SupplyAnalysisView } from './SupplyAnalysisView';
import { OrganizationView } from './OrganizationView';
import { OperationalView } from './OperationalView';
import { TimelineView } from './TimelineView';
import { Card, Button, Input } from '../components/Shared';
import { Project } from '../types';
import * as Icons from 'lucide-react';
import { jsPDF } from "jspdf";

interface ProjectsViewProps {
    projects: Project[];
    onUpdateProject: (p: Project) => void;
    onCreateProject: () => void;
}

export const ProjectsView = ({ projects, onUpdateProject, onCreateProject }: ProjectsViewProps) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [activeStage, setActiveStage] = useState('timeline');

  const activeProject = projects.find(p => p.id === selectedProjectId);

  const generatePDF = () => {
      if (!activeProject) return;
      const doc = new jsPDF();
      let yPos = 20;
      const margin = 20;
      const pageHeight = doc.internal.pageSize.height;

      const addHeader = (title: string, newPage = true) => {
          if (newPage) {
              doc.addPage();
              yPos = 20;
          }
          doc.setFontSize(16);
          doc.setTextColor(11, 11, 69);
          doc.text(title, margin, yPos);
          yPos += 10;
          doc.setFontSize(10);
          doc.setTextColor(0,0,0);
      };

      const checkPageBreak = (spaceNeeded: number) => {
          if (yPos + spaceNeeded > pageHeight - margin) {
              doc.addPage();
              yPos = 20;
          }
      };

      // Capa
      doc.setFontSize(24);
      doc.setTextColor(11, 11, 69); 
      doc.text(activeProject.title, 105, 100, { align: 'center' });
      doc.setFontSize(14);
      doc.setTextColor(100, 100, 100);
      doc.text(`Cliente: ${activeProject.client}`, 105, 110, { align: 'center' });
      doc.text(`Data: ${new Date().toLocaleDateString()}`, 105, 120, { align: 'center' });

      // 1. Sector
      addHeader("1. Análise Setorial");
      doc.setFontSize(12); doc.setTextColor(0,0,0); doc.text("Visão Geral:", margin, yPos); yPos+=6;
      doc.setFontSize(10); doc.setTextColor(80,80,80);
      doc.text(doc.splitTextToSize(activeProject.sectorData.overview, 170), margin, yPos);
      yPos += 30; // Approx
      
      checkPageBreak(40);
      doc.setFontSize(12); doc.setTextColor(0,0,0); doc.text("Tendências:", margin, yPos); yPos+=6;
      doc.setFontSize(10); doc.setTextColor(80,80,80);
      doc.text(doc.splitTextToSize(activeProject.sectorData.trends, 170), margin, yPos);
      
      // 2. Pesquisa de Mercado
      addHeader("2. Pesquisa de Mercado");
      doc.setFontSize(12); doc.text("Público-Alvo:", margin, yPos); yPos+=6;
      doc.setFontSize(10);
      doc.text(doc.splitTextToSize(activeProject.marketResearch.targetAudience, 170), margin, yPos);
      yPos += 25;
      
      checkPageBreak(30);
      doc.setFontSize(12); doc.text("Persona:", margin, yPos); yPos+=6;
      doc.setFontSize(10);
      doc.text(doc.splitTextToSize(activeProject.marketResearch.persona, 170), margin, yPos);
      
      // 3. Oferta e Concorrência
      addHeader("3. Análise de Oferta (Concorrência)");
      activeProject.supplyData.competitors.forEach((comp, i) => {
          checkPageBreak(25);
          doc.setFont(undefined, 'bold');
          doc.text(`${i+1}. ${comp.name} (${comp.type === 'direct' ? 'Direto' : 'Indireto'})`, margin, yPos);
          yPos += 5;
          doc.setFont(undefined, 'normal');
          doc.text(`   Preço: ${comp.priceLevel} | Pontos Fortes: ${comp.strength}`, margin, yPos);
          yPos += 10;
      });

      // 4. Organização
      addHeader("4. Organização e RH");
      doc.text(`Missão: ${activeProject.organizationData.mission}`, margin, yPos); yPos += 10;
      doc.text(`Visão: ${activeProject.organizationData.vision}`, margin, yPos); yPos += 10;
      doc.text(`Valores: ${activeProject.organizationData.values}`, margin, yPos); yPos += 15;
      
      checkPageBreak(50);
      doc.setFontSize(12); doc.text("Estrutura de Cargos:", margin, yPos); yPos += 8;
      doc.setFontSize(10);
      activeProject.organizationData.roles.forEach(role => {
          doc.text(`- ${role.title}: ${role.quantity} vaga(s) x R$ ${role.salary}`, margin, yPos);
          yPos += 6;
      });

      // 5. Plano Operacional
      addHeader("5. Plano Operacional");
      doc.text("Layout e Infraestrutura:", margin, yPos); yPos+=7;
      doc.text(doc.splitTextToSize(activeProject.operationalData.layout, 170), margin, yPos);
      yPos += 20;
      checkPageBreak(30);
      doc.text("Processos Chave:", margin, yPos); yPos+=7;
      doc.text(doc.splitTextToSize(activeProject.operationalData.processes, 170), margin, yPos);

      // 6. Marketing
      addHeader("6. Marketing e Vendas");
      doc.setFontSize(12); doc.text("Mix de Marketing (4Ps):", margin, yPos); yPos += 8;
      doc.setFontSize(10);
      doc.text(`Produto: ${activeProject.marketingData.mix.product}`, margin, yPos); yPos += 6;
      doc.text(`Preço: ${activeProject.marketingData.mix.price}`, margin, yPos); yPos += 6;
      doc.text(`Praça: ${activeProject.marketingData.mix.place}`, margin, yPos); yPos += 6;
      doc.text(`Promoção: ${activeProject.marketingData.mix.promotion}`, margin, yPos); yPos += 15;

      checkPageBreak(60);
      doc.setFontSize(12); doc.text("Análise SWOT:", margin, yPos); yPos += 8;
      doc.setFontSize(10); doc.setTextColor(0, 100, 0); // Green
      doc.text("Forças (Strengths):", margin, yPos); yPos += 5;
      // Note: SWOT arrays might be empty in mock data, logic handles it visually
      activeProject.marketingData.swot.strengths.forEach(s => { doc.text(`- ${s}`, margin+5, yPos); yPos += 5; });
      yPos += 5;
      doc.setTextColor(200, 0, 0); // Red
      doc.text("Fraquezas (Weaknesses):", margin, yPos); yPos += 5;
      activeProject.marketingData.swot.weaknesses.forEach(s => { doc.text(`- ${s}`, margin+5, yPos); yPos += 5; });
      doc.setTextColor(0,0,0);

      // 7. Financials
      addHeader("7. Projeções Financeiras");
      doc.text(`Investimento Inicial: R$ ${activeProject.financialData.initialInvestment.toLocaleString('pt-BR')}`, margin, yPos); yPos+=10;
      doc.text(`Receita Mensal Estimada: R$ ${activeProject.financialData.monthlyRevenue.toLocaleString('pt-BR')}`, margin, yPos); yPos+=10;
      doc.text(`Custo Mensal Estimado: R$ ${activeProject.financialData.monthlyCost.toLocaleString('pt-BR')}`, margin, yPos); yPos+=10;
      doc.text(`TMA: ${activeProject.financialData.discountRate}%`, margin, yPos);

      doc.save(`${activeProject.title}_PlanoNegocios.pdf`);
  };

  const handleSaveAndExit = () => {
    setSelectedProjectId(null);
  };

  // Cálculo da Folha para Integração
  const totalPayroll = activeProject ? activeProject.organizationData.roles.reduce((acc, r) => acc + (r.salary * r.quantity), 0) : 0;

  if (!selectedProjectId) {
      return (
          <div className="space-y-6 animate-in fade-in duration-500">
              <h2 className="text-2xl font-bold text-[#0b0b45]">Projetos</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map(project => (
                      <Card key={project.id} className="hover:shadow-xl transition-shadow cursor-pointer border-t-4 border-[#ff9933] group" >
                          <div onClick={() => setSelectedProjectId(project.id)}>
                            <h3 className="font-bold text-lg text-[#0b0b45] mb-2 group-hover:text-[#ff9933] transition-colors">{project.title}</h3>
                            <p className="text-gray-600 text-sm mb-4">{project.client}</p>
                            <div className="flex justify-between items-center text-sm text-gray-500">
                                <span className="px-2 py-1 bg-gray-100 rounded text-xs font-semibold uppercase">{project.status}</span>
                                <span>{project.startDate}</span>
                            </div>
                          </div>
                      </Card>
                  ))}
                  <Card className="flex items-center justify-center border-dashed border-2 border-gray-300 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors min-h-[160px]">
                      <div className="text-center text-gray-500" onClick={onCreateProject}>
                          <Icons.Plus size={32} className="mx-auto mb-2" />
                          <p>Novo Projeto</p>
                      </div>
                  </Card>
              </div>
          </div>
      );
  }

  if (!activeProject) return <div>Erro ao carregar projeto.</div>;

  const renderContent = () => {
    switch (activeStage) {
      case 'sector': 
        return (
            <div className="space-y-6 animate-in fade-in duration-500">
                <h2 className="text-2xl font-bold text-[#0b0b45]">Contexto Setorial</h2>
                <Card>
                    <h3 className="font-semibold mb-4 text-[#0b0b45]">Panorama Macro</h3>
                    <Input multiline label="Histórico e Visão Geral" value={activeProject.sectorData.overview} onChange={(e:any) => onUpdateProject({...activeProject, sectorData: {...activeProject.sectorData, overview: e.target.value}})} />
                    <Input multiline label="Tendências e Tecnologia" value={activeProject.sectorData.trends} onChange={(e:any) => onUpdateProject({...activeProject, sectorData: {...activeProject.sectorData, trends: e.target.value}})} />
                </Card>
                <Card>
                    <h3 className="font-semibold mb-4 text-[#0b0b45]">5 Forças de Porter</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input multiline label="Rivalidade entre Concorrentes" value={activeProject.sectorData.porter.rivalry} onChange={(e:any) => onUpdateProject({...activeProject, sectorData: {...activeProject.sectorData, porter: {...activeProject.sectorData.porter, rivalry: e.target.value}}})} />
                        <Input multiline label="Poder de Permuta dos Fornecedores" value={activeProject.sectorData.porter.supplierPower} onChange={(e:any) => onUpdateProject({...activeProject, sectorData: {...activeProject.sectorData, porter: {...activeProject.sectorData.porter, supplierPower: e.target.value}}})} />
                        <Input multiline label="Poder de Permuta dos Compradores" value={activeProject.sectorData.porter.buyerPower} onChange={(e:any) => onUpdateProject({...activeProject, sectorData: {...activeProject.sectorData, porter: {...activeProject.sectorData.porter, buyerPower: e.target.value}}})} />
                        <Input multiline label="Ameaça de Novos Entrantes" value={activeProject.sectorData.porter.threatNewEntrants} onChange={(e:any) => onUpdateProject({...activeProject, sectorData: {...activeProject.sectorData, porter: {...activeProject.sectorData.porter, threatNewEntrants: e.target.value}}})} />
                        <Input multiline label="Ameaça de Produtos Substitutos" value={activeProject.sectorData.porter.threatSubstitutes} onChange={(e:any) => onUpdateProject({...activeProject, sectorData: {...activeProject.sectorData, porter: {...activeProject.sectorData.porter, threatSubstitutes: e.target.value}}})} />
                    </div>
                </Card>
            </div>
        );
      case 'market': return <MarketResearchView data={activeProject.marketResearch} onUpdate={(d) => onUpdateProject({...activeProject, marketResearch: d})} />;
      case 'supply': return <SupplyAnalysisView competitors={activeProject.supplyData.competitors} suppliers={activeProject.supplyData.suppliers} onUpdateCompetitors={(c) => onUpdateProject({...activeProject, supplyData: {...activeProject.supplyData, competitors: c}})} onUpdateSuppliers={(s) => onUpdateProject({...activeProject, supplyData: {...activeProject.supplyData, suppliers: s}})} />;
      case 'org': return <OrganizationView data={activeProject.organizationData} onUpdate={(d) => onUpdateProject({...activeProject, organizationData: d})} />;
      case 'operational': return <OperationalView data={activeProject.operationalData} setData={(d) => onUpdateProject({...activeProject, operationalData: d})} />;
      case 'marketing': return <MarketingView data={activeProject.marketingData} onUpdate={(d) => onUpdateProject({...activeProject, marketingData: d})} />;
      case 'financial': return <FinancialView data={activeProject.financialData} onUpdate={(d) => onUpdateProject({...activeProject, financialData: d})} payrollCost={totalPayroll} />;
      case 'timeline': return <TimelineView startDate={activeProject.startDate} data={activeProject.timelineData} onUpdate={(d) => onUpdateProject({...activeProject, timelineData: d})} />;
      default: return <div>Módulo em construção</div>;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white border-b border-[#d9d9d9] mb-6 -mx-6 px-6 pt-4 sticky top-0 z-10 shadow-sm">
        {/* Header: Title + Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <div>
                <button onClick={() => setSelectedProjectId(null)} className="text-sm text-gray-500 hover:text-[#ff9933] mb-1 flex items-center gap-1">
                    <Icons.ArrowLeft size={14} /> Voltar para Projetos
                </button>
                <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold text-[#0b0b45]">
                        <input 
                            value={activeProject.title} 
                            onChange={(e) => onUpdateProject({...activeProject, title: e.target.value})}
                            className="bg-transparent border-b border-transparent hover:border-gray-300 focus:border-[#ff9933] outline-none"
                        />
                    </h1>
                </div>
            </div>
            <div className="flex gap-2 mb-4 md:mb-0">
                <Button variant="outline" onClick={generatePDF}><Icons.Download size={16}/> Exportar PDF</Button>
                <Button variant="primary" onClick={handleSaveAndExit}><Icons.Save size={16}/> Salvar & Sair</Button>
            </div>
        </div>
        
        {/* New Navigation: Horizontal Buttons */}
        <div className="flex flex-wrap gap-2 pb-4">
          {PROJECT_STAGES.map((stage) => {
            const IconComp = (Icons as any)[stage.icon] || Icons.Circle;
            const isActive = activeStage === stage.id;
            return (
              <button
                key={stage.id}
                onClick={() => setActiveStage(stage.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-[#ff9933] text-white shadow-md' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <IconComp size={16} />
                <span>{stage.title}</span>
              </button>
            );
          })}
        </div>
      </div>
      
      <div className="flex-1 overflow-auto pb-10">
        {renderContent()}
      </div>
    </div>
  );
};