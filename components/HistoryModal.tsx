
import React, { useState, useEffect, useRef } from 'react';
import { X, Trophy, Star, MapPin, Award, Camera, Save, Goal } from 'lucide-react';
import { HistoryEvent } from '../types';

interface HistoryModalProps {
  event: HistoryEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (updatedEvent: HistoryEvent) => void; // Hacemos opcional para compatibilidad pero lo usaremos
  isAdminMode?: boolean;
}

const HistoryModal: React.FC<HistoryModalProps> = ({ event, isOpen, onClose, onSave, isAdminMode }) => {
  const [editedEvent, setEditedEvent] = useState<HistoryEvent | null>(null);
  
  // Refs para archivos
  const mainImageRef = useRef<HTMLInputElement>(null);
  const bestPlayerInputRef = useRef<HTMLInputElement>(null);
  const topScorerInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
      if(event) setEditedEvent(JSON.parse(JSON.stringify(event)));
  }, [event, isOpen]);

  if (!isOpen || !editedEvent) return null;

  const handleUpdate = (field: keyof HistoryEvent, value: any) => {
      setEditedEvent(prev => prev ? { ...prev, [field]: value } : null);
  };

  const saveChanges = () => {
      if(onSave && editedEvent) {
          onSave(editedEvent);
          alert("¡Historia actualizada!");
      }
  };

  const handleImageUpload = (field: 'imageUrl' | 'bestPlayerImage' | 'topScorerImage', e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              handleUpdate(field, reader.result as string);
          };
          reader.readAsDataURL(file);
      }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose}></div>

      <div className="relative bg-zinc-900 w-full max-w-3xl rounded-2xl shadow-2xl border border-zinc-800 animate-fade-in-up overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar">
        
        {/* Header Controls */}
        <div className="absolute top-4 right-4 z-30 flex gap-2">
            {isAdminMode && (
                <button 
                  onClick={saveChanges} 
                  className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-full hover:scale-110 transition-transform shadow-lg border border-blue-400 group"
                  title="Guardar Cambios"
                >
                    <Save size={20} className="group-hover:animate-pulse"/>
                </button>
            )}
            <button 
            onClick={onClose}
            className="bg-black/50 text-white p-2 rounded-full hover:bg-white hover:text-black transition-all backdrop-blur-sm border border-white/10"
            >
            <X size={20} />
            </button>
        </div>

        <div className="relative h-72 group">
            <img src={editedEvent.imageUrl} className="w-full h-full object-cover transition-all" alt={`${editedEvent.year}`} />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-black/20 to-transparent"></div>
            
            {/* Botón Edición Imagen Principal - Blanco sobre fondo oscuro */}
            {isAdminMode && (
                <div 
                    className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-20"
                    onClick={() => mainImageRef.current?.click()}
                >
                    <div className="bg-white text-black p-3 rounded-full mb-2 shadow-xl animate-bounce-subtle">
                        <Camera size={32} />
                    </div>
                    <span className="text-white font-bold uppercase text-sm tracking-widest bg-black/50 px-3 py-1 rounded">Cambiar Portada</span>
                    <input type="file" ref={mainImageRef} className="hidden" onChange={(e) => handleImageUpload('imageUrl', e)} accept="image/*" />
                </div>
            )}

            <div className="absolute bottom-0 left-0 p-8 z-10 pointer-events-none">
                <h2 className="text-7xl font-black text-white italic tracking-tighter leading-none drop-shadow-lg">{editedEvent.year}</h2>
                <div className="flex items-center gap-2 text-wc-green font-bold uppercase tracking-widest mt-2 drop-shadow-md">
                    <MapPin size={16} /> {editedEvent.host}
                </div>
            </div>
        </div>

        <div className="p-8 space-y-8">
            
            {/* --- SECCIÓN 1: CAMPEÓN --- */}
            <div className="bg-gradient-to-r from-zinc-800 to-black p-6 rounded-2xl border border-yellow-500/30 relative overflow-hidden">
                <div className="absolute right-0 top-0 h-full w-1/3 bg-yellow-500/10 skew-x-12"></div>
                <span className="text-xs text-yellow-500 uppercase font-bold tracking-widest mb-2 block">Campeón del Mundo</span>
                <div className="flex items-center gap-3 relative z-10">
                    <Trophy className="text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" size={40} />
                    {isAdminMode ? (
                        <input 
                            value={editedEvent.champion} 
                            onChange={(e) => handleUpdate('champion', e.target.value)}
                            className="bg-black/50 text-3xl md:text-4xl font-black text-white border-b border-yellow-500/50 outline-none w-full"
                        />
                    ) : (
                        <span className="text-3xl md:text-4xl font-black text-white italic">{editedEvent.champion}</span>
                    )}
                </div>
            </div>

            {/* --- SECCIÓN 2: LEYENDAS DEL TORNEO --- */}
            <div>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Star className="text-purple-500" size={20}/> Leyendas del Torneo
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* MEJOR JUGADOR */}
                    <div className="bg-zinc-800/40 p-4 rounded-xl border border-white/5 flex items-center gap-4 relative group">
                         <div className="relative w-20 h-20 shrink-0">
                             <div className="w-full h-full rounded-full overflow-hidden border-2 border-zinc-600 bg-black">
                                 {editedEvent.bestPlayerImage ? (
                                     <img src={editedEvent.bestPlayerImage} className="w-full h-full object-cover" />
                                 ) : (
                                     <div className="w-full h-full flex items-center justify-center bg-zinc-800"><Award className="text-gray-500"/></div>
                                 )}
                             </div>
                             {isAdminMode && (
                                <div 
                                    className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                    onClick={() => bestPlayerInputRef.current?.click()}
                                >
                                    <Camera size={20} className="text-white"/>
                                </div>
                             )}
                             <input type="file" ref={bestPlayerInputRef} className="hidden" onChange={(e) => handleImageUpload('bestPlayerImage', e)} accept="image/*" />
                         </div>
                         <div className="flex-grow">
                             <span className="text-[10px] text-wc-blue uppercase font-bold tracking-wider block mb-1">Balón de Oro</span>
                             {isAdminMode ? (
                                 <input 
                                    value={editedEvent.bestPlayer} 
                                    onChange={(e) => handleUpdate('bestPlayer', e.target.value)}
                                    className="bg-black/50 text-white font-bold w-full p-1 text-sm rounded border border-zinc-700"
                                 />
                             ) : (
                                 <span className="text-lg font-bold text-white block leading-none">{editedEvent.bestPlayer}</span>
                             )}
                         </div>
                    </div>

                    {/* GOLEADOR */}
                    <div className="bg-zinc-800/40 p-4 rounded-xl border border-white/5 flex items-center gap-4 relative group">
                         <div className="relative w-20 h-20 shrink-0">
                             <div className="w-full h-full rounded-full overflow-hidden border-2 border-zinc-600 bg-black">
                                 {editedEvent.topScorerImage ? (
                                     <img src={editedEvent.topScorerImage} className="w-full h-full object-cover" />
                                 ) : (
                                     <div className="w-full h-full flex items-center justify-center bg-zinc-800"><Goal className="text-gray-500"/></div>
                                 )}
                             </div>
                             {isAdminMode && (
                                <div 
                                    className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                    onClick={() => topScorerInputRef.current?.click()}
                                >
                                    <Camera size={20} className="text-white"/>
                                </div>
                             )}
                             <input type="file" ref={topScorerInputRef} className="hidden" onChange={(e) => handleImageUpload('topScorerImage', e)} accept="image/*" />
                         </div>
                         <div className="flex-grow">
                             <span className="text-[10px] text-wc-green uppercase font-bold tracking-wider block mb-1">Bota de Oro (Goleador)</span>
                             {isAdminMode ? (
                                 <input 
                                    value={editedEvent.topScorer || ''} 
                                    onChange={(e) => handleUpdate('topScorer', e.target.value)}
                                    className="bg-black/50 text-white font-bold w-full p-1 text-sm rounded border border-zinc-700"
                                    placeholder="Nombre Goleador"
                                 />
                             ) : (
                                 <span className="text-lg font-bold text-white block leading-none">{editedEvent.topScorer || 'N/A'}</span>
                             )}
                         </div>
                    </div>

                </div>
                {isAdminMode && <p className="text-[10px] text-gray-600 mt-2 text-center">Fotos recomendadas: Cuadradas (300x300px)</p>}
            </div>

            {/* --- SECCIÓN 3: RESUMEN --- */}
            <div className="prose prose-invert border-t border-zinc-800 pt-6">
                <h3 className="text-lg font-bold text-white mb-2">Resumen del Torneo</h3>
                {isAdminMode ? (
                    <textarea 
                        value={editedEvent.description || ''}
                        onChange={(e) => handleUpdate('description', e.target.value)}
                        className="w-full bg-black/50 text-gray-300 p-3 rounded-xl border border-zinc-700 h-32 outline-none focus:border-wc-blue"
                    />
                ) : (
                    <p className="text-gray-300 leading-relaxed">
                        {editedEvent.description || "No hay descripción disponible para este torneo histórico."}
                    </p>
                )}
            </div>
        </div>

      </div>
    </div>
  );
};

export default HistoryModal;
