import React, { useState } from 'react';
import { Card, Button } from '../components/Shared';
import { Task } from '../types';
import { CheckCircle, AlertCircle, ArrowLeft, ArrowRight, User } from 'lucide-react';

interface DashboardViewProps {
  tasks: Task[];
  onUpdateTask: (taskId: string, status: Task['status']) => void;
}

export const DashboardView = ({ tasks, onUpdateTask }: DashboardViewProps) => {
  const [filterType, setFilterType] = useState<'all' | 'project' | 'training' | 'general'>('all');
  const [onlyMyTasks, setOnlyMyTasks] = useState(false);

  // Helper function: Normalize strings for comparison (remove accents, lowercase)
  const normalizeString = (str: string) => {
      return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  };

  const filteredTasks = tasks.filter(t => {
    const typeMatch = filterType === 'all' || t.type === filterType;
    const currentUser = "Eu"; // Mocked current user
    const assigneeMatch = onlyMyTasks 
        ? normalizeString(t.assignee).includes(normalizeString(currentUser)) 
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

  const getTypeColor = (type: Task['type']) => {
      switch(type) {
          case 'project': return 'bg-blue-100 text-blue-800';
          case 'training': return 'bg-purple-100 text-purple-800';
          case 'general': return 'bg-gray-100 text-gray-800';
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
        <div className="flex gap-2 w-full md:w-auto">
            <select 
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#ff9933] flex-1 md:flex-none"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
            >
                <option value="all">Todas Categorias</option>
                <option value="project">Projetos</option>
                <option value="training">Treinamento</option>
                <option value="general">Geral</option>
            </select>
            <Button 
                variant={onlyMyTasks ? 'primary' : 'outline'} 
                onClick={() => setOnlyMyTasks(!onlyMyTasks)}
                className="text-sm whitespace-nowrap"
            >
                {onlyMyTasks ? 'Minhas Tarefas' : 'Todas as Tarefas'}
            </Button>
        </div>
      </div>

      {/* Kanban Board - Snap Scrolling on Mobile */}
      <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory h-full pb-4 scrollbar-hide">
        {['todo', 'doing', 'done'].map((status) => (
            <div key={status} className="min-w-[85vw] md:min-w-[300px] snap-center bg-gray-50 rounded-lg p-4 flex flex-col h-full border border-gray-200 shadow-sm md:flex-1">
                <h3 className="font-bold text-[#0b0b45] mb-4 uppercase text-sm tracking-wider flex items-center justify-between border-b pb-2">
                    {status === 'todo' && 'A Fazer'}
                    {status === 'doing' && 'Em Andamento'}
                    {status === 'done' && 'Concluído'}
                    <span className="bg-white px-2 py-1 rounded shadow-sm text-xs font-mono">
                        {filteredTasks.filter(t => t.status === status).length}
                    </span>
                </h3>
                
                <div className="space-y-3 overflow-y-auto flex-1 pr-1">
                    {filteredTasks.filter(t => t.status === status).map(task => (
                        <Card key={task.id} className="p-4 hover:shadow-md transition-shadow relative group">
                            {/* Header: Badges */}
                            <div className="flex justify-between items-start mb-2">
                                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${getTypeColor(task.type)}`}>
                                    {task.type}
                                </span>
                                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${getPriorityColor(task.priority)}`}>
                                    {task.priority}
                                </span>
                            </div>
                            
                            {/* Body: Title */}
                            <p className="font-semibold text-gray-800 mb-4 leading-tight">{task.title}</p>
                            
                            {/* Footer: User & Date */}
                            <div className="flex justify-between items-center text-xs">
                                <div className="flex items-center gap-1 text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                    <User size={12} />
                                    <span className="truncate max-w-[80px]">{task.assignee}</span>
                                </div>
                                <span className={`${isOverdue(task.dueDate, status) ? 'text-red-600 font-bold flex items-center gap-1' : 'text-gray-500'}`}>
                                    {isOverdue(task.dueDate, status) && <AlertCircle size={12}/>}
                                    {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                                </span>
                            </div>

                            {/* Actions Buttons */}
                            <div className="mt-3 flex justify-between border-t pt-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                <div>
                                    {status !== 'todo' && (
                                        <button 
                                            onClick={() => onUpdateTask(task.id, status === 'done' ? 'doing' : 'todo')} 
                                            className="p-1 hover:bg-gray-100 rounded text-gray-600 flex items-center gap-1 text-xs"
                                            title="Mover para trás"
                                        >
                                            <ArrowLeft size={14} /> Voltar
                                        </button>
                                    )}
                                </div>
                                <div>
                                    {status !== 'done' && (
                                        <button 
                                            onClick={() => onUpdateTask(task.id, status === 'todo' ? 'doing' : 'done')} 
                                            className="p-1 hover:bg-[#ff9933]/10 rounded text-[#ff9933] flex items-center gap-1 text-xs font-semibold"
                                            title="Avançar"
                                        >
                                            Avançar <ArrowRight size={14} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))}
                    {filteredTasks.filter(t => t.status === status).length === 0 && (
                        <div className="text-center py-8 opacity-40">
                            <CheckCircle size={32} className="mx-auto mb-2" />
                            <p className="text-sm">Tudo limpo por aqui</p>
                        </div>
                    )}
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};