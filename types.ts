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
  assignee: string;
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

export interface Project {
  id: string;
  title: string;
  client: string;
  status: 'planning' | 'execution' | 'review' | 'completed';
  startDate: string;
  financialData: FinancialData;
  marketingData: any;
  sectorData: any;
  supplyData: any;
  marketResearch: any;
  organizationData: any;
  operationalData: any;
  timelineData: any;
}