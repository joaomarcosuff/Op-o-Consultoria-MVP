export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'consultant' | 'client';
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  email?: string;
  phone?: string;
  value: number;
  probability: number;
  status: 'prospect' | 'meeting' | 'proposal' | 'closed_won' | 'closed_lost';
  lastContact: string;
  history: { date: string; note: string }[];
}

export interface Task {
  id: string;
  projectId?: string;
  title: string;
  type: 'project' | 'training' | 'general';
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'doing' | 'done';
  assignee: string; // user name
  dueDate: string;
}

export interface InvestmentBreakdown {
  reform: number;
  furniture: number;
  equipment: number;
  marketing: number;
  legal: number;
  workingCapital: number;
}

export interface FinancialData {
  initialInvestment: number;
  investmentBreakdown: InvestmentBreakdown;
  monthlyRevenue: number;
  monthlyCost: number;
  annualGrowthRate: number;
  taxRate: number;
  discountRate: number;
}

export interface Competitor {
  id: string;
  name: string;
  strength: string; 
  priceLevel: 'low' | 'medium' | 'high';
  type: 'direct' | 'indirect';
  channels: string;
  website?: string;
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  ratingPrice: number;
  ratingQuality: number;
  ratingDeadline: number;
}

export interface ActionPlanItem {
  id: string;
  what: string;
  why: string;
  who: string;
  when: string;
  where: string;
  how: string;
  howMuch: number;
  status: 'pending' | 'in_progress' | 'done';
}

export interface MarketingData {
  description: string;
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  mix: {
    product: string;
    price: string;
    place: string;
    promotion: string;
  };
  funnel: {
    top: string;
    middle: string;
    bottom: string;
  };
  actionPlan: ActionPlanItem[];
}

export interface PorterForces {
  rivalry: string;
  supplierPower: string;
  buyerPower: string;
  threatNewEntrants: string;
  threatSubstitutes: string;
}

export interface SectorData {
  overview: string;
  trends: string;
  porter: PorterForces;
}

export interface MarketResearchData {
  surveyLink: string;
  targetAudience: string;
  persona: string;
  dataAnalysis: string;
}

export interface Role {
  id: string;
  title: string;
  salary: number;
  quantity: number;
}

export interface OrganizationData {
  mission: string;
  vision: string;
  values: string;
  taxRegime: string;
  cnae: string;
  roles: Role[];
}

export interface OperationalData {
  layout: string;
  capacity: string;
  processes: string;
  logistics: string;
}

export interface TimelineTask {
  id: string;
  title: string;
  description?: string; // Adicionado
  module?: string;      // Adicionado
  estimatedDays?: number; // Adicionado
  completed: boolean;
  dueDate: string;
}

export interface TimelineData {
  tasks: TimelineTask[];
}

export interface Project {
  id: string;
  title: string;
  client: string;
  status: 'planning' | 'execution' | 'review' | 'completed';
  startDate: string;
  sectorData: SectorData;
  marketResearch: MarketResearchData;
  supplyData: {
    competitors: Competitor[];
    suppliers: Supplier[];
  };
  organizationData: OrganizationData;
  marketingData: MarketingData;
  operationalData: OperationalData;
  financialData: FinancialData;
  timelineData: TimelineData;
}