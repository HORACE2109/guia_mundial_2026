
import React, { useState } from 'react';
import { Megaphone, Edit2, Save } from 'lucide-react';

interface NewsTickerProps {
  text: string;
  isAdminMode: boolean;
  onUpdate: (newText: string) => void;
}

const NewsTicker: React.FC<NewsTickerProps> = ({ text, isAdminMode, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempText, setTempText] = useState(text);

  const handleSave = () => {
    onUpdate(tempText);
    setIsEditing(false);
  };

  // Generamos el contenido repetido para la marquesina
  const MarqueeContent = () => (
    <>
        <span className="mx-4">{text}</span>
        <span className="mx-4 opacity-50">•</span>
        <span className="mx-4">{text}</span>
        <span className="mx-4 opacity-50">•</span>
        <span className="mx-4">{text}</span>
        <span className="mx-4 opacity-50">•</span>
        <span className="mx-4">{text}</span>
        <span className="mx-4 opacity-50">•</span>
    </>
  );

  return (
    <div className="bg-black text-white border-y border-white/20 relative overflow-hidden h-12 flex items-center z-20">
      
      {/* Etiqueta Fija Izquierda - ROJO SOLIDO CON TEXTO BLANCO */}
      <div className="absolute left-0 top-0 bottom-0 bg-red-600 text-white px-6 z-30 flex items-center gap-2 font-black uppercase italic text-sm md:text-base shadow-[5px_0_15px_rgba(0,0,0,0.5)] skew-x-[-10deg] -ml-4 pl-8 border-r-2 border-white">
        <div className="skew-x-[10deg] flex items-center gap-2">
            <Megaphone size={20} className="animate-pulse text-white" />
            <span className="text-white drop-shadow-md">ÚLTIMO MOMENTO</span>
        </div>
      </div>

      {/* Contenido de la Marquesina con Máscara de Degradado */}
      <div className="w-full h-full flex items-center relative pl-40 md:pl-48 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        {isEditing ? (
          <div className="w-full pr-20 flex items-center h-full bg-zinc-900 z-40 absolute inset-0 pl-48 border-b-2 border-wc-blue">
             <input 
                value={tempText}
                onChange={(e) => setTempText(e.target.value)}
                className="w-full bg-transparent text-white font-mono outline-none placeholder-gray-500 font-bold px-4"
                placeholder="Escribe el texto de la marquesina..."
                autoFocus
             />
          </div>
        ) : (
            <div className="flex overflow-hidden w-full relative h-full items-center">
                <div className="animate-marquee-infinite font-bold uppercase text-sm md:text-base tracking-wider text-white">
                    {/* Renderizamos dos bloques para el loop infinito perfecto */}
                    <div className="flex items-center shrink-0">
                        <MarqueeContent />
                    </div>
                    <div className="flex items-center shrink-0">
                        <MarqueeContent />
                    </div>
                    <div className="flex items-center shrink-0">
                        <MarqueeContent />
                    </div>
                </div>
            </div>
        )}
      </div>

      {/* Botón de Edición Admin */}
      {isAdminMode && (
        <div className="absolute right-0 top-0 bottom-0 bg-black z-50 flex items-center px-3 shadow-[-5px_0_15px_rgba(0,0,0,0.5)] border-l border-white/10">
            {isEditing ? (
                <button 
                  onClick={handleSave} 
                  className="bg-green-600 hover:bg-green-500 text-white p-1.5 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)] transition-all"
                  title="Guardar Texto"
                >
                    <Save size={18} />
                </button>
            ) : (
                <button 
                  onClick={() => { setTempText(text); setIsEditing(true); }} 
                  className="bg-white hover:bg-gray-200 text-black p-1.5 rounded-full shadow-lg transition-all"
                  title="Editar Marquesina"
                >
                    <Edit2 size={16} />
                </button>
            )}
        </div>
      )}

    </div>
  );
};

export default NewsTicker;
