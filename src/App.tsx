import React, { useState, useEffect } from 'react';
import { LoginView } from './views/LoginView';
import { HomeView } from './views/HomeView';
import { CommercialView } from './views/CommercialView';
import { ProjectsView } from './views/ProjectsView';
import { DashboardView } from './views/DashboardView';
import { LayoutDashboard, PieChart, Briefcase, Menu, LogOut, Settings, ClipboardList } from 'lucide-react';
import { Project, Lead, Task } from './types';

// Mock Data Initialization
const MOCK_PROJECTS: Project[] = [
    {
        id: '1', title: 'Expansão Nacional Varejo', client: 'Grupo ABC', status: 'execution', startDate: '2023-01-15',
        financialData: { 
            initialInvestment: 500000, 
            investmentBreakdown: { reform: 200000, furniture: 100000, equipment: 100000, marketing: 50000, legal: 20000, workingCapital: 30000 },
            monthlyRevenue: 120000, monthlyCost: 80000, annualGrowthRate: 10, taxRate: 15, discountRate: 12 
        },
        marketingData: { 
          description: 'Varejo de moda', 
          swot: { strengths: [], weaknesses: [], opportunities: [], threats: [] }, 
          mix: { product: '', price: '', place: '', promotion: '' }, 
          funnel: { top: '', middle: '', bottom: '' },
          actionPlan: [] 
        },
        sectorData: { 
          overview: 'Setor em crescimento...', 
          trends: 'Omnichannel', 
          porter: { rivalry: '', supplierPower: '', buyerPower: '', threatNewEntrants: '', threatSubstitutes: '' } 
        },
        supplyData: { competitors: [], suppliers: [] },
        marketResearch: { surveyLink: '', targetAudience: '', persona: '', dataAnalysis: '' },
        organizationData: { mission: '', vision: '', values: '', taxRegime: 'Simples Nacional', cnae: '', roles: [] },
        operationalData: { layout: '', capacity: '', processes: '', logistics: '' },
        timelineData: { tasks: [] }
    },
    {
        id: '2', title: 'Reestruturação RH', client: 'TechSoft', status: 'planning', startDate: '2023-11-01',
        financialData: { 
            initialInvestment: 50000, 
            investmentBreakdown: { reform: 0, furniture: 10000, equipment: 20000, marketing: 0, legal: 10000, workingCapital: 10000 },
            monthlyRevenue: 0, monthlyCost: 0, annualGrowthRate: 0, taxRate: 0, discountRate: 10 
        },
        marketingData: { 
          description: '', 
          swot: { strengths: [], weaknesses: [], opportunities: [], threats: [] }, 
          mix: { product: '', price: '', place: '', promotion: '' }, 
          funnel: { top: '', middle: '', bottom: '' },
          actionPlan: [] 
        },
        sectorData: { 
          overview: '', 
          trends: '', 
          porter: { rivalry: '', supplierPower: '', buyerPower: '', threatNewEntrants: '', threatSubstitutes: '' } 
        },
        supplyData: { competitors: [], suppliers: [] },
        marketResearch: { surveyLink: '', targetAudience: '', persona: '', dataAnalysis: '' },
        organizationData: { mission: '', vision: '', values: '', taxRegime: 'Lucro Presumido', cnae: '', roles: [] },
        operationalData: { layout: '', capacity: '', processes: '', logistics: '' },
        timelineData: { tasks: [] }
    }
];

const MOCK_TASKS: Task[] = [
    { id: '1', title: 'Validar premissas financeiras', type: 'project', priority: 'high', status: 'doing', assignee: 'Eu', dueDate: '2023-10-25', projectId: '1' },
    { id: '2', title: 'Treinamento de Compliance', type: 'training', priority: 'medium', status: 'todo', assignee: 'Eu', dueDate: '2023-12-01' },
    { id: '3', title: 'Pagar fornecedores', type: 'general', priority: 'high', status: 'done', assignee: 'Financeiro', dueDate: '2023-10-20' },
    { id: '4', title: 'Reunião de Kickoff', type: 'project', priority: 'medium', status: 'todo', assignee: 'João', dueDate: '2023-11-05', projectId: '2' },
    { id: '5', title: 'Atualizar CRM', type: 'general', priority: 'low', status: 'todo', assignee: 'Eu', dueDate: '2023-11-10' },
];

const MOCK_LEADS: Lead[] = [
    { id: '1', name: 'Mario Silva', company: 'Construtora Silva', email: 'mario@silva.com', phone: '11 99999-9999', value: 45000, probability: 60, status: 'meeting', lastContact: '2023-10-22', history: [] },
    { id: '2', name: 'Ana Costa', company: 'Inovação LTDA', email: 'ana@inovacao.com', phone: '11 88888-8888', value: 12000, probability: 30, status: 'prospect', lastContact: '2023-10-20', history: [] },
];

