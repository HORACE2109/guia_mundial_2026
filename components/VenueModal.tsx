
import React, { useState, useEffect, useRef } from 'react';
import { X, MapPin, Users, Mountain, CloudSun, Camera, Save, Trash2 } from 'lucide-react';
import { Venue } from '../types';

interface VenueModalProps {
  venue: Venue | null;
  isOpen: boolean;
  onClose: () => void;
  isAdminMode: boolean;
  onSave: (updatedVenue: Venue) => void;
}

const VenueModal: React.FC<VenueModalProps> = ({ venue, isOpen, onClose, isAdminMode, onSave }) => {
  const [editedVenue, setEditedVenue] = useState<Venue | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (venue) {
        setEditedVenue(JSON.parse(JSON.stringify(venue)));
    }
  }, [venue, isOpen]);

  if (!isOpen || !editedVenue) return null;

  const handleChange = (field: keyof Venue, value: string) => {
    setEditedVenue(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange('imageUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
      if (editedVenue) {
          onSave(editedVenue);
          onClose();
      }
  };

  if (!isAdminMode) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative bg-zinc-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-zinc-700 animate-fade-in-up flex flex-col max-h-[90vh] overflow-y-auto custom-scrollbar">
        
        <div className="flex justify-between items-center p-6 border-b border-zinc-800">
            <h2 className="text-2xl font-black text-white uppercase italic">
                {editedVenue.id ? 'Editar Sede' : 'Nueva Sede'}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={24}/></button>
        </div>

        <div className="p-6 space-y-6">
            
            <div 
                className="relative h-48 rounded-xl overflow-hidden bg-black border-2 border-dashed border-zinc-700 hover:border-wc-blue cursor-pointer group"
                onClick={() => fileInputRef.current?.click()}
            >
                {editedVenue.imageUrl ? (
                    <img src={editedVenue.imageUrl} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500 flex-col">
                        <Camera size={32} className="mb-2"/>
                        <span className="text-xs uppercase">Subir Foto Estadio</span>
                    </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 transition-opacity">
                    <span className="bg-black/70 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2">
                        <Camera size={14}/> Cambiar Imagen
                    </span>
                </div>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload}/>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1 md:col-span-2">
                    <label className="text-xs text-wc-blue font-bold uppercase block mb-1">Nombre del Estadio</label>
                    <input 
                        className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-white font-bold text-lg focus:border-wc-blue outline-none"
                        value={editedVenue.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        placeholder="Ej: Estadio Azteca"
                    />
                </div>

                <div>
                    <label className="text-xs text-gray-400 font-bold uppercase block mb-1">Ciudad</label>
                    <input 
                        className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-white focus:border-wc-blue outline-none"
                        value={editedVenue.city}
                        onChange={(e) => handleChange('city', e.target.value)}
                    />
                </div>
                <div>
                    <label className="text-xs text-gray-400 font-bold uppercase block mb-1">País</label>
                    <select 
                        className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-white focus:border-wc-blue outline-none"
                        value={editedVenue.country}
                        onChange={(e) => handleChange('country', e.target.value)}
                    >
                        <option value="México">México</option>
                        <option value="USA">USA</option>
                        <option value="Canadá">Canadá</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="text-xs text-gray-400 font-bold uppercase block mb-1">Descripción de la Sede</label>
                <textarea 
                    className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-white focus:border-wc-blue outline-none resize-none h-24"
                    value={editedVenue.cityDescription}
                    onChange={(e) => handleChange('cityDescription', e.target.value)}
                    placeholder="Breve descripción de la ciudad o el estadio..."
                />
            </div>

            <div className="grid grid-cols-3 gap-3 bg-zinc-800/30 p-4 rounded-xl border border-white/5">
                <div>
                    <label className="text-[10px] text-gray-500 font-bold uppercase block mb-1 flex items-center gap-1"><Users size={10}/> Aforo</label>
                    <input 
                        className="w-full bg-black border border-zinc-700 rounded p-2 text-white text-sm font-mono"
                        value={editedVenue.capacity}
                        onChange={(e) => handleChange('capacity', e.target.value)}
                        placeholder="80K"
                    />
                </div>
                <div>
                    <label className="text-[10px] text-gray-500 font-bold uppercase block mb-1 flex items-center gap-1"><Mountain size={10}/> Altitud</label>
                    <input 
                        className="w-full bg-black border border-zinc-700 rounded p-2 text-white text-sm font-mono"
                        value={editedVenue.altitude}
                        onChange={(e) => handleChange('altitude', e.target.value)}
                        placeholder="20m"
                    />
                </div>
                <div>
                    <label className="text-[10px] text-gray-500 font-bold uppercase block mb-1 flex items-center gap-1"><CloudSun size={10}/> Clima</label>
                    <input 
                        className="w-full bg-black border border-zinc-700 rounded p-2 text-white text-sm font-mono"
                        value={editedVenue.climate}
                        onChange={(e) => handleChange('climate', e.target.value)}
                        placeholder="25°C"
                    />
                </div>
            </div>

        </div>

        <div className="p-6 pt-0">
            <button 
                onClick={handleSubmit}
                className="w-full bg-[#a3ff00] text-black font-black py-4 rounded-xl hover:bg-white transition-colors shadow-lg flex items-center justify-center gap-2 border border-black"
            >
                <Save size={20}/> GUARDAR SEDE
            </button>
        </div>

      </div>
    </div>
  );
};

export default VenueModal;
