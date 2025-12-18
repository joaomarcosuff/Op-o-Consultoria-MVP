import React, { useState } from 'react';
import { PROJECT_STAGES } from './projectTemplates';
import { FinancialView } from './FinancialView';
import { MarketingView } from './MarketingView';
import { MarketResearchView } from './MarketResearchView';
import { SupplyAnalysisView } from './SupplyAnalysisView';
import { OrganizationView } from './OrganizationView';
import { OperationalView } from './OperationalView';
import { TimelineView } from './TimelineView';
import { Card, Button, Input } from './Shared';
import { Project } from './types';
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
      doc.setFontSize(24);
      doc.text(activeProject.title, 105, 100, { align: 'center' });
      doc.save(`${activeProject.title}.pdf`);
  };

  const handleSaveAndExit = () => setSelectedProjectId(null);

  if (!selectedProjectId) {
      return (
          <div className="space-y-6 animate-in fade-in duration-500">
              <h2 className="text-2xl font-bold text-[#0b0b45]">Projetos</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map(project => (
                      <Card key={project.id} className="hover:shadow-xl transition-shadow cursor-pointer border-t-4 border-[#ff9933]" onClick={() => setSelectedProjectId(project.id)}>
                        <h3 className="font-bold text-lg text-[#0b0b45] mb-2">{project.title}</h3>
                        <p className="text-gray-600 text-sm mb-4">{project.client}</p>
                        <div className="flex justify-between items-center text-sm text-gray-500">
                            <span className="px-2 py-1 bg-gray-100 rounded text-xs uppercase">{project.status}</span>
                            <span>{project.startDate}</span>
                        </div>
                      </Card>
                  ))}
                  <Card className="flex items-center justify-center border-dashed border-2 border-gray-300 bg-gray-50 cursor-pointer" onClick={onCreateProject}>
                      <div className="text-center text-gray-500"><Icons.Plus size={32} className="mx-auto mb-2" /><p>Novo Projeto</p></div>
                  </Card>
              </div>
          </div>
      );
  }

  if (!activeProject) return <div>Erro ao carregar projeto.</div>;

  const renderContent = () => {
    switch (activeStage) {
      case 'market': return <MarketResearchView data={activeProject.marketResearch} onUpdate={(d) => onUpdateProject({...activeProject, marketResearch: d})} />;
      case 'supply': return <SupplyAnalysisView competitors={activeProject.supplyData.competitors} suppliers={activeProject.supplyData.suppliers} onUpdateCompetitors={(c) => onUpdateProject({...activeProject, supplyData: {...activeProject.supplyData, competitors: c}})} onUpdateSuppliers={(s) => onUpdateProject({...activeProject, supplyData: {...activeProject.supplyData, suppliers: s}})} />;
      case 'org': return <OrganizationView data={activeProject.organizationData} onUpdate={(d) => onUpdateProject({...activeProject, organizationData: d})} />;
      case 'operational': return <OperationalView data={activeProject.operationalData} setData={(d) => onUpdateProject({...activeProject, operationalData: d})} />;
      case 'marketing': return <MarketingView data={activeProject.marketingData} onUpdate={(d) => onUpdateProject({...activeProject, marketingData: d})} />;
      case 'financial': return <FinancialView data={activeProject.financialData} onUpdate={(d) => onUpdateProject({...activeProject, financialData: d})} />;
      case 'timeline': return <TimelineView startDate={activeProject.startDate} data={activeProject.timelineData} onUpdate={(d) => onUpdateProject({...activeProject, timelineData: d})} />;
      default: return <div className="p-10 text-center">Módulo em desenvolvimento</div>;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white border-b mb-6 -mx-6 px-6 pt-4 sticky top-0 z-10 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <div>
                <button onClick={() => setSelectedProjectId(null)} className="text-sm text-gray-500 hover:text-[#ff9933] mb-1 flex items-center gap-1"><Icons.ArrowLeft size={14}/> Voltar</button>
                <h1 className="text-2xl font-bold text-[#0b0b45]">{activeProject.title}</h1>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" onClick={generatePDF}><Icons.Download size={16}/> PDF</Button>
                <Button variant="primary" onClick={handleSaveAndExit}><Icons.Save size={16}/> Sair</Button>
            </div>
        </div>
        <div className="flex flex-wrap gap-2 pb-4">
          {PROJECT_STAGES.map((stage) => {
            const IconComp = (Icons as any)[stage.icon] || Icons.Circle;
            return (
              <button key={stage.id} onClick={() => setActiveStage(stage.id)} className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium ${activeStage === stage.id ? 'bg-[#ff9933] text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                <IconComp size={16} /><span>{stage.title}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="flex-1 overflow-auto">{renderContent()}</div>
    </div>
  );
};