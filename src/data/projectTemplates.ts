import { TimelineTask } from '../types';

export const PROJECT_STAGES = [
  { id: 'sector', title: 'Análise Setorial', icon: 'PieChart' },
  { id: 'market', title: 'Pesquisa Mercado', icon: 'Search' },
  { id: 'supply', title: 'Oferta & Concorrência', icon: 'Users' },
  { id: 'org', title: 'Organização & RH', icon: 'Briefcase' },
  { id: 'operational', title: 'Plano Operacional', icon: 'Settings' },
  { id: 'marketing', title: 'Marketing & Vendas', icon: 'Megaphone' },
  { id: 'financial', title: 'Viabilidade Financeira', icon: 'DollarSign' },
  { id: 'timeline', title: 'Cronograma', icon: 'Calendar' },
];

export const KANBAN_COLUMNS = [
  { id: 'prospect', title: 'Prospecção' },
  { id: 'meeting', title: 'Reunião Agendada' },
  { id: 'proposal', title: 'Proposta Enviada' },
  { id: 'closed_won', title: 'Fechado (Ganho)' },
];

export const CONSULTING_MANUAL_TASKS = [
  // --- MÓDULO 1: ANÁLISE SETORIAL ---
  {
    title: "Levantamento de Dados Macroeconômicos",
    description: "Pesquisar indicadores atuais (IPCA, SELIC, PIB) e tendências do setor em fontes confiáveis (IBGE, Associações de Classe).",
    estimatedDays: 2,
    module: 'Setorial'
  },
  {
    title: "Análise das 5 Forças de Porter",
    description: "Mapear a intensidade da concorrência, poder de barganha e barreiras de entrada no setor específico do cliente.",
    estimatedDays: 1,
    module: 'Setorial'
  },

  // --- MÓDULO 2: PESQUISA DE MERCADO ---
  {
    title: "Definição de Público-Alvo e Persona",
    description: "Determinar características demográficas e psicográficas do cliente ideal.",
    estimatedDays: 2,
    module: 'Mercado'
  },
  {
    title: "Criação e Disparo de Pesquisa",
    description: "Elaborar formulário (Google Forms/Typeform) e definir canais de distribuição para coleta de dados.",
    estimatedDays: 3,
    module: 'Mercado'
  },
  {
    title: "Tabulação e Análise de Dados",
    description: "Compilar respostas da pesquisa quantitativa e gerar insights qualitativos.",
    estimatedDays: 2,
    module: 'Mercado'
  },

  // --- MÓDULO 3: ANÁLISE DE OFERTA ---
  {
    title: "Mapeamento de Concorrentes",
    description: "Identificar 3-5 concorrentes diretos e indiretos, listando pontos fortes e fracos.",
    estimatedDays: 2,
    module: 'Oferta'
  },
  {
    title: "Cliente Oculto / Benchmarking",
    description: "Simular compra ou interagir com concorrentes para validar preços e atendimento.",
    estimatedDays: 3,
    module: 'Oferta'
  },

  // --- MÓDULO 4: PLANO OPERACIONAL ---
  {
    title: "Definição de Layout e Localização",
    description: "Estabelecer o arranjo físico e verificar adequação do imóvel.",
    estimatedDays: 2,
    module: 'Operacional'
  },
  {
    title: "Mapeamento de Processos Chave",
    description: "Desenhar o fluxograma operacional da produção ou serviço.",
    estimatedDays: 3,
    module: 'Operacional'
  },
  {
    title: "Planejamento Logístico",
    description: "Definir estoque mínimo, canais de distribuição e fornecimento.",
    estimatedDays: 2,
    module: 'Operacional'
  },

  // --- MÓDULO 5: ORGANIZAÇÃO ---
  {
    title: "Definição de Identidade Corporativa",
    description: "Validar ou criar Missão, Visão e Valores alinhados à estratégia.",
    estimatedDays: 1,
    module: 'Organizacao'
  },
  {
    title: "Estruturação de Organograma",
    description: "Definir cargos, descrições de função e hierarquia necessária para operação.",
    estimatedDays: 2,
    module: 'Organizacao'
  },
  {
    title: "Definição Tributária e Legal",
    description: "Consultar contador para definir melhor CNAE e regime tributário.",
    estimatedDays: 2,
    module: 'Organizacao'
  },

  // --- MÓDULO 6: MARKETING ---
  {
    title: "Definição do Mix de Marketing (4Ps)",
    description: "Estruturar estratégias de Produto, Preço, Praça e Promoção.",
    estimatedDays: 2,
    module: 'Marketing'
  },
  {
    title: "Análise SWOT Cruzada",
    description: "Relacionar Forças/Fraquezas com Oportunidades/Ameaças para gerar plano de ação.",
    estimatedDays: 1,
    module: 'Marketing'
  },
  {
    title: "Elaboração do Plano de Ação 5W2H",
    description: "Listar ações práticas orçadas para execução imediata.",
    estimatedDays: 2,
    module: 'Marketing'
  },

  // --- MÓDULO 7: FINANCEIRO ---
  {
    title: "Levantamento de Investimentos Iniciais",
    description: "Cotar reformas, móveis, equipamentos e custos de abertura.",
    estimatedDays: 3,
    module: 'Financeiro'
  },
  {
    title: "Projeção de Custos Fixos e Variáveis",
    description: "Estimar folha de pagamento, aluguel, CMV e impostos.",
    estimatedDays: 2,
    module: 'Financeiro'
  },
  {
    title: "Análise de Viabilidade Econômica",
    description: "Calcular VPL, TIR e Payback para validar o modelo de negócio.",
    estimatedDays: 1,
    module: 'Financeiro'
  }
];

// Helper Function to generate tasks
export const generateInitialProjectTasks = (startDateString?: string): TimelineTask[] => {
  // Use provided start date or fallback to today
  const start = startDateString ? new Date(startDateString) : new Date();
  
  // If the date string is invalid or undefined, default to today to avoid NaN errors
  const baseDate = isNaN(start.getTime()) ? new Date() : start;
  
  let currentOffset = 0;

  return CONSULTING_MANUAL_TASKS.map((template, index) => {
    const dueDate = new Date(baseDate);
    // Add offset days to the base date
    dueDate.setDate(baseDate.getDate() + currentOffset + template.estimatedDays);
    currentOffset += template.estimatedDays; // Sequential flow: next task starts after previous ends

    return {
        id: `task-${Date.now()}-${index}`,
        title: template.title,
        description: template.description,
        module: template.module,
        estimatedDays: template.estimatedDays,
        completed: false,
        dueDate: dueDate.toISOString().split('T')[0]
    };
  });
};