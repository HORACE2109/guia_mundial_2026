
import React from 'react';
import { X, Calendar, Share2, PlayCircle } from 'lucide-react';
import { NewsItem } from '../types';

interface NewsModalProps {
  news: NewsItem | null;
  isOpen: boolean;
  onClose: () => void;
}

// Helper para extraer ID de YouTube
const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

const NewsModal: React.FC<NewsModalProps> = ({ news, isOpen, onClose }) => {
  if (!isOpen || !news) return null;

  const videoId = news.videoUrl ? getYouTubeId(news.videoUrl) : null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity" 
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-zinc-900 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border border-zinc-800 animate-fade-in-up scrollbar-hide flex flex-col">
        
        {/* Botón Cerrar Flotante */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 bg-black/50 text-white p-2 rounded-full hover:bg-white hover:text-black transition-all backdrop-blur-sm border border-white/10"
        >
          <X size={24} />
        </button>

        {/* Header Imagen */}
        <div className="relative h-64 md:h-96 w-full shrink-0">
            <img 
                src={news.imageUrl} 
                alt={news.title} 
                className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-black/40 to-transparent"></div>
            
            <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full max-w-3xl">
                <div className="inline-flex items-center gap-2 bg-wc-blue/20 border border-wc-blue/30 px-3 py-1 rounded-full text-wc-blue text-xs font-bold uppercase tracking-widest mb-3 backdrop-blur-md">
                    <Calendar size={12} />
                    {news.date}
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-white leading-tight drop-shadow-xl">
                    {news.title}
                </h2>
            </div>
        </div>

        {/* Cuerpo de la Noticia */}
        <div className="p-6 md:p-10 bg-zinc-900">
            
            {/* VIDEO EMBED (Si existe) */}
            {videoId && (
                <div className="mb-8 rounded-xl overflow-hidden shadow-2xl border border-zinc-700">
                    <div className="relative pb-[56.25%] h-0">
                        <iframe 
                            src={`https://www.youtube.com/embed/${videoId}?autoplay=0`}
                            title="YouTube video player"
                            className="absolute top-0 left-0 w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            )}

            {/* Resumen destacado */}
            <p className="text-xl md:text-2xl text-gray-200 font-light italic leading-relaxed mb-8 border-l-4 border-wc-green pl-6">
                {news.summary}
            </p>

            {/* Contenido Completo */}
            <div className="prose prose-invert prose-lg max-w-none text-gray-300 leading-loose space-y-6 font-sans">
                {news.content ? (
                    news.content.split('\n').map((paragraph, index) => (
                        paragraph.trim() && <p key={index}>{paragraph}</p>
                    ))
                ) : (
                   <p className="opacity-50 italic">No hay contenido adicional disponible para esta noticia.</p>
                )}
            </div>

            {/* Footer del Modal */}
            <div className="mt-12 pt-8 border-t border-zinc-800 flex justify-between items-center">
                <span className="text-gray-500 text-sm">Guía Mundial 2026 • Redacción Oficial</span>
                <button className="text-wc-blue hover:text-white flex items-center gap-2 text-sm font-bold transition-colors">
                    <Share2 size={16} /> Compartir
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};

export default NewsModal;
