import React from 'react';
import { Card, Button } from '../components/Shared';
import { TimelineData } from '../types';
import { generateInitialProjectTasks } from '../data/projectTemplates';
import { CheckSquare, Square, Info } from 'lucide-react';

interface TimelineViewProps {
    data: TimelineData;
    onUpdate: (data: TimelineData) => void;
    startDate?: string;
}

export const TimelineView = ({ data, onUpdate, startDate }: TimelineViewProps) => {
  
  const toggleTask = (taskId: string) => {
      const newTasks = data.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t);
      onUpdate({ ...data, tasks: newTasks });
  };

  const progress = data.tasks.length > 0 
    ? Math.round((data.tasks.filter(t => t.completed).length / data.tasks.length) * 100) 
    : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#0b0b45]">Cronograma de Implantação</h2>
        {data.tasks.length === 0 && (
            <Button onClick={() => onUpdate({ tasks: generateInitialProjectTasks(startDate) })}>
                Gerar Cronograma Padrão
            </Button>
        )}
      </div>
      
      <Card className="bg-gradient-to-r from-[#0b0b45] to-[#1a1a5c] text-white">
          <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">Progresso Global</span>
              <span className="font-bold text-2xl">{progress}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3">
              <div className="bg-[#ff9933] h-3 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
          </div>
          {startDate && <p className="text-xs text-gray-300 mt-2">Início do Projeto: {new Date(startDate).toLocaleDateString('pt-BR')}</p>}
      </Card>

      <div className="grid grid-cols-1 gap-6">
        <Card>
            <h3 className="font-semibold mb-4 text-[#0b0b45]">Etapas do Projeto</h3>
            <div className="space-y-3">
                {data.tasks.length === 0 && (
                    <div className="text-center py-12 bg-gray-50 rounded border border-dashed border-gray-300">
                        <p className="text-gray-500 mb-4">Nenhuma tarefa definida para este projeto.</p>
                        <p className="text-sm text-gray-400">Clique no botão acima para carregar o roteiro de consultoria.</p>
                    </div>
                )}
                {data.tasks.map(task => (
                    <div key={task.id} className="group p-4 hover:bg-gray-50 rounded border border-gray-100 hover:border-gray-200 transition-all shadow-sm">
                        <div className="flex items-start gap-3">
                            <button 
                                onClick={() => toggleTask(task.id)}
                                className="mt-1 text-gray-400 hover:text-[#0b0b45] transition-colors"
                            >
                                {task.completed ? <CheckSquare className="text-[#0b0b45]" size={24} /> : <Square size={24} />}
                            </button>
                            
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h4 className={`font-semibold ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                                        {task.title}
                                    </h4>
                                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">
                                        {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                                    </span>
                                </div>
                                
                                {task.description && (
                                    <p className={`text-sm mt-1 ${task.completed ? 'text-gray-300' : 'text-gray-600'}`}>
                                        {task.description}
                                    </p>
                                )}

                                <div className="flex gap-2 mt-2">
                                    {task.module && (
                                        <span className="text-[10px] uppercase font-bold text-[#ff9933] bg-[#ff9933]/10 px-2 py-0.5 rounded">
                                            {task.module}
                                        </span>
                                    )}
                                    {task.estimatedDays && (
                                        <span className="text-[10px] text-gray-400 border border-gray-200 px-2 py-0.5 rounded">
                                            ~{task.estimatedDays} dias
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
      </div>
    </div>
  );
};