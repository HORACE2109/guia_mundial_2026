
import React, { useState, useEffect } from 'react';
import { Trophy, AlertCircle, CheckCircle, XCircle, Play, RefreshCcw, Plus, Trash2, Save, Edit2, Clock, AlertTriangle } from 'lucide-react';
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
    if (percentage === 100) return { title: "¡LEYENDA MUNDIAL!", color: "text-yellow-400", msg: "Sabes más que la FIFA." };
    if (percentage >= 80) return { title: "DT DE SILLÓN", color: "text-wc-blue", msg: "Casi perfecto, te faltó el VAR." };
    if (percentage >= 60) return { title: "HINCHA PROMEDIO", color: "text-green-400", msg: "Ves los partidos, pero no lees las estadísticas." };
    return { title: "TURISTA DEL GOL", color: "text-gray-400", msg: "Vas al estadio solo por la comida." };
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
      <div className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-2xl p-8 md:p-12 text-center shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-wc-blue via-wc-green to-wc-purple"></div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-zinc-800 mb-6 border-4 border-wc-green shadow-[0_0_20px_rgba(163,255,0,0.3)] animate-pulse-slow">
            <Trophy size={40} className="text-wc-green" />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black text-white italic uppercase mb-2">
            ¿Cuánto sabes del <span className="text-transparent bg-clip-text bg-gradient-to-r from-wc-green to-wc-blue">Mundial?</span>
          </h2>
          <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
            Responde {questions.length} preguntas contrarreloj. Tienes {TIME_PER_QUESTION} segundos por pregunta.
          </p>

          <button 
            onClick={startGame}
            className="group bg-white text-black text-xl font-black py-4 px-10 rounded-full hover:bg-wc-blue hover:scale-105 transition-all shadow-lg flex items-center gap-3 mx-auto"
          >
            <Play fill="currentColor" /> JUGAR AHORA
          </button>
        </div>
      </div>
    );
  }

  // 3. PANTALLA DE RESULTADOS
  if (gameState === 'finished') {
    const rank = getRank(score);
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center animate-fade-in-up">
        <h3 className="text-gray-400 uppercase tracking-widest mb-4">Resultados Finales</h3>
        
        <div className="mb-6">
            <span className="text-6xl font-black text-white block mb-2">{score} / {questions.length}</span>
            <div className={`text-3xl md:text-4xl font-black italic uppercase ${rank.color} mb-2`}>
                {rank.title}
            </div>
            <p className="text-gray-400">{rank.msg}</p>
        </div>

        <button 
            onClick={startGame}
            className="bg-zinc-800 text-white px-6 py-3 rounded-lg font-bold hover:bg-zinc-700 transition-colors flex items-center gap-2 mx-auto"
        >
            <RefreshCcw size={18} /> Intentar de nuevo
        </button>
      </div>
    );
  }

  // 4. PANTALLA DE JUEGO (PREGUNTA ACTUAL)
  const currentQ = questions[currentQIndex];
  const timerPercent = (timeLeft / TIME_PER_QUESTION) * 100;
  const timerColor = timeLeft <= 3 ? 'bg-red-500' : timeLeft <= 7 ? 'bg-yellow-500' : 'bg-green-500';

  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 md:p-10 relative overflow-hidden min-h-[450px] flex flex-col justify-center">
      
      {/* --- Header Juego --- */}
      <div className="flex justify-between items-start mb-6">
        <div>
            <span className="text-wc-blue font-bold uppercase tracking-widest text-xs block mb-1">Pregunta {currentQIndex + 1} de {questions.length}</span>
            <span className="bg-zinc-800 px-2 py-0.5 rounded text-gray-400 font-mono text-xs">Score: {score}</span>
        </div>
        
        {/* Temporizador Visual */}
        <div className="flex flex-col items-end">
            <div className={`flex items-center gap-2 font-mono text-xl font-bold ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                <Clock size={20} /> 00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
            </div>
        </div>
      </div>

      {/* Barra de Tiempo */}
      <div className="w-full h-2 bg-zinc-800 rounded-full mb-8 overflow-hidden">
          <div 
            className={`h-full ${timerColor} transition-all duration-1000 ease-linear`}
            style={{ width: `${timerPercent}%` }}
          ></div>
      </div>

      <h3 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center leading-tight">
        {currentQ.question}
      </h3>

      {/* Mensaje de Tiempo Agotado */}
      {isAnswered && selectedAnswer === -1 && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
              <div className="text-center">
                  <AlertTriangle size={48} className="text-red-500 mx-auto mb-2" />
                  <h2 className="text-3xl font-black text-white italic uppercase">¡Tiempo Agotado!</h2>
                  <p className="text-gray-400">Pasando a la siguiente...</p>
              </div>
          </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto w-full">
        {currentQ.options.map((option, idx) => {
            // Determinar estilos del botón
            let btnClass = "p-4 rounded-xl border-2 text-lg font-bold transition-all duration-300 relative ";
            
            if (isAnswered) {
                if (idx === currentQ.correctAnswerIndex) {
                    btnClass += "bg-green-600 border-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.5)]"; // Correcta siempre verde
                } else if (idx === selectedAnswer) {
                    btnClass += "bg-red-600 border-red-500 text-white"; // Elegida incorrecta roja
                } else {
                    btnClass += "bg-zinc-800 border-zinc-700 text-gray-500 opacity-50"; // Resto apagado
                }
            } else {
                btnClass += "bg-zinc-800 border-zinc-700 text-gray-200 hover:bg-wc-blue hover:text-black hover:border-wc-blue hover:scale-[1.02]";
            }

            return (
                <button 
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    disabled={isAnswered}
                    className={btnClass}
                >
                    {option}
                    {isAnswered && idx === currentQ.correctAnswerIndex && <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2" size={24}/>}
                    {isAnswered && idx === selectedAnswer && idx !== currentQ.correctAnswerIndex && <XCircle className="absolute right-4 top-1/2 -translate-y-1/2" size={24}/>}
                </button>
            );
        })}
      </div>

    </div>
  );
};

export default TriviaGame;
