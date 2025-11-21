
import React from 'react';
import { MapPin, Users, Mountain, CloudSun, Camera, Edit } from 'lucide-react';
import { Venue } from '../types';

interface VenueCardProps {
  venue: Venue;
  isAdminMode?: boolean;
  onUpdateImage?: (id: number) => void; // Simplificado: ya no pide la URL aquí
}

const VenueCard: React.FC<VenueCardProps> = ({ venue, isAdminMode, onUpdateImage }) => {
  
  const handleEditImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onUpdateImage) {
        onUpdateImage(venue.id);
    }
  };

  return (
    <div className="group bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-wc-blue/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,234,255,0.1)] flex flex-col h-full relative">
      
      {/* Imagen con Overlay */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={venue.imageUrl} 
          alt={venue.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent"></div>
        
        {/* Botón de Edición (Solo Admin) - SIEMPRE VISIBLE SI ES ADMIN */}
        {isAdminMode && (
          <button 
            onClick={handleEditImage}
            className="absolute top-2 right-2 z-30 bg-wc-blue text-black border-2 border-white p-2 rounded-full hover:bg-white hover:scale-110 transition-all shadow-xl cursor-pointer animate-bounce-subtle"
            title="Cambiar imagen del estadio"
          >
            <Camera size={20} />
          </button>
        )}

        <div className="absolute bottom-2 left-4">
          <div className="flex items-center text-wc-green text-xs font-bold uppercase tracking-wider mb-1">
              <MapPin size={12} className="mr-1" /> {venue.country}
          </div>
          <h3 className="text-xl font-bold text-white leading-none">{venue.city}</h3>
        </div>
      </div>

      {/* Información Directa */}
      <div className="p-5 flex flex-col flex-grow">
        <h4 className="text-lg font-black text-white mb-1 uppercase italic tracking-tight">{venue.name}</h4>
        <p className="text-base text-gray-300 mb-4 line-clamp-2 border-b border-white/5 pb-4 font-medium">
            {venue.cityDescription}
        </p>
        
        {/* Grid de Datos Rápidos */}
        <div className="grid grid-cols-3 gap-2 mt-auto">
            <div className="text-center p-2 bg-black/40 rounded border border-white/5">
                <Users size={16} className="mx-auto text-wc-blue mb-1" />
                <span className="block text-[10px] text-gray-500 uppercase">Aforo</span>
                <span className="text-xs font-mono font-bold text-white">{venue.capacity}</span>
            </div>
            <div className="text-center p-2 bg-black/40 rounded border border-white/5">
                <Mountain size={16} className="mx-auto text-purple-500 mb-1" />
                <span className="block text-[10px] text-gray-500 uppercase">Altitud</span>
                <span className="text-xs font-mono font-bold text-white">{venue.altitude}</span>
            </div>
            <div className="text-center p-2 bg-black/40 rounded border border-white/5">
                <CloudSun size={16} className="mx-auto text-yellow-500 mb-1" />
                <span className="block text-[10px] text-gray-500 uppercase">Clima</span>
                <span className="text-xs font-mono font-bold text-white">{venue.climate}</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default VenueCard;
