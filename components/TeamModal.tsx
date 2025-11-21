
import React, { useState, useRef, useEffect } from 'react';
import { X, Trophy, Users, TrendingUp, Flag, Shield, Save, Upload, Plus, Trash2, Camera, User, Shirt } from 'lucide-react';
import { Team, Player } from '../types';

interface TeamModalProps {
  team: Team | null;
  isOpen: boolean;
  onClose: () => void;
  isAdminMode: boolean;
  onSave: (updatedTeam: Team) => void;
}

const TeamModal: React.FC<TeamModalProps> = ({ team, isOpen, onClose, isAdminMode, onSave }) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'squad'>('summary');
  
  // Estados de Edición del Equipo
  const [editedTeam, setEditedTeam] = useState<Team | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coachInputRef = useRef<HTMLInputElement>(null);
  const jerseyInputRef = useRef<HTMLInputElement>(null);

  // Estados de Edición de Jugador (Nuevo o Existente)
  const [editingPlayer, setEditingPlayer] = useState<Partial<Player> | null>(null);
  const playerFileRef = useRef<HTMLInputElement>(null);

  // Cargar datos al abrir
  useEffect(() => {
    if (team) {
        setEditedTeam(JSON.parse(JSON.stringify(team))); // Deep copy
        setEditingPlayer(null);
        setActiveTab('summary');
    }
  }, [team, isOpen]);

  if (!isOpen || !editedTeam) return null;

  // --- MANEJADORES DE EDICIÓN DE EQUIPO ---
  const handleTeamChange = (field: keyof Team, value: any) => {
    setEditedTeam(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleTeamChange('logoUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoachUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleTeamChange('coachImage', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

   const handleJerseyUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleTeamChange('jerseyImage', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveChanges = () => {
      if (editedTeam) {
          onSave(editedTeam);
          alert('¡Cambios guardados!'); 
      }
  };

  // --- MANEJADORES DE JUGADORES ---
  const handleAddPlayer = () => {
      setEditingPlayer({
          id: Date.now(), // Temporal ID
          name: '',
          position: 'FW',
          number: 0,
          club: '',
          age: 0,
          height: '',
          weight: '',
          worldCups: 0,
          imageUrl: ''
      });
  };

  const handleEditPlayer = (player: Player) => {
      setEditingPlayer({ ...player });
  };

  const handleDeletePlayer = (e: React.MouseEvent, playerId: number) => {
      e.stopPropagation();
      if (confirm('¿Eliminar jugador?')) {
          const newSquad = editedTeam.squad.filter(p => p.id !== playerId);
          // Actualizamos local
          setEditedTeam({ ...editedTeam, squad: newSquad });
          // Guardamos en App inmediatamente
          onSave({ ...editedTeam, squad: newSquad });
      }
  };

  const savePlayer = () => {
      if (!editingPlayer || !editingPlayer.name) {
          alert("El nombre del jugador es obligatorio");
          return;
      }
      
      // Creamos una copia del squad actual
      let newSquad = [...editedTeam.squad];
      
      // Buscamos si el jugador ya existe en el array original
      const existingIndex = newSquad.findIndex(p => p.id === editingPlayer.id);

      if (existingIndex >= 0) {
          // Actualizar existente
          newSquad[existingIndex] = editingPlayer as Player;
      } else {
          // Agregar nuevo
          newSquad.push(editingPlayer as Player);
      }

      const newTeamState = { ...editedTeam, squad: newSquad };
      setEditedTeam(newTeamState);
      
      // Guardar en App.tsx inmediatamente para persistir
      onSave(newTeamState);
      
      setEditingPlayer(null); // Volver a lista
  };

  const handlePlayerImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              setEditingPlayer(prev => prev ? { ...prev, imageUrl: reader.result as string } : null);
          };
          reader.readAsDataURL(file);
      }
  };

  // Helper para colores de posición
  const getPositionStyle = (pos: string) => {
      switch(pos) {
          case 'GK': return 'from-yellow-600 to-yellow-900 border-yellow-500';
          case 'DF': return 'from-blue-600 to-blue-900 border-blue-500';
          case 'MF': return 'from-green-600 to-green-900 border-green-500';
          case 'FW': return 'from-red-600 to-red-900 border-red-500';
          default: return 'from-gray-600 to-gray-900 border-gray-500';
      }
  };

  // --- RENDERIZADO ---
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal Container */}
      <div className="relative bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-fade-in-up">
        
        {/* === HEADER RESPONSIVE === */}
        <div className="relative bg-gradient-to-r from-zinc-900 via-zinc-800 to-black p-6 border-b border-zinc-800 shrink-0">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white bg-black/50 p-2 rounded-full transition-colors z-10 border border-white/10 hover:bg-red-900/50"
          >
            <X size={24} />
          </button>

          <div className="flex flex-col md:flex-row items-center md:items-end space-y-4 md:space-y-0 md:space-x-6 pt-2">
            {/* Escudo / Bandera Editable */}
            <div className="relative group shrink-0">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden border-4 border-zinc-800 bg-black shadow-2xl relative flex items-center justify-center">
                    {editedTeam.logoUrl ? (
                        <img src={editedTeam.logoUrl} className="w-full h-full object-contain p-2" alt="Logo" />
                    ) : editedTeam.code ? (
                        <img src={`https://flagcdn.com/w320/${editedTeam.code}.png`} className="w-full h-full object-cover" alt="Flag" />
                    ) : (
                        <Shield className="w-16 h-16 text-gray-600" />
                    )}
                </div>
                
                {isAdminMode && (
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-0 right-0 bg-wc-blue text-black p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
                        title="Cambiar Escudo"
                    >
                        <Camera size={16} />
                    </button>
                )}
                <input type="file" ref={fileInputRef} className="hidden" onChange={handleLogoUpload} accept="image/*"/>
            </div>

            <div className="mb-2 flex-grow text-center md:text-left w-full">
                {isAdminMode ? (
                    <div className="flex flex-col gap-2 items-center md:items-start">
                        <input 
                            value={editedTeam.name}
                            onChange={(e) => handleTeamChange('name', e.target.value)}
                            className="bg-transparent border-b border-zinc-600 text-3xl md:text-5xl font-black text-white uppercase italic px-2 py-1 w-full text-center md:text-left outline-none focus:border-wc-blue"
                            placeholder="NOMBRE DEL PAÍS"
                        />
                        <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-2">
                            <input 
                                value={editedTeam.fifaAbbr}
                                onChange={(e) => handleTeamChange('fifaAbbr', e.target.value)}
                                className="bg-black/50 border border-zinc-600 w-24 text-wc-blue font-mono font-bold px-2 py-1 rounded text-center"
                                placeholder="ABR"
                            />
                             <button 
                                onClick={saveChanges}
                                className="bg-wc-green text-black px-6 py-1 rounded-full font-bold text-sm flex items-center gap-2 hover:bg-white transition-colors shadow-[0_0_10px_rgba(163,255,0,0.2)]"
                            >
                                <Save size={16} /> GUARDAR CAMBIOS
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <h2 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-none drop-shadow-lg">
                            {editedTeam.name}
                        </h2>
                        <div className="flex items-center justify-center md:justify-start gap-4 mt-2">
                             <span className="text-2xl font-mono font-bold text-wc-blue tracking-widest border border-wc-blue/30 px-3 rounded bg-wc-blue/10">{editedTeam.fifaAbbr}</span>
                             <div className="h-px w-20 bg-zinc-700"></div>
                        </div>
                    </>
                )}
            </div>
          </div>

          {/* TABS DE NAVEGACIÓN */}
          <div className="flex mt-8 gap-2 border-b border-zinc-800 justify-center md:justify-start overflow-x-auto">
              <button 
                onClick={() => { setActiveTab('summary'); setEditingPlayer(null); }}
                className={`px-6 py-3 font-bold uppercase tracking-widest text-xs md:text-sm transition-all rounded-t-lg ${activeTab === 'summary' ? 'bg-zinc-800 text-white border-t-2 border-wc-green' : 'text-gray-500 hover:text-gray-300 hover:bg-zinc-800/50'}`}
              >
                  Resumen
              </button>
              <button 
                onClick={() => setActiveTab('squad')}
                className={`px-6 py-3 font-bold uppercase tracking-widest text-xs md:text-sm transition-all rounded-t-lg ${activeTab === 'squad' ? 'bg-zinc-800 text-white border-t-2 border-wc-blue' : 'text-gray-500 hover:text-gray-300 hover:bg-zinc-800/50'}`}
              >
                  Plantel Completo <span className="ml-2 bg-black/50 px-2 py-0.5 rounded-full text-xs">{editedTeam.squad.length}</span>
              </button>
          </div>
        </div>

        {/* === CONTENIDO SCROLLEABLE === */}
        <div className="flex-grow overflow-y-auto p-6 md:p-8 bg-zinc-900 custom-scrollbar">
            
            {/* --- VISTA RESUMEN --- */}
            {activeTab === 'summary' && (
                <div className="animate-fade-in space-y-8">
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <StatBox icon={<TrendingUp className="text-wc-green" />} label="Ranking FIFA" value={editedTeam.ranking} isAdmin={isAdminMode} onChange={(v) => handleTeamChange('ranking', Number(v))} subtext="Mundial" />
                        <StatBox icon={<Users className="text-wc-blue" />} label="Valor Plantel" value={editedTeam.squadValue} isAdmin={isAdminMode} onChange={(v) => handleTeamChange('squadValue', v)} subtext="Euros Estimado" />
                        <StatBox icon={<Trophy className="text-yellow-500" />} label="Títulos" value={editedTeam.titles} isAdmin={isAdminMode} onChange={(v) => handleTeamChange('titles', Number(v))} subtext="Copas del Mundo" />
                        <StatBox icon={<Flag className="text-purple-500" />} label="Participaciones" value={editedTeam.participations} isAdmin={isAdminMode} onChange={(v) => handleTeamChange('participations', Number(v))} subtext="Ediciones" />
                    </div>

                    <div className="flex flex-col md:flex-row gap-8">
                        {/* ANÁLISIS TÁCTICO */}
                        <div className="flex-1 bg-zinc-800/30 p-8 rounded-2xl border border-white/5 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-2 h-full bg-wc-green"></div>
                            <h3 className="text-xl font-black text-white flex items-center mb-6 uppercase italic">
                                Análisis Táctico
                            </h3>
                            {isAdminMode ? (
                                <textarea 
                                    value={editedTeam.description || ''}
                                    onChange={(e) => handleTeamChange('description', e.target.value)}
                                    className="w-full h-48 bg-black/50 border border-zinc-700 rounded-xl p-4 text-gray-300 focus:border-wc-blue outline-none resize-none text-lg"
                                    placeholder="Escribe un resumen del equipo, estilo de juego, figuras..."
                                />
                            ) : (
                                <p className="text-gray-300 leading-relaxed text-lg font-light">
                                    {editedTeam.description || "No hay descripción disponible para este equipo."}
                                </p>
                            )}
                        </div>
                        
                        {/* COLUMNA DERECHA: DT Y CAMISETA */}
                        <div className="w-full md:w-1/3 flex flex-col gap-4">
                            
                            {/* 1. Director Técnico */}
                            <div className="bg-zinc-800/30 rounded-2xl border border-white/5 p-4 flex items-center gap-4 relative group">
                                <div className="relative w-20 h-20 shrink-0">
                                    <div className="w-full h-full rounded-full overflow-hidden bg-black border-2 border-zinc-600 shadow-lg">
                                        {editedTeam.coachImage ? (
                                            <img src={editedTeam.coachImage} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-zinc-800"><User className="text-gray-500"/></div>
                                        )}
                                    </div>
                                    {isAdminMode && (
                                        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={() => coachInputRef.current?.click()}>
                                            <Camera size={20} className="text-white"/>
                                        </div>
                                    )}
                                    <input type="file" ref={coachInputRef} className="hidden" accept="image/*" onChange={handleCoachUpload}/>
                                </div>
                                <div className="flex-grow">
                                    <span className="text-[10px] uppercase text-gray-500 font-bold tracking-widest block mb-1">Director Técnico</span>
                                    {isAdminMode ? (
                                        <input 
                                            value={editedTeam.coachName || ''}
                                            onChange={(e) => handleTeamChange('coachName', e.target.value)}
                                            className="bg-black/50 border border-zinc-600 text-white font-bold text-sm p-1 w-full rounded"
                                            placeholder="Nombre DT"
                                        />
                                    ) : (
                                        <span className="text-lg font-bold text-white leading-none">{editedTeam.coachName || 'A confirmar'}</span>
                                    )}
                                </div>
                                {isAdminMode && <div className="absolute top-2 right-2 text-[9px] text-gray-600">400x400px</div>}
                            </div>

                            {/* 2. Camiseta */}
                            <div className="flex-grow bg-black rounded-2xl border border-zinc-800 flex flex-col items-center justify-center p-6 relative group overflow-hidden">
                                <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
                                    <Shirt size={16} className="text-gray-500"/>
                                    <span className="text-gray-500 text-xs uppercase tracking-widest font-bold">Oficial</span>
                                </div>
                                
                                <div className="relative w-full h-48 flex items-center justify-center mt-2">
                                    {editedTeam.jerseyImage ? (
                                        <img src={editedTeam.jerseyImage} className="h-full w-auto object-contain drop-shadow-2xl transition-transform group-hover:scale-105" />
                                    ) : (
                                        <div className="text-center opacity-30">
                                             <Shirt size={64} className={`mx-auto text-${editedTeam.primaryColor === 'yellow' ? 'yellow-400' : editedTeam.primaryColor === 'blue' ? 'blue-600' : editedTeam.primaryColor === 'green' ? 'green-600' : 'red-600'} mb-2`} strokeWidth={1} fill="currentColor" fillOpacity={0.2} />
                                             <span className="text-xs">Sin imagen oficial</span>
                                        </div>
                                    )}
                                </div>

                                {isAdminMode && (
                                    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-20" onClick={() => jerseyInputRef.current?.click()}>
                                        <Camera size={32} className="text-white mb-2"/>
                                        <span className="text-xs font-bold text-white uppercase">Subir Camiseta</span>
                                        <span className="text-[10px] text-gray-400 mt-1">PNG Transparente (500x600)</span>
                                    </div>
                                )}
                                <input type="file" ref={jerseyInputRef} className="hidden" accept="image/*" onChange={handleJerseyUpload}/>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex justify-center pt-4">
                         <button onClick={() => setActiveTab('squad')} className="bg-white text-black px-10 py-4 rounded-full font-black hover:bg-wc-blue transition-all hover:scale-105 shadow-lg flex items-center group w-full md:w-auto justify-center text-lg">
                            VER PLANTEL COMPLETO
                            <Users className="ml-3 group-hover:translate-x-1 transition-transform" size={24} />
                        </button>
                    </div>
                </div>
            )}

            {/* --- VISTA PLANTEL (GRID DE CARTAS) --- */}
            {activeTab === 'squad' && !editingPlayer && (
                <div className="animate-fade-in">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 sticky top-0 bg-zinc-900/95 p-4 z-10 backdrop-blur-sm border-b border-zinc-800 -mx-6 px-6">
                         <div className="flex items-center gap-3">
                             <h3 className="text-2xl font-black text-white italic uppercase">Convocados</h3>
                             <span className="bg-wc-blue/20 text-wc-blue px-3 py-1 rounded-full text-xs font-bold border border-wc-blue/30">{editedTeam.squad.length} / 26</span>
                         </div>
                         {isAdminMode && (
                             <button onClick={handleAddPlayer} className="bg-wc-green text-black px-6 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-white shadow-[0_0_15px_rgba(163,255,0,0.3)] transition-all">
                                 <Plus size={20} /> AGREGAR JUGADOR
                             </button>
                         )}
                    </div>

                    {editedTeam.squad.length === 0 ? (
                        <div className="text-center py-20 bg-zinc-800/20 rounded-3xl border-2 border-dashed border-zinc-700">
                            <Users size={64} className="mx-auto text-zinc-700 mb-4"/>
                            <p className="text-gray-500 text-xl font-light">Aún no hay jugadores cargados.</p>
                            {isAdminMode && <p className="text-wc-blue mt-2 cursor-pointer hover:underline" onClick={handleAddPlayer}>¡Agrega el primero ahora!</p>}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {editedTeam.squad.map((player) => (
                                <div 
                                    key={player.id} 
                                    className={`group relative overflow-hidden rounded-t-2xl rounded-b-xl bg-gradient-to-b from-zinc-800 to-black border-t-4 transition-all hover:-translate-y-2 duration-300 ${getPositionStyle(player.position)}`}
                                    onClick={() => isAdminMode && handleEditPlayer(player)}
                                >
                                    {/* Posición Badge */}
                                    <div className="absolute top-0 left-4 bg-black/80 backdrop-blur-md text-white text-center px-3 py-4 rounded-b-lg border-x border-b border-white/10 z-10 shadow-xl">
                                        <span className="block text-2xl font-black leading-none">{player.number}</span>
                                        <span className={`block text-xs font-bold mt-1 ${player.position === 'GK' ? 'text-yellow-500' : player.position === 'DF' ? 'text-blue-400' : player.position === 'MF' ? 'text-green-400' : 'text-red-500'}`}>
                                            {player.position}
                                        </span>
                                    </div>

                                    {/* Imagen Jugador */}
                                    <div className="h-64 w-full relative overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
                                        <div className={`absolute inset-0 opacity-20 bg-gradient-to-b ${getPositionStyle(player.position).split(' ')[0]} to-black`}></div>
                                        {player.imageUrl ? (
                                            <img src={player.imageUrl} className="w-full h-full object-cover object-top transition-transform group-hover:scale-110 duration-500" alt={player.name} />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-700">
                                                <User size={80} />
                                            </div>
                                        )}
                                        
                                        {/* Nombre Overlay */}
                                        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black via-black/80 to-transparent pt-12 pb-3 px-4">
                                            <h4 className="text-xl font-black text-white uppercase italic truncate text-center drop-shadow-md">{player.name}</h4>
                                            <p className="text-center text-gray-400 text-xs truncate">{player.club}</p>
                                        </div>
                                    </div>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-3 bg-black border-t border-zinc-800 py-3 px-2 text-center">
                                        <div className="border-r border-zinc-800">
                                            <span className="block text-[10px] text-gray-500 uppercase">Edad</span>
                                            <span className="block text-white font-bold font-mono">{player.age}</span>
                                        </div>
                                        <div className="border-r border-zinc-800">
                                            <span className="block text-[10px] text-gray-500 uppercase">Altura</span>
                                            <span className="block text-white font-bold font-mono">{player.height}</span>
                                        </div>
                                        <div>
                                            <span className="block text-[10px] text-gray-500 uppercase">Mundiales</span>
                                            <span className="block text-white font-bold font-mono">{player.worldCups}</span>
                                        </div>
                                    </div>

                                    {/* Botón Eliminar (Solo Admin) */}
                                    {isAdminMode && (
                                        <button 
                                            onClick={(e) => handleDeletePlayer(e, player.id)} 
                                            className="absolute top-2 right-2 bg-red-600/80 hover:bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all z-20 scale-90 group-hover:scale-100 shadow-lg"
                                        >
                                            <Trash2 size={16}/>
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* --- VISTA PLANTEL (FORMULARIO EDICIÓN) --- */}
            {activeTab === 'squad' && editingPlayer && (
                <div className="animate-fade-in max-w-3xl mx-auto">
                    <div className="flex items-center justify-between mb-6 border-b border-zinc-800 pb-4">
                        <button onClick={() => setEditingPlayer(null)} className="text-gray-400 hover:text-white text-sm font-bold flex items-center gap-2">
                             <span className="text-lg">←</span> VOLVER
                        </button>
                        <h3 className="text-2xl font-black text-white italic uppercase">
                            {editingPlayer.id ? 'Editar Ficha Técnica' : 'Nuevo Jugador'}
                        </h3>
                    </div>

                    <div className="bg-zinc-800/50 p-8 rounded-2xl border border-zinc-700 shadow-2xl flex flex-col md:flex-row gap-8">
                        
                        {/* Columna Izq: Foto y Preview */}
                        <div className="w-full md:w-1/3 flex flex-col items-center">
                            <div className="relative group cursor-pointer w-full aspect-[3/4] rounded-xl overflow-hidden bg-black border-2 border-dashed border-zinc-600 hover:border-wc-blue transition-colors mb-4" onClick={() => playerFileRef.current?.click()}>
                                {editingPlayer.imageUrl ? (
                                    <img src={editingPlayer.imageUrl} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 gap-2">
                                        <Upload size={32} />
                                        <span className="text-xs font-bold uppercase">Subir Foto</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    <Camera className="text-white" size={32} />
                                </div>
                            </div>
                            <input type="file" ref={playerFileRef} className="hidden" onChange={handlePlayerImageUpload} accept="image/*" />
                            
                            <div className="bg-yellow-900/20 border border-yellow-600/30 p-3 rounded-lg text-center w-full">
                                <p className="text-[10px] text-yellow-200 font-bold uppercase tracking-wider mb-1">
                                    MEDIDAS RECOMENDADAS
                                </p>
                                <p className="text-xs text-white font-mono">600 x 800 px</p>
                                <p className="text-[10px] text-gray-400 mt-1">Formato 3:4 Vertical</p>
                            </div>
                        </div>

                        {/* Columna Der: Datos */}
                        <div className="w-full md:w-2/3 space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="col-span-1 md:col-span-2">
                                    <label className="text-xs text-wc-blue font-bold uppercase block mb-1">Nombre Completo</label>
                                    <input className="w-full bg-black border border-zinc-600 rounded-lg p-3 text-white font-bold text-lg focus:border-wc-blue outline-none" 
                                        value={editingPlayer.name} onChange={e => setEditingPlayer({...editingPlayer, name: e.target.value})} placeholder="Ej: Lionel Messi" />
                                </div>
                                 <div className="col-span-1 md:col-span-2">
                                    <label className="text-xs text-gray-400 font-bold uppercase block mb-1">Club Actual</label>
                                    <input className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-white focus:border-wc-blue outline-none" 
                                        value={editingPlayer.club} onChange={e => setEditingPlayer({...editingPlayer, club: e.target.value})} placeholder="Ej: Inter Miami" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="text-xs text-gray-400 font-bold uppercase block mb-1">Posición</label>
                                    <select className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-white focus:border-wc-blue outline-none font-mono"
                                        value={editingPlayer.position} onChange={e => setEditingPlayer({...editingPlayer, position: e.target.value as any})}>
                                        <option value="FW">DEL</option>
                                        <option value="MF">MED</option>
                                        <option value="DF">DEF</option>
                                        <option value="GK">ARQ</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400 font-bold uppercase block mb-1">Dorsal</label>
                                    <input type="number" className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-white focus:border-wc-blue outline-none font-mono" 
                                        value={editingPlayer.number} onChange={e => setEditingPlayer({...editingPlayer, number: Number(e.target.value)})} />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400 font-bold uppercase block mb-1">Edad</label>
                                    <input type="number" className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-white focus:border-wc-blue outline-none font-mono" 
                                        value={editingPlayer.age} onChange={e => setEditingPlayer({...editingPlayer, age: Number(e.target.value)})} />
                                </div>
                                 <div>
                                    <label className="text-xs text-gray-400 font-bold uppercase block mb-1">Mundiales</label>
                                    <input type="number" className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-white focus:border-wc-blue outline-none font-mono" 
                                        value={editingPlayer.worldCups} onChange={e => setEditingPlayer({...editingPlayer, worldCups: Number(e.target.value)})} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-gray-400 font-bold uppercase block mb-1">Altura</label>
                                    <input className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-white focus:border-wc-blue outline-none font-mono" placeholder="1.80m"
                                        value={editingPlayer.height} onChange={e => setEditingPlayer({...editingPlayer, height: e.target.value})} />
                                </div>
                                 <div>
                                    <label className="text-xs text-gray-400 font-bold uppercase block mb-1">Peso</label>
                                    <input className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-white focus:border-wc-blue outline-none font-mono" placeholder="75kg"
                                        value={editingPlayer.weight} onChange={e => setEditingPlayer({...editingPlayer, weight: e.target.value})} />
                                </div>
                            </div>

                            <button onClick={savePlayer} className="w-full bg-white text-black font-black py-4 rounded-xl hover:bg-wc-green hover:scale-[1.02] transition-all mt-4 shadow-lg flex items-center justify-center gap-2">
                                <Save size={20} /> GUARDAR JUGADOR
                            </button>

                        </div>
                    </div>
                </div>
            )}

        </div>
      </div>
    </div>
  );
};

// Componente Auxiliar para Estadísticas Editables
const StatBox = ({ icon, label, value, isAdmin, onChange, subtext }: { icon: React.ReactNode, label: string, value: any, isAdmin: boolean, onChange: (val: string) => void, subtext: string }) => (
    <div className="bg-zinc-800/50 p-5 rounded-2xl border border-zinc-700/50 flex flex-col items-center text-center relative overflow-hidden group hover:border-wc-blue/30 transition-colors">
        <div className="mb-3 p-3 bg-black rounded-full border border-zinc-800 group-hover:scale-110 transition-transform">{icon}</div>
        <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">{label}</span>
        {isAdmin ? (
            <input 
                value={value} 
                onChange={(e) => onChange(e.target.value)}
                className="bg-black border border-zinc-600 text-center w-full rounded text-white font-black text-xl focus:border-wc-blue outline-none py-1"
            />
        ) : (
            <span className="text-2xl md:text-3xl font-black text-white tracking-tight">{value}</span>
        )}
        <span className="text-[10px] text-gray-600 mt-1">{subtext}</span>
    </div>
);

export default TeamModal;
