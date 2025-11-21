
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

  // Si está inactivo y no soy admin, no mostrar nada
  if (!isActive && !isAdminMode) return null;

  const handleEditGroup = (group: WorldCupGroup) => {
    setEditingGroupId(group.id);
    // Deep copy para evitar mutaciones directas
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
        
        {/* Header Control Admin */}
        {isAdminMode && (
            <div className="absolute top-4 left-4 z-10">
                <button 
                    onClick={() => onToggleActive(!isActive)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs border transition-all ${isActive ? 'bg-wc-green text-black border-wc-green' : 'bg-red-900/50 text-red-200 border-red-800'}`}
                >
                    {isActive ? <><Eye size={14}/> SECCIÓN VISIBLE</> : <><EyeOff size={14}/> SECCIÓN OCULTA</>}
                </button>
            </div>
        )}

        <div className="text-center mb-10">
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic mb-2">
                Fase de <span className="text-transparent bg-clip-text bg-gradient-to-r from-wc-blue to-wc-purple">Grupos</span>
            </h2>
            <p className="text-gray-500 text-sm tracking-widest uppercase">48 Equipos • 12 Grupos • El camino a la gloria</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {groups.map((group) => (
            <div key={group.id} className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden hover:border-wc-blue/30 transition-colors group relative">
                
                {/* Group Header */}
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
                            className="text-gray-500 hover:text-wc-blue relative z-10"
                        >
                            <Edit2 size={16}/>
                        </button>
                    )}
                    {isAdminMode && editingGroupId === group.id && (
                         <button 
                            onClick={saveGroup} 
                            className="text-wc-green hover:text-white relative z-10 bg-zinc-900 p-1 rounded-full border border-wc-green"
                        >
                            <Save size={16}/>
                        </button>
                    )}
                </div>

                {/* Group Body (Teams List) */}
                <div className="p-4 space-y-2">
                    {(editingGroupId === group.id ? tempTeams : group.teams).map((team, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-2 rounded bg-black/40 border border-transparent hover:border-white/5">
                            <span className="text-gray-600 font-mono text-xs w-4">{idx + 1}</span>
                            
                            {/* Bandera */}
                            <div className="relative group/flag flex-shrink-0">
                                <div className="w-8 h-5 bg-zinc-700 rounded-sm overflow-hidden flex items-center justify-center border border-white/10 relative">
                                    {team.flag ? (
                                        <img src={team.flag} className="w-full h-full object-cover" alt={team.name} />
                                    ) : (
                                        <div className="w-full h-full bg-zinc-800"></div>
                                    )}
                                    
                                    {/* Upload Flag Button (Only Editing) */}
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
                
                {/* Texto de ayuda medidas en modo edición */}
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
