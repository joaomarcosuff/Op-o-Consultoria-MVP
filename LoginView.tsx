import React, { useState } from 'react';
import { Card, Button, Input } from './Shared';
import { User, PlayCircle, Loader2 } from 'lucide-react';
import { signInWithEmailAndPassword, signInAnonymously, OAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from './firebase';

export const LoginView = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    if (e) e.preventDefault();
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

  const handleMicrosoftLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const provider = new OAuthProvider('microsoft.com');
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      setError('Erro ao autenticar com a Microsoft. Verifique se os pop-ups estão permitidos.');
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
          
          {error && <p className="text-red-500 text-xs mb-4 text-center">{error}</p>}
          
          <div className="space-y-3 mt-6">
            <Button variant="primary" className="w-full" disabled={loading} onClick={handleLogin}>
                {loading ? <Loader2 className="animate-spin" size={18} /> : 'Entrar no Sistema'}
            </Button>
            
            <button 
              type="button"
              onClick={handleMicrosoftLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-4 py-2 border border-gray-300 rounded bg-white hover:bg-gray-50 transition-colors text-gray-700 font-medium"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 23 23" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#f3f3f3" d="M0 0h23v23H0z"/>
                    <path fill="#f25022" d="M1 1h10v10H1z"/>
                    <path fill="#7fba00" d="M12 1h10v10H12z"/>
                    <path fill="#00a4ef" d="M1 12h10v10H1z"/>
                    <path fill="#ffb900" d="M12 12h10v10H12z"/>
                  </svg>
                  Login com Microsoft
                </>
              )}
            </button>
            
            <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="flex-shrink-0 mx-4 text-gray-400 text-xs uppercase">ou</span>
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