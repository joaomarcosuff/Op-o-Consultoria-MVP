import React, { useMemo } from 'react';
import { Card } from './Shared';
import { TrendingUp, Users, CheckCircle, AlertCircle, Calendar, ArrowRight, DollarSign, Briefcase, CheckSquare, PieChart, ClipboardList } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart as RePieChart, Pie, Cell, AreaChart, Area, CartesianGrid } from 'recharts';
import { Project, Task, Lead } from './types';
import { calculateProjections } from './financialMath';

interface HomeViewProps {
  projects: Project[];
  tasks: Task[];
  leads: Lead[];
  onNavigate: (view: 'home' | 'commercial' | 'projects' | 'dashboard') => void;
}

export const HomeView = ({ projects, tasks, leads, onNavigate }: HomeViewProps) => {
  const kpis = useMemo(() => {
    const activeProjects = projects.filter(p => p.status === 'execution').length;
    const pendingTasks = tasks.filter(t => t.status !== 'done').length;
    const newLeads = leads.filter(l => l.status === 'prospect').length;
    
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
    const revenueGoal = totalRevenue * 1.2;

    return { 
        activeProjects, 
        pendingTasks, 
        newLeads, 
        totalRevenue,
        revenueGoal,
        revenueProgress: Math.min((totalRevenue / revenueGoal) * 100, 100)
    };
  }, [projects, tasks, leads]);

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

  const taskDistribution = useMemo(() => {
    return [
        { name: 'Alta', value: tasks.filter(t => t.priority === 'high' && t.status !== 'done').length, color: '#ef4444' },
        { name: 'Média', value: tasks.filter(t => t.priority === 'medium' && t.status !== 'done').length, color: '#f59e0b' },
        { name: 'Baixa', value: tasks.filter(t => t.priority === 'low' && t.status !== 'done').length, color: '#10b981' },
    ];
  }, [tasks]);

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

  const upcomingTasks = tasks
    .filter(t => t.status !== 'done')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  const isOverdue = (dateStr: string) => new Date(dateStr) < new Date();

  const moduleShortcuts = [
      { id: 'projects', title: 'Projetos', description: 'Gestão de consultorias...', icon: PieChart, color: 'bg-blue-600', stat: `${kpis.activeProjects} Ativos`, view: 'projects' as const },
      { id: 'commercial', title: 'Comercial', description: 'Pipeline de vendas...', icon: Briefcase, color: 'bg-purple-600', stat: `${kpis.newLeads} Novos Leads`, view: 'commercial' as const },
      { id: 'tasks', title: 'Tarefas', description: 'Minhas pendências...', icon: ClipboardList, color: 'bg-[#ff9933]', stat: `${kpis.pendingTasks} Pendentes`, view: 'dashboard' as const },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-2xl font-bold text-[#0b0b45]">Olá, Consultor Sênior</h1>
            <p className="text-gray-500">Panorama da operação hoje.</p>
        </div>
        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium border border-blue-100 flex items-center gap-2 shadow-sm">
            <Calendar size={14} /> {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-[#ff9933]">
          <p className="text-gray-500 text-sm">Receita Projetada</p>
          <p className="text-2xl font-bold text-[#0b0b45]">R$ {kpis.totalRevenue.toLocaleString('pt-BR', { notation: 'compact' })}</p>
          <div className="mt-3">
            <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div className="bg-[#ff9933] h-1.5 rounded-full" style={{ width: `${kpis.revenueProgress}%` }}></div>
            </div>
          </div>
        </Card>
        <Card className="border-l-4 border-blue-600"><p className="text-gray-500 text-sm">Projetos Ativos</p><p className="text-2xl font-bold text-[#0b0b45]">{kpis.activeProjects}</p></Card>
        <Card className="border-l-4 border-purple-500"><p className="text-gray-500 text-sm">Novos Leads</p><p className="text-2xl font-bold text-[#0b0b45]">{kpis.newLeads}</p></Card>
        <Card className="border-l-4 border-red-500"><p className="text-gray-500 text-sm">Pendências</p><p className="text-2xl font-bold text-[#0b0b45]">{kpis.pendingTasks}</p></Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {moduleShortcuts.map((module) => (
          <Card key={module.id} onClick={() => onNavigate(module.view)} className="cursor-pointer hover:shadow-xl transition-all">
            <div className="flex items-center gap-4 mb-4">
              <div className={`p-4 rounded-xl ${module.color} text-white`}><module.icon size={28} /></div>
              <h4 className="font-bold text-xl text-[#0b0b45]">{module.title}</h4>
            </div>
            <p className="text-gray-500 text-sm mb-4">{module.description}</p>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h3 className="font-bold text-[#0b0b45] mb-6">Evolução Financeira</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="revenue" stroke="#0b0b45" fill="#0b0b45" fillOpacity={0.1} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
        <div className="lg:col-span-1">
          <Card>
            <h3 className="font-bold text-[#0b0b45] mb-4">Próximas Entregas</h3>
            <div className="space-y-3">
              {upcomingTasks.map(task => (
                <div key={task.id} className="p-3 border rounded hover:bg-gray-50">
                  <p className="text-sm font-semibold">{task.title}</p>
                  <p className="text-xs text-gray-500">{new Date(task.dueDate).toLocaleDateString('pt-BR')}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};