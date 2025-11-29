
import React, { useState, useRef } from 'react';
import { Eye, EyeOff, Edit2, Save, Calculator, RefreshCw, Camera } from 'lucide-react';
import { GroupStanding, StandingTeam } from '../types';

interface StandingsSectionProps {
  standings: GroupStanding[];
  isActive: boolean;
  isAdminMode: boolean;
  onUpdate: (newStandings: GroupStanding[]) => void;
  onToggleActive: (active: boolean) => void;
}

const StandingsSection: React.FC<StandingsSectionProps> = ({ standings, isActive, isAdminMode, onUpdate, onToggleActive }) => {
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [tempTeams, setTempTeams] = useState<StandingTeam[]>([]);
  const flagInputRef = useRef<HTMLInputElement>(null);
  const [editingTeamIndex, setEditingTeamIndex] = useState<number | null>(null);

  if (!isActive && !isAdminMode) return null;

  // --- LOGICA DE EDICIÓN ---
  
  const startEditing = (groupId: string, teams: StandingTeam[]) => {
    setEditingGroupId(groupId);
    setTempTeams(JSON.parse(JSON.stringify(teams))); // Deep copy
  };

  const cancelEditing = () => {
    setEditingGroupId(null);
    setTempTeams([]);
    setEditingTeamIndex(null);
  };

  const handleStatChange = (index: number, field: keyof StandingTeam, value: string) => {
    const numValue = parseInt(value) || 0;
    const newTeams = [...tempTeams];
    
    // Actualizamos el campo editado
    (newTeams[index] as any)[field] = numValue;

    // AUTO-CALCULOS
    // 1. Puntos: (PG * 3) + (PE * 1)
    newTeams[index].pts = (newTeams[index].pg * 3) + newTeams[index].pe;
    
    // 2. PJ: PG + PE + PP
    newTeams[index].pj = newTeams[index].pg + newTeams[index].pe + newTeams[index].pp;

    // 3. Diferencia: GF - GC
    newTeams[index].dif = newTeams[index].gf - newTeams[index].gc;

    setTempTeams(newTeams);
  };

  const handleNameChange = (index: number, value: string) => {
      const newTeams = [...tempTeams];
      newTeams[index].name = value;
      setTempTeams(newTeams);
  };

  const handleFlagUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && editingTeamIndex !== null) {
          const reader = new FileReader();
          reader.onloadend = () => {
              const newTeams = [...tempTeams];
              newTeams[editingTeamIndex].flag = reader.result as string;
              setTempTeams(newTeams);
          };
          reader.readAsDataURL(file);
      }
  };

  const saveGroup = () => {
    if (editingGroupId) {
      // Ordenar automáticamente al guardar: PTS DESC, DIF DESC, GF DESC
      const sortedTeams = [...tempTeams].sort((a, b) => {
          if (b.pts !== a.pts) return b.pts - a.pts;
          if (b.dif !== a.dif) return b.dif - a.dif;
          return b.gf - a.gf;
      });

      const updatedStandings = standings.map(g => 
        g.id === editingGroupId ? { ...g, teams: sortedTeams } : g
      );
      onUpdate(updatedStandings);
      setEditingGroupId(null);
      setTempTeams([]);
    }
  };

  return (
    <section className={`py-12 bg-black border-t border-zinc-800 relative ${!isActive ? 'opacity-50 grayscale' : ''}`}>
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header Control Admin */}
        {isAdminMode && (
            <div className="absolute top-4 left-4 z-10 flex gap-2">
                <button 
                    onClick={() => onToggleActive(!isActive)}
                    className={`flex items-center gap-2 px-6 py-2 rounded-full font-black text-xs transition-all border-2 border-white shadow-lg hover:scale-105 ${isActive ? 'bg-[#a3ff00] text-black' : 'bg-red-600 text-white'}`}
                >
                    {isActive ? <><Eye size={14}/> TABLA VISIBLE</> : <><EyeOff size={14}/> TABLA OCULTA</>}
                </button>
            </div>
        )}

        <div className="text-center mb-10">
            <h2 className="text-4xl md:text-6xl font-black uppercase italic mb-2 tracking-tighter leading-none text-white">
                TABLA DE <span className="text-wc-blue">POSICIONES</span>
            </h2>
            <p className="text-gray-400 text-lg uppercase font-bold tracking-widest mt-2">
                ACTUALIZACIÓN EN TIEMPO REAL
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {standings.map((group) => {
             const isEditing = editingGroupId === group.id;
             const teamsToRender = isEditing ? tempTeams : group.teams;

             return (
                <div key={group.id} className={`bg-zinc-900 border rounded-xl overflow-hidden transition-all ${isEditing ? 'border-wc-blue ring-2 ring-wc-blue/30 scale-[1.02] z-20' : 'border-zinc-800 hover:border-zinc-600'}`}>
                    
                    {/* Header Grupo */}
                    <div className="bg-zinc-800 px-4 py-3 flex justify-between items-center border-b border-zinc-700">
                        <h3 className="font-black text-white text-lg italic">GRUPO {group.id}</h3>
                        
                        {isAdminMode && !isEditing && (
                            <button onClick={() => startEditing(group.id, group.teams)} className="text-gray-500 hover:text-wc-blue p-1 rounded hover:bg-black">
                                <Edit2 size={16} />
                            </button>
                        )}
                        {isAdminMode && isEditing && (
                             <div className="flex gap-2">
                                <button onClick={cancelEditing} className="text-red-400 hover:text-white text-xs font-bold px-2">Cancelar</button>
                                <button onClick={saveGroup} className="bg-wc-blue text-black px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 hover:bg-white">
                                    <Save size={14} /> Guardar
                                </button>
                             </div>
                        )}
                    </div>

                    {/* Tabla */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-black/40 text-[10px] text-gray-400 uppercase tracking-wider text-center">
                                    <th className="p-2 text-left font-bold w-32 pl-4">Equipo</th>
                                    <th className="p-2 w-8" title="Partidos Jugados">PJ</th>
                                    <th className="p-2 w-8" title="Ganados">G</th>
                                    <th className="p-2 w-8" title="Empatados">E</th>
                                    <th className="p-2 w-8" title="Perdidos">P</th>
                                    <th className="p-2 w-8 hidden sm:table-cell" title="Goles Favor">GF</th>
                                    <th className="p-2 w-8 hidden sm:table-cell" title="Goles Contra">GC</th>
                                    <th className="p-2 w-8 font-bold text-white">DIF</th>
                                    <th className="p-2 w-10 font-black text-wc-blue text-xs pr-4">PTS</th>
                                </tr>
                            </thead>
                            <tbody className="text-xs md:text-sm">
                                {teamsToRender.map((team, idx) => {
                                    // Colores de clasificación
                                    let rowBg = "border-b border-zinc-800";
                                    let posColor = "text-gray-500";
                                    
                                    if (!isEditing) {
                                        if (idx < 2) { rowBg += " bg-green-900/10 hover:bg-green-900/20"; posColor = "text-green-500 font-bold"; }
                                        else if (idx === 2) { rowBg += " hover:bg-yellow-900/10"; posColor = "text-yellow-500"; }
                                        else { rowBg += " opacity-60 hover:opacity-100"; }
                                    }

                                    return (
                                        <tr key={idx} className={`${rowBg} transition-colors`}>
                                            <td className="p-2 pl-4">
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-[10px] w-3 text-center ${posColor}`}>{idx + 1}</span>
                                                    {isEditing ? (
                                                        <>
                                                            <div className="relative w-6 h-4 shrink-0 group/flag cursor-pointer" onClick={() => { setEditingTeamIndex(idx); flagInputRef.current?.click(); }}>
                                                                <img src={team.flag || 'https://via.placeholder.com/20'} className="w-full h-full object-cover rounded-[1px] opacity-70" />
                                                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover/flag:opacity-100"><Camera size={10} className="text-white"/></div>
                                                            </div>
                                                            <input 
                                                                value={team.name}
                                                                onChange={(e) => handleNameChange(idx, e.target.value)}
                                                                className="bg-black border border-zinc-700 w-full text-white px-1 py-0.5 rounded text-xs outline-none focus:border-wc-blue"
                                                            />
                                                        </>
                                                    ) : (
                                                        <>
                                                            <img src={team.flag} className="w-6 h-4 object-cover rounded-[1px] shadow-sm" alt={team.name}/>
                                                            <span className="font-bold text-white truncate max-w-[80px] sm:max-w-none">{team.name}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Celdas de Stats */}
                                            {isEditing ? (
                                                // MODO EDICIÓN: INPUTS
                                                <>
                                                    <td className="p-1 text-center font-mono text-gray-500">{team.pj}</td>
                                                    <td className="p-1"><input className="w-full bg-zinc-800 text-center text-white p-1 rounded focus:bg-black outline-none" type="number" value={team.pg} onChange={(e) => handleStatChange(idx, 'pg', e.target.value)} /></td>
                                                    <td className="p-1"><input className="w-full bg-zinc-800 text-center text-white p-1 rounded focus:bg-black outline-none" type="number" value={team.pe} onChange={(e) => handleStatChange(idx, 'pe', e.target.value)} /></td>
                                                    <td className="p-1"><input className="w-full bg-zinc-800 text-center text-white p-1 rounded focus:bg-black outline-none" type="number" value={team.pp} onChange={(e) => handleStatChange(idx, 'pp', e.target.value)} /></td>
                                                    <td className="p-1 hidden sm:table-cell"><input className="w-full bg-zinc-800 text-center text-white p-1 rounded focus:bg-black outline-none" type="number" value={team.gf} onChange={(e) => handleStatChange(idx, 'gf', e.target.value)} /></td>
                                                    <td className="p-1 hidden sm:table-cell"><input className="w-full bg-zinc-800 text-center text-white p-1 rounded focus:bg-black outline-none" type="number" value={team.gc} onChange={(e) => handleStatChange(idx, 'gc', e.target.value)} /></td>
                                                    <td className="p-1 text-center font-bold font-mono text-gray-300">{team.dif > 0 ? `+${team.dif}` : team.dif}</td>
                                                    <td className="p-1 text-center font-black font-mono text-wc-blue">{team.pts}</td>
                                                </>
                                            ) : (
                                                // MODO VISUALIZACIÓN
                                                <>
                                                    <td className="p-2 text-center text-gray-300 font-mono">{team.pj}</td>
                                                    <td className="p-2 text-center text-gray-400">{team.pg}</td>
                                                    <td className="p-2 text-center text-gray-400">{team.pe}</td>
                                                    <td className="p-2 text-center text-gray-400">{team.pp}</td>
                                                    <td className="p-2 text-center text-gray-500 hidden sm:table-cell">{team.gf}</td>
                                                    <td className="p-2 text-center text-gray-500 hidden sm:table-cell">{team.gc}</td>
                                                    <td className="p-2 text-center font-bold text-gray-300 font-mono">{team.dif > 0 ? `+${team.dif}` : team.dif}</td>
                                                    <td className="p-2 text-center font-black text-white text-base font-mono pr-4">{team.pts}</td>
                                                </>
                                            )}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
             );
          })}
        </div>
        
        {/* Input Oculto para Banderas */}
        <input type="file" ref={flagInputRef} className="hidden" accept="image/*" onChange={handleFlagUpload} />

      </div>
    </section>
  );
};

export default StandingsSection;
