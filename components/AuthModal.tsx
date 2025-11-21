
import React, { useState } from 'react';
import { Lock, ChevronRight, ShieldCheck, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(false);

    // Simulación de verificación (en el futuro esto consultará a Supabase)
    setTimeout(() => {
      if (password === 'admin2026') {
        onLogin();
        setPassword('');
        onClose();
      } else {
        setError(true);
        // Efecto de vibración en error
        const input = document.getElementById('password-input');
        input?.classList.add('animate-shake');
        setTimeout(() => input?.classList.remove('animate-shake'), 500);
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop con blur */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

      <div className="relative bg-zinc-900 w-full max-w-md rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden animate-fade-in-up">
        
        {/* Header Decorativo */}
        <div className="h-2 bg-gradient-to-r from-wc-blue via-wc-green to-wc-purple"></div>
        
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-800 mb-4 border border-zinc-700 shadow-[0_0_15px_rgba(0,234,255,0.1)]">
              <Lock size={32} className="text-wc-blue" />
            </div>
            <h2 className="text-2xl font-bold text-white uppercase italic tracking-wider">Acceso Admin</h2>
            <p className="text-gray-500 text-sm mt-2">Ingresa tus credenciales para editar el contenido.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <input 
                id="password-input"
                type="password" 
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(false); }}
                className={`w-full bg-black border-2 rounded-lg py-4 px-4 text-white text-center text-lg tracking-[0.5em] font-mono focus:outline-none transition-all placeholder:tracking-normal ${error ? 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]' : 'border-zinc-700 focus:border-wc-blue'}`}
                placeholder="••••••"
                autoFocus
              />
              {error && (
                <div className="absolute -bottom-6 left-0 w-full flex justify-center items-center text-red-500 text-xs font-bold mt-2 animate-fade-in">
                   <AlertCircle size={12} className="mr-1"/> CONTRASEÑA INCORRECTA
                </div>
              )}
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-black font-black py-4 rounded-lg hover:bg-wc-blue transition-colors flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  INGRESAR <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="bg-zinc-950 p-4 text-center border-t border-zinc-800">
           <p className="text-[10px] text-gray-600 uppercase tracking-widest flex items-center justify-center gap-1">
             <ShieldCheck size={10} /> Panel Seguro • Guía Mundial 2026
           </p>
        </div>

      </div>
    </div>
  );
};

export default AuthModal;