const SidebarItem = ({ icon: Icon, label, active, onClick }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
      active ? 'bg-[#ff9933] text-white shadow-lg' : 'text-gray-300 hover:bg-[#ff9933]/20 hover:text-white'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </button>
);

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'commercial' | 'projects' | 'dashboard'>('home');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  
  // Global State
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);

  // Responsive Sidebar
  useEffect(() => {
    const handleResize = () => {
        if (window.innerWidth < 768) setSidebarOpen(false);
        else setSidebarOpen(true);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleUpdateProject = (updatedProject: Project) => {
      setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
  };

  const handleCreateProject = () => {
      const newProject: Project = {
          id: Date.now().toString(),
          title: 'Novo Projeto',
          client: 'Cliente',
          status: 'planning',
          startDate: new Date().toISOString().split('T')[0],
          financialData: { 
              initialInvestment: 0, 
              investmentBreakdown: { reform: 0, furniture: 0, equipment: 0, marketing: 0, legal: 0, workingCapital: 0 },
              monthlyRevenue: 0, monthlyCost: 0, annualGrowthRate: 0, taxRate: 0, discountRate: 0 
          },
          marketingData: { 
            description: '', 
            swot: { strengths: [], weaknesses: [], opportunities: [], threats: [] }, 
            mix: { product: '', price: '', place: '', promotion: '' }, 
            funnel: { top: '', middle: '', bottom: '' },
            actionPlan: [] 
          },
          sectorData: { 
            overview: '', 
            trends: '', 
            porter: { rivalry: '', supplierPower: '', buyerPower: '', threatNewEntrants: '', threatSubstitutes: '' } 
          },
          supplyData: { competitors: [], suppliers: [] },
          marketResearch: { surveyLink: '', targetAudience: '', persona: '', dataAnalysis: '' },
          organizationData: { mission: '', vision: '', values: '', taxRegime: 'Simples Nacional', cnae: '', roles: [] },
          operationalData: { layout: '', capacity: '', processes: '', logistics: '' },
          timelineData: { tasks: [] }
      };
      setProjects([...projects, newProject]);
  };

  const handleUpdateTask = (taskId: string, status: Task['status']) => {
      setTasks(tasks.map(t => t.id === taskId ? { ...t, status } : t));
  };

  if (!isAuthenticated) {
    return <LoginView onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="flex h-screen bg-[#d9d9d9] font-sans overflow-hidden">
      {/* Mobile Overlay */}
      {isSidebarOpen && window.innerWidth < 768 && (
          <div className="fixed inset-0 bg-black/50 z-10" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* Sidebar */}
      <aside className={`fixed md:relative w-64 bg-[#0b0b45] text-white flex flex-col shadow-xl z-20 h-full transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-0 md:hidden'}`}>
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="bg-[#ff9933] p-2 rounded text-[#0b0b45]">
               <Settings size={20} />
             </div>
             <span className="font-bold text-lg tracking-tight">Opção Cons.</span>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <SidebarItem icon={LayoutDashboard} label="Visão Geral" active={currentView === 'home'} onClick={() => { setCurrentView('home'); if(window.innerWidth < 768) setSidebarOpen(false); }} />
          <SidebarItem icon={PieChart} label="Projetos" active={currentView === 'projects'} onClick={() => { setCurrentView('projects'); if(window.innerWidth < 768) setSidebarOpen(false); }} />
          <SidebarItem icon={Briefcase} label="Comercial" active={currentView === 'commercial'} onClick={() => { setCurrentView('commercial'); if(window.innerWidth < 768) setSidebarOpen(false); }} />
          <SidebarItem icon={ClipboardList} label="Tarefas" active={currentView === 'dashboard'} onClick={() => { setCurrentView('dashboard'); if(window.innerWidth < 768) setSidebarOpen(false); }} />
        </nav>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="flex items-center space-x-2 text-gray-300 hover:text-[#ff9933] w-full px-4 py-2 transition-colors"
          >
            <LogOut size={18} />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden flex flex-col relative w-full">
        <header className="bg-white shadow-sm border-b h-16 flex items-center px-6 justify-between z-10 shrink-0">
            <div className="flex items-center gap-4">
                <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="md:hidden text-[#0b0b45]">
                    <Menu size={24} />
                </button>
                <h2 className="font-semibold text-[#0b0b45] text-xl">
                    {currentView === 'home' && 'Dashboard Executivo'}
                    {currentView === 'commercial' && 'Gestão Comercial'}
                    {currentView === 'projects' && 'Gestão de Projetos'}
                    {currentView === 'dashboard' && 'Minhas Tarefas'}
                </h2>
            </div>
            <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500 hidden md:inline">Olá, Consultor Sênior</span>
                <div className="w-8 h-8 bg-[#0b0b45] rounded-full flex items-center justify-center text-white font-bold">
                    CS
                </div>
            </div>
        </header>
        <div className="flex-1 overflow-auto p-6 bg-[#d9d9d9]">
          {currentView === 'home' && <HomeView projects={projects} tasks={tasks} leads={leads} onNavigate={setCurrentView} />}
          {currentView === 'commercial' && <CommercialView leads={leads} onAddLead={(l) => setLeads([...leads, l])} onUpdateLead={(l) => setLeads(leads.map(x => x.id === l.id ? l : x))} />}
          {currentView === 'projects' && <ProjectsView projects={projects} onUpdateProject={handleUpdateProject} onCreateProject={handleCreateProject} />}
          {currentView === 'dashboard' && <DashboardView tasks={tasks} onUpdateTask={handleUpdateTask} />}
        </div>
      </main>
    </div>
  );
};

export default App;