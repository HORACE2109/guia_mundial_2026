
import React, { useRef } from 'react';
import { Upload, Layout, Power, Image as ImageIcon, Link as LinkIcon, Trash2 } from 'lucide-react';
import { AdZone } from '../types';

interface AdBannerProps {
  zone: AdZone;
  isAdminMode: boolean;
  onUpdate: (updatedZone: AdZone) => void;
}

const AdBanner: React.FC<AdBannerProps> = ({ zone, isAdminMode, onUpdate }) => {
  const fileInputRef1 = useRef<HTMLInputElement>(null);
  const fileInputRef2 = useRef<HTMLInputElement>(null);

  if (!isAdminMode && !zone.active) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, imageNum: 1 | 2) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (imageNum === 1) {
          onUpdate({ ...zone, image1: base64String });
        } else {
          onUpdate({ ...zone, image2: base64String });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileSelect = (inputRef: React.RefObject<HTMLInputElement | null>) => {
    inputRef.current?.click();
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 my-6 animate-fade-in-up">
      
      {isAdminMode && (
        <div className="bg-zinc-900 border-2 border-dashed border-wc-purple/50 rounded-xl p-4 mb-4 relative group hover:border-wc-purple transition-colors">
          <div className="absolute -top-3 left-4 bg-wc-purple text-white text-xs font-bold px-2 py-1 rounded shadow-lg">
            ESPACIO PUBLICITARIO #{zone.id}
          </div>
          
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
                {/* Toggle Activo/Inactivo - Botones Sólidos */}
                <button 
                    onClick={() => onUpdate({ ...zone, active: !zone.active })}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black transition-colors border border-white ${zone.active ? 'bg-[#a3ff00] text-black' : 'bg-red-600 text-white'}`}
                >
                    <Power size={14} /> {zone.active ? 'VISIBLE' : 'OCULTO'}
                </button>

                {/* Toggle Layout */}
                <div className="flex bg-black rounded-lg p-1 border border-zinc-700">
                    <button 
                        onClick={() => onUpdate({ ...zone, layout: 'full' })}
                        className={`p-1.5 rounded flex items-center gap-1 text-xs ${zone.layout === 'full' ? 'bg-zinc-700 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                        title="Banner Largo Completo"
                    >
                        <Layout size={14} className="rotate-90" /> Full
                    </button>
                    <button 
                        onClick={() => onUpdate({ ...zone, layout: 'split' })}
                        className={`p-1.5 rounded flex items-center gap-1 text-xs ${zone.layout === 'split' ? 'bg-zinc-700 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                        title="Dos Columnas"
                    >
                        <Layout size={14} /> Split
                    </button>
                </div>
            </div>

            {/* Controles de Carga de Imagen - Botones Sólidos Azules */}
            <div className="flex gap-2">
                <div className="flex items-center gap-2 bg-black/50 p-1.5 rounded border border-zinc-700">
                    <span className="text-xs text-gray-400 font-mono px-1">IMG 1</span>
                    <button 
                        onClick={() => triggerFileSelect(fileInputRef1)}
                        className="bg-blue-600 hover:bg-blue-500 text-white p-1.5 rounded transition-colors shadow border border-blue-400"
                        title="Subir Imagen 1 desde PC"
                    >
                        <Upload size={14} />
                    </button>
                    <input type="file" ref={fileInputRef1} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 1)} />
                </div>

                {zone.layout === 'split' && (
                    <div className="flex items-center gap-2 bg-black/50 p-1.5 rounded border border-zinc-700">
                        <span className="text-xs text-gray-400 font-mono px-1">IMG 2</span>
                         <button 
                            onClick={() => triggerFileSelect(fileInputRef2)}
                            className="bg-blue-600 hover:bg-blue-500 text-white p-1.5 rounded transition-colors shadow border border-blue-400"
                            title="Subir Imagen 2 desde PC"
                        >
                            <Upload size={14} />
                        </button>
                        <input type="file" ref={fileInputRef2} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 2)} />
                    </div>
                )}
            </div>
          </div>
          
          <p className="text-[10px] text-gray-500 mt-2 text-center">
            Medidas sugeridas: Full (1200x250px) | Split (600x250px cada uno). Las imágenes se guardan en tu navegador.
          </p>
        </div>
      )}

      {zone.active && (
        <div className={`grid gap-4 ${zone.layout === 'full' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
            <div className="relative group overflow-hidden rounded-lg border border-white/5">
                {zone.image1 ? (
                    <img src={zone.image1} alt="Publicidad" className="w-full h-32 md:h-48 object-cover" />
                ) : (
                    <div className="w-full h-32 md:h-48 bg-zinc-800 flex flex-col items-center justify-center text-zinc-600">
                        <ImageIcon size={32} className="mb-2"/>
                        <span className="text-xs uppercase tracking-widest">Espacio Disponible</span>
                    </div>
                )}
                {zone.link1 && (
                    <a href={zone.link1} target="_blank" rel="noreferrer" className="absolute inset-0 z-10"></a>
                )}
            </div>

            {zone.layout === 'split' && (
                <div className="relative group overflow-hidden rounded-lg border border-white/5">
                     {zone.image2 ? (
                        <img src={zone.image2} alt="Publicidad" className="w-full h-32 md:h-48 object-cover" />
                    ) : (
                        <div className="w-full h-32 md:h-48 bg-zinc-800 flex flex-col items-center justify-center text-zinc-600">
                            <ImageIcon size={32} className="mb-2"/>
                            <span className="text-xs uppercase tracking-widest">Espacio Disponible</span>
                        </div>
                    )}
                </div>
            )}
        </div>
      )}
    </div>
  );
};

export default AdBanner;
