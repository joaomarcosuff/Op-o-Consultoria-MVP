import { TimelineTask } from './types';

export const PROJECT_STAGES = [
  { id: 'timeline', title: 'Cronograma', icon: 'Calendar' },
  { id: 'market', title: 'Pesquisa Mercado', icon: 'Search' },
  { id: 'supply', title: 'Oferta & Concorrência', icon: 'Users' },
  { id: 'org', title: 'Organização & RH', icon: 'Briefcase' },
  { id: 'operational', title: 'Plano Operacional', icon: 'Settings' },
  { id: 'marketing', title: 'Marketing & Vendas', icon: 'Megaphone' },
  { id: 'financial', title: 'Viabilidade Financeira', icon: 'DollarSign' },
];

export const KANBAN_COLUMNS = [
  { id: 'prospect', title: 'Prospecção' },
  { id: 'meeting', title: 'Reunião' },
  { id: 'proposal', title: 'Proposta' },
  { id: 'closed_won', title: 'Fechado' },
];

export const CONSULTING_MANUAL_TASKS = [
  { title: "Definição de Público-Alvo", description: "Determinar características da Persona.", estimatedDays: 2, module: 'Mercado' },
  { title: "Mapeamento de Concorrentes", description: "Identificar concorrentes diretos e indiretos.", estimatedDays: 2, module: 'Oferta' },
  { title: "Viabilidade Financeira", description: "Calcular VPL, TIR e Payback.", estimatedDays: 1, module: 'Financeiro' }
];

export const generateInitialProjectTasks = (startDateString?: string): TimelineTask[] => {
  const baseDate = startDateString ? new Date(startDateString) : new Date();
  let currentOffset = 0;
  return CONSULTING_MANUAL_TASKS.map((template, index) => {
    const dueDate = new Date(baseDate);
    dueDate.setDate(baseDate.getDate() + currentOffset + template.estimatedDays);
    currentOffset += template.estimatedDays;
    return { id: `task-${Date.now()}-${index}`, title: template.title, description: template.description, module: template.module, estimatedDays: template.estimatedDays, completed: false, dueDate: dueDate.toISOString().split('T')[0] };
  });
};