import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot, collection, query, where } from 'firebase/firestore';
import { auth, db } from './firebase';
import { LoginView } from './views/LoginView';
import { HomeView } from './views/HomeView';
import { CommercialView } from './views/CommercialView';
import { ProjectsView } from './views/ProjectsView';
import { DashboardView } from './views/DashboardView';
import { LayoutDashboard, PieChart, Briefcase, Menu, LogOut, Settings, ClipboardList, Loader2 } from 'lucide-react';
import { Project, Lead, Task } from './types';

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
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'home' | 'commercial' | 'projects' | 'dashboard'>('home');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);

  // 1. Monitorar estado de Autenticação
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Monitorar e Sincronizar Dados do Firestore quando logado
  useEffect(() => {
    if (!user) {
        setProjects([]);
        setLeads([]);
        setTasks([]);
        return;
    }

    // Listener para Projetos
    const qProjects = query(collection(db, "projects"), where("userId", "==", user.uid));
    const unsubProjects = onSnapshot(qProjects, (snapshot) => {
        const loadedProjects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
        setProjects(loadedProjects);
    });

    // Listener para Leads
    const qLeads = query(collection(db, "leads"), where("userId", "==", user.uid));
    const unsubLeads = onSnapshot(qLeads, (snapshot) => {
        const loadedLeads = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lead));
        setLeads(loadedLeads);
    });

    // Listener para Tarefas
    const qTasks = query(collection(db, "tasks"), where("userId", "==", user.uid));
    const unsubTasks = onSnapshot(qTasks, (snapshot) => {
        const loadedTasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
        setTasks(loadedTasks);
    });

    return () => {
        unsubProjects();
        unsubLeads();
        unsubTasks();
    };
  }, [user]);

  // Funções de Update Sincronizadas com Firestore
  const handleUpdateProject = async (updatedProject: Project) => {
      if (!user) return;
      await setDoc(doc(db, "projects", updatedProject.id), { ...updatedProject, userId: user.uid });
  };

  const handleCreateProject = async () => {
      if (!user) return;
      const id = Date.now().toString();
      const newProject: Project = {
          id,
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
          sectorData: { overview: '', trends: '', porter: { rivalry: '', supplierPower: '', buyerPower: '', threatNewEntrants: '', threatSubstitutes: '' } },
          supplyData: { competitors: [], suppliers: [] },
          marketResearch: { surveyLink: '', targetAudience: '', persona: '', dataAnalysis: '' },
          organizationData: { mission: '', vision: '', values: '', taxRegime: 'Simples Nacional', cnae: '', roles: [] },
          operationalData: { layout: '', capacity: '', processes: '', logistics: '' },
          timelineData: { tasks: [] }
      };
      await setDoc(doc(db, "projects", id), { ...newProject, userId: user.uid });
  };

  const handleUpdateLead = async (lead: Lead) => {
    if (!user) return;
    await setDoc(doc(db, "leads", lead.id), { ...lead, userId: user.uid });
  };

  const handleAddLead = async (lead: Lead) => {
    if (!user) return;
    await setDoc(doc(db, "leads", lead.id), { ...lead, userId: user.uid });
  };

  const handleUpdateTask = async (taskId: string, status: Task['status']) => {
      if (!user) return;
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        await setDoc(doc(db, "tasks", taskId), { ...task, status, userId: user.uid });
      }
  };

  if (loading) {
      return (
          <div className="h-screen flex items-center justify-center bg-[#d9d9d9]">
              <Loader2 className="animate-spin text-[#0b0b45]" size={48} />
          </div>
      );
  }

  if (!user) {
    return <LoginView />;
  }

  return (
    <div className="flex h-screen bg-[#d9d9d9] font-sans overflow-hidden">
      {isSidebarOpen && window.innerWidth < 768 && (
          <div className="fixed inset-0 bg-black/50 z-10" onClick={() => setSidebarOpen(false)}></div>
      )}

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
            onClick={() => signOut(auth)}
            className="flex items-center space-x-2 text-gray-300 hover:text-[#ff9933] w-full px-4 py-2 transition-colors"
          >
            <LogOut size={18} />
            <span>Sair</span>
          </button>
        </div>
      </aside>

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
                <span className="text-sm text-gray-500 hidden md:inline">Logado como: {user.email || 'Demo'}</span>
                <div className="w-8 h-8 bg-[#0b0b45] rounded-full flex items-center justify-center text-white font-bold">
                    {user.email ? user.email[0].toUpperCase() : 'D'}
                </div>
            </div>
        </header>
        <div className="flex-1 overflow-auto p-6 bg-[#d9d9d9]">
          {currentView === 'home' && <HomeView projects={projects} tasks={tasks} leads={leads} onNavigate={setCurrentView} />}
          {/* Fix: Use correct prop names for CommercialView as defined in its interface */}
          {currentView === 'commercial' && <CommercialView leads={leads} onAddLead={handleAddLead} onUpdateLead={handleUpdateLead} />}
          {currentView === 'projects' && <ProjectsView projects={projects} onUpdateProject={handleUpdateProject} onCreateProject={handleCreateProject} />}
          {currentView === 'dashboard' && <DashboardView tasks={tasks} onUpdateTask={handleUpdateTask} />}
        </div>
      </main>
    </div>
  );
};

export default App;