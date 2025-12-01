
import React, { useState } from 'react';
import { Edit2, Save, Eye, EyeOff, Camera } from 'lucide-react';
import { WorldCupGroup, GroupTeam } from '../types';

interface GroupsSectionProps {
  groups: WorldCupGroup[];
  isActive: boolean;
  isAdminMode: boolean;
  onUpdate: (newGroups: WorldCupGroup[]) => void;
  onToggleActive: (active: boolean) => void;
}

const GroupsSection: React.FC<GroupsSectionProps> = ({ groups, isActive, isAdminMode, onUpdate, onToggleActive }) => {
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [tempTeams, setTempTeams] = useState<GroupTeam[]>([]);

  if (!isActive && !isAdminMode) return null;

  const handleEditGroup = (group: WorldCupGroup) => {
    setEditingGroupId(group.id);
    setTempTeams(JSON.parse(JSON.stringify(group.teams)));
  };

  const handleTeamNameChange = (index: number, value: string) => {
    const newTeams = [...tempTeams];
    newTeams[index].name = value;
    setTempTeams(newTeams);
  };

  const handleFlagUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              const newTeams = [...tempTeams];
              newTeams[index].flag = reader.result as string;
              setTempTeams(newTeams);
          };
          reader.readAsDataURL(file);
      }
  };

  const saveGroup = () => {
    if (editingGroupId) {
      const updatedGroups = groups.map(g => 
        g.id === editingGroupId ? { ...g, teams: tempTeams } : g
      );
      onUpdate(updatedGroups);
      setEditingGroupId(null);
    }
  };

  return (
    <section className={`py-12 bg-wc-black border-t border-zinc-800 relative ${!isActive ? 'opacity-50 grayscale' : ''}`}>
      <div className="max-w-7xl mx-auto px-4">
        
        {isAdminMode && (
            <div className="absolute top-4 left-4 z-10">
                <button 
                    onClick={() => onToggleActive(!isActive)}
                    className={`flex items-center gap-2 px-6 py-2 rounded-full font-black text-xs transition-all border-2 border-white shadow-lg hover:scale-105 ${isActive ? 'bg-[#a3ff00] text-black' : 'bg-red-600 text-white'}`}
                >
                    {isActive ? <><Eye size={14}/> SECCIÓN VISIBLE</> : <><EyeOff size={14}/> SECCIÓN OCULTA</>}
                </button>
            </div>
        )}

        <div className="text-center mb-10">
            <h2 className="text-4xl md:text-6xl font-black uppercase italic mb-2 tracking-tighter leading-none">
                FASE DE <span className="text-wc-green">GRUPOS</span>
            </h2>
            <p className="text-white text-lg md:text-xl tracking-[0.2em] uppercase font-bold mt-4 drop-shadow-md opacity-90">
                48 EQUIPOS • 12 GRUPOS • EL CAMINO A LA GLORIA
            </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {groups.map((group) => (
            <div key={group.id} className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden hover:border-wc-blue/30 transition-colors group relative">
                
                <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 p-4 border-b border-zinc-700 flex justify-between items-center">
                    <span className="text-4xl font-black text-white/20 italic absolute right-2 top-0 pointer-events-none select-none">
                        {group.id}
                    </span>
                    <h3 className="text-xl font-bold text-white relative z-10 pl-2 border-l-4 border-wc-blue">
                        GRUPO {group.id}
                    </h3>
                    
                    {isAdminMode && editingGroupId !== group.id && (
                        <button 
                            onClick={() => handleEditGroup(group)} 
                            className="bg-white text-black p-2 rounded-full hover:bg-gray-200 shadow-md relative z-10 transition-transform hover:scale-110 border border-black"
                            title="Editar Grupo"
                        >
                            <Edit2 size={14}/>
                        </button>
                    )}
                    {isAdminMode && editingGroupId === group.id && (
                         <button 
                            onClick={saveGroup} 
                            className="bg-[#a3ff00] text-black p-2 rounded-full hover:bg-white shadow-md relative z-10 transition-transform hover:scale-110 border border-black"
                            title="Guardar Grupo"
                        >
                            <Save size={14}/>
                        </button>
                    )}
                </div>

                <div className="p-4 space-y-2">
                    {(editingGroupId === group.id ? tempTeams : group.teams).map((team, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-2 rounded bg-black/40 border border-transparent hover:border-white/5">
                            <span className="text-gray-600 font-mono text-xs w-4">{idx + 1}</span>
                            
                            <div className="relative group/flag flex-shrink-0">
                                <div className="w-8 h-5 bg-zinc-700 rounded-sm overflow-hidden flex items-center justify-center border border-white/10 relative">
                                    {team.flag ? (
                                        <img src={team.flag} className="w-full h-full object-cover" alt={team.name} />
                                    ) : (
                                        <div className="w-full h-full bg-zinc-800"></div>
                                    )}
                                    
                                    {editingGroupId === group.id && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                            <label 
                                                htmlFor={`flag-upload-${group.id}-${idx}`} 
                                                className="text-white cursor-pointer hover:scale-110 transition-transform"
                                                title="Subir Bandera (48x32px)"
                                            >
                                                <Camera size={12} />
                                            </label>
                                            <input 
                                                type="file" 
                                                id={`flag-upload-${group.id}-${idx}`} 
                                                className="hidden" 
                                                accept="image/*" 
                                                onChange={(e) => handleFlagUpload(idx, e)} 
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {editingGroupId === group.id ? (
                                <input 
                                    value={team.name}
                                    onChange={(e) => handleTeamNameChange(idx, e.target.value)}
                                    className="bg-zinc-800 text-white text-sm font-bold w-full px-2 py-1 rounded focus:outline-none focus:ring-1 focus:ring-wc-blue"
                                    placeholder="Nombre Equipo..."
                                    autoFocus={idx === 0}
                                />
                            ) : (
                                <span className={`text-sm font-bold ${!team.name || team.name === 'TBD' ? 'text-gray-600 italic' : 'text-white'}`}>
                                    {team.name || 'Por definir'}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
                
                {editingGroupId === group.id && (
                    <div className="px-4 pb-2 text-center border-t border-zinc-800 pt-2">
                        <span className="text-[10px] text-yellow-500 font-mono">Banderas: 48x32 px (aprox)</span>
                    </div>
                )}

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default GroupsSection;
