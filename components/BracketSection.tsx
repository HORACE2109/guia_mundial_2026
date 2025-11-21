
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
  // Estado temporal para edición
  const [tempMatch, setTempMatch] = useState<BracketMatch | null>(null);

  // Refs para inputs de archivos
  const team1FlagRef = useRef<HTMLInputElement>(null);
  const team2FlagRef = useRef<HTMLInputElement>(null);

  if (!isActive && !isAdminMode) return null;

  // Helpers para encontrar partidos por ID
  const getMatch = (id: string) => matches.find(m => m.id === id);

  // Handlers de Edición
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
          setTempMatch({
              ...tempMatch,
              [teamKey]: {
                  ...tempMatch[teamKey],
                  [field]: value
              }
          });
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

  // Subcomponente para una tarjeta de partido - VERSIÓN COMPACTA
  const MatchCard = ({ id, isFinal = false }: { id: string, isFinal?: boolean }) => {
    const match = editingMatchId === id ? tempMatch : getMatch(id);
    const isEditing = editingMatchId === id;

    if (!match) return null;

    // COMPACTO: w-40 md:w-48 (más chico para que entre en pantallas)
    return (
      <div className={`relative bg-zinc-900 border ${isFinal ? 'border-yellow-500/50 shadow-[0_0_20px_rgba(234,179,8,0.15)] scale-110 z-10' : 'border-zinc-700 hover:border-wc-blue'} rounded-md p-1.5 w-40 md:w-48 mb-2 flex flex-col gap-1 transition-all group`}>
        
        {/* Header Tarjeta */}
        <div className="flex justify-between items-center mb-0.5 px-1">
             <span className="text-[9px] uppercase font-bold text-gray-500 tracking-wider">{match.label}</span>
             {isAdminMode && !isEditing && (
                 <button onClick={() => handleEditClick(match)} className="text-gray-600 hover:text-wc-blue"><Edit2 size={10}/></button>
             )}
             {isAdminMode && isEditing && (
                 <button onClick={handleSave} className="text-wc-green hover:text-white"><Save size={12}/></button>
             )}
        </div>

        {/* Equipo 1 */}
        <TeamRow 
            team={match.team1} 
            isEditing={isEditing} 
            onNameChange={(val: string) => updateTeam('team1', 'name', val)}
            onScoreChange={(val: string) => updateTeam('team1', 'score', val)}
            onFlagClick={() => team1FlagRef.current?.click()}
            fileRef={team1FlagRef}
            onFileChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFlagUpload('team1', e)}
        />
        
        {/* Separador VS */}
        {!isEditing && <div className="h-px bg-zinc-800 w-full my-0.5"></div>}

        {/* Equipo 2 */}
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

  // Subcomponente Fila de Equipo
  const TeamRow = ({ team, isEditing, onNameChange, onScoreChange, onFlagClick, fileRef, onFileChange }: any) => (
      <div className={`flex items-center justify-between p-1 rounded ${isEditing ? 'bg-black' : ''}`}>
          <div className="flex items-center gap-2 flex-grow overflow-hidden">
              <div className="relative group/flag cursor-pointer shrink-0" onClick={isEditing ? onFlagClick : undefined}>
                  <div className="w-5 h-3.5 bg-zinc-800 rounded-sm overflow-hidden border border-zinc-700 flex items-center justify-center">
                      {team.flag ? <img src={team.flag} className="w-full h-full object-cover" alt="Flag"/> : null}
                  </div>
                  {isEditing && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover/flag:opacity-100">
                          <Camera size={8} className="text-white"/>
                      </div>
                  )}
                  <input type="file" ref={fileRef} className="hidden" accept="image/*" onChange={onFileChange} />
              </div>
              
              {isEditing ? (
                  <input 
                    value={team.name} 
                    onChange={(e) => onNameChange(e.target.value)} 
                    className="bg-transparent text-white text-[10px] font-bold w-full outline-none placeholder-gray-700"
                    placeholder="Equipo..."
                  />
              ) : (
                  <span className={`text-xs font-bold truncate ${!team.name || team.name === 'TBD' ? 'text-gray-600' : 'text-white'}`}>
                      {team.name || 'TBD'}
                  </span>
              )}
          </div>
          
          {/* Score */}
          <div className="ml-1">
               {isEditing ? (
                  <input 
                    value={team.score || ''} 
                    onChange={(e) => onScoreChange(e.target.value)} 
                    className="bg-zinc-800 text-white text-[10px] font-mono font-bold w-5 text-center rounded outline-none focus:border-wc-blue border border-transparent"
                    placeholder="-"
                  />
              ) : (
                  <span className="font-mono text-xs font-bold text-wc-blue">{team.score}</span>
              )}
          </div>
      </div>
  );


  // --- RENDERIZADO DEL ARBOL ---
  return (
    <section className={`py-12 bg-wc-black border-t border-zinc-800 relative overflow-x-auto ${!isActive ? 'opacity-50 grayscale' : ''}`}>
      <div className="min-w-[750px] max-w-6xl mx-auto px-4">
        
        {/* Controles Admin */}
        {isAdminMode && (
            <div className="absolute top-4 left-4 z-10">
                <button 
                    onClick={() => onToggleActive(!isActive)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs border transition-all ${isActive ? 'bg-purple-600 text-white border-purple-400' : 'bg-red-900/50 text-red-200 border-red-800'}`}
                >
                    {isActive ? <><Eye size={14}/> LLAVES VISIBLES</> : <><EyeOff size={14}/> LLAVES OCULTAS</>}
                </button>
            </div>
        )}

        {/* Header Mejorado */}
        <div className="text-center mb-10">
             <div className="inline-flex items-center gap-2 bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 px-6 py-2 rounded-full mb-4 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                <Medal size={16} />
                <span className="text-xs font-black uppercase tracking-[0.2em]">Camino a la Gloria</span>
             </div>
             <h2 className="text-4xl md:text-6xl font-black text-white uppercase italic leading-none">
                Fase <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-600">Final</span>
             </h2>
        </div>

        {/* Grid del Bracket - COMPACTO PARA PROLIJIDAD */}
        <div className="flex justify-center items-center relative scale-100 origin-top">
            
            {/* === RAMA IZQUIERDA === */}
            {/* Reducido gap para compactar */}
            <div className="flex gap-4">
                {/* Columna Cuartos Izq */}
                <div className="flex flex-col gap-4 justify-center">
                    <div className="relative">
                        <MatchCard id="qf1" />
                        <div className="absolute top-1/2 -right-4 w-4 h-px bg-zinc-700"></div>
                        <div className="absolute top-1/2 -right-4 w-px h-[110%] bg-zinc-700 origin-top"></div>
                    </div>
                    <div className="relative">
                        <MatchCard id="qf2" />
                        <div className="absolute top-1/2 -right-4 w-4 h-px bg-zinc-700"></div>
                        <div className="absolute bottom-1/2 -right-4 w-px h-[110%] bg-zinc-700 origin-bottom"></div>
                    </div>
                </div>

                {/* Columna Semi Izq */}
                <div className="flex flex-col justify-center relative">
                     <div className="w-4 h-px bg-zinc-700 absolute top-1/2 -left-4"></div>
                     <MatchCard id="sf1" />
                     <div className="w-4 h-px bg-zinc-700 absolute top-1/2 -right-4"></div>
                </div>
            </div>

            {/* === CENTRO (FINAL) === */}
            <div className="flex flex-col items-center justify-center px-6 relative -mt-8">
                <div className="mb-4 drop-shadow-[0_0_35px_rgba(234,179,8,0.4)] animate-float">
                    <Trophy size={80} className="text-yellow-400" strokeWidth={1} />
                </div>
                <MatchCard id="final" isFinal />
                <div className="mt-4 text-center bg-black/50 px-4 py-1 rounded-full border border-white/10">
                    <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                        19 de Julio • New Jersey
                    </span>
                </div>
            </div>

            {/* === RAMA DERECHA === */}
             <div className="flex gap-4 flex-row-reverse">
                {/* Columna Cuartos Der */}
                <div className="flex flex-col gap-4 justify-center">
                    <div className="relative">
                        <MatchCard id="qf3" />
                        <div className="absolute top-1/2 -left-4 w-4 h-px bg-zinc-700"></div>
                        <div className="absolute top-1/2 -left-4 w-px h-[110%] bg-zinc-700 origin-top"></div>
                    </div>
                    <div className="relative">
                        <MatchCard id="qf4" />
                        <div className="absolute top-1/2 -left-4 w-4 h-px bg-zinc-700"></div>
                        <div className="absolute bottom-1/2 -left-4 w-px h-[110%] bg-zinc-700 origin-bottom"></div>
                    </div>
                </div>

                {/* Columna Semi Der */}
                <div className="flex flex-col justify-center relative">
                     <div className="w-4 h-px bg-zinc-700 absolute top-1/2 -right-4"></div>
                     <MatchCard id="sf2" />
                     <div className="w-4 h-px bg-zinc-700 absolute top-1/2 -left-4"></div>
                </div>
            </div>

        </div>

      </div>
    </section>
  );
};

export default BracketSection;
