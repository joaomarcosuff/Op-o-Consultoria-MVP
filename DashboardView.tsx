import React, { useState } from 'react';
import { Card, Button } from './Shared';
import { Task } from './types';
import { CheckCircle, AlertCircle, ArrowLeft, ArrowRight, User } from 'lucide-react';

interface DashboardViewProps {
  tasks: Task[];
  onUpdateTask: (taskId: string, status: Task['status']) => void;
}

export const DashboardView = ({ tasks, onUpdateTask }: DashboardViewProps) => {
  const [filterType, setFilterType] = useState<'all' | 'project' | 'training' | 'general'>('all');
  const [onlyMyTasks, setOnlyMyTasks] = useState(false);

  const normalizeString = (str: string) => {
      return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  };

  const filteredTasks = tasks.filter(t => {
    const typeMatch = filterType === 'all' || t.type === filterType;
    const currentUser = "Eu";
    const assigneeMatch = onlyMyTasks 
        ? normalizeString(t.assignee || "").includes(normalizeString(currentUser)) 
        : true;
    return typeMatch && assigneeMatch;
  });

  const getPriorityColor = (priority: Task['priority']) => {
      switch(priority) {
          case 'high': return 'bg-red-100 text-red-800 border-red-200';
          case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
          case 'low': return 'bg-green-100 text-green-800 border-green-200';
          default: return 'bg-gray-100 text-gray-800';
      }
  };

  const isOverdue = (dateStr: string, status: string) => {
      if (status === 'done') return false;
      return new Date(dateStr) < new Date();
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-[#0b0b45]">Gestão de Tarefas</h2>
        <div className="flex gap-2">
            <select className="border border-gray-300 rounded px-3 py-2" value={filterType} onChange={(e) => setFilterType(e.target.value as any)}>
                <option value="all">Todas Categorias</option>
                <option value="project">Projetos</option>
                <option value="training">Treinamento</option>
                <option value="general">Geral</option>
            </select>
            <Button variant={onlyMyTasks ? 'primary' : 'outline'} onClick={() => setOnlyMyTasks(!onlyMyTasks)}>
                {onlyMyTasks ? 'Minhas' : 'Todas'}
            </Button>
        </div>
      </div>
      <div className="flex gap-4 overflow-x-auto h-full pb-4">
        {['todo', 'doing', 'done'].map((status) => (
            <div key={status} className="min-w-[300px] bg-gray-50 rounded-lg p-4 flex flex-col h-full border border-gray-200 flex-1">
                <h3 className="font-bold text-[#0b0b45] mb-4 uppercase text-sm border-b pb-2 flex justify-between">
                    {status === 'todo' ? 'A Fazer' : status === 'doing' ? 'Em Andamento' : 'Concluído'}
                    <span className="bg-white px-2 py-0.5 rounded shadow-sm font-mono text-xs">
                        {filteredTasks.filter(t => t.status === status).length}
                    </span>
                </h3>
                <div className="space-y-3 overflow-y-auto flex-1">
                    {filteredTasks.filter(t => t.status === status).map(task => (
                        <Card key={task.id} className="p-4 hover:shadow-md transition-shadow relative group">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800">{task.type}</span>
                                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${getPriorityColor(task.priority)}`}>{task.priority}</span>
                            </div>
                            <p className="font-semibold text-gray-800 mb-4">{task.title}</p>
                            <div className="flex justify-between items-center text-xs">
                                <div className="flex items-center gap-1 text-gray-500"><User size={12} /><span>{task.assignee}</span></div>
                                <span className={isOverdue(task.dueDate, status) ? 'text-red-600 font-bold' : 'text-gray-500'}>
                                    {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                                </span>
                            </div>
                            <div className="mt-3 flex justify-between border-t pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                {status !== 'todo' && <button onClick={() => onUpdateTask(task.id, status === 'done' ? 'doing' : 'todo')} className="text-xs text-gray-500"><ArrowLeft size={12}/> Voltar</button>}
                                {status !== 'done' && <button onClick={() => onUpdateTask(task.id, status === 'todo' ? 'doing' : 'done')} className="text-xs text-[#ff9933]">Avançar <ArrowRight size={12}/></button>}
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};