
import React, { useState, useEffect } from 'react';
import { Trophy, AlertCircle, CheckCircle, XCircle, Play, RefreshCcw, Plus, Trash2, Save, Edit2, Clock, AlertTriangle, Crown, Brain, Ticket, Plane } from 'lucide-react';
import { GameQuestion } from '../types';

interface TriviaGameProps {
  questions: GameQuestion[];
  isAdminMode: boolean;
  onUpdateQuestions: (questions: GameQuestion[]) => void;
}

const TIME_PER_QUESTION = 10; // 10 segundos por pregunta

const TriviaGame: React.FC<TriviaGameProps> = ({ questions, isAdminMode, onUpdateQuestions }) => {
  // Estados del Juego
  const [gameState, setGameState] = useState<'start' | 'playing' | 'finished'>('start');
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  
  // Nuevo Estado: Temporizador
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);

  // Estados de Edición (Admin)
  const [isEditing, setIsEditing] = useState(false);
  const [editingQ, setEditingQ] = useState<GameQuestion | null>(null);

  // --- LÓGICA DEL TEMPORIZADOR ---
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    
    if (gameState === 'playing' && !isAnswered && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !isAnswered) {
      // TIEMPO AGOTADO
      handleTimeOut();
    }

    return () => clearInterval(timer);
  }, [timeLeft, gameState, isAnswered]);

  const handleTimeOut = () => {
    setIsAnswered(true);
    setSelectedAnswer(-1); // -1 indica que no respondió a tiempo
    
    // Esperar y pasar a la siguiente
    setTimeout(() => {
      nextQuestion();
    }, 2000);
  };

  // --- LÓGICA DEL JUEGO ---
  const startGame = () => {
    setScore(0);
    setCurrentQIndex(0);
    setGameState('playing');
    setIsAnswered(false);
    setSelectedAnswer(null);
    setTimeLeft(TIME_PER_QUESTION);
  };

  const nextQuestion = () => {
    if (currentQIndex < questions.length - 1) {
        setCurrentQIndex(prev => prev + 1);
        setIsAnswered(false);
        setSelectedAnswer(null);
        setTimeLeft(TIME_PER_QUESTION); // Reiniciar reloj
      } else {
        setGameState('finished');
      }
  };

  const handleAnswer = (optionIndex: number) => {
    if (isAnswered) return;
    setSelectedAnswer(optionIndex);
    setIsAnswered(true);

    if (optionIndex === questions[currentQIndex].correctAnswerIndex) {
      setScore(prev => prev + 1);
    }

    // Esperar un poco y pasar a la siguiente
    setTimeout(() => {
      nextQuestion();
    }, 1500);
  };

  const getRank = (score: number) => {
    const percentage = (score / questions.length) * 100;
    if (percentage === 100) return { 
        title: "LEYENDA ABSOLUTA", 
        theme: "text-yellow-400", 
        bgGradient: "from-yellow-900/50 to-black",
        borderColor: "border-yellow-500",
        icon: <Crown size={64} className="text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.8)]" />,
        msg: "¡Impresionante! Sabes más que el presidente de la FIFA." 
    };
    if (percentage >= 80) return { 
        title: "DT DE SILLÓN", 
        theme: "text-wc-blue", 
        bgGradient: "from-blue-900/50 to-black",
        borderColor: "border-wc-blue",
        icon: <Brain size={64} className="text-wc-blue drop-shadow-[0_0_15px_rgba(0,234,255,0.8)]" />,
        msg: "Casi perfecto. Te faltó consultar el VAR en una jugada." 
    };
    if (percentage >= 60) return { 
        title: "HINCHA DE MUNDIAL", 
        theme: "text-green-400", 
        bgGradient: "from-green-900/50 to-black",
        borderColor: "border-green-500",
        icon: <Ticket size={64} className="text-green-400 drop-shadow-[0_0_15px_rgba(34,197,94,0.8)]" />,
        msg: "Ves los partidos importantes, pero no te pidas la camiseta todavía." 
    };
    return { 
        title: "TURISTA DEL GOL", 
        theme: "text-red-400", 
        bgGradient: "from-red-900/50 to-black",
        borderColor: "border-red-500",
        icon: <Plane size={64} className="text-red-400 drop-shadow-[0_0_15px_rgba(248,113,113,0.8)]" />,
        msg: "Admitelo: Vas al estadio solo por la comida." 
    };
  };

  // --- LÓGICA DE ADMINISTRACIÓN ---
  const handleAddQuestion = () => {
    const newQ: GameQuestion = {
      id: Date.now(),
      question: "Escribe tu pregunta aquí...",
      options: ["Opción A", "Opción B", "Opción C", "Opción D"],
      correctAnswerIndex: 0
    };
    onUpdateQuestions([...questions, newQ]);
    setEditingQ(newQ);
    setIsEditing(true);
  };

  const handleDeleteQuestion = (id: number) => {
    if (confirm('¿Borrar pregunta?')) {
      onUpdateQuestions(questions.filter(q => q.id !== id));
    }
  };

  const handleSaveQuestion = () => {
    if (editingQ) {
      const updated = questions.map(q => q.id === editingQ.id ? editingQ : q);
      if (!questions.find(q => q.id === editingQ.id)) {
        updated.push(editingQ);
      }
      onUpdateQuestions(updated);
      setIsEditing(false);
      setEditingQ(null);
    }
  };

  const updateEditingOption = (idx: number, text: string) => {
    if (!editingQ) return;
    const newOps = [...editingQ.options];
    newOps[idx] = text;
    setEditingQ({ ...editingQ, options: newOps });
  };

  // --- RENDERIZADO ---

  // 1. VISTA DE ADMINISTRACIÓN
  if (isAdminMode && isEditing && editingQ) {
    return (
      <div className="bg-zinc-900 p-6 rounded-xl border border-wc-blue shadow-xl animate-fade-in">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Edit2 size={20} className="text-wc-blue"/> Editar Pregunta
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-400 block mb-1">Pregunta</label>
            <input 
              className="w-full bg-black border border-zinc-700 rounded p-3 text-white font-bold"
              value={editingQ.question}
              onChange={e => setEditingQ({...editingQ, question: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {editingQ.options.map((opt, idx) => (
              <div key={idx} className={`p-3 rounded border ${editingQ.correctAnswerIndex === idx ? 'border-green-500 bg-green-900/20' : 'border-zinc-700 bg-black'}`}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-gray-500">Opción {idx + 1}</span>
                  <button 
                    onClick={() => setEditingQ({...editingQ, correctAnswerIndex: idx})}
                    className={`text-xs px-2 py-1 rounded ${editingQ.correctAnswerIndex === idx ? 'bg-green-500 text-black' : 'bg-zinc-700 text-gray-300 hover:bg-zinc-600'}`}
                  >
                    {editingQ.correctAnswerIndex === idx ? 'Correcta' : 'Marcar como Correcta'}
                  </button>
                </div>
                <input 
                  className="w-full bg-transparent border-b border-zinc-600 text-white focus:border-white outline-none"
                  value={opt}
                  onChange={e => updateEditingOption(idx, e.target.value)}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-white px-4">Cancelar</button>
            <button onClick={handleSaveQuestion} className="bg-wc-blue text-black font-bold px-6 py-2 rounded hover:bg-white flex items-center gap-2">
              <Save size={18}/> Guardar Cambios
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isAdminMode && !isEditing) {
    return (
      <div className="bg-zinc-900/50 border border-dashed border-zinc-700 p-6 rounded-xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">Gestor de Trivia ({questions.length} preguntas)</h3>
          <button onClick={handleAddQuestion} className="bg-wc-green text-black px-4 py-2 rounded font-bold flex items-center gap-2 hover:bg-white">
            <Plus size={18}/> Nueva Pregunta
          </button>
        </div>
        
        <div className="space-y-3">
          {questions.map((q, idx) => (
            <div key={q.id} className="bg-black p-4 rounded border border-zinc-800 flex justify-between items-center">
              <div>
                <span className="text-wc-blue font-bold mr-2">#{idx + 1}</span>
                <span className="text-gray-300">{q.question}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setEditingQ(q); setIsEditing(true); }} className="p-2 bg-blue-600 rounded text-white hover:bg-blue-500"><Edit2 size={14}/></button>
                <button onClick={() => handleDeleteQuestion(q.id)} className="p-2 bg-red-600 rounded text-white hover:bg-red-500"><Trash2 size={14}/></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 2. PANTALLA DE INICIO
  if (gameState === 'start') {
    return (
      <div className="bg-zinc-950 border-4 border-wc-green/50 rounded-2xl p-8 md:p-12 text-center shadow-[0_0_50px_rgba(163,255,0,0.15)] relative overflow-hidden group">
        
        {/* Neon Glow Effects */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-wc-blue via-wc-green to-wc-purple animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-wc-green/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-zinc-900 mb-6 border-4 border-wc-green shadow-[0_0_30px_rgba(163,255,0,0.4)] animate-pulse-slow">
            <Trophy size={48} className="text-wc-green" />
          </div>
          
          <h2 className="text-4xl md:text-6xl font-black text-white italic uppercase mb-2 tracking-tighter">
            ¿CUÁNTO SABES DEL <span className="text-wc-green text-shadow-neon">MUNDIAL?</span>
          </h2>
          <p className="text-2xl md:text-3xl text-gray-200 mb-10 font-black italic tracking-tighter uppercase drop-shadow-md max-w-2xl mx-auto leading-none">
            LOS ESCENARIOS DONDE SE ESCRIBIRÁ LA HISTORIA
          </p>

          <p className="text-sm text-gray-400 mb-8 font-mono border border-zinc-700 inline-block px-4 py-1 rounded bg-black/50">
             {questions.length} PREGUNTAS • {TIME_PER_QUESTION}s POR TURNO
          </p>

          {/* BOTÓN JUGAR: VERDE NEÓN ALTO CONTRASTE */}
          <button 
            onClick={startGame}
            className="group bg-wc-green text-black text-xl md:text-2xl font-black py-5 px-16 rounded-full hover:scale-105 hover:bg-white transition-all shadow-[0_0_30px_rgba(163,255,0,0.4)] flex items-center gap-3 mx-auto uppercase italic tracking-tighter border-4 border-transparent hover:border-wc-green"
          >
            <Play fill="black" size={24} /> JUGAR AHORA
          </button>
        </div>
      </div>
    );
  }

  // 3. PANTALLA DE RESULTADOS (MODO COPADO)
  if (gameState === 'finished') {
    const rank = getRank(score);
    return (
      <div className={`relative rounded-2xl p-8 md:p-12 text-center animate-fade-in-up border-4 ${rank.borderColor} overflow-hidden shadow-2xl`}>
        {/* Fondo con Gradiente Dinámico */}
        <div className={`absolute inset-0 bg-gradient-to-br ${rank.bgGradient} opacity-90`}></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>

        <div className="relative z-10 flex flex-col items-center">
            
            <div className="mb-6 animate-float">
                {rank.icon}
            </div>

            <h3 className="text-white/60 uppercase tracking-[0.5em] font-bold mb-2 text-sm">Resultado Final</h3>
            
            <div className="mb-8">
                <span className="text-7xl md:text-8xl font-black text-white drop-shadow-2xl block mb-2">{score}/{questions.length}</span>
                <div className={`text-4xl md:text-6xl font-black italic uppercase ${rank.theme} drop-shadow-lg mb-6 tracking-tighter`}>
                    {rank.title}
                </div>
                
                {/* CAJA DE MENSAJE DESTACADO */}
                <div className="bg-black/60 backdrop-blur-md p-8 rounded-xl border-l-8 border-white max-w-3xl mx-auto transform rotate-1 shadow-2xl">
                    <p className={`text-3xl md:text-5xl font-black italic text-white drop-shadow-lg leading-none uppercase tracking-tight`}>
                        "{rank.msg}"
                    </p>
                </div>
            </div>

            <button 
                onClick={startGame}
                className="bg-white text-black px-8 py-4 rounded-full font-black hover:bg-gray-200 transition-colors flex items-center gap-2 mx-auto shadow-xl hover:scale-105 transform active:scale-95 uppercase italic"
            >
                <RefreshCcw size={20} strokeWidth={3} /> INTENTAR DE NUEVO
            </button>
        </div>
      </div>
    );
  }

  // 4. PANTALLA DE JUEGO (PREGUNTA ACTUAL)
  const currentQ = questions[currentQIndex];
  const timerPercent = (timeLeft / TIME_PER_QUESTION) * 100;
  
  // Color del timer dinámico
  let timerColor = 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]';
  if (timeLeft <= 5) timerColor = 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.6)]';
  if (timeLeft <= 3) timerColor = 'bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.8)]';

  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 md:p-10 relative overflow-hidden min-h-[500px] flex flex-col justify-center shadow-2xl">
      
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-wc-blue/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* --- Header Juego --- */}
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div>
            <span className="text-wc-blue font-bold uppercase tracking-widest text-xs block mb-1">Pregunta {currentQIndex + 1} de {questions.length}</span>
            <div className="bg-zinc-800 px-3 py-1 rounded-full text-white font-bold text-xs inline-flex items-center gap-2 border border-white/10">
                 <Trophy size={12} className="text-yellow-400"/> Score: {score}
            </div>
        </div>
        
        {/* Temporizador Visual */}
        <div className="flex flex-col items-end">
            <div className={`flex items-center gap-2 font-mono text-2xl font-black ${timeLeft <= 3 ? 'text-red-500 animate-pulse scale-110' : 'text-white'}`}>
                <Clock size={24} /> 00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
            </div>
        </div>
      </div>

      {/* Barra de Tiempo */}
      <div className="w-full h-3 bg-zinc-800 rounded-full mb-8 overflow-hidden border border-zinc-700">
          <div 
            className={`h-full ${timerColor} transition-all duration-1000 ease-linear rounded-full`}
            style={{ width: `${timerPercent}%` }}
          ></div>
      </div>

      <h3 className="text-3xl md:text-5xl font-black text-white mb-10 text-center leading-none drop-shadow-md uppercase italic tracking-tight">
        {currentQ.question}
      </h3>

      {/* Mensaje de Tiempo Agotado */}
      {isAnswered && selectedAnswer === -1 && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/90 backdrop-blur-sm animate-fade-in">
              <div className="text-center transform scale-125">
                  <AlertTriangle size={64} className="text-red-500 mx-auto mb-4 animate-bounce" />
                  <h2 className="text-4xl font-black text-white italic uppercase mb-2">¡Tiempo Agotado!</h2>
                  <p className="text-gray-400 font-bold uppercase tracking-widest">Demasiado lento...</p>
              </div>
          </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto w-full relative z-10">
        {currentQ.options.map((option, idx) => {
            // Determinar estilos del botón
            let btnClass = "p-5 rounded-2xl border-2 text-lg md:text-xl font-bold transition-all duration-300 relative overflow-hidden group ";
            
            if (isAnswered) {
                if (idx === currentQ.correctAnswerIndex) {
                    btnClass += "bg-green-600 border-green-400 text-white shadow-[0_0_25px_rgba(34,197,94,0.6)] scale-[1.02] z-10"; // Correcta siempre verde
                } else if (idx === selectedAnswer) {
                    btnClass += "bg-red-600 border-red-500 text-white opacity-80 grayscale"; // Elegida incorrecta roja
                } else {
                    btnClass += "bg-zinc-900 border-zinc-800 text-gray-600 opacity-30 blur-[1px] scale-95"; // Resto apagado
                }
            } else {
                btnClass += "bg-zinc-800 border-zinc-700 text-gray-200 hover:bg-white hover:text-black hover:border-white hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:-translate-y-1 active:scale-95";
            }

            return (
                <button 
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    disabled={isAnswered}
                    className={btnClass}
                >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                        {option}
                        {isAnswered && idx === currentQ.correctAnswerIndex && <CheckCircle className="text-white animate-bounce" size={24}/>}
                        {isAnswered && idx === selectedAnswer && idx !== currentQ.correctAnswerIndex && <XCircle className="text-white" size={24}/>}
                    </span>
                    
                    {/* Hover Glow Effect */}
                    {!isAnswered && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>}
                </button>
            );
        })}
      </div>

    </div>
  );
};

export default TriviaGame;
