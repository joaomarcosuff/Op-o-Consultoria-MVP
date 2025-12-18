import React, { useState } from 'react';
import { Card, Button, Input } from '../components/Shared';
import { User, PlayCircle, Loader2 } from 'lucide-react';
import { signInWithEmailAndPassword, signInAnonymously } from 'firebase/auth';
import { auth } from '../firebase';

export const LoginView = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError('Falha ao entrar. Verifique suas credenciais.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async () => {
    setLoading(true);
    try {
      await signInAnonymously(auth);
    } catch (err) {
      setError('Erro ao entrar no modo demo.');
    } finally {
      setLoading(false);
    }
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
        
        <form onSubmit={handleLogin}>
          <Input 
            label="Email Corporativo" 
            value={email} 
            onChange={(e: any) => setEmail(e.target.value)} 
            placeholder="usuario@exemplo.com" 
          />
          <Input 
            label="Senha" 
            type="password" 
            value={password} 
            onChange={(e: any) => setPassword(e.target.value)} 
          />
          
          {error && <p className="text-red-500 text-xs mb-4">{error}</p>}
          
          <div className="space-y-3 mt-6">
            <Button variant="primary" className="w-full" disabled={loading} onClick={handleLogin}>
                {loading ? <Loader2 className="animate-spin" size={18} /> : 'Entrar no Sistema'}
            </Button>
            
            <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="flex-shrink-0 mx-4 text-gray-400 text-xs">OU</span>
                <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <Button variant="outline" className="w-full" onClick={handleDemo} type="button" disabled={loading}>
               <PlayCircle size={18} />
               Modo Demonstração (Anônimo)
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};