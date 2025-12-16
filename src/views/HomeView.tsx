import React, { useMemo } from 'react';
import { Card } from '../components/Shared';
import { TrendingUp, Users, CheckCircle, AlertCircle, Calendar, ArrowRight, DollarSign, Briefcase, CheckSquare, PieChart, ClipboardList } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart as RePieChart, Pie, Cell, AreaChart, Area, CartesianGrid } from 'recharts';
import { Project, Task, Lead } from '../types';
import { calculateProjections } from '../utils/financialMath';

interface HomeViewProps {
  projects: Project[];
  tasks: Task[];
  leads: Lead[];
  onNavigate: (view: 'home' | 'commercial' | 'projects' | 'dashboard') => void;
}

export const HomeView = ({ projects, tasks, leads, onNavigate }: HomeViewProps) => {
  
  // 1. KPI Calculation & Data Prep
  const kpis = useMemo(() => {
    const activeProjects = projects.filter(p => p.status === 'execution').length;
    const pendingTasks = tasks.filter(t => t.status !== 'done').length;
    const newLeads = leads.filter(l => l.status === 'prospect').length;
    
    // Revenue Calculation (Mock for Year 1)
    const projectRevenue = projects
      .filter(p => p.status === 'execution' || p.status === 'planning')
      .reduce((acc, p) => {
        const { cashFlow } = calculateProjections(p.financialData, 1);
        return acc + (cashFlow.reduce((sum, m) => sum + m.revenue, 0));
      }, 0);

    const pipelineValue = leads
      .filter(l => l.status === 'closed_won')
      .reduce((acc, l) => acc + l.value, 0);

    const totalRevenue = projectRevenue + pipelineValue;
    const revenueGoal = totalRevenue * 1.2; // Mock Goal

    return { 
        activeProjects, 
        pendingTasks, 
        newLeads, 
        totalRevenue,
        revenueGoal,
        revenueProgress: Math.min((totalRevenue / revenueGoal) * 100, 100)
    };
  }, [projects, tasks, leads]);

  // Chart Data: Financial Evolution
  const revenueData = useMemo(() => {
    return [
      { name: 'Jan', revenue: kpis.totalRevenue * 0.1, target: kpis.revenueGoal * 0.1 },
      { name: 'Fev', revenue: kpis.totalRevenue * 0.12, target: kpis.revenueGoal * 0.18 },
      { name: 'Mar', revenue: kpis.totalRevenue * 0.15, target: kpis.revenueGoal * 0.26 },
      { name: 'Abr', revenue: kpis.totalRevenue * 0.18, target: kpis.revenueGoal * 0.34 },
      { name: 'Mai', revenue: kpis.totalRevenue * 0.2, target: kpis.revenueGoal * 0.42 },
      { name: 'Jun', revenue: kpis.totalRevenue * 0.25, target: kpis.revenueGoal * 0.5 },
    ];
  }, [kpis.totalRevenue]);

  // Chart Data: Task Priority
  const taskDistribution = useMemo(() => {
    return [
        { name: 'Alta', value: tasks.filter(t => t.priority === 'high' && t.status !== 'done').length, color: '#ef4444' }, // red-500
        { name: 'Média', value: tasks.filter(t => t.priority === 'medium' && t.status !== 'done').length, color: '#f59e0b' }, // amber-500
        { name: 'Baixa', value: tasks.filter(t => t.priority === 'low' && t.status !== 'done').length, color: '#10b981' }, // green-500
    ];
  }, [tasks]);

  // Chart Data: Commercial Pipeline
  const pipelineData = useMemo(() => {
      const statusMap: any = { 'prospect': 0, 'meeting': 0, 'proposal': 0, 'closed_won': 0 };
      leads.forEach(l => {
          if (statusMap[l.status] !== undefined) statusMap[l.status] += l.value;
      });
      return [
          { name: 'Prospecção', value: statusMap['prospect'] },
          { name: 'Reunião', value: statusMap['meeting'] },
          { name: 'Proposta', value: statusMap['proposal'] },
          { name: 'Fechado', value: statusMap['closed_won'] },
      ];
  }, [leads]);

  // Helper: Upcoming Deliveries
  const upcomingTasks = tasks
    .filter(t => t.status !== 'done')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  const isOverdue = (dateStr: string) => new Date(dateStr) < new Date();

  const moduleShortcuts = [
      { 
          id: 'projects',
          title: 'Projetos', 
          description: 'Gestão de consultorias, cronogramas e entregáveis.',
          icon: PieChart, 
          color: 'bg-blue-600', 
          stat: `${kpis.activeProjects} Ativos`,
          view: 'projects' as const
      },
      { 
          id: 'commercial',
          title: 'Comercial', 
          description: 'Pipeline de vendas, CRM e gestão de leads.',
          icon: Briefcase, 
          color: 'bg-purple-600', 
          stat: `${kpis.newLeads} Novos Leads`,
          view: 'commercial' as const
      },
      { 
          id: 'tasks',
          title: 'Tarefas', 
          description: 'Minhas pendências e quadro Kanban geral.',
          icon: ClipboardList, 
          color: 'bg-[#ff9933]', 
          stat: `${kpis.pendingTasks} Pendentes`,
          view: 'dashboard' as const
      },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* 1. Header: Welcome & Date */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-2xl font-bold text-[#0b0b45]">Olá, Consultor Sênior</h1>
            <p className="text-gray-500">Aqui está o panorama da sua operação hoje.</p>
        </div>
        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium border border-blue-100 flex items-center gap-2 shadow-sm">
            <Calendar size={14} /> {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </span>
      </div>
      
      {/* 2. KPIs: Semantic Border Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Financeiro */}
        <Card className="border-l-4 border-[#ff9933] relative overflow-hidden group">
          <div className="flex justify-between items-start mb-2">
             <div className="p-2 bg-[#ff9933]/10 rounded-lg text-[#ff9933] group-hover:bg-[#ff9933] group-hover:text-white transition-colors">
                 <DollarSign size={20} />
             </div>
             <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Anual</span>
          </div>
          <p className="text-gray-500 text-sm">Receita Projetada</p>
          <p className="text-2xl font-bold text-[#0b0b45] mt-1">R$ {kpis.totalRevenue.toLocaleString('pt-BR', { notation: 'compact' })}</p>
          {/* Progress Bar */}
          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500">Meta: {kpis.revenueGoal.toLocaleString('pt-BR', { notation: 'compact' })}</span>
                <span className="font-bold text-[#ff9933]">{kpis.revenueProgress.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div className="bg-[#ff9933] h-1.5 rounded-full transition-all duration-1000" style={{ width: `${kpis.revenueProgress}%` }}></div>
            </div>
          </div>
        </Card>

        {/* Projetos */}
        <Card className="border-l-4 border-blue-600 group">
          <div className="flex justify-between items-start mb-2">
             <div className="p-2 bg-blue-50 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                 <Briefcase size={20} />
             </div>
          </div>
          <p className="text-gray-500 text-sm">Projetos em Execução</p>
          <p className="text-2xl font-bold text-[#0b0b45] mt-1">{kpis.activeProjects}</p>
          <p className="text-xs text-green-600 mt-2 flex items-center">
            <TrendingUp size={12} className="mr-1" /> Dentro do prazo
          </p>
        </Card>

        {/* Leads */}
        <Card className="border-l-4 border-purple-500 group">
          <div className="flex justify-between items-start mb-2">
             <div className="p-2 bg-purple-50 rounded-lg text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                 <Users size={20} />
             </div>
          </div>
          <p className="text-gray-500 text-sm">Novos Leads (Mês)</p>
          <p className="text-2xl font-bold text-[#0b0b45] mt-1">{kpis.newLeads}</p>
          <p className="text-xs text-gray-400 mt-2">Pipeline ativo</p>
        </Card>

         {/* Tarefas */}
         <Card className="border-l-4 border-red-500 group">
          <div className="flex justify-between items-start mb-2">
             <div className="p-2 bg-red-50 rounded-lg text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors">
                 <CheckSquare size={20} />
             </div>
             {kpis.pendingTasks > 0 && <span className="flex h-3 w-3 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span></span>}
          </div>
          <p className="text-gray-500 text-sm">Tarefas Pendentes</p>
          <p className="text-2xl font-bold text-[#0b0b45] mt-1">{kpis.pendingTasks}</p>
          <p className="text-xs text-red-500 mt-2 font-medium">Requer atenção</p>
        </Card>
      </div>

      {/* 3. System Modules Shortcuts (Acesso Rápido Melhorado) */}
      <div>
        <h3 className="text-lg font-bold text-[#0b0b45] mb-4 flex items-center gap-2">
            Módulos do Sistema
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {moduleShortcuts.map((module) => (
                <div 
                    key={module.id} 
                    onClick={() => onNavigate(module.view)}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden"
                >
                    <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity`}>
                        <module.icon size={100} className={module.color.replace('bg-', 'text-')} />
                    </div>
                    
                    <div className="flex items-center gap-4 mb-4">
                        <div className={`p-4 rounded-xl shadow-sm ${module.color} text-white`}>
                            <module.icon size={28} />
                        </div>
                        <div>
                            <h4 className="font-bold text-xl text-[#0b0b45]">{module.title}</h4>
                            <span className="text-xs font-semibold bg-gray-100 px-2 py-0.5 rounded text-gray-600">{module.stat}</span>
                        </div>
                    </div>
                    
                    <p className="text-gray-500 text-sm mb-4 min-h-[40px]">{module.description}</p>
                    
                    <div className="flex items-center text-[#ff9933] font-semibold text-sm group-hover:gap-2 transition-all">
                        Acessar Módulo <ArrowRight size={16} />
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* 4. Dashboards & List Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Charts Section */}
        <div className="lg:col-span-2 space-y-6">
            <Card>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-[#0b0b45]">Evolução Financeira (Realizado vs Meta)</h3>
                </div>
                <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData}>
                        <defs>
                            <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0b0b45" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#0b0b45" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                        <Area type="monotone" dataKey="revenue" stroke="#0b0b45" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" name="Realizado" />
                        <Area type="monotone" dataKey="target" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" fill="none" name="Meta" />
                    </AreaChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <h3 className="font-bold text-[#0b0b45] mb-4">Pipeline Comercial</h3>
                    <div className="h-56">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={pipelineData} layout="vertical">
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={80} tick={{fontSize: 12}} />
                                <Tooltip cursor={{fill: 'transparent'}} />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                    {pipelineData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.name === 'Fechado' ? '#10b981' : '#0b0b45'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
                <Card>
                    <h3 className="font-bold text-[#0b0b45] mb-4">Prioridade de Tarefas</h3>
                    <div className="h-56">
                        <ResponsiveContainer width="100%" height="100%">
                            <RePieChart>
                                <Pie
                                    data={taskDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={70}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {taskDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </RePieChart>
                        </ResponsiveContainer>
                        <div className="flex justify-center gap-3 text-xs mt-2">
                             {taskDistribution.map(t => (
                                 <div key={t.name} className="flex items-center gap-1">
                                     <div className="w-2 h-2 rounded-full" style={{backgroundColor: t.color}}></div> {t.name}
                                 </div>
                             ))}
                        </div>
                    </div>
                </Card>
            </div>
        </div>

        {/* 5. Upcoming Deliveries List */}
        <div className="lg:col-span-1">
            <Card className="h-full flex flex-col">
                <h3 className="font-bold text-[#0b0b45] mb-4 flex items-center gap-2">
                    <AlertCircle size={18} className="text-[#ff9933]" /> Próximas Entregas
                </h3>
                <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                    {upcomingTasks.length === 0 && <p className="text-gray-400 text-sm text-center py-10">Tudo em dia!</p>}
                    {upcomingTasks.map(task => {
                        const overdue = isOverdue(task.dueDate);
                        return (
                            <div key={task.id} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors group">
                                <div className="flex justify-between items-start mb-1">
                                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                                        task.priority === 'high' ? 'bg-red-100 text-red-700' :
                                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-green-100 text-green-700'
                                    }`}>
                                        {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Média' : 'Baixa'}
                                    </span>
                                    <span className="text-[10px] text-gray-400 bg-gray-100 px-1 rounded">{task.type}</span>
                                </div>
                                <p className="text-sm font-semibold text-gray-800 leading-tight mb-2 group-hover:text-[#0b0b45]">{task.title}</p>
                                <div className="flex justify-between items-center text-xs">
                                    <span className={`flex items-center gap-1 ${overdue ? 'text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded' : 'text-gray-500'}`}>
                                        <Calendar size={12} /> {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                                    </span>
                                    <span className="text-gray-400">{task.assignee}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <button 
                    onClick={() => onNavigate('dashboard')}
                    className="w-full mt-4 text-sm text-[#0b0b45] font-semibold hover:underline text-center"
                >
                    Ver todas as tarefas
                </button>
            </Card>
        </div>

      </div>
    </div>
  );
};