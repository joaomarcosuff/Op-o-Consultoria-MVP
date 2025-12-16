import React from 'react';
import { Card, Button, Input } from '../components/Shared';
import { User, PlayCircle } from 'lucide-react';

export const LoginView = ({ onLogin }: { onLogin: () => void }) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate auth
    if (email && password) onLogin();
  };

  const handleDemo = () => {
    onLogin();
  };

  return (
    <div className="min-h-screen bg-[#d9d9d9] flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-t-4 border-[#ff9933]">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-[#0b0b45] p-3 rounded-full mb-3">
            <User size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#0b0b45]">Opção Consultoria</h1>
          <p className="text-gray-500">Plataforma de Gestão Integrada</p>
        </div>
        <form onSubmit={handleSubmit}>
          <Input label="Email Corporativo" value={email} onChange={(e: any) => setEmail(e.target.value)} placeholder="usuario@opcaoconsultoria.com.br" />
          <Input label="Senha" type="password" value={password} onChange={(e: any) => setPassword(e.target.value)} />
          
          <div className="space-y-3 mt-6">
            <Button variant="primary" className="w-full" onClick={handleSubmit}>
                Entrar no Sistema
            </Button>
            
            <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="flex-shrink-0 mx-4 text-gray-400 text-xs">OU</span>
                <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <Button variant="outline" className="w-full" onClick={handleDemo} type="button">
               <PlayCircle size={18} />
               Modo Demonstração
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};