
import React from 'react';
import { BarChart2, Edit2, Activity } from 'lucide-react';
import { PollConfig } from '../types';

interface FanPulseProps {
  config: PollConfig;
  isAdminMode: boolean;
  onUpdateConfig: (newConfig: PollConfig) => void;
  hasVoted: boolean;
  onVote: (optionId: string) => void;
}

const FanPulse: React.FC<FanPulseProps> = ({ config, isAdminMode, onUpdateConfig, hasVoted, onVote }) => {

  const totalVotes = config.options.reduce((acc, curr) => acc + curr.votes, 0);

  const handleQuestionChange = (newQ: string) => {
    onUpdateConfig({ ...config, question: newQ });
  };

  const handleOptionLabelChange = (id: string, newLabel: string) => {
    const newOptions = config.options.map(opt => opt.id === id ? { ...opt, label: newLabel } : opt);
    onUpdateConfig({ ...config, options: newOptions });
  };

  return (
    <section className="py-16 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/40 via-black to-black border-y border-white/5 relative overflow-hidden">
      {/* Glow de fondo decorativo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        
        {/* Header Fan Pulse Destacado */}
        <div className="flex justify-center mb-8">
             <div className="inline-flex items-center gap-3 bg-black border border-purple-500 px-8 py-3 rounded-full shadow-[0_0_25px_rgba(168,85,247,0.3)] animate-pulse-slow">
                <Activity size={20} className="text-purple-400" />
                <span className="text-base font-black uppercase tracking-[0.3em] text-white">
                    Fan Pulse
                </span>
             </div>
        </div>

        {/* Título Editable */}
        <div className="mb-12">
            {isAdminMode ? (
                <div className="relative inline-block w-full max-w-2xl">
                    <input 
                        value={config.question}
                        onChange={(e) => handleQuestionChange(e.target.value)}
                        className="w-full bg-black/50 border-b-2 border-wc-blue text-3xl md:text-6xl font-black text-white text-center outline-none py-2 uppercase italic"
                        placeholder="ESCRIBE LA PREGUNTA..."
                    />
                    <Edit2 size={16} className="absolute top-0 right-0 text-wc-blue opacity-50" />
                </div>
            ) : (
                <h2 className="text-4xl md:text-7xl font-black text-white uppercase italic leading-none drop-shadow-[0_4px_15px_rgba(147,51,234,0.6)]">
                    {config.question}
                </h2>
            )}
        </div>

        {/* Opciones de Voto */}
        <div className="grid grid-cols-1 gap-4 max-w-2xl mx-auto">
          {config.options.map((opt) => {
            const percent = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
            
            return (
              <div 
                key={opt.id} 
                className={`relative bg-zinc-900/80 backdrop-blur-md rounded-xl overflow-hidden h-20 cursor-pointer group border-2 transition-all ${hasVoted ? 'border-zinc-800' : 'border-zinc-800 hover:border-purple-500 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:scale-[1.02]'}`}
                onClick={() => !hasVoted && !isAdminMode && onVote(opt.id)}
              >
                {/* Barra de Progreso */}
                <div 
                  className={`absolute top-0 left-0 h-full ${opt.color} opacity-30 transition-all duration-1000 ease-out`} 
                  style={{ width: hasVoted || isAdminMode ? `${percent}%` : '0%' }}
                ></div>
                
                <div className="absolute inset-0 flex items-center justify-between px-8 z-10">
                    {/* Label Editable */}
                    {isAdminMode ? (
                        <input 
                            value={opt.label}
                            onChange={(e) => handleOptionLabelChange(opt.id, e.target.value)}
                            onClick={(e) => e.stopPropagation()} // Evitar votar al clickear input
                            className="bg-transparent border-b border-white/30 text-white font-bold text-xl w-2/3 outline-none focus:border-wc-blue"
                        />
                    ) : (
                        <span className="font-bold text-white text-xl md:text-2xl group-hover:translate-x-2 transition-transform shadow-black drop-shadow-md flex items-center gap-2 uppercase italic">
                            {opt.label}
                        </span>
                    )}

                    {/* Porcentaje / Votos */}
                    {(hasVoted || isAdminMode) && (
                        <div className="flex flex-col items-end">
                            <span className="font-mono font-black text-3xl text-white animate-fade-in drop-shadow-md">{percent}%</span>
                            {isAdminMode && <span className="text-[10px] text-gray-400">{opt.votes} votos</span>}
                        </div>
                    )}
                </div>
              </div>
            )
          })}
        </div>
        
        <p className="text-xs text-gray-500 mt-8 uppercase tracking-widest font-bold flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            {totalVotes.toLocaleString()} Votos Registrados
        </p>
      </div>
    </section>
  );
};

export default FanPulse;
