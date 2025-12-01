
import React, { useState, useRef } from 'react';
import { Edit2, Save, Upload, Eye, EyeOff } from 'lucide-react';
import { FeaturedNewsItem } from '../types';

interface FeaturedNewsProps {
  data: FeaturedNewsItem;
  isAdminMode: boolean;
  onUpdate: (newData: FeaturedNewsItem) => void;
}

const FeaturedNews: React.FC<FeaturedNewsProps> = ({ data, isAdminMode, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<FeaturedNewsItem>(data);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!data.active && !isAdminMode) return null;

  const handleSave = () => {
    onUpdate(editData);
    setIsEditing(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditData({ ...editData, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <section className="relative w-full my-8 animate-fade-in-up">
      
      {isAdminMode && !isEditing && (
        <div className="absolute top-4 left-4 z-50 flex gap-2">
          <button 
            onClick={() => onUpdate({ ...data, active: !data.active })}
            className={`px-6 py-2 rounded-full font-black text-xs shadow-xl flex items-center gap-2 transition-all border-2 border-white hover:scale-105 ${data.active ? 'bg-[#a3ff00] text-black' : 'bg-red-600 text-white'}`}
          >
            {data.active ? <><Eye size={14}/> VISIBLE</> : <><EyeOff size={14}/> OCULTO</>}
          </button>
          <button 
            onClick={() => { setEditData(data); setIsEditing(true); }}
            className="bg-[#00eaff] text-black px-6 py-2 rounded-full font-black text-xs shadow-xl flex items-center gap-2 hover:scale-105 transition-transform border-2 border-white"
          >
            <Edit2 size={14}/> EDITAR PORTADA
          </button>
        </div>
      )}

      {isEditing ? (
        <div className="bg-zinc-900 border-y-4 border-wc-blue p-8 relative">
           <div className="max-w-4xl mx-auto space-y-6">
              <h3 className="text-2xl font-black text-white flex items-center gap-2 uppercase italic"><Edit2/> Editando Noticia Principal</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div 
                    className="aspect-video bg-black border-2 border-dashed border-zinc-600 rounded-xl overflow-hidden relative group cursor-pointer hover:border-wc-green"
                    onClick={() => fileInputRef.current?.click()}
                 >
                    <img src={editData.imageUrl} className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <Upload size={40} className="text-white mb-2"/>
                        <span className="text-xs font-bold text-white uppercase bg-black/50 px-2 py-1 rounded">Cambiar Imagen de Fondo</span>
                    </div>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload}/>
                 </div>
                 <div className="text-center md:text-left flex flex-col justify-center">
                    <span className="inline-block bg-yellow-500/20 text-yellow-300 border border-yellow-500/50 px-3 py-2 rounded text-sm font-bold font-mono uppercase mb-2">
                        MEDIDA EXACTA: 1920 x 1080 px
                    </span>
                    <p className="text-gray-500 text-xs">La imagen se ajustará automáticamente, pero esta resolución garantiza la mejor calidad.</p>
                 </div>

                 <div className="space-y-4 col-span-1 md:col-span-2">
                    <div>
                        <label className="text-xs text-gray-400 uppercase font-bold">Título Impactante</label>
                        <input 
                            value={editData.title}
                            onChange={(e) => setEditData({...editData, title: e.target.value})}
                            className="w-full bg-black border border-zinc-700 rounded p-3 text-white font-black text-xl focus:border-wc-blue outline-none"
                            placeholder="EJ: ¡YA TENEMOS GRUPOS!"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-400 uppercase font-bold">Bajada / Subtítulo</label>
                        <textarea 
                            value={editData.subtitle}
                            onChange={(e) => setEditData({...editData, subtitle: e.target.value})}
                            className="w-full bg-black border border-zinc-700 rounded p-3 text-white h-24 resize-none focus:border-wc-blue outline-none"
                            placeholder="Breve descripción..."
                        />
                    </div>
                 </div>
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t border-zinc-800">
                  <button onClick={() => setIsEditing(false)} className="text-white font-bold bg-red-600 px-6 py-2 rounded-full hover:bg-red-500 border border-black shadow-lg">Cancelar</button>
                  <button onClick={handleSave} className="bg-[#a3ff00] text-black px-8 py-3 rounded-full font-black flex items-center gap-2 hover:scale-105 transition-transform shadow-[0_0_20px_rgba(163,255,0,0.3)] border border-black">
                      <Save size={18}/> GUARDAR CAMBIOS
                  </button>
              </div>
           </div>
        </div>
      ) : (
        data.active && (
            <div className="relative w-full min-h-[60vh] md:min-h-[70vh] flex items-end overflow-hidden group">
                <div className="absolute inset-0 z-0">
                    <img 
                        src={data.imageUrl} 
                        alt="Featured" 
                        className="w-full h-full object-cover transition-transform duration-[20s] group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/20 to-transparent"></div>
                </div>
                <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pb-12 md:pb-20">
                    <div className="inline-block bg-red-600 text-white text-xs md:text-sm font-black uppercase tracking-widest px-3 py-1 mb-4 animate-pulse rounded-sm shadow-lg border border-red-400/50">
                        ● Breaking News
                    </div>
                    <h2 className="text-4xl md:text-7xl font-black text-white uppercase italic leading-[0.9] mb-4 drop-shadow-2xl max-w-4xl">
                        {data.title}
                    </h2>
                    <p className="text-lg md:text-2xl text-gray-200 font-light max-w-2xl mb-8 drop-shadow-md border-l-4 border-wc-blue pl-4 bg-gradient-to-r from-black/50 to-transparent pr-4 py-2 rounded-r">
                        {data.subtitle}
                    </p>
                </div>
            </div>
        )
      )}
    </section>
  );
};

export default FeaturedNews;
