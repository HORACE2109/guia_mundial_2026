
import React, { useState, useRef } from 'react';
import { Edit2, Save, Eye, EyeOff, Trophy, Camera, Medal } from 'lucide-react';
import { BracketMatch, BracketTeam } from '../types';

interface BracketSectionProps {
  matches: BracketMatch[];
  isActive: boolean;
  isAdminMode: boolean;
  onUpdate: (matches: BracketMatch[]) => void;
  onToggleActive: (active: boolean) => void;
}

const BracketSection: React.FC<BracketSectionProps> = ({ matches, isActive, isAdminMode, onUpdate, onToggleActive }) => {
  const [editingMatchId, setEditingMatchId] = useState<string | null>(null);
  const [tempMatch, setTempMatch] = useState<BracketMatch | null>(null);

  const team1FlagRef = useRef<HTMLInputElement>(null);
  const team2FlagRef = useRef<HTMLInputElement>(null);

  if (!isActive && !isAdminMode) return null;

  const getMatch = (id: string) => matches.find(m => m.id === id);

  const handleEditClick = (match: BracketMatch) => {
    setEditingMatchId(match.id);
    setTempMatch(JSON.parse(JSON.stringify(match)));
  };

  const handleSave = () => {
    if (tempMatch) {
      const updatedMatches = matches.map(m => m.id === tempMatch.id ? tempMatch : m);
      onUpdate(updatedMatches);
      setEditingMatchId(null);
      setTempMatch(null);
    }
  };

  const updateTeam = (teamKey: 'team1' | 'team2', field: keyof BracketTeam, value: any) => {
      if (tempMatch) {
          setTempMatch({ ...tempMatch, [teamKey]: { ...tempMatch[teamKey], [field]: value } });
      }
  };

  const handleFlagUpload = (teamKey: 'team1' | 'team2', e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && tempMatch) {
          const reader = new FileReader();
          reader.onloadend = () => {
              updateTeam(teamKey, 'flag', reader.result as string);
          };
          reader.readAsDataURL(file);
      }
  };

  const MatchCard = ({ id, isFinal = false }: { id: string, isFinal?: boolean }) => {
    const match = editingMatchId === id ? tempMatch : getMatch(id);
    const isEditing = editingMatchId === id;

    if (!match) return null;

    return (
      <div className={`relative bg-zinc-900 border ${isFinal ? 'border-yellow-500/50 shadow-[0_0_25px_rgba(234,179,8,0.2)] scale-105 z-10' : 'border-zinc-700 hover:border-wc-blue'} rounded-xl p-3 w-56 md:w-72 mb-4 flex flex-col gap-2 transition-all group shadow-lg`}>
        
        <div className="flex justify-between items-center mb-1 px-1 border-b border-zinc-800 pb-1">
             <span className="text-[10px] md:text-xs uppercase font-bold text-gray-400 tracking-widest">{match.label}</span>
             {isAdminMode && !isEditing && (
                 <button onClick={() => handleEditClick(match)} className="bg-white text-black p-1.5 rounded-full hover:bg-gray-200 shadow-sm hover:scale-110 transition-transform border border-black"><Edit2 size={12}/></button>
             )}
             {isAdminMode && isEditing && (
                 <button onClick={handleSave} className="bg-[#a3ff00] text-black p-1.5 rounded-full hover:bg-white shadow-sm hover:scale-110 transition-transform border border-black"><Save size={12}/></button>
             )}
        </div>

        <TeamRow 
            team={match.team1} 
            isEditing={isEditing} 
            onNameChange={(val: string) => updateTeam('team1', 'name', val)}
            onScoreChange={(val: string) => updateTeam('team1', 'score', val)}
            onFlagClick={() => team1FlagRef.current?.click()}
            fileRef={team1FlagRef}
            onFileChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFlagUpload('team1', e)}
        />
        
        {!isEditing && <div className="h-px bg-zinc-800 w-full my-0 opacity-50"></div>}

        <TeamRow 
            team={match.team2} 
            isEditing={isEditing} 
            onNameChange={(val: string) => updateTeam('team2', 'name', val)}
            onScoreChange={(val: string) => updateTeam('team2', 'score', val)}
            onFlagClick={() => team2FlagRef.current?.click()}
            fileRef={team2FlagRef}
            onFileChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFlagUpload('team2', e)}
        />
      </div>
    );
  };

  const TeamRow = ({ team, isEditing, onNameChange, onScoreChange, onFlagClick, fileRef, onFileChange }: any) => (
      <div className={`flex items-center justify-between p-2 rounded-lg transition-colors ${isEditing ? 'bg-black border border-zinc-700' : 'hover:bg-zinc-800/50'}`}>
          <div className="flex items-center gap-3 flex-grow overflow-hidden">
              <div className="relative group/flag cursor-pointer shrink-0" onClick={isEditing ? onFlagClick : undefined}>
                  <div className="w-8 h-5 bg-zinc-800 rounded shadow-sm overflow-hidden border border-zinc-600 flex items-center justify-center">
                      {team.flag ? <img src={team.flag} className="w-full h-full object-cover" alt="Flag"/> : null}
                  </div>
                  {isEditing && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover/flag:opacity-100 transition-opacity">
                          <Camera size={10} className="text-white"/>
                      </div>
                  )}
                  <input type="file" ref={fileRef} className="hidden" accept="image/*" onChange={onFileChange} />
              </div>
              
              {isEditing ? (
                  <input 
                    value={team.name} 
                    onChange={(e) => onNameChange(e.target.value)} 
                    className="bg-transparent text-white text-xs font-bold w-full outline-none placeholder-gray-600 uppercase"
                    placeholder="NOMBRE..."
                  />
              ) : (
                  <span className={`text-sm md:text-base font-bold truncate ${!team.name || team.name === 'TBD' ? 'text-gray-600 italic' : 'text-white'}`}>
                      {team.name || 'A definir'}
                  </span>
              )}
          </div>
          <div className="ml-2">
               {isEditing ? (
                  <input 
                    value={team.score || ''} 
                    onChange={(e) => onScoreChange(e.target.value)} 
                    className="bg-zinc-800 text-white text-sm font-mono font-bold w-8 text-center rounded outline-none focus:border-wc-blue border border-zinc-700 py-0.5"
                    placeholder="-"
                  />
              ) : (
                  <span className="font-mono text-base md:text-lg font-black text-wc-blue">{team.score}</span>
              )}
          </div>
      </div>
  );

  return (
    <section className={`py-16 bg-wc-black border-t border-zinc-800 relative overflow-x-auto custom-scrollbar ${!isActive ? 'opacity-50 grayscale' : ''}`}>
      <div className="min-w-[1000px] max-w-7xl mx-auto px-4 md:px-8">
        
        {isAdminMode && (
            <div className="absolute top-4 left-4 z-10">
                <button 
                    onClick={() => onToggleActive(!isActive)}
                    className={`flex items-center gap-2 px-6 py-2 rounded-full font-black text-xs transition-all border-2 border-white shadow-lg hover:scale-105 ${isActive ? 'bg-purple-600 text-white' : 'bg-red-600 text-white'}`}
                >
                    {isActive ? <><Eye size={14}/> LLAVES VISIBLES</> : <><EyeOff size={14}/> LLAVES OCULTAS</>}
                </button>
            </div>
        )}

        <div className="text-center mb-16">
             <div className="inline-flex items-center gap-2 bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 px-6 py-2 rounded-full mb-4 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                <Medal size={16} />
                <span className="text-xs font-black uppercase tracking-[0.2em]">Camino a la Gloria</span>
             </div>
             <h2 className="text-5xl md:text-7xl font-black uppercase italic leading-none text-white tracking-tighter">
                FASE <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">FINAL</span>
             </h2>
        </div>

        <div className="flex justify-center items-center relative scale-100 origin-top pb-10">
            <div className="flex gap-10">
                <div className="flex flex-col gap-8 justify-center">
                    <div className="relative">
                        <MatchCard id="qf1" />
                        <div className="absolute top-1/2 -right-8 w-8 h-0.5 bg-zinc-700"></div>
                        <div className="absolute top-1/2 -right-8 w-0.5 h-[120%] bg-zinc-700 origin-top"></div>
                    </div>
                    <div className="relative">
                        <MatchCard id="qf2" />
                        <div className="absolute top-1/2 -right-8 w-8 h-0.5 bg-zinc-700"></div>
                        <div className="absolute bottom-1/2 -right-8 w-0.5 h-[120%] bg-zinc-700 origin-bottom"></div>
                    </div>
                </div>
                <div className="flex flex-col justify-center relative">
                     <div className="w-8 h-0.5 bg-zinc-700 absolute top-1/2 -left-8"></div>
                     <MatchCard id="sf1" />
                     <div className="w-8 h-0.5 bg-zinc-700 absolute top-1/2 -right-8"></div>
                </div>
            </div>
            <div className="flex flex-col items-center justify-center px-10 relative -mt-12">
                <div className="mb-6 drop-shadow-[0_0_45px_rgba(234,179,8,0.5)] animate-float">
                    <Trophy size={100} className="text-yellow-400" strokeWidth={1} />
                </div>
                <MatchCard id="final" isFinal />
                <div className="mt-6 text-center bg-zinc-900 border border-yellow-500/20 px-6 py-2 rounded-full shadow-lg">
                    <span className="text-yellow-500 text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
                        <Medal size={14}/> 19 de Julio • New York / NJ
                    </span>
                </div>
            </div>
             <div className="flex gap-10 flex-row-reverse">
                <div className="flex flex-col gap-8 justify-center">
                    <div className="relative">
                        <MatchCard id="qf3" />
                        <div className="absolute top-1/2 -left-8 w-8 h-0.5 bg-zinc-700"></div>
                        <div className="absolute top-1/2 -left-8 w-0.5 h-[120%] bg-zinc-700 origin-top"></div>
                    </div>
                    <div className="relative">
                        <MatchCard id="qf4" />
                        <div className="absolute top-1/2 -left-8 w-8 h-0.5 bg-zinc-700"></div>
                        <div className="absolute bottom-1/2 -left-8 w-0.5 h-[120%] bg-zinc-700 origin-bottom"></div>
                    </div>
                </div>
                <div className="flex flex-col justify-center relative">
                     <div className="w-8 h-0.5 bg-zinc-700 absolute top-1/2 -right-8"></div>
                     <MatchCard id="sf2" />
                     <div className="w-8 h-0.5 bg-zinc-700 absolute top-1/2 -left-8"></div>
                </div>
            </div>
        </div>

      </div>
    </section>
  );
};

export default BracketSection;
